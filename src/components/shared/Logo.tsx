import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">G</span>
      </div>
      <span className="text-lg font-bold tracking-tight">
        GEO <span className="text-primary">Score</span>
      </span>
    </Link>
  );
}
