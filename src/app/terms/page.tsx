import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termini di Servizio",
  description:
    "Termini e condizioni di utilizzo del servizio GEO Score.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-heading text-3xl font-bold">
        Termini di Servizio
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Ultimo aggiornamento: 2 marzo 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="font-heading text-xl font-semibold">
            1. Descrizione del servizio
          </h2>
          <p className="text-muted-foreground">
            GEO Score è un servizio di analisi che misura la visibilità del tuo
            sito web per gli AI search engine. Il servizio fornisce un
            punteggio 0-100 e raccomandazioni per migliorare
            l&apos;ottimizzazione.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            2. Utilizzo consentito
          </h2>
          <p className="text-muted-foreground">
            Puoi utilizzare GEO Score per analizzare siti web di cui sei
            proprietario o per i quali hai l&apos;autorizzazione. È vietato
            utilizzare il servizio per:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Attività illegali o fraudolente</li>
            <li>Scansioni automatizzate massive senza autorizzazione</li>
            <li>
              Reverse engineering del motore di analisi o abuso
              dell&apos;infrastruttura
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            3. Limitazione di responsabilità
          </h2>
          <p className="text-muted-foreground">
            GEO Score è fornito &quot;così com&apos;è&quot; senza garanzie di
            alcun tipo. I punteggi e le raccomandazioni sono indicativi e non
            costituiscono consulenza professionale. Auriti Labs non è
            responsabile per decisioni prese sulla base dei risultati
            dell&apos;analisi.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            4. Proprietà intellettuale
          </h2>
          <p className="text-muted-foreground">
            Il motore di analisi GEO Score è proprietario. I risultati
            dell&apos;analisi possono essere condivisi liberamente. Il logo, il
            nome e l&apos;interfaccia sono di proprietà di Auriti Labs.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            5. Modifiche ai termini
          </h2>
          <p className="text-muted-foreground">
            Ci riserviamo il diritto di modificare questi termini in qualsiasi
            momento. Le modifiche saranno pubblicate su questa pagina con la
            data di aggiornamento. L&apos;uso continuato del servizio
            costituisce accettazione dei nuovi termini.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            6. Legge applicabile
          </h2>
          <p className="text-muted-foreground">
            Questi termini sono regolati dalla legge italiana. Per qualsiasi
            controversia è competente il Foro di Roma.
          </p>
        </section>
      </div>
    </div>
  );
}
