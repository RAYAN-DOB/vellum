import { cn } from "@/lib/utils";

type VellumLogoProps = {
  className?: string;
  /** Show the full wordmark next to the mark. */
  withWordmark?: boolean;
  /** Override the mark size (rem-based). Default: h-7 / w-7. */
  size?: "sm" | "md" | "lg";
  /** Force a tone. Default inherits currentColor. */
  tone?: "light" | "gold";
};

const sizeMap = {
  sm: { mark: "h-7 w-7", word: "text-[1.1rem]" },
  md: { mark: "h-9 w-9", word: "text-[1.4rem]" },
  lg: { mark: "h-12 w-12", word: "text-[2rem]" },
} as const;

/**
 * Vellum brand mark — Premium 3D-style logo with glow effects
 * Dramatic "V" mark with metallic feel and ambient lighting
 */
export function VellumLogo({
  className,
  withWordmark = false,
  size = "md",
  tone = "light",
}: VellumLogoProps) {
  const dims = sizeMap[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 leading-none",
        className,
      )}
    >
      <span className="relative">
        {/* Glow effect behind logo */}
        <span 
          className="absolute inset-0 blur-lg opacity-60"
          style={{
            background: tone === "gold" 
              ? "radial-gradient(circle, rgba(245,166,35,0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
          }}
        />
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          focusable="false"
          className={cn("shrink-0 relative", dims.mark)}
        >
          <defs>
            {/* Gold gradient */}
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tone === "gold" ? "#fcd28d" : "#ffffff"} />
              <stop offset="50%" stopColor={tone === "gold" ? "#f5a623" : "#e4e4e7"} />
              <stop offset="100%" stopColor={tone === "gold" ? "#c98a12" : "#a1a1aa"} />
            </linearGradient>
            {/* Subtle inner shadow */}
            <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feOffset in="blur" dx="0" dy="1" result="offsetBlur" />
              <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
            </filter>
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle with glass effect */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#logoGradient)"
            opacity="0.1"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* The "V" mark - bold and modern */}
          <path
            d="M12 12 L20 28 L28 12"
            stroke="url(#logoGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#glow)"
          />
          
          {/* Small accent dot */}
          <circle
            cx="20"
            cy="30"
            r="1.5"
            fill={tone === "gold" ? "#f5a623" : "#ffffff"}
            opacity="0.8"
          />
        </svg>
      </span>
      
      {withWordmark && (
        <span
          className={cn(
            "font-display tracking-tight",
            dims.word,
            tone === "gold" ? "text-gradient-gold" : "text-paper"
          )}
        >
          Vellum
        </span>
      )}
    </span>
  );
}
