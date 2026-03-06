// Client per chiamare il backend Python (FastAPI geo-optimizer-skill)
// Usato SOLO lato server (API routes) — mai dal browser

import type { AuditResult } from "@/types/audit";
import { AuditResultSchema } from "@/types/api";

const TIMEOUT_MS = parseInt(process.env.API_TIMEOUT_MS ?? "30000", 10);
const MAX_RETRIES = 2;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Chiama il backend Python per eseguire l'audit di un URL
export async function runAudit(url: string): Promise<AuditResult> {
  const baseUrl = process.env.INTERNAL_API_URL;
  const apiKey = process.env.INTERNAL_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new ApiError("Configurazione backend mancante", 500);
  }

  const endpoint = `${baseUrl}/api/audit?url=${encodeURIComponent(url)}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new ApiError(
          `Backend ha risposto con ${response.status}`,
          response.status,
        );
      }

      const json = await response.json();

      // Validazione risposta backend con Zod
      const parsed = AuditResultSchema.safeParse(json);
      if (!parsed.success) {
        console.error("Risposta backend non valida:", parsed.error.issues);
        throw new ApiError("Risposta non valida dal servizio di analisi", 502);
      }

      return parsed.data as AuditResult;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Non ritentare su errori client (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Ultimo tentativo: propaga l'errore
      if (attempt === MAX_RETRIES) break;

      // Exponential backoff con jitter prima del prossimo tentativo
      const backoffMs = Math.min(1000 * Math.pow(2, attempt), 8000);
      const jitter = Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, backoffMs + jitter));
    }
  }

  throw lastError ?? new ApiError("Errore sconosciuto dal backend", 502);
}
