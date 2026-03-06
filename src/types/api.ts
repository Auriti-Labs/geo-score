// Schemi di validazione API con Zod + tipi inferiti

import { z } from "zod";

// --- Request ---

export const AuditRequestSchema = z.object({
  url: z.string().url("URL non valido").max(2000, "URL troppo lungo"),
});

export const EmailRequestSchema = z.object({
  email: z.string().email("Email non valida"),
  audit_id: z.string().uuid("ID audit non valido"),
});

// --- Backend (risposta dal backend Python) ---

export const AuditResultSchema = z.object({
  url: z.string(),
  score: z.number().min(0).max(100),
  band: z.enum(["critical", "foundation", "good", "excellent"]),
  timestamp: z.string(),
  http_status: z.number().int(),
  page_size: z.number().int(),
  checks: z.object({
    robots_txt: z.object({
      found: z.boolean(),
      citation_bots_ok: z.boolean(),
      bots_allowed: z.array(z.string()),
      bots_blocked: z.array(z.string()),
      bots_missing: z.array(z.string()),
    }),
    llms_txt: z.object({
      found: z.boolean(),
      has_h1: z.boolean(),
      has_sections: z.boolean(),
      has_links: z.boolean(),
      word_count: z.number().int(),
    }),
    schema_jsonld: z.object({
      found_types: z.array(z.string()),
      has_website: z.boolean(),
      has_faq: z.boolean(),
      has_webapp: z.boolean(),
    }),
    meta_tags: z.object({
      has_title: z.boolean(),
      has_description: z.boolean(),
      has_canonical: z.boolean(),
      has_og_title: z.boolean(),
      has_og_description: z.boolean(),
      title_text: z.string(),
      description_length: z.number().int(),
    }),
    content: z.object({
      has_h1: z.boolean(),
      heading_count: z.number().int(),
      has_numbers: z.boolean(),
      has_links: z.boolean(),
      word_count: z.number().int(),
    }),
  }),
  recommendations: z.array(z.string()),
});

// --- Response ---

export const AuditResponseSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  score: z.number().int().min(0).max(100),
  band: z.enum(["critical", "foundation", "good", "excellent"]),
});

export const EmailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// --- Tipi inferiti ---

export type AuditRequest = z.infer<typeof AuditRequestSchema>;
export type EmailRequest = z.infer<typeof EmailRequestSchema>;
export type AuditResponse = z.infer<typeof AuditResponseSchema>;
export type EmailResponse = z.infer<typeof EmailResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
