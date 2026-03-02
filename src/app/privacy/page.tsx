import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sulla privacy di GEO Score. Come raccogliamo, utilizziamo e proteggiamo i tuoi dati.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-heading text-3xl font-bold">
        Informativa sulla Privacy
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Ultimo aggiornamento: 2 marzo 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="font-heading text-xl font-semibold">
            1. Titolare del trattamento
          </h2>
          <p className="text-muted-foreground">
            Il titolare del trattamento è Auriti Labs. Per qualsiasi richiesta
            relativa alla privacy, contattaci tramite la{" "}
            <a href="/contact" className="underline hover:text-foreground">
              pagina contatti
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            2. Dati raccolti
          </h2>
          <p className="text-muted-foreground">GEO Score raccoglie:</p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>
              <strong>URL analizzati</strong> — per eseguire l&apos;analisi GEO
              e mostrare i risultati
            </li>
            <li>
              <strong>Indirizzo email</strong> — solo se fornito
              volontariamente per ricevere il report PDF
            </li>
            <li>
              <strong>Dati di utilizzo anonimi</strong> — eventi aggregati
              (numero analisi, download report) senza identificatori personali
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            3. Base giuridica
          </h2>
          <p className="text-muted-foreground">
            Il trattamento dei dati si basa sul consenso esplicito
            dell&apos;utente (Art. 6(1)(a) GDPR) per l&apos;invio di email, e
            sul legittimo interesse (Art. 6(1)(f) GDPR) per l&apos;analisi
            degli URL e le statistiche aggregate.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            4. Cookie e tracciamento
          </h2>
          <p className="text-muted-foreground">
            GEO Score <strong>non utilizza cookie di terze parti</strong>,
            pixel di tracciamento o servizi di analytics esterni. I font sono
            serviti localmente (nessuna connessione a Google Fonts). Utilizziamo
            solo cookie tecnici essenziali per il funzionamento del sito (es.
            preferenza tema chiaro/scuro).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            5. Conservazione dei dati
          </h2>
          <p className="text-muted-foreground">
            I risultati delle analisi sono conservati per 12 mesi per
            consentire la consultazione. Gli indirizzi email sono conservati
            fino alla revoca del consenso. I dati di utilizzo anonimi sono
            conservati a tempo indeterminato.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            6. Diritti dell&apos;utente
          </h2>
          <p className="text-muted-foreground">
            Ai sensi del GDPR, hai diritto di: accesso, rettifica,
            cancellazione, limitazione del trattamento, portabilità dei dati e
            opposizione. Per esercitare questi diritti, contattaci tramite la{" "}
            <a href="/contact" className="underline hover:text-foreground">
              pagina contatti
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            7. Trasferimento dati
          </h2>
          <p className="text-muted-foreground">
            I dati sono ospitati su infrastruttura europea (Supabase EU). Non
            trasferiamo dati personali al di fuori dello Spazio Economico
            Europeo senza adeguate garanzie.
          </p>
        </section>
      </div>
    </div>
  );
}
