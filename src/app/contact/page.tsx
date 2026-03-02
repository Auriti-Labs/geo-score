import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/ContactForm";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Contattaci per domande, segnalazioni o richieste relative a GEO Score.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-16">
      <h1 className="mb-4 font-heading text-3xl font-bold">Contattaci</h1>
      <p className="mb-8 text-muted-foreground">
        Hai domande, suggerimenti o vuoi esercitare i tuoi diritti privacy?
        Compila il form e ti risponderemo entro 48 ore.
      </p>
      <ContactForm />
    </div>
  );
}
