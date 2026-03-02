import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Pagina non trovata</p>
      <Button asChild>
        <Link href="/">Torna alla home</Link>
      </Button>
    </div>
  );
}
