"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Errore applicazione:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">Qualcosa è andato storto</h2>
      <p className="text-muted-foreground">
        Si è verificato un errore imprevisto. Riprova o torna alla home.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="default">
          Riprova
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Torna alla home</Link>
        </Button>
      </div>
    </div>
  );
}
