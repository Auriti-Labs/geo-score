import { BarChart3 } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";

// Server component — fetcha direttamente da Supabase senza API call client-side
export async function ScanCounter() {
  let count = 0;

  try {
    const supabase = createServiceClient();
    const { count: total } = await supabase
      .from("audits")
      .select("*", { count: "exact", head: true });

    count = total ?? 0;
  } catch {
    // Fallback silenzioso — non mostrare nulla se errore
    return null;
  }

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <BarChart3 className="h-4 w-4" aria-hidden="true" />
      <span>
        <strong className="text-foreground">
          {count.toLocaleString("it-IT")}
        </strong>{" "}
        siti analizzati
      </span>
    </div>
  );
}
