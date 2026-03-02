import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Cos'è il GEO Score?",
    answer:
      "Il GEO Score misura quanto il tuo sito è ottimizzato per essere trovato e citato dagli AI search engine come ChatGPT, Perplexity, Claude e Gemini. Il punteggio va da 0 a 100 su 5 categorie.",
  },
  {
    question: "Cos'è la Generative Engine Optimization (GEO)?",
    answer:
      "La GEO è una disciplina emergente basata sulla ricerca Princeton KDD 2024. Mentre la SEO tradizionale ottimizza per Google, la GEO ottimizza per gli AI engine che generano risposte citando fonti web.",
  },
  {
    question: "L'analisi è gratuita?",
    answer:
      "Sì, l'analisi base con punteggio e raccomandazioni è completamente gratuita. Il report PDF dettagliato richiede solo un'email.",
  },
  {
    question: "Quali categorie vengono analizzate?",
    answer:
      "Analizziamo 5 categorie: robots.txt (accesso AI bot), llms.txt (file indice AI), Schema JSON-LD (dati strutturati), Meta Tags (metadati pagina) e Contenuto (qualità per AI).",
  },
  {
    question: "Quanto tempo richiede l'analisi?",
    answer:
      "L'analisi completa richiede circa 5-15 secondi. Il sistema verifica l'accessibilità ai bot AI, analizza i dati strutturati e valuta la qualità del contenuto.",
  },
] as const;

// JSON-LD FAQPage — contenuto statico hardcoded, sicuro per rendering diretto
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export function FaqSection() {
  return (
    <section className="px-4 py-16" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center font-heading text-3xl font-bold">
          Domande frequenti
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
