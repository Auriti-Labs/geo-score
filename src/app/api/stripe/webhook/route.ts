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
        // Recupera dettagli abbonamento
        const subResponse =
          await stripe.subscriptions.retrieve(subscriptionId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = subResponse as any;

        // Salva abbonamento
        await supabase.from("subscriptions").upsert({
          id: subscriptionId,
          user_id: userId,
          plan,
          status: sub.status,
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          cancel_at_period_end: sub.cancel_at_period_end ?? false,
        });

        // Aggiorna piano profilo
        await supabase
          .from("profiles")
          .update({ plan })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;
      const subscriptionId = subscription.id as string;

      // Aggiorna stato abbonamento
      const newStatus = subscription.status as string;
      const isCanceled =
        newStatus === "canceled" || newStatus === "unpaid";

      await supabase
        .from("subscriptions")
        .update({
          status: newStatus,
          current_period_end: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          cancel_at_period_end: subscription.cancel_at_period_end ?? false,
        })
        .eq("id", subscriptionId);

      // Se cancellato, riporta a free
      if (isCanceled) {
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("id", subscriptionId)
          .single();

        if (subData) {
          await supabase
            .from("profiles")
            .update({ plan: "free" })
            .eq("id", subData.user_id);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
