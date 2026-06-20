import { cn } from "@/lib/utils";

type VellumLogoProps = {
  className?: string;
  /** Show the full wordmark next to the mark. */
  withWordmark?: boolean;
  /** Override the mark size (rem-based). Default: h-7 / w-7. */
  size?: "sm" | "md" | "lg";
  /** Force a tone. Default inherits currentColor (for the sheet). */
  tone?: "ink" | "paper";
};

const sizeMap = {
  sm: { mark: "h-5 w-5", word: "text-[1.05rem]" },
  md: { mark: "h-7 w-7", word: "text-[1.3rem]" },
  lg: { mark: "h-10 w-10", word: "text-[1.9rem]" },
} as const;

/**
 * Vellum brand mark — "Datum": the survey benchmark symbol of every
 * architectural plan. A datum rule (the ground line) with a downward triangle
 * converging on a single measured point, marked by one pine accent diamond —
 * the way a dimension resolves on a benchmark, and the way a project resolves
 * to one signed-off deliverable. Not a letter; real drafting iconography.
 *
 * Tone-aware: the rule + triangle take currentColor by default (or ink/paper
 * when forced), so the mark stays legible on light and dark chrome; the apex
 * diamond is the lone pine accent.
 */
export function VellumLogo({
  className,
  withWordmark = false,
  size = "md",
  tone,
}: VellumLogoProps) {
  const colorClass = tone === "ink" ? "text-ink" : tone === "paper" ? "text-paper" : "";
  const markColor =
    tone === "paper" ? "var(--paper)" : tone === "ink" ? "var(--ink)" : "currentColor";
  const dims = sizeMap[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 leading-none",
        colorClass,
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
        className={cn("shrink-0", dims.mark)}
      >
        {/* Datum rule — the ground / benchmark line */}
        <rect x="4" y="7" width="24" height="1.9" fill={markColor} />
        {/* Benchmark triangle — converges on one measured point */}
        <path
          d="M7.5 9.2 L24.5 9.2 L16 24 Z"
          fill="none"
          stroke={markColor}
          strokeWidth="2.1"
          strokeLinejoin="miter"
        />
        {/* Datum tick — the single pine accent at the measured origin */}
        <rect
          x="14.45"
          y="22.45"
          width="3.1"
          height="3.1"
          transform="rotate(45 16 24)"
          fill="var(--pine)"
        />
      </svg>
      {withWordmark && (
        <span className={cn("font-sans font-medium tracking-[-0.02em]", dims.word)}>
          Vellum
        </span>
      )}
    </span>
  );
}
