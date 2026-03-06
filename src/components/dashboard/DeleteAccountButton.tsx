"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Errore nella cancellazione");
      }

      toast.success("Account eliminato. Arrivederci!");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella cancellazione",
      );
      setLoading(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setConfirming(true)}
      >
        Elimina account
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm font-medium text-destructive">
        Sei sicuro? Questa azione è irreversibile.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setConfirming(false)}
        disabled={loading}
      >
        Annulla
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Eliminazione...
          </>
        ) : (
          "Conferma eliminazione"
        )}
      </Button>
    </div>
  );
}
