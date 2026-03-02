import type { Metadata } from "next";
import { PricingToggle } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Piani e prezzi di GEO Score. Analisi gratuita, piani Pro e Agency per monitoraggio continuo.",
};

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold">
          Piani semplici, trasparenti
        </h1>
        <p className="text-lg text-muted-foreground">
          Inizia gratis. Passa a Pro quando ne hai bisogno.
        </p>
      </div>
      <PricingToggle />
    </div>
  );
}
