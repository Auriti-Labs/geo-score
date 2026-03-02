import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { AuditRow } from "@/types/database";
import { SCORE_BANDS, CATEGORIES } from "@/lib/constants";
import type { ScoreBand, AuditChecks } from "@/types/audit";

// Genera report testuale (per MVP — PDF con @react-pdf/renderer in fase 2)
function generateTextReport(audit: AuditRow): string {
  const bandInfo = SCORE_BANDS[audit.band as ScoreBand];
  const checks = audit.checks as AuditChecks;

  const lines: string[] = [
    "═══════════════════════════════════════════════════",
    "                    GEO SCORE REPORT",
    "═══════════════════════════════════════════════════",
    "",
    `URL:        ${audit.url}`,
    `Punteggio:  ${audit.score}/100 (${bandInfo.label})`,
    `Data:       ${new Date(audit.created_at).toLocaleDateString("it-IT")}`,
    `HTTP:       ${audit.http_status}`,
    "",
    "───────────────────────────────────────────────────",
    "DETTAGLIO CATEGORIE",
    "───────────────────────────────────────────────────",
    "",
  ];

  // robots.txt
  lines.push(`▸ ${CATEGORIES.robots_txt.label} (max ${CATEGORIES.robots_txt.maxPoints}pt)`);
  lines.push(`  Trovato: ${checks.robots_txt.found ? "Sì" : "No"}`);
  lines.push(`  Bot citazione OK: ${checks.robots_txt.citation_bots_ok ? "Sì" : "No"}`);
  if (checks.robots_txt.bots_allowed.length > 0)
    lines.push(`  Autorizzati: ${checks.robots_txt.bots_allowed.join(", ")}`);
  if (checks.robots_txt.bots_blocked.length > 0)
    lines.push(`  Bloccati: ${checks.robots_txt.bots_blocked.join(", ")}`);
  lines.push("");

  // llms.txt
  lines.push(`▸ ${CATEGORIES.llms_txt.label} (max ${CATEGORIES.llms_txt.maxPoints}pt)`);
  lines.push(`  Trovato: ${checks.llms_txt.found ? "Sì" : "No"}`);
  lines.push(`  Parole: ${checks.llms_txt.word_count}`);
  lines.push("");

  // Schema
  lines.push(`▸ ${CATEGORIES.schema_jsonld.label} (max ${CATEGORIES.schema_jsonld.maxPoints}pt)`);
  lines.push(`  Tipi trovati: ${checks.schema_jsonld.found_types.join(", ") || "Nessuno"}`);
  lines.push("");

  // Meta
  lines.push(`▸ ${CATEGORIES.meta_tags.label} (max ${CATEGORIES.meta_tags.maxPoints}pt)`);
  lines.push(`  Title: ${checks.meta_tags.has_title ? "Sì" : "No"} — ${checks.meta_tags.title_text}`);
  lines.push(`  Description: ${checks.meta_tags.has_description ? "Sì" : "No"} (${checks.meta_tags.description_length} car.)`);
  lines.push(`  Canonical: ${checks.meta_tags.has_canonical ? "Sì" : "No"}`);
  lines.push(`  Open Graph: ${checks.meta_tags.has_og_title ? "Sì" : "No"}`);
  lines.push("");

  // Contenuto
  lines.push(`▸ ${CATEGORIES.content.label} (max ${CATEGORIES.content.maxPoints}pt)`);
  lines.push(`  H1: ${checks.content.has_h1 ? "Sì" : "No"}`);
  lines.push(`  Intestazioni: ${checks.content.heading_count}`);
  lines.push(`  Parole: ${checks.content.word_count}`);
  lines.push("");

  // Raccomandazioni
  if (audit.recommendations.length > 0) {
    lines.push("───────────────────────────────────────────────────");
    lines.push("RACCOMANDAZIONI");
    lines.push("───────────────────────────────────────────────────");
    lines.push("");
    audit.recommendations.forEach((rec, i) => {
      lines.push(`  ${i + 1}. ${rec}`);
    });
    lines.push("");
  }

  lines.push("═══════════════════════════════════════════════════");
  lines.push("Generato da GEO Score — geoscore.dev");
  lines.push("Basato sulla ricerca Princeton KDD 2024");

  return lines.join("\n");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    const { data: audit } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (!audit) {
      return NextResponse.json(
        { error: "Audit non trovato" },
        { status: 404 },
      );
    }

    // Traccia download
    await supabase.from("usage_events").insert({
      event_type: "report_downloaded",
      audit_id: id,
    });

    // Genera report testuale (MVP) — PDF in fase successiva
    const report = generateTextReport(audit as AuditRow);
    const filename = `geo-score-report-${audit.score}.txt`;

    return new NextResponse(report, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Errore generazione report:", error);
    return NextResponse.json(
      { error: "Errore nella generazione del report" },
      { status: 500 },
    );
  }
}
