"use client";

import { useState, useCallback } from "react";

// Hook per copiare testo nella clipboard con feedback visuale
export function useCopy(resetMs = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
      } catch {
        // Fallback per browser senza Clipboard API
        setCopied(false);
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
