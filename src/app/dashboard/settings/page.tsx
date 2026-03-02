import type { Metadata } from "next";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PlanBadge } from "@/components/dashboard/PlanBadge";
import type { UserPlan } from "@/types/database";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impostazioni",
  description: "Gestisci il tuo profilo e abbonamento GEO Score.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const serviceClient = createServiceClient();

  const { data: profile } = await serviceClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as UserPlan;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 font-heading text-2xl font-bold">Impostazioni</h1>

      {/* Profilo */}
      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold">Profilo</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome</span>
            <span>{profile?.full_name ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Membro dal</span>
            <span>
              {profile
                ? new Date(profile.created_at).toLocaleDateString("it-IT")
                : "—"}
            </span>
          </div>
        </div>
      </section>

      {/* Piano */}
      <section className="mb-8 rounded-lg border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Piano</h2>
          <PlanBadge plan={plan} />
        </div>
        {plan === "free" ? (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              Stai usando il piano gratuito con 3 analisi al giorno.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Passa a Pro
            </Link>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              Piano {plan.charAt(0).toUpperCase() + plan.slice(1)} attivo.
            </p>
            <a
              href="/api/stripe/portal"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Gestisci abbonamento
            </a>
          </div>
        )}
      </section>

      {/* Torna alla dashboard */}
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Torna alla dashboard
      </Link>
    </div>
  );
}
