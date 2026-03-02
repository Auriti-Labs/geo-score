import { Shield, FlaskConical, Zap } from "lucide-react";

const signals = [
  {
    icon: FlaskConical,
    text: "Basato sulla ricerca Princeton KDD 2024 (GEO)",
  },
  {
    icon: Shield,
    text: "814 test, 88% coverage — motore validato",
  },
  {
    icon: Zap,
    text: "14 AI bot tracciati tra cui GPTBot, ClaudeBot, PerplexityBot",
  },
] as const;

export function TrustSignals() {
  return (
    <section className="border-y bg-muted/50 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8">
        {signals.map((signal) => (
          <div
            key={signal.text}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <signal.icon className="h-4 w-4 shrink-0" />
            <span>{signal.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
