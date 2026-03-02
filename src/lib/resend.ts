import { Resend } from "resend";

// Inizializzazione lazy — evita errori se RESEND_API_KEY non è configurata
let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "GEO Score <noreply@geoscore.dev>";

interface SendReportEmailParams {
  to: string;
  url: string;
  score: number;
  reportUrl: string;
}

/** Invia email con link al report PDF */
export async function sendReportEmail({
  to,
  url,
  score,
  reportUrl,
}: SendReportEmailParams): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("Resend non configurato — email non inviata");
    return false;
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Il tuo GEO Score: ${score}/100 — ${url}`,
    html: buildReportEmailHtml({ url, score, reportUrl }),
  });

  if (error) {
    console.error("Errore invio email Resend:", error);
    return false;
  }

  return true;
}

/** Template HTML inline per massima compatibilità email client */
function buildReportEmailHtml({
  url,
  score,
  reportUrl,
}: Omit<SendReportEmailParams, "to">): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden">
    <div style="background:#18181b;padding:32px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">GEO Score</h1>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 16px;color:#3f3f46;font-size:16px">
        Ecco i risultati dell'analisi per <strong>${url}</strong>:
      </p>
      <div style="text-align:center;margin:24px 0">
        <div style="display:inline-block;background:#f4f4f5;border-radius:12px;padding:24px 40px">
          <span style="font-size:48px;font-weight:700;color:#18181b">${score}</span>
          <span style="font-size:20px;color:#71717a">/100</span>
        </div>
      </div>
      <div style="text-align:center;margin:24px 0">
        <a href="${reportUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:6px;font-size:14px;font-weight:600">
          Scarica il report PDF
        </a>
      </div>
      <p style="margin:24px 0 0;color:#a1a1aa;font-size:13px;text-align:center">
        Hai ricevuto questa email perché hai richiesto un report GEO Score.
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}
