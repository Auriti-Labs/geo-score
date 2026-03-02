import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuditNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20">
      <h1 className="text-4xl font-bold">Audit non trovato</h1>
      <p className="text-muted-foreground">
        Questo audit non esiste o è stato rimosso.
      </p>
      <Button asChild>
        <Link href="/">Analizza un nuovo sito</Link>
      </Button>
    </div>
  );
}
