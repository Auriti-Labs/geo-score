import type { UserPlan } from "@/types/database";

const PLAN_LIMITS: Record<UserPlan, number | null> = {
  free: 3,
  pro: 50,
  agency: null, // illimitato
};

interface UsageBarProps {
  plan: UserPlan;
  used: number;
}

export function UsageBar({ plan, used }: UsageBarProps) {
  const limit = PLAN_LIMITS[plan];

  // Piano agency — nessun limite
  if (limit === null) {
    return (
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{used}</span> analisi
        oggi — <span className="text-primary">illimitate</span>
      </div>
    );
  }

  const percentage = Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage >= 80;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Analisi oggi</span>
        <span className={isNearLimit ? "font-medium text-destructive" : "text-muted-foreground"}>
          {used}/{limit}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${
            isNearLimit ? "bg-destructive" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
