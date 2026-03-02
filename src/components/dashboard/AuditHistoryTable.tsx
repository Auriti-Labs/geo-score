import Link from "next/link";
import type { ScoreBand } from "@/types/audit";
import { SCORE_BANDS } from "@/lib/constants";

interface AuditSummary {
  id: string;
  url: string;
  score: number;
  band: ScoreBand;
  created_at: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateUrl(url: string, max = 50): string {
  if (url.length <= max) return url;
  return url.slice(0, max) + "…";
}

export function AuditHistoryTable({ audits }: { audits: AuditSummary[] }) {
  if (audits.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">Nessun audit trovato.</p>
        <Link href="/" className="mt-2 inline-block text-sm text-primary hover:underline">
          Analizza il tuo primo sito
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">URL</th>
            <th className="px-4 py-3 text-center font-medium">Score</th>
            <th className="px-4 py-3 text-center font-medium">Band</th>
            <th className="px-4 py-3 text-right font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit) => {
            const bandInfo = SCORE_BANDS[audit.band];
            return (
              <tr key={audit.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link
                    href={`/audit/${audit.id}`}
                    className="text-primary hover:underline"
                  >
                    {truncateUrl(audit.url)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-center font-mono font-semibold">
                  {audit.score}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="inline-block rounded px-2 py-0.5 text-xs font-medium"
                    style={{ color: bandInfo.color }}
                  >
                    {bandInfo.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {formatDate(audit.created_at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
