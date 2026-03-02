import type { Metadata } from "next";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuditHistoryTable } from "@/components/dashboard/AuditHistoryTable";
import { PlanBadge } from "@/components/dashboard/PlanBadge";
import { UsageBar } from "@/components/dashboard/UsageBar";
import type { UserPlan } from "@/types/database";
import type { ScoreBand } from "@/types/audit";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "I tuoi audit GEO Score, storico e utilizzo.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const serviceClient = createServiceClient();

  // Recupera profilo utente
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("plan, audit_count_today, audit_count_reset_at")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as UserPlan;

  // Reset contatore se giorno diverso
  const today = new Date().toISOString().split("T")[0];
  const usedToday =
    profile?.audit_count_reset_at === today
      ? profile.audit_count_today
      : 0;

  // Recupera storico audit dell'utente (ultimi 50)
  const { data: audits } = await serviceClient
    .from("audits")
    .select("id, url, score, band, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Benvenuto, {user.user_metadata?.full_name ?? user.email}
          </p>
        </div>
        <PlanBadge plan={plan} />
      </div>

      {/* Usage */}
      <div className="mb-8 rounded-lg border p-4">
        <UsageBar plan={plan} used={usedToday} />
      </div>

      {/* Storico audit */}
      <div>
        <h2 className="mb-4 font-heading text-lg font-semibold">
          I tuoi audit
        </h2>
        <AuditHistoryTable
          audits={
            (audits ?? []).map((a) => ({
              ...a,
              band: a.band as ScoreBand,
            }))
          }
        />
      </div>
    </div>
  );
}
