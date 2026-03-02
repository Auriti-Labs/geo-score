import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { AuditRow } from "@/types/database";
import { SCORE_BANDS } from "@/lib/constants";
import { AuditClient } from "./audit-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("audits")
    .select("url, score, band")
    .eq("id", id)
    .single();

  if (!data) return { title: "Audit non trovato" };

  const bandInfo = SCORE_BANDS[data.band as keyof typeof SCORE_BANDS];

  return {
    title: `GEO Score ${data.score}/100 — ${data.url}`,
    description: `${data.url} ha ottenuto un punteggio GEO di ${data.score}/100 (${bandInfo.label}). Analisi completa su 5 categorie per la visibilità AI.`,
    openGraph: {
      title: `GEO Score ${data.score}/100`,
      description: `${data.url} — ${bandInfo.label}`,
    },
  };
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params;

  // Valida formato UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: audit } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (!audit) {
    notFound();
  }

  return <AuditClient audit={audit as AuditRow} />;
}
