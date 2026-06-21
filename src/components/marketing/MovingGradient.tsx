"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * MovingGradient — a slow cinematic aurora field, Vellum palette only:
 * deep ink-black base + emerald + cyan + petrol blobs, blurred, drifting on long
 * loops (no rainbow, no neon — moody, premium). `dark` glows on black (mix-blend
 * screen); `light` is a faint coloured wash for paper sections.
 *
 * Perf: the blob animations PAUSE when the field scrolls off-screen (Intersection
 * via useInView), so three instances on one page don't all paint continuously.
 * Reduced-motion safe (global reduce block freezes the drift). Place inside a
 * `relative overflow-hidden` parent.
 */
export function MovingGradient({
  className,
  variant = "dark",
  grain = false,
}: {
  className?: string;
  variant?: "dark" | "light";
  grain?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "140px" });
  const dark = variant === "dark";
  const play = inView ? "running" : "paused";

  const blob = (color: string, pct: number) =>
    `radial-gradient(circle at center, color-mix(in srgb, ${color} ${pct}%, transparent), transparent 66%)`;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* base */}
      <div className={cn("absolute inset-0", dark ? "bg-[#0a1213]" : "bg-paper")} />

      {/* emerald blob */}
      <div
        className="absolute -left-[12%] -top-[18%] h-[75%] w-[75%] rounded-full blur-[56px]"
        style={{
          background: blob("var(--pine)", dark ? 56 : 24),
          mixBlendMode: dark ? "screen" : "multiply",
          animation: "aurora-1 24s ease-in-out infinite",
          animationPlayState: play,
          willChange: "transform",
        }}
      />
      {/* cyan blob */}
      <div
        className="absolute -right-[10%] top-[10%] h-[70%] w-[70%] rounded-full blur-[60px]"
        style={{
          background: blob("var(--cyan)", dark ? 46 : 20),
          mixBlendMode: dark ? "screen" : "multiply",
          animation: "aurora-2 30s ease-in-out infinite",
          animationPlayState: play,
          willChange: "transform",
        }}
      />
      {/* petrol blob (depth) */}
      <div
        className="absolute bottom-[-22%] left-[22%] h-[78%] w-[78%] rounded-full blur-[64px]"
        style={{
          background: blob("var(--petrol)", dark ? 60 : 16),
          mixBlendMode: dark ? "screen" : "multiply",
          animation: "aurora-3 26s ease-in-out infinite",
          animationPlayState: play,
          willChange: "transform",
        }}
      />
      {/* faint brass warmth (trace) — dark only */}
      {dark ? (
        <div
          className="absolute right-[18%] top-[-8%] h-[40%] w-[40%] rounded-full blur-[64px]"
          style={{
            background: blob("var(--brass)", 12),
            mixBlendMode: "screen",
            animation: "aurora-2 34s ease-in-out infinite",
            animationPlayState: play,
          }}
        />
      ) : null}

      {/* cinematic vignette — darkens the edges (dark only) */}
      {dark ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 38%, transparent 38%, rgba(6,10,11,0.5) 78%, rgba(6,10,11,0.82))",
          }}
        />
      ) : null}

      {/* fine grain — opt-in only (perf); kills banding when used */}
      {grain ? (
        <svg className="absolute inset-0 hidden h-full w-full opacity-[0.05] mix-blend-overlay md:block">
          <filter id="mg-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mg-grain)" />
        </svg>
      ) : null}
    </div>
  );
}
