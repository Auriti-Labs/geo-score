"use client";

import type { AuditRow } from "@/types/database";
import type { ScoreBand } from "@/types/audit";
import { ScoreGauge } from "@/components/audit/ScoreGauge";
import { ScoreBandBadge } from "@/components/audit/ScoreBand";
import { CategoryCard } from "@/components/audit/CategoryCard";
import { CheckItem } from "@/components/audit/CheckItem";
import { RecommendationList } from "@/components/audit/RecommendationList";
import { ShareCard } from "@/components/audit/ShareCard";
import { DownloadReport } from "@/components/audit/DownloadReport";
import { formatDate, truncateUrl } from "@/lib/utils";

interface AuditClientProps {
  audit: AuditRow;
}

export function AuditClient({ audit }: AuditClientProps) {
  const { checks } = audit;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      {/* Header con score */}
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <ScoreGauge score={audit.score} band={audit.band as ScoreBand} />
        <ScoreBandBadge band={audit.band as ScoreBand} />
        <h1 className="font-heading text-xl font-semibold">{truncateUrl(audit.url, 60)}</h1>
        <p className="text-sm text-muted-foreground">
          Analizzato il {formatDate(audit.created_at)}
        </p>
      </div>

      {/* Azioni */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <ShareCard auditId={audit.id} score={audit.score} url={audit.url} />
        <DownloadReport auditId={audit.id} />
      </div>

      {/* Categorie dettaglio */}
      <div className="space-y-4">
        {/* robots.txt */}
        <CategoryCard category="robots_txt">
          <CheckItem
            label="robots.txt trovato"
            passed={checks.robots_txt.found}
          />
          <CheckItem
            label="Bot di citazione autorizzati"
            passed={checks.robots_txt.citation_bots_ok}
            detail="OAI-SearchBot, ClaudeBot, PerplexityBot"
          />
          {checks.robots_txt.bots_allowed.length > 0 && (
            <CheckItem
              label={`${checks.robots_txt.bots_allowed.length} bot autorizzati`}
              passed={true}
              detail={checks.robots_txt.bots_allowed.join(", ")}
            />
          )}
          {checks.robots_txt.bots_blocked.length > 0 && (
            <CheckItem
              label={`${checks.robots_txt.bots_blocked.length} bot bloccati`}
              passed={false}
              detail={checks.robots_txt.bots_blocked.join(", ")}
            />
          )}
          {checks.robots_txt.bots_missing.length > 0 && (
            <CheckItem
              label={`${checks.robots_txt.bots_missing.length} bot non menzionati`}
              passed={false}
              detail={checks.robots_txt.bots_missing.join(", ")}
            />
          )}
        </CategoryCard>

        {/* llms.txt */}
        <CategoryCard category="llms_txt">
          <CheckItem
            label="llms.txt trovato"
            passed={checks.llms_txt.found}
          />
          <CheckItem
            label="Contiene intestazione H1"
            passed={checks.llms_txt.has_h1}
          />
          <CheckItem
            label="Contiene sezioni strutturate"
            passed={checks.llms_txt.has_sections}
          />
          <CheckItem
            label="Contiene link"
            passed={checks.llms_txt.has_links}
          />
          {checks.llms_txt.word_count > 0 && (
            <CheckItem
              label={`${checks.llms_txt.word_count} parole`}
              passed={checks.llms_txt.word_count >= 50}
              detail="Minimo consigliato: 50 parole"
            />
          )}
        </CategoryCard>

        {/* Schema JSON-LD */}
        <CategoryCard category="schema_jsonld">
          {checks.schema_jsonld.found_types.length > 0 ? (
            <CheckItem
              label={`Schema trovati: ${checks.schema_jsonld.found_types.join(", ")}`}
              passed={true}
            />
          ) : (
            <CheckItem label="Nessuno schema JSON-LD trovato" passed={false} />
          )}
          <CheckItem
            label="Schema WebSite"
            passed={checks.schema_jsonld.has_website}
          />
          <CheckItem
            label="Schema FAQPage"
            passed={checks.schema_jsonld.has_faq}
          />
          <CheckItem
            label="Schema WebApplication"
            passed={checks.schema_jsonld.has_webapp}
          />
        </CategoryCard>

        {/* Meta Tags */}
        <CategoryCard category="meta_tags">
          <CheckItem
            label="Tag title presente"
            passed={checks.meta_tags.has_title}
            detail={checks.meta_tags.title_text || undefined}
          />
          <CheckItem
            label="Meta description presente"
            passed={checks.meta_tags.has_description}
            detail={
              checks.meta_tags.description_length > 0
                ? `${checks.meta_tags.description_length} caratteri`
                : undefined
            }
          />
          <CheckItem
            label="Canonical URL"
            passed={checks.meta_tags.has_canonical}
          />
          <CheckItem
            label="Open Graph title"
            passed={checks.meta_tags.has_og_title}
          />
          <CheckItem
            label="Open Graph description"
            passed={checks.meta_tags.has_og_description}
          />
        </CategoryCard>

        {/* Contenuto */}
        <CategoryCard category="content">
          <CheckItem
            label="Intestazione H1 presente"
            passed={checks.content.has_h1}
          />
          <CheckItem
            label={`${checks.content.heading_count} intestazioni totali`}
            passed={checks.content.heading_count >= 3}
            detail="Minimo consigliato: 3"
          />
          <CheckItem
            label="Contiene statistiche/numeri"
            passed={checks.content.has_numbers}
            detail="Le statistiche aumentano le citazioni AI del +40%"
          />
          <CheckItem
            label="Contiene link esterni"
            passed={checks.content.has_links}
            detail="Le fonti citate aumentano le citazioni AI del +115%"
          />
          <CheckItem
            label={`${checks.content.word_count} parole`}
            passed={checks.content.word_count >= 300}
            detail="Minimo consigliato: 300 parole"
          />
        </CategoryCard>

        {/* Raccomandazioni */}
        <RecommendationList recommendations={audit.recommendations} />
      </div>
    </div>
  );
}
