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
  md: { mark: "h-7 w-7", word: "text-[1.35rem]" },
  lg: { mark: "h-10 w-10", word: "text-[2rem]" },
} as const;

/**
 * Vellum brand mark — a folded sheet of drafting paper carrying a drafted "V"
 * that resolves at a single measured datum point (the sienna tick), the way a
 * dimension converges on a benchmark. Flat, drafted, premium: ink + paper +
 * one sienna accent, no gradients, no shadow.
 *
 * Tone-aware: on a paper-toned sheet the glyph is inked, on an ink-toned sheet
 * the glyph is paper — so the mark stays legible on both light and dark chrome.
 */
export function VellumLogo({
  className,
  withWordmark = false,
  size = "md",
  tone,
}: VellumLogoProps) {
  const colorClass = tone === "ink" ? "text-ink" : tone === "paper" ? "text-paper" : "";
  const sheetFill =
    tone === "paper" ? "var(--paper)" : tone === "ink" ? "var(--ink)" : "currentColor";
  const glyphFill = tone === "paper" ? "var(--ink)" : "var(--paper)";
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
        {/* Outer sheet */}
        <rect x="2.5" y="2.5" width="27" height="27" rx="4" fill={sheetFill} />
        {/* Folded vellum corner — a deliberate hairline fold */}
        <path d="M22.5 2.5 L29.5 9.5 L29.5 2.5 Z" fill={glyphFill} opacity="0.16" />
        {/* The drafted V — two precise strokes meeting at the measured vertex */}
        <path
          d="M9.5 9.8 L16 21.4 L22.5 9.8"
          stroke={glyphFill}
          strokeWidth="2.3"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />
        {/* Datum tick — the single sienna accent, the measured origin point */}
        <rect x="14.9" y="20.3" width="2.2" height="2.2" rx="0.35" fill="var(--sienna)" />
      </svg>
      {withWordmark && (
        <span className={cn("font-display tracking-tight", dims.word)}>Vellum</span>
      )}
    </span>
  );
}
