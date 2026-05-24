import { cn } from "@/lib/utils";

type Tone = "neutral" | "amber" | "green" | "blue" | "red" | "violet";

const TONE_STYLES: Record<Tone, string> = {
  neutral: "border-[#d8d0bf] bg-[#f0eadf] text-[#3c382f]",
  amber: "border-amber-300 bg-amber-50 text-amber-900",
  green: "border-emerald-300 bg-emerald-50 text-emerald-900",
  blue: "border-sky-300 bg-sky-50 text-sky-900",
  red: "border-red-300 bg-red-50 text-red-900",
  violet: "border-violet-300 bg-violet-50 text-violet-900",
};

const DARK_TONE_STYLES: Record<Tone, string> = {
  neutral: "border-[#34312b] bg-[#0a0908] text-[#cfc6b5]",
  amber: "border-amber-500/50 bg-amber-950/40 text-amber-200",
  green: "border-emerald-500/50 bg-emerald-950/40 text-emerald-200",
  blue: "border-sky-500/50 bg-sky-950/40 text-sky-200",
  red: "border-red-500/50 bg-red-950/40 text-red-200",
  violet: "border-violet-500/50 bg-violet-950/40 text-violet-200",
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
