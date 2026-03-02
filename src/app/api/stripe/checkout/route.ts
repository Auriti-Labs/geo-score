import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getStripe, getStripePriceId } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, interval } = body as {
      plan: "pro" | "agency";
      interval: "month" | "year";
    };

    if (!["pro", "agency"].includes(plan) || !["month", "year"].includes(interval)) {
      return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
    }

    const stripe = getStripe();
    const priceId = getStripePriceId(plan, interval);
    const serviceClient = createServiceClient();

    // Recupera o crea Stripe Customer
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await serviceClient
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Crea Checkout Session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancel`,
      metadata: { supabase_user_id: user.id, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Errore Stripe checkout:", error);
    return NextResponse.json(
      { error: "Errore nella creazione del checkout" },
      { status: 500 },
    );
  }
}
