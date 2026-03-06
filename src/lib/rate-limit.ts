import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/stripe";
import type { UserPlan } from "@/types/database";

interface RateLimitResult {
  allowed: boolean;
  used: number;
  limit: number | null; // null = illimitato
  remaining: number | null;
}

/** Controlla e incrementa il contatore giornaliero per utenti autenticati */
export async function checkRateLimit(
  userId: string | null,
  ipHash?: string,
): Promise<RateLimitResult> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  // Utente autenticato → usa profilo
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, audit_count_today, audit_count_reset_at")
      .eq("id", userId)
      .single();

    if (!profile) {
      return { allowed: false, used: 0, limit: 0, remaining: 0 };
    }

    const plan = profile.plan as UserPlan;
    const limit = PLAN_LIMITS[plan];

    // Illimitato per agency
    if (limit === Infinity) {
      return { allowed: true, used: profile.audit_count_today, limit: null, remaining: null };
    }

    // Incremento atomico: reset + increment in una singola operazione
    // Previene race condition tra check e update
    let used = profile.audit_count_today;
    if (profile.audit_count_reset_at !== today) {
      used = 0;
    }

    if (used >= limit) {
      return { allowed: false, used, limit, remaining: 0 };
    }

    // Aggiornamento atomico con condizione sul contatore attuale
    // Se un'altra richiesta incrementa prima di noi, il filtro eq fallisce
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({
        audit_count_today: used + 1,
        audit_count_reset_at: today,
      })
      .eq("id", userId)
      .eq("audit_count_today", profile.audit_count_reset_at !== today ? 0 : used)
      .select("audit_count_today")
      .single();

    // Se l'update non ha matchato righe, un'altra richiesta ha vinto la race
    if (updateError || !updated) {
      return { allowed: false, used, limit, remaining: 0 };
    }

    return {
      allowed: true,
      used: updated.audit_count_today,
      limit,
      remaining: limit - updated.audit_count_today,
    };
  }

  // Utente anonimo → limita per IP hash (3/giorno via usage_events)
  const anonLimit = 3;

  if (!ipHash) {
    return { allowed: true, used: 0, limit: anonLimit, remaining: anonLimit };
  }

  const startOfDay = `${today}T00:00:00.000Z`;
  const { count } = await supabase
    .from("usage_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "audit_completed")
    .eq("ip_hash", ipHash)
    .gte("created_at", startOfDay);

  const used = count ?? 0;

  if (used >= anonLimit) {
    return { allowed: false, used, limit: anonLimit, remaining: 0 };
  }

  return {
    allowed: true,
    used,
    limit: anonLimit,
    remaining: anonLimit - used,
  };
}

/** Genera un hash crittografico dell'IP per rate limiting (GDPR Art. 32) */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "geo-score-default-salt";
  return `ip_${crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 16)}`;
}
