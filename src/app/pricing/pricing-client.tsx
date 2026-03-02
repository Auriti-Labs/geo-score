"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing/PricingCard";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Per provare GEO Score",
    features: [
      "3 analisi al giorno",
      "Punteggio 0-100 su 5 categorie",
      "Raccomandazioni prioritizzate",
      "Report PDF via email",
    ] as const,
    isFree: true,
  },
  {
    name: "Pro",
    price: "29",
    priceYearly: "290",
    description: "Per professionisti e PMI",
    features: [
      "50 analisi al giorno",
      "Dashboard con storico audit",
      "Monitoraggio settimanale URL",
      "Notifiche cambio punteggio",
      "Report PDF illimitati",
      "Supporto prioritario",
    ] as const,
    plan: "pro" as const,
    highlighted: true,
  },
  {
    name: "Agency",
    price: "99",
    priceYearly: "990",
    description: "Per agenzie e team",
    features: [
      "Analisi illimitate",
      "Tutto il piano Pro",
      "API pubblica con chiave",
      "Report white-label",
      "Confronto competitor",
      "Logo e branding personalizzati",
    ] as const,
    plan: "agency" as const,
  },
] as const;

export function PricingToggle() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div>
      {/* Toggle mensile/annuale */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <span
          className={`text-sm ${!isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}
        >
          Mensile
        </span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            isYearly ? "bg-primary" : "bg-muted"
          }`}
          aria-label="Toggle mensile/annuale"
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
              isYearly ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <span
          className={`text-sm ${isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}
        >
          Annuale
          <span className="ml-1 text-xs text-primary">-17%</span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            name={plan.name}
            price={plan.price}
            priceYearly={"priceYearly" in plan ? plan.priceYearly : undefined}
            period="/mese"
            description={plan.description}
            features={plan.features}
            plan={"plan" in plan ? plan.plan : undefined}
            highlighted={"highlighted" in plan ? plan.highlighted : false}
            isYearly={isYearly}
            isFree={"isFree" in plan ? plan.isFree : false}
          />
        ))}
      </div>
    </div>
  );
}
