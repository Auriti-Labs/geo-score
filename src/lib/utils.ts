import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatta data ISO in formato leggibile
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Tronca URL per visualizzazione
export function truncateUrl(url: string, maxLength = 50): string {
  const clean = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength - 3) + "...";
}

// Normalizza URL per dedup (lowercase, senza trailing /, senza www)
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed.toLowerCase());
    parsed.hostname = parsed.hostname.replace(/^www\./, "");
    // Rimuovi trailing slash dal pathname (tranne root)
    if (parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return trimmed.toLowerCase().replace(/\/+$/, "");
  }
}
