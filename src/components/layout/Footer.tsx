import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Separator className="mb-6" />
        <div className="flex flex-col gap-6">
          {/* Link legali */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Termini
            </Link>
            <Link href="/cookie-policy" className="hover:text-foreground">
              Cookie
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contatti
            </Link>
          </div>
          {/* Credits */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              GEO Score — Basato sulla ricerca{" "}
              <a
                href="https://arxiv.org/abs/2311.09735"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Princeton KDD 2024
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              Creato da{" "}
              <a
                href="https://github.com/Auriti-Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Auriti Labs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
