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

    // Reset contatore se giorno diverso
    let used = profile.audit_count_today;
    if (profile.audit_count_reset_at !== today) {
      used = 0;
      await supabase
        .from("profiles")
        .update({ audit_count_today: 0, audit_count_reset_at: today })
        .eq("id", userId);
    }

    // Illimitato per agency
    if (limit === Infinity) {
      return { allowed: true, used, limit: null, remaining: null };
    }

    if (used >= limit) {
      return { allowed: false, used, limit, remaining: 0 };
    }

    // Incrementa contatore
    await supabase
      .from("profiles")
      .update({ audit_count_today: used + 1 })
      .eq("id", userId);

    return {
      allowed: true,
      used: used + 1,
      limit,
      remaining: limit - used - 1,
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

/** Genera un hash anonimo dell'IP per rate limiting */
export function hashIp(ip: string): string {
  // Hash semplice — non reversibile, sufficiente per rate limiting
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `ip_${Math.abs(hash).toString(36)}`;
}
