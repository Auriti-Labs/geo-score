"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie-consent";

// Legge lo stato dal localStorage senza setState nell'effect
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getConsentSnapshot(): string | null {
  if (typeof window === "undefined") return "accepted";
  return localStorage.getItem(COOKIE_CONSENT_KEY);
}

function getServerSnapshot(): string | null {
  return "accepted"; // SSR: non mostrare il banner
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribeToStorage, getConsentSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  const handleConsent = useCallback((value: "accepted" | "rejected") => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setDismissed(true);
  }, []);

  if (consent || dismissed) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      role="dialog"
      aria-label="Consenso cookie"
    >
      <div className="container mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          Questo sito utilizza solo cookie tecnici essenziali.{" "}
          <Link
            href="/cookie-policy"
            className="underline hover:text-foreground"
          >
            Scopri di più
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            onClick={() => handleConsent("rejected")}
            size="sm"
            variant="outline"
          >
            Rifiuta
          </Button>
          <Button
            onClick={() => handleConsent("accepted")}
            size="sm"
          >
            Accetta
          </Button>
        </div>
      </div>
    </div>
  );
}
