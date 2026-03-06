import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev"));
    }

    const serviceClient = createServiceClient();
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.redirect(new URL("/pricing", process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev"));
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev";

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/dashboard/settings`,
    });

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error("Errore Stripe portal:", error);
    // Redirect con query param per mostrare errore lato client
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=portal", process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev"),
    );
  }
}
