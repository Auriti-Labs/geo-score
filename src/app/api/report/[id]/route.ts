import { NextResponse, type NextRequest } from "next/server";
import React from "react";
import { createServiceClient } from "@/lib/supabase/server";
import type { AuditRow } from "@/types/database";
import { getClientIp, hashIp, checkInMemoryRateLimit } from "@/lib/rate-limit";

// Limite: 10 download per IP ogni 15 minuti
const REPORT_RATE_LIMIT = 10;
const REPORT_RATE_WINDOW = 15 * 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Rate limiting per IP
    const clientIp = getClientIp(request);
    if (clientIp) {
      const ipHash = hashIp(clientIp);
      if (!checkInMemoryRateLimit(`report:${ipHash}`, REPORT_RATE_LIMIT, REPORT_RATE_WINDOW)) {
        return NextResponse.json(
          { error: "Troppe richieste. Riprova tra qualche minuto." },
          { status: 429, headers: { "Retry-After": "900" } },
        );
      }
    }

    const { id } = await params;

    // Validazione UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "ID non valido" }, { status: 400 });
    }

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

    // Lazy load @react-pdf/renderer (~200KB) — caricato solo quando serve
    const [{ renderToBuffer }, { ReportPdf }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@/lib/pdf/report-template"),
    ]);

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
