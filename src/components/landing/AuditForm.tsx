"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) return;

    // Aggiungi https:// se mancante
    const fullUrl =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;

    setLoading(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Errore ${res.status}`);
      }

      const data = await res.json();
      router.push(`/audit/${data.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore durante l'analisi",
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="url"
            placeholder="es. mioblog.it"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-9"
            disabled={loading}
            aria-label="URL del sito da analizzare"
          />
        </div>
        <Button type="submit" disabled={loading || !url.trim()} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisi...
            </>
          ) : (
            "Analizza"
          )}
        </Button>
      </form>
      {loading && (
        <p className="text-center text-xs text-muted-foreground animate-in fade-in">
          L&apos;analisi richiede circa 10 secondi...
        </p>
      )}
    </div>
  );
}
