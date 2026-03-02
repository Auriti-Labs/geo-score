"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EmailGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditId: string;
}

export function EmailGateDialog({
  open,
  onOpenChange,
  auditId,
}: EmailGateDialogProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    setLoading(true);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, audit_id: auditId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Errore ${res.status}`);
      }

      toast.success("Report inviato alla tua email!");
      onOpenChange(false);
      setEmail("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nell'invio",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scarica il report PDF</DialogTitle>
          <DialogDescription>
            Inserisci la tua email per ricevere il report completo in formato
            PDF.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="la-tua@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            aria-label="Indirizzo email"
          />
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded border-input"
              required
            />
            <span>
              Acconsento al trattamento dei dati per ricevere il report.{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
            </span>
          </label>
          <Button
            type="submit"
            disabled={loading || !email.trim() || !consent}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Invio...
              </>
            ) : (
              "Invia report"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
