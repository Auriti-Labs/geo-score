import { NextResponse, type NextRequest } from "next/server";
import { EmailRequestSchema } from "@/types/api";
import { createServiceClient } from "@/lib/supabase/server";
import { sendReportEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
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
      metadata: { email_hash: email.split("@")[1] },
    });

    // Invio email con link al report PDF via Resend
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev";
    const reportUrl = `${siteUrl}/api/report/${audit_id}`;

    await sendReportEmail({
      to: email,
      url: audit.url,
      score: audit.score,
      reportUrl,
    });

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
