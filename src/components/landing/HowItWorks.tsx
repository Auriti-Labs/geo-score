import { Globe, BarChart3, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Globe,
    title: "1. Inserisci l'URL",
    description:
      "Incolla l'indirizzo del tuo sito web. L'analisi inizia immediatamente.",
  },
  {
    icon: BarChart3,
    title: "2. Ricevi il punteggio",
    description:
      "Ottieni un punteggio 0-100 su 5 categorie: robots.txt, llms.txt, Schema, Meta e Contenuto.",
  },
  {
    icon: Lightbulb,
    title: "3. Migliora il sito",
    description:
      "Segui le raccomandazioni prioritizzate per rendere il tuo sito visibile agli AI engine.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="px-4 py-16" id="come-funziona">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold">
          Come funziona
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="text-center">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
