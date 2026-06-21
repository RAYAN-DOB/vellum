"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/utils";

/**
 * Atelier mini-charts — pure SVG/CSS, no chart library. On-brand (pine on paper,
 * hairline rules). Bars fill and the donut arc draws once on scroll-in, with a
 * count-up on the percentage — a sober "live data" feel. Reduced-motion renders
 * the final state instantly; SSR-safe.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function BarChart({
  data,
  className,
}: {
  data: { label: string; value: number; hint?: string }[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div ref={ref} className={cn("space-y-3", className)}>
      {data.map((d, i) => {
        const pct = Math.round((d.value / max) * 100);
        return (
          <div key={d.label}>
            <div className="flex items-baseline justify-between text-[12px]">
              <span className="truncate text-graphite">{d.label}</span>
              <span className="ml-3 shrink-0 font-mono text-ink">
                {d.hint ?? d.value}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-vellum">
              <motion.div
                className="h-full rounded-full bg-pine"
                initial={reduce ? false : { width: 0 }}
                animate={{ width: reduce || inView ? `${pct}%` : 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.7, ease: EASE, delay: i * 0.07 }
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Donut({
  value,
  total,
  label,
  sublabel,
}: {
  value: number;
  total: number;
  label: string;
  sublabel?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  return (
    <div ref={ref} className="flex items-center gap-5">
      <svg
        viewBox="0 0 100 100"
        className="size-24 shrink-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--vellum-dim)"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--pine)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          initial={reduce ? false : { strokeDashoffset: dash }}
          animate={{ strokeDashoffset: reduce || inView ? 0 : dash }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
        />
      </svg>
      <div className="min-w-0">
        <p className="font-display text-[2.25rem] leading-none text-ink">
          <CountUp value={Math.round(pct * 100)} />%
        </p>
        <p className="caption mt-1.5">{label}</p>
        {sublabel ? (
          <p className="mt-0.5 text-[12px] text-mute">{sublabel}</p>
        ) : null}
      </div>
    </div>
  );
}
