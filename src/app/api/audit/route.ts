import { NextResponse, type NextRequest } from "next/server";
import { AuditRequestSchema } from "@/types/api";
import { createServiceClient } from "@/lib/supabase/server";
import { runAudit } from "@/lib/api-client";
import { normalizeUrl } from "@/lib/utils";

// Dedup: se esiste un audit < 5 minuti per lo stesso URL, riutilizzalo
const DEDUP_MINUTES = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validazione
    const parsed = AuditRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "URL non valido" },
        { status: 400 },
      );
    }

    const { url } = parsed.data;
    const urlNormalized = normalizeUrl(url);
    const supabase = createServiceClient();

    // Dedup: cerca audit recente per lo stesso URL
    const cutoff = new Date(
      Date.now() - DEDUP_MINUTES * 60 * 1000,
    ).toISOString();

    const { data: existing } = await supabase
      .from("audits")
      .select("id, url, score, band")
      .eq("url_normalized", urlNormalized)
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json({
        id: existing.id,
        url: existing.url,
        score: existing.score,
        band: existing.band,
      });
    }

    // Chiama il backend Python
    const result = await runAudit(url);

    // Salva su Supabase
    const { data: audit, error: insertError } = await supabase
      .from("audits")
      .insert({
        url: result.url,
        url_normalized: urlNormalized,
        score: result.score,
        band: result.band,
        checks: result.checks,
        recommendations: result.recommendations,
        http_status: result.http_status,
        page_size: result.page_size,
      })
      .select("id, url, score, band")
      .single();

    if (insertError || !audit) {
      console.error("Errore salvataggio audit:", insertError);
      return NextResponse.json(
        { error: "Errore nel salvataggio dei risultati" },
        { status: 500 },
      );
    }

    // Traccia evento
    await supabase.from("usage_events").insert({
      event_type: "audit_completed",
      audit_id: audit.id,
      metadata: { url: result.url, score: result.score },
    });

    return NextResponse.json({
      id: audit.id,
      url: audit.url,
      score: audit.score,
      band: audit.band,
    });
  } catch (error) {
    console.error("Errore API audit:", error);

    if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra qualche secondo." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: "Errore durante l'analisi. Riprova più tardi." },
      { status: 502 },
    );
  }
}
