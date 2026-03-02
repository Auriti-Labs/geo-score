import type { ScoreBand as ScoreBandType } from "@/types/audit";
import { SCORE_BANDS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface ScoreBandProps {
  band: ScoreBandType;
}

const variantMap: Record<ScoreBandType, "default" | "secondary" | "destructive" | "outline"> = {
  excellent: "default",
  good: "secondary",
  foundation: "outline",
  critical: "destructive",
};

export function ScoreBandBadge({ band }: ScoreBandProps) {
  const info = SCORE_BANDS[band];

  return (
    <Badge variant={variantMap[band]} className="text-sm">
      {info.label} ({info.min}-{info.max})
    </Badge>
  );
}
