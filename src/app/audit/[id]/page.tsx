import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import type { AuditRow } from "@/types/database";
import { SCORE_BANDS } from "@/lib/constants";
import { AuditClient } from "./audit-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Cache della query — deduplicata tra generateMetadata e page component
const getAudit = cache(async (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) return null;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  return data as AuditRow | null;
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) return { title: "Audit non trovato" };

  const bandInfo = SCORE_BANDS[audit.band as keyof typeof SCORE_BANDS];

  return {
    title: `GEO Score ${audit.score}/100 — ${audit.url}`,
    description: `${audit.url} ha ottenuto un punteggio GEO di ${audit.score}/100 (${bandInfo.label}). Analisi completa su 5 categorie per la visibilità AI.`,
    openGraph: {
      title: `GEO Score ${audit.score}/100`,
      description: `${audit.url} — ${bandInfo.label}`,
    },
    alternates: {
      canonical: `${SITE_URL}/audit/${id}`,
    },
  };
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  // BreadcrumbList JSON-LD per SEO — contenuto statico server-side, sicuro
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `GEO Score ${audit.score}/100`,
        item: `${SITE_URL}/audit/${audit.id}`,
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbLd }}
      />
      <AuditClient audit={audit} />
    </>
  );
}
