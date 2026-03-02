"use client";

import { useEffect, useState } from "react";
import type { ScoreBand } from "@/types/audit";
import { SCORE_BANDS } from "@/lib/constants";

interface ScoreGaugeProps {
  score: number;
  band: ScoreBand;
  size?: number;
}

// Cerchio SVG animato che mostra il punteggio 0-100
export function ScoreGauge({ score, band, size = 180 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const color = SCORE_BANDS[band].color;

  useEffect(() => {
    // Animazione del punteggio da 0 al valore finale
    const duration = 1000;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const fraction = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - fraction, 3);
      setAnimatedScore(Math.round(eased * score));

      if (fraction < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Cerchio sfondo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-muted"
        />
        {/* Cerchio progresso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      {/* Punteggio al centro */}
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold" style={{ color }}>
          {animatedScore}
        </span>
        <span className="text-sm text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}
