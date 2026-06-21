import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Pill — the Neo-Atelier pill system. One sober, premium pill that covers every
 * requested role (statut, prestation, étape, calque, tag, filtre, garantie,
 * prix/délai). Fine border, translucent paper, a soft glow + micro-lift on
 * hover, and a subtle emerald→cyan gradient wash when active. No neon.
 *
 * Pure CSS interaction → usable from Server Components. Reduced-motion safe
 * (only a 1px lift + a soft shadow, neutralised by the global reduce block).
 */

export type PillTone =
  | "neutral"
  | "pine"
  | "cyan"
  | "petrol"
  | "brass"
  | "graphite";

const TONE: Record<PillTone, { text: string; border: string; dot: string; ring: string }> = {
  neutral: { text: "text-graphite", border: "border-line-strong", dot: "bg-mute", ring: "var(--mute)" },
  pine: { text: "text-pine-active", border: "border-pine/35", dot: "bg-pine", ring: "var(--pine)" },
  cyan: {
    text: "text-[color-mix(in_srgb,var(--cyan)_55%,var(--ink))]",
    border: "border-cyan/40",
    dot: "bg-cyan",
    ring: "var(--cyan)",
  },
  petrol: {
    text: "text-[color-mix(in_srgb,var(--petrol)_65%,var(--ink))]",
    border: "border-petrol/40",
    dot: "bg-petrol",
    ring: "var(--petrol)",
  },
  brass: {
    text: "text-[color-mix(in_srgb,var(--brass)_50%,var(--ink))]",
    border: "border-brass/45",
    dot: "bg-brass",
    ring: "var(--brass)",
  },
  graphite: { text: "text-graphite", border: "border-graphite/30", dot: "bg-graphite", ring: "var(--graphite)" },
};

export function Pill({
  children,
  icon,
  tone = "neutral",
  active = false,
  dot = false,
  mono = false,
  dark = false,
  size = "md",
  className,
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: PillTone;
  /** Active = subtle emerald→cyan gradient wash + soft glow. */
  active?: boolean;
  /** Leading status dot. */
  dot?: boolean;
  /** Mono type — for prices, délais, références. */
  mono?: boolean;
  /** Dark-context: translucent ink surface + paper text, for dark sections. */
  dark?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <span
      className={cn(
        "group/pill relative inline-flex items-center gap-1.5 rounded-full border font-medium backdrop-blur-[2px] transition-all duration-200 ease-out",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-[12px]",
        mono && "font-mono tracking-[0.02em]",
        dark
          ? cn(
              "border-white/15 text-paper/90",
              active
                ? "bg-white/[0.13] shadow-[0_4px_16px_-9px_var(--pill-ring)]"
                : "bg-white/[0.06] hover:-translate-y-px hover:bg-white/[0.13]",
            )
          : cn(
              t.border,
              t.text,
              active
                ? "bg-[image:var(--pill-grad)] shadow-[0_4px_16px_-8px_var(--pill-ring)]"
                : "bg-paper/60 hover:-translate-y-px hover:bg-paper/85 hover:shadow-[0_4px_16px_-9px_var(--pill-ring)]",
            ),
        className,
      )}
      style={
        {
          "--pill-ring": `color-mix(in srgb, ${t.ring} 50%, transparent)`,
          "--pill-grad": `linear-gradient(120deg, color-mix(in srgb, ${t.ring} 13%, var(--paper)), color-mix(in srgb, var(--cyan) 8%, var(--paper)))`,
        } as CSSProperties
      }
    >
      {dot ? (
        <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", t.dot)} />
      ) : null}
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-3.5">
          {icon}
        </span>
      ) : null}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}
