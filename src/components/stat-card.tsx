"use client";

import CountUp from "@/components/reactbits/CountUp";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export function StatCard({
  label,
  value,
  suffix,
  hint,
  color = "rgba(139, 123, 255, 0.22)",
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <SpotlightCard
      spotlightColor={color}
      className="rise !rounded-2xl !p-5"
      style={{ animationDelay: `${delay}ms`, "--spotlight-card-surface": "rgba(17,17,20,0.7)" } as React.CSSProperties}
    >
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-white">
        <CountUp to={value} separator="," duration={1.6} delay={delay / 1000} suffix={suffix} trigger="load" />
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </SpotlightCard>
  );
}
