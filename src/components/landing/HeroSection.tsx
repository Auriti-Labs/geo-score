import { AuditForm } from "./AuditForm";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-8 px-4 py-20 text-center md:py-32">
      <div className="flex flex-col items-center gap-4">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Il tuo sito è visibile per{" "}
          <span className="text-primary">gli AI search engine?</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
          Scopri il tuo punteggio GEO Score 0-100. Analisi gratuita su 5
          categorie con raccomandazioni per migliorare la visibilità su ChatGPT,
          Perplexity, Claude e Gemini.
        </p>
      </div>
      <AuditForm />
      <p className="text-sm text-muted-foreground">
        Gratuito. Nessuna registrazione richiesta.
      </p>
    </section>
  );
}
