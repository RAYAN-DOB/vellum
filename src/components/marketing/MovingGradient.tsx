import { cn } from "@/lib/utils";

/**
 * MovingGradient — a slow cinematic aurora field, Vellum palette only:
 * deep ink-black base + emerald + cyan + petrol blobs, heavily blurred, drifting
 * on long loops (no rainbow, no neon — moody, premium, like a lit drafting room
 * at night). `dark` glows on black (mix-blend screen); `light` is a faint
 * coloured wash for paper sections. Decorative + reduced-motion safe (the global
 * reduce block freezes the drift). Place inside a `relative overflow-hidden` parent.
 */
export function MovingGradient({
  className,
  variant = "dark",
  grain = true,
}: {
  className?: string;
  variant?: "dark" | "light";
  grain?: boolean;
}) {
  const dark = variant === "dark";

  const blob = (color: string, pct: number) =>
    `radial-gradient(circle at center, color-mix(in srgb, ${color} ${pct}%, transparent), transparent 66%)`;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* base */}
      <div className={cn("absolute inset-0", dark ? "bg-[#0a1213]" : "bg-paper")} />

      {/* emerald blob */}
      <div
        className="absolute -left-[12%] -top-[18%] h-[75%] w-[75%] rounded-full blur-[90px]"
        style={{
          background: blob("var(--pine)", dark ? 80 : 24),
          mixBlendMode: dark ? "screen" : "multiply",
          animation: "aurora-1 24s ease-in-out infinite",
        }}
      />
      {/* cyan blob */}
      <div
        className="absolute -right-[10%] top-[10%] h-[70%] w-[70%] rounded-full blur-[100px]"
        style={{
          background: blob("var(--cyan)", dark ? 70 : 20),
          mixBlendMode: dark ? "screen" : "multiply",
          animation: "aurora-2 30s ease-in-out infinite",
        }}
      />
      {/* petrol blob (depth) */}
      <div
        className="absolute bottom-[-22%] left-[22%] h-[78%] w-[78%] rounded-full blur-[110px]"
        style={{
          background: blob("var(--petrol)", dark ? 85 : 16),
          mixBlendMode: dark ? "screen" : "multiply",
          animation: "aurora-3 26s ease-in-out infinite",
        }}
      />
      {/* faint brass warmth (trace) — dark only */}
      {dark ? (
        <div
          className="absolute right-[18%] top-[-8%] h-[40%] w-[40%] rounded-full blur-[100px]"
          style={{
            background: blob("var(--brass)", 22),
            mixBlendMode: "screen",
            animation: "aurora-2 34s ease-in-out infinite",
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

      {/* fine grain — kills banding, adds texture */}
      {grain ? (
        <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay">
          <filter id="mg-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mg-grain)" />
        </svg>
      ) : null}
    </div>
  );
}
