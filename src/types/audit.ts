// Tipi mappati 1:1 dal backend Python (geo-optimizer-skill)

export type ScoreBand = "critical" | "foundation" | "good" | "excellent";

export interface RobotsCheck {
  found: boolean;
  citation_bots_ok: boolean;
  bots_allowed: string[];
  bots_blocked: string[];
  bots_missing: string[];
}

export interface LlmsTxtCheck {
  found: boolean;
  has_h1: boolean;
  has_sections: boolean;
  has_links: boolean;
  word_count: number;
}

export interface SchemaCheck {
  found_types: string[];
  has_website: boolean;
  has_faq: boolean;
  has_webapp: boolean;
}

export interface MetaTagsCheck {
  has_title: boolean;
  has_description: boolean;
  has_canonical: boolean;
  has_og_title: boolean;
  has_og_description: boolean;
  title_text: string;
  description_length: number;
}

export interface ContentCheck {
  has_h1: boolean;
  heading_count: number;
  has_numbers: boolean;
  has_links: boolean;
  word_count: number;
}

export interface AuditChecks {
  robots_txt: RobotsCheck;
  llms_txt: LlmsTxtCheck;
  schema_jsonld: SchemaCheck;
  meta_tags: MetaTagsCheck;
  content: ContentCheck;
}

export interface AuditResult {
  url: string;
  score: number;
  band: ScoreBand;
  timestamp: string;
  http_status: number;
  page_size: number;
  checks: AuditChecks;
  recommendations: string[];
}
