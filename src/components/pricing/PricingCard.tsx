"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PricingCardProps {
  name: string;
  price: string;
  priceYearly?: string;
  period: string;
  description: string;
  features: readonly string[];
  plan?: "pro" | "agency";
  highlighted?: boolean;
  isYearly: boolean;
  isFree?: boolean;
}

export function PricingCard({
  name,
  price,
  priceYearly,
  period,
  description,
  features,
  plan,
  highlighted = false,
  isYearly,
  isFree = false,
}: PricingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const displayPrice = isYearly && priceYearly ? priceYearly : price;
  const displayPeriod = isFree ? "" : isYearly ? "/anno" : period;

  async function handleCheckout() {
    if (isFree) {
      router.push("/");
      return;
    }

    if (!plan) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          interval: isYearly ? "year" : "month",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?next=/pricing");
          return;
        }
        throw new Error(data.error || "Errore checkout");
      }

      // Redirect a Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nel checkout",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex flex-col rounded-xl border p-6 ${
        highlighted
          ? "border-primary bg-primary/5 shadow-lg"
          : "bg-card"
      }`}
    >
      <div className="mb-6">
        <h2 className="font-heading text-xl font-semibold">{name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold">&euro;{displayPrice}</span>
          {displayPeriod && (
            <span className="text-muted-foreground">{displayPeriod}</span>
          )}
        </div>
        {isYearly && !isFree && (
          <p className="mt-1 text-xs text-primary">Risparmi il 17%</p>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <span className="mt-0.5 text-primary">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={handleCheckout}
        disabled={loading}
        variant={highlighted ? "default" : "outline"}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Caricamento...
          </>
        ) : isFree ? (
          "Inizia gratis"
        ) : (
          "Abbonati"
        )}
      </Button>
    </div>
  );
}
