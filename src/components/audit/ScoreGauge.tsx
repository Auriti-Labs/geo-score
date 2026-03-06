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
    // Rispetta prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Usa rAF per evitare setState sincrono nell'effect
      const id = requestAnimationFrame(() => setAnimatedScore(score));
      return () => cancelAnimationFrame(id);
    }

    // Animazione del punteggio da 0 al valore finale
    const duration = 1000;
    const start = performance.now();
    let rafId: number;

    function animate(now: number) {
      const elapsed = now - start;
      const fraction = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - fraction, 3);
      setAnimatedScore(Math.round(eased * score));

      if (fraction < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [score]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`GEO Score: ${score} su 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <title>GEO Score: {score} su 100</title>
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
