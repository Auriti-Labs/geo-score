"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

export function ScanCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setCount(data.totalAudits))
      .catch(() => setCount(null));
  }, []);

  // Non mostrare nulla finché non abbiamo il dato o se è 0
  if (count === null || count === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <BarChart3 className="h-4 w-4" />
      <span>
        <strong className="text-foreground">
          {count.toLocaleString("it-IT")}
        </strong>{" "}
        siti analizzati
      </span>
    </div>
  );
}
