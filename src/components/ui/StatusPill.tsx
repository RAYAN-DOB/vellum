import { cn } from "@/lib/utils";

type Tone = "neutral" | "amber" | "green" | "blue" | "red" | "violet";

/**
 * Status tones, redrawn as desaturated brand-world paper tints. Every pill is a
 * ~10-12% wash of a single brand accent laid over warm paper, a hairline border
 * in the same family, and dark ink-ish text — so they all read as ink-on-paper
 * rather than stock candy colors.
 *
 *   green  -> moss     (positive)
 *   amber  -> clay/amber (attention)
 *   red    -> crimson  (danger)
 *   blue   -> graphite/ink tint (informational, off-brand recolor)
 *   violet -> vellum/graphite tint (off-brand recolor)
 *   neutral-> vellum/mute
 */
const TONE_STYLES: Record<Tone, string> = {
  neutral:
    "border-line-strong bg-vellum text-graphite",
  amber:
    "border-[color-mix(in_srgb,var(--amber)_28%,var(--paper))] bg-[color-mix(in_srgb,var(--amber)_12%,var(--paper))] text-[color-mix(in_srgb,var(--amber)_45%,var(--ink))]",
  green:
    "border-[color-mix(in_srgb,var(--moss)_30%,var(--paper))] bg-[color-mix(in_srgb,var(--moss)_12%,var(--paper))] text-[color-mix(in_srgb,var(--moss)_45%,var(--ink))]",
  blue:
    "border-[color-mix(in_srgb,var(--graphite)_22%,var(--paper))] bg-[color-mix(in_srgb,var(--graphite)_10%,var(--paper))] text-graphite",
  red:
    "border-[color-mix(in_srgb,var(--crimson)_30%,var(--paper))] bg-[color-mix(in_srgb,var(--crimson)_11%,var(--paper))] text-[color-mix(in_srgb,var(--crimson)_55%,var(--ink))]",
  violet:
    "border-[color-mix(in_srgb,var(--mute)_28%,var(--paper))] bg-[color-mix(in_srgb,var(--vellum-dim)_70%,var(--paper))] text-[color-mix(in_srgb,var(--mute)_40%,var(--ink))]",
};

const DARK_TONE_STYLES: Record<Tone, string> = {
  neutral:
    "border-graphite bg-ink text-soft",
  amber:
    "border-[color-mix(in_srgb,var(--amber)_45%,var(--ink))] bg-[color-mix(in_srgb,var(--amber)_18%,var(--ink))] text-[color-mix(in_srgb,var(--amber)_55%,var(--paper))]",
  green:
    "border-[color-mix(in_srgb,var(--moss)_45%,var(--ink))] bg-[color-mix(in_srgb,var(--moss)_18%,var(--ink))] text-[color-mix(in_srgb,var(--moss)_55%,var(--paper))]",
  blue:
    "border-[color-mix(in_srgb,var(--soft)_30%,var(--ink))] bg-[color-mix(in_srgb,var(--graphite)_60%,var(--ink))] text-[color-mix(in_srgb,var(--soft)_70%,var(--paper))]",
  red:
    "border-[color-mix(in_srgb,var(--crimson)_50%,var(--ink))] bg-[color-mix(in_srgb,var(--crimson)_22%,var(--ink))] text-[color-mix(in_srgb,var(--crimson)_55%,var(--paper))]",
  violet:
    "border-[color-mix(in_srgb,var(--mute)_38%,var(--ink))] bg-[color-mix(in_srgb,var(--mute)_18%,var(--ink))] text-[color-mix(in_srgb,var(--soft)_65%,var(--paper))]",
};

export function StatusPill({
  tone = "neutral",
  children,
  dark = false,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        dark ? DARK_TONE_STYLES[tone] : TONE_STYLES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
