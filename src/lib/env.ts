// Validazione env vars — importato da layout.tsx per fallire subito all'avvio

const requiredServerVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "INTERNAL_API_URL",
  "INTERNAL_API_KEY",
] as const;

export function validateEnv() {
  // Skip validazione durante il build (next build non ha env vars runtime)
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }

  const missing = requiredServerVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `⚠ Variabili ambiente mancanti: ${missing.join(", ")}. Controlla .env.local`,
    );
  }
}
