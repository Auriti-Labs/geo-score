import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendationListProps {
  recommendations: string[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4 text-primary" />
          Raccomandazioni
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="shrink-0 font-medium text-primary">
                {i + 1}.
              </span>
              <span className="text-muted-foreground">{rec}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
