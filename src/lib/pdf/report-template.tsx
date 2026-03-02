import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { AuditRow } from "@/types/database";
import type { ScoreBand, AuditChecks } from "@/types/audit";
import { SCORE_BANDS, CATEGORIES } from "@/lib/constants";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#18181b",
  },
  // Header
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#18181b",
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#71717a",
  },
  // Score
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f4f4f5",
    borderRadius: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontFamily: "Helvetica-Bold",
  },
  scoreMax: {
    fontSize: 20,
    color: "#71717a",
    marginLeft: 2,
  },
  scoreBand: {
    marginLeft: 16,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  scoreUrl: {
    marginLeft: "auto",
    fontSize: 10,
    color: "#71717a",
    maxWidth: 200,
  },
  // Categorie
  categorySection: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f5",
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  categoryPoints: {
    fontSize: 10,
    color: "#71717a",
  },
  checkRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingLeft: 8,
  },
  checkIcon: {
    width: 14,
    fontSize: 10,
  },
  checkLabel: {
    flex: 1,
    fontSize: 9,
  },
  checkDetail: {
    fontSize: 8,
    color: "#a1a1aa",
    paddingLeft: 22,
    marginBottom: 2,
  },
  // Raccomandazioni
  recsHeader: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 4,
  },
  recItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  recNumber: {
    width: 16,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#71717a",
  },
  recText: {
    flex: 1,
    fontSize: 9,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#a1a1aa",
  },
});

/** Componente check singolo */
function Check({
  label,
  passed,
  detail,
}: {
  label: string;
  passed: boolean;
  detail?: string;
}) {
  return (
    <View>
      <View style={styles.checkRow}>
        <Text style={styles.checkIcon}>{passed ? "✓" : "✗"}</Text>
        <Text style={styles.checkLabel}>{label}</Text>
      </View>
      {detail && <Text style={styles.checkDetail}>{detail}</Text>}
    </View>
  );
}

interface ReportPdfProps {
  audit: AuditRow;
}

export function ReportPdf({ audit }: ReportPdfProps) {
  const bandInfo = SCORE_BANDS[audit.band as ScoreBand];
  const checks = audit.checks as AuditChecks;
  const date = new Date(audit.created_at).toLocaleDateString("it-IT");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GEO Score Report</Text>
          <Text style={styles.subtitle}>
            Analisi visibilità AI — {date}
          </Text>
        </View>

        {/* Score principale */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>{audit.score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
          <Text style={[styles.scoreBand, { color: bandInfo.color }]}>
            {bandInfo.label}
          </Text>
          <Text style={styles.scoreUrl}>{audit.url}</Text>
        </View>

        {/* robots.txt */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>
              {CATEGORIES.robots_txt.label}
            </Text>
            <Text style={styles.categoryPoints}>
              max {CATEGORIES.robots_txt.maxPoints}pt
            </Text>
          </View>
          <Check label="robots.txt trovato" passed={checks.robots_txt.found} />
          <Check
            label="Bot di citazione autorizzati"
            passed={checks.robots_txt.citation_bots_ok}
          />
          {checks.robots_txt.bots_allowed.length > 0 && (
            <Check
              label={`${checks.robots_txt.bots_allowed.length} bot autorizzati`}
              passed={true}
              detail={checks.robots_txt.bots_allowed.join(", ")}
            />
          )}
          {checks.robots_txt.bots_blocked.length > 0 && (
            <Check
              label={`${checks.robots_txt.bots_blocked.length} bot bloccati`}
              passed={false}
              detail={checks.robots_txt.bots_blocked.join(", ")}
            />
          )}
        </View>

        {/* llms.txt */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>
              {CATEGORIES.llms_txt.label}
            </Text>
            <Text style={styles.categoryPoints}>
              max {CATEGORIES.llms_txt.maxPoints}pt
            </Text>
          </View>
          <Check label="llms.txt trovato" passed={checks.llms_txt.found} />
          <Check label="Contiene H1" passed={checks.llms_txt.has_h1} />
          <Check
            label="Sezioni strutturate"
            passed={checks.llms_txt.has_sections}
          />
          <Check label="Contiene link" passed={checks.llms_txt.has_links} />
          <Check
            label={`${checks.llms_txt.word_count} parole`}
            passed={checks.llms_txt.word_count >= 50}
          />
        </View>

        {/* Schema JSON-LD */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>
              {CATEGORIES.schema_jsonld.label}
            </Text>
            <Text style={styles.categoryPoints}>
              max {CATEGORIES.schema_jsonld.maxPoints}pt
            </Text>
          </View>
          {checks.schema_jsonld.found_types.length > 0 ? (
            <Check
              label={`Schema: ${checks.schema_jsonld.found_types.join(", ")}`}
              passed={true}
            />
          ) : (
            <Check label="Nessuno schema trovato" passed={false} />
          )}
          <Check label="WebSite" passed={checks.schema_jsonld.has_website} />
          <Check label="FAQPage" passed={checks.schema_jsonld.has_faq} />
          <Check
            label="WebApplication"
            passed={checks.schema_jsonld.has_webapp}
          />
        </View>

        {/* Meta Tags */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>
              {CATEGORIES.meta_tags.label}
            </Text>
            <Text style={styles.categoryPoints}>
              max {CATEGORIES.meta_tags.maxPoints}pt
            </Text>
          </View>
          <Check
            label="Title"
            passed={checks.meta_tags.has_title}
            detail={checks.meta_tags.title_text || undefined}
          />
          <Check
            label="Description"
            passed={checks.meta_tags.has_description}
            detail={
              checks.meta_tags.description_length > 0
                ? `${checks.meta_tags.description_length} caratteri`
                : undefined
            }
          />
          <Check label="Canonical" passed={checks.meta_tags.has_canonical} />
          <Check label="Open Graph" passed={checks.meta_tags.has_og_title} />
        </View>

        {/* Contenuto */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>
              {CATEGORIES.content.label}
            </Text>
            <Text style={styles.categoryPoints}>
              max {CATEGORIES.content.maxPoints}pt
            </Text>
          </View>
          <Check label="H1 presente" passed={checks.content.has_h1} />
          <Check
            label={`${checks.content.heading_count} intestazioni`}
            passed={checks.content.heading_count >= 3}
          />
          <Check
            label="Statistiche/numeri"
            passed={checks.content.has_numbers}
          />
          <Check label="Link esterni" passed={checks.content.has_links} />
          <Check
            label={`${checks.content.word_count} parole`}
            passed={checks.content.word_count >= 300}
          />
        </View>

        {/* Raccomandazioni */}
        {audit.recommendations.length > 0 && (
          <View>
            <Text style={styles.recsHeader}>Raccomandazioni</Text>
            {audit.recommendations.map((rec, i) => (
              <View key={i} style={styles.recItem}>
                <Text style={styles.recNumber}>{i + 1}.</Text>
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            GEO Score — geoscore.dev
          </Text>
          <Text style={styles.footerText}>
            Basato sulla ricerca Princeton KDD 2024
          </Text>
        </View>
      </Page>
    </Document>
  );
}
