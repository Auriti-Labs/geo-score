import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckItemProps {
  label: string;
  passed: boolean;
  detail?: string;
}

// Singolo check pass/fail con dettaglio opzionale
export function CheckItem({ label, passed, detail }: CheckItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          passed ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500",
        )}
      >
        {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </div>
      <div className="flex-1">
        <p className={cn("text-sm", passed ? "text-foreground" : "text-muted-foreground")}>
          {label}
        </p>
        {detail && (
          <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
        )}
      </div>
    </div>
  );
}
