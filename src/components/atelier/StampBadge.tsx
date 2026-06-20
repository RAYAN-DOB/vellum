"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type Tone = "pine" | "crimson" | "graphite";

const toneClass: Record<Tone, string> = {
  pine: "border-[color-mix(in_srgb,var(--pine)_55%,var(--paper))] text-[color-mix(in_srgb,var(--pine)_62%,var(--ink))]",
  crimson:
    "border-[color-mix(in_srgb,var(--crimson)_50%,var(--paper))] text-[color-mix(in_srgb,var(--crimson)_60%,var(--ink))]",
  graphite: "border-line-strong text-graphite",
};

/**
 * StampBadge — a status badge that lands like an ink stamp: it scales down and
 * rotates into a slight tilt with a springy spring. Reduced-motion safe.
 */
export function StampBadge({
  label,
  tone = "pine",
  className,
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={reduce ? false : { scale: 1.35, rotate: -16, opacity: 0 }}
      animate={reduce ? false : { scale: 1, rotate: -6, opacity: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 15 }}
      className={cn(
        "inline-flex shrink-0 -rotate-6 items-center rounded-[3px] border-2 px-3 py-1 font-mono text-[12px] font-semibold uppercase tracking-[0.14em]",
        toneClass[tone],
        className,
      )}
    >
      {label}
    </motion.span>
  );
}
