import { cn } from "@/lib/utils";

type VellumLogoProps = {
  className?: string;
  /** Show the full wordmark next to the mark. */
  withWordmark?: boolean;
  /** Override the mark size (rem-based). Default: h-7 / w-7. */
  size?: "sm" | "md" | "lg";
  /** Force a tone. Default inherits currentColor. */
  tone?: "ink" | "paper";
};

const sizeMap = {
  sm: { mark: "h-5 w-5", word: "text-[1.05rem]" },
  md: { mark: "h-7 w-7", word: "text-[1.35rem]" },
  lg: { mark: "h-10 w-10", word: "text-[2rem]" },
} as const;

/**
 * Vellum brand mark — a folded sheet of drafting paper forming a "V".
 * The fold-line is a deliberate hairline, the corner is sharp like a T-square.
 * No gradients, no shadow — flat, drafted, premium.
 */
export function VellumLogo({
  className,
  withWordmark = false,
  size = "md",
  tone,
}: VellumLogoProps) {
  const colorClass = tone === "ink" ? "text-ink" : tone === "paper" ? "text-paper" : "";
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
        <rect
          x="2.5"
          y="2.5"
          width="27"
          height="27"
          rx="3.5"
          fill="currentColor"
        />
        {/* Folded corner — vellum sheet */}
        <path
          d="M22 2.5 L29.5 10 L29.5 2.5 Z"
          fill="var(--paper)"
          opacity="0.18"
        />
        {/* The "V" drafted in negative space */}
        <path
          d="M9 10 L16 22 L23 10"
          stroke="var(--paper)"
          strokeWidth="2.25"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />
      </svg>
      {withWordmark && (
        <span
          className={cn(
            "font-display tracking-tight",
            dims.word,
          )}
        >
          Vellum
        </span>
      )}
    </span>
  );
}
