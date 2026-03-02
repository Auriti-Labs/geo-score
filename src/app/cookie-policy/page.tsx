import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Informativa sull'utilizzo dei cookie su GEO Score.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-heading text-3xl font-bold">Cookie Policy</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Ultimo aggiornamento: 2 marzo 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="font-heading text-xl font-semibold">
            Cosa sono i cookie
          </h2>
          <p className="text-muted-foreground">
            I cookie sono piccoli file di testo che i siti web memorizzano sul
            tuo dispositivo. Servono per ricordare le tue preferenze e
            migliorare l&apos;esperienza di navigazione.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            Cookie utilizzati da GEO Score
          </h2>
          <p className="text-muted-foreground">
            GEO Score utilizza <strong>solo cookie tecnici essenziali</strong>:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-semibold">Nome</th>
                  <th className="py-2 text-left font-semibold">Scopo</th>
                  <th className="py-2 text-left font-semibold">Durata</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">theme</td>
                  <td className="py-2">Preferenza tema chiaro/scuro</td>
                  <td className="py-2">1 anno</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">cookie-consent</td>
                  <td className="py-2">
                    Stato accettazione banner cookie
                  </td>
                  <td className="py-2">1 anno</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            Cookie di terze parti
          </h2>
          <p className="text-muted-foreground">
            GEO Score <strong>non utilizza cookie di terze parti</strong>. Non
            sono presenti cookie di analytics (Google Analytics), pubblicità,
            social media o tracciamento. I font sono serviti localmente senza
            connessioni a server esterni.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold">
            Come gestire i cookie
          </h2>
          <p className="text-muted-foreground">
            Puoi eliminare i cookie dal tuo browser in qualsiasi momento
            attraverso le impostazioni del browser. La disabilitazione dei
            cookie tecnici potrebbe compromettere il funzionamento di alcune
            preferenze (es. tema scuro).
          </p>
        </section>
      </div>
    </div>
  );
}
