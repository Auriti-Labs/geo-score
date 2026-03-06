import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { AuditRow } from "@/types/database";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ReportPdf } from "@/lib/pdf/report-template";

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

    // Genera PDF con timeout di 30s — cast necessario per compatibilità tipi @react-pdf/renderer
    const element = React.createElement(ReportPdf, {
      audit: audit as AuditRow,
    });
    const PDF_TIMEOUT_MS = 30_000;
    const pdfBuffer = await Promise.race([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderToBuffer(element as any),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout generazione PDF")), PDF_TIMEOUT_MS),
      ),
    ]);
    const filename = `geo-score-report-${audit.score}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Errore generazione report PDF:", error);
    return NextResponse.json(
      { error: "Errore nella generazione del report" },
      { status: 500 },
    );
  }
}
