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
