import type { UserPlan } from "@/types/database";
import { Badge } from "@/components/ui/badge";

const PLAN_CONFIG: Record<UserPlan, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  free: { label: "Free", variant: "secondary" },
  pro: { label: "Pro", variant: "default" },
  agency: { label: "Agency", variant: "default" },
};

export function PlanBadge({ plan }: { plan: UserPlan }) {
  const config = PLAN_CONFIG[plan];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
