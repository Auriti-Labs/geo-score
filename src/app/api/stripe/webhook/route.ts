import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret non configurato" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan as "pro" | "agency";
      const subscriptionId = session.subscription as string;

      if (userId && plan && subscriptionId) {
        // Recupera dettagli abbonamento (expand items per current_period_end)
        const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["items.data"],
        });
        // current_period_end è nel primo item (API clover+)
        const periodEnd = sub.items.data[0]?.current_period_end;

        // Salva abbonamento — verifica errore
        const { error: upsertError } = await supabase
          .from("subscriptions")
          .upsert({
            id: subscriptionId,
            user_id: userId,
            plan,
            status: sub.status,
            current_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
            cancel_at_period_end: sub.cancel_at_period_end ?? false,
          });

        if (upsertError) {
          console.error("Errore upsert subscription:", upsertError);
          return NextResponse.json(
            { error: "Errore salvataggio subscription" },
            { status: 500 },
          );
        }

        // Aggiorna piano profilo — verifica errore
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ plan })
          .eq("id", userId);

        if (profileError) {
          console.error("Errore update profilo:", profileError);
          return NextResponse.json(
            { error: "Errore aggiornamento profilo" },
            { status: 500 },
          );
        }
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const subscriptionId = subscription.id;

      // Aggiorna stato abbonamento — verifica errore
      const newStatus = subscription.status;
      const isCanceled =
        newStatus === "canceled" || newStatus === "unpaid";

      // current_period_end è nel primo item (API clover+)
      const itemPeriodEnd = subscription.items?.data?.[0]?.current_period_end;

      const { error: subUpdateError } = await supabase
        .from("subscriptions")
        .update({
          status: newStatus,
          current_period_end: itemPeriodEnd
            ? new Date(itemPeriodEnd * 1000).toISOString()
            : null,
          cancel_at_period_end: subscription.cancel_at_period_end ?? false,
        })
        .eq("id", subscriptionId);

      if (subUpdateError) {
        console.error("Errore update subscription:", subUpdateError);
        return NextResponse.json(
          { error: "Errore aggiornamento subscription" },
          { status: 500 },
        );
      }

      // Se cancellato, riporta a free
      if (isCanceled) {
        const { data: subData, error: selectError } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("id", subscriptionId)
          .single();

        if (selectError) {
          console.error("Errore recupero user_id subscription:", selectError);
          return NextResponse.json(
            { error: "Errore recupero subscription" },
            { status: 500 },
          );
        }

        if (subData) {
          const { error: downgradeError } = await supabase
            .from("profiles")
            .update({ plan: "free" })
            .eq("id", subData.user_id);

          if (downgradeError) {
            console.error("Errore downgrade a free:", downgradeError);
            return NextResponse.json(
              { error: "Errore downgrade piano" },
              { status: 500 },
            );
          }
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
