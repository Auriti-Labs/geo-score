import Stripe from "stripe";

// Client Stripe server-side (singleton lazy)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY non configurata");
    _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  }
  return _stripe;
}

// Mappa piani → Price ID Stripe
export function getStripePriceId(
  plan: "pro" | "agency",
  interval: "month" | "year",
): string {
  const key =
    `STRIPE_PRICE_${plan.toUpperCase()}_${interval === "month" ? "MONTHLY" : "YEARLY"}` as const;
  const priceId = process.env[key];
  if (!priceId) throw new Error(`${key} non configurato`);
  return priceId;
}

// Limiti per piano
export const PLAN_LIMITS = {
  free: 3,
  pro: 50,
  agency: Infinity,
} as const;
