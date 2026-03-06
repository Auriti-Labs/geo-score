import { NextResponse, type NextRequest } from "next/server";
import { AuditRequestSchema } from "@/types/api";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runAudit, ApiError } from "@/lib/api-client";
import { normalizeUrl } from "@/lib/utils";
import { checkRateLimit, hashIp } from "@/lib/rate-limit";

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

    // Recupera user_id se autenticato (opzionale)
    let userId: string | null = null;
    try {
      const authClient = await createClient();
      const { data: { user } } = await authClient.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Utente anonimo — ok
    }

    // Rate limiting per piano
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ipHash = clientIp ? hashIp(clientIp) : undefined;
    const rateLimit = await checkRateLimit(userId, ipHash);

    if (!rateLimit.allowed) {
      const resetTime = new Date();
      resetTime.setUTCHours(24, 0, 0, 0);
      return NextResponse.json(
        {
          error: "Limite giornaliero raggiunto. Passa a Pro per più analisi.",
          used: rateLimit.used,
          limit: rateLimit.limit,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((resetTime.getTime() - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(rateLimit.limit ?? 0),
            "X-RateLimit-Used": String(rateLimit.used),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetTime.toISOString(),
          },
        },
      );
    }

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
        ...(userId && { user_id: userId }),
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

    // Traccia evento (ip_hash per rate limiting anonimi)
    await supabase.from("usage_events").insert({
      event_type: "audit_completed",
      audit_id: audit.id,
      metadata: { url: result.url, score: result.score },
      ...(ipHash && { ip_hash: ipHash }),
    });

    return NextResponse.json({
      id: audit.id,
      url: audit.url,
      score: audit.score,
      band: audit.band,
    });
  } catch (error) {
    console.error("Errore API audit:", error);

    // Differenzia errori dal backend Python
    if (error instanceof ApiError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Troppe richieste al servizio di analisi. Riprova tra qualche secondo." },
          { status: 429, headers: { "Retry-After": "10" } },
        );
      }
      if (error.status >= 400 && error.status < 500) {
        return NextResponse.json(
          { error: "URL non raggiungibile o non valido. Verifica l'indirizzo e riprova." },
          { status: 422 },
        );
      }
      // 5xx o timeout dal backend
      return NextResponse.json(
        { error: "Il servizio di analisi non è al momento disponibile. Riprova tra qualche minuto." },
        { status: 503, headers: { "Retry-After": "60" } },
      );
    }

    // Errore di timeout (AbortError)
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "L'analisi ha impiegato troppo tempo. Il sito potrebbe essere lento. Riprova." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: "Errore durante l'analisi. Riprova più tardi." },
      { status: 502 },
    );
  }
}
