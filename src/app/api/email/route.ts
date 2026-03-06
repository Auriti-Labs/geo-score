import { NextResponse, type NextRequest } from "next/server";
import { EmailRequestSchema } from "@/types/api";
import { createServiceClient } from "@/lib/supabase/server";
import { sendReportEmail } from "@/lib/resend";
import { getClientIp, hashIp, checkInMemoryRateLimit } from "@/lib/rate-limit";

// Limite: 5 richieste per IP ogni 15 minuti
const EMAIL_RATE_LIMIT = 5;
const EMAIL_RATE_WINDOW = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting per IP
    const clientIp = getClientIp(request);
    if (clientIp) {
      const ipHash = hashIp(clientIp);
      if (!checkInMemoryRateLimit(`email:${ipHash}`, EMAIL_RATE_LIMIT, EMAIL_RATE_WINDOW)) {
        return NextResponse.json(
          { error: "Troppe richieste. Riprova tra qualche minuto." },
          { status: 429, headers: { "Retry-After": "900" } },
        );
      }
    }

    const body = await request.json();

    // Validazione
    const parsed = EmailRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dati non validi" },
        { status: 400 },
      );
    }

    const { email, audit_id } = parsed.data;
    const supabase = createServiceClient();

    // Verifica che l'audit esista
    const { data: audit } = await supabase
      .from("audits")
      .select("id, url, score")
      .eq("id", audit_id)
      .single();

    if (!audit) {
      return NextResponse.json(
        { error: "Audit non trovato" },
        { status: 404 },
      );
    }

    // Salva email (upsert per evitare duplicati)
    await supabase.from("emails").upsert(
      {
        email,
        audit_id,
        source: "report_download" as const,
      },
      { onConflict: "email,audit_id" },
    );

    // Traccia evento
    await supabase.from("usage_events").insert({
      event_type: "email_collected",
      audit_id,
      metadata: { source: "report_download" },
    });

    // Invio email con link al report PDF via Resend
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev";
    const reportUrl = `${siteUrl}/api/report/${audit_id}`;

    const emailSent = await sendReportEmail({
      to: email,
      url: audit.url,
      score: audit.score,
      reportUrl,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: "Errore nell'invio dell'email. Riprova." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Report inviato alla tua email",
    });
  } catch (error) {
    console.error("Errore API email:", error);
    return NextResponse.json(
      { error: "Errore nel salvataggio. Riprova." },
      { status: 500 },
    );
  }
}
