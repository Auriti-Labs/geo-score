// Costanti scoring — replicate 1:1 da geo-optimizer-skill/src/geo_optimizer/models/config.py

import type { ScoreBand } from "@/types/audit";

// Bot AI tracciati nel check robots.txt
export const AI_BOTS: Record<string, string> = {
  GPTBot: "OpenAI (ChatGPT training)",
  "OAI-SearchBot": "OpenAI (ChatGPT search citations)",
  "ChatGPT-User": "OpenAI (ChatGPT on-demand fetch)",
  "anthropic-ai": "Anthropic (Claude training)",
  ClaudeBot: "Anthropic (Claude citations)",
  "claude-web": "Anthropic (Claude web crawl)",
  PerplexityBot: "Perplexity AI (index builder)",
  "Perplexity-User": "Perplexity (citation fetch on-demand)",
  "Google-Extended": "Google (Gemini training)",
  "Applebot-Extended": "Apple (AI training)",
  "cohere-ai": "Cohere (language models)",
  DuckAssistBot: "DuckDuckGo AI",
  Bytespider: "ByteDance/TikTok AI",
  "meta-externalagent": "Meta AI (Facebook/Instagram AI)",
};

// Bot critici per citazioni (non solo training)
export const CITATION_BOTS = new Set([
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
]);

// Schema.org tipi valutati
export const VALUABLE_SCHEMAS = [
  "WebSite",
  "WebApplication",
  "FAQPage",
  "Article",
  "BlogPosting",
  "HowTo",
  "Recipe",
  "Product",
  "Organization",
  "Person",
  "BreadcrumbList",
] as const;

// Pesi scoring per categoria
export const SCORING = {
  robots_found: 5,
  robots_citation_ok: 15,
  robots_some_allowed: 8,
  llms_found: 10,
  llms_h1: 3,
  llms_sections: 4,
  llms_links: 3,
  schema_website: 10,
  schema_faq: 10,
  schema_webapp: 5,
  schema_webapp_or_extra: 5,
  meta_title: 5,
  meta_description: 8,
  meta_canonical: 3,
  meta_og: 4,
  content_h1: 4,
  content_numbers: 6,
  content_links: 5,
} as const;

// Bande di punteggio con colori e label
export const SCORE_BANDS: Record<
  ScoreBand,
  { min: number; max: number; label: string; color: string }
> = {
  excellent: { min: 91, max: 100, label: "Eccellente", color: "#22c55e" },
  good: { min: 71, max: 90, label: "Buono", color: "#3b82f6" },
  foundation: { min: 41, max: 70, label: "Base", color: "#f59e0b" },
  critical: { min: 0, max: 40, label: "Critico", color: "#ef4444" },
};

// Categorie audit con label e icona
export const CATEGORIES = {
  robots_txt: {
    label: "robots.txt",
    description: "Accesso AI bot al sito",
    maxPoints: 20,
  },
  llms_txt: {
    label: "llms.txt",
    description: "File indice per AI",
    maxPoints: 20,
  },
  schema_jsonld: {
    label: "Schema JSON-LD",
    description: "Dati strutturati",
    maxPoints: 25,
  },
  meta_tags: {
    label: "Meta Tags",
    description: "Metadati pagina",
    maxPoints: 20,
  },
  content: {
    label: "Contenuto",
    description: "Qualità contenuto per AI",
    maxPoints: 15,
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
