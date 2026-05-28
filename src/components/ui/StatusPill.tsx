import { cn } from "@/lib/utils";

type Tone = "neutral" | "amber" | "green" | "gold" | "red" | "blue";

const TONE_STYLES: Record<Tone, string> = {
  neutral: "border-graphite bg-slate/50 text-silver",
  gold: "border-gold/30 bg-gold/10 text-gold",
  amber: "border-amber/30 bg-amber/10 text-amber",
  green: "border-emerald/30 bg-emerald/10 text-emerald",
  blue: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  red: "border-crimson/30 bg-crimson/10 text-crimson",
};

export function StatusPill({
  tone = "neutral",
  children,
  className,
  dot = false,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        TONE_STYLES[tone],
        className,
      )}
    >
      {dot && (
        <span 
          className={cn(
            "size-1.5 rounded-full animate-pulse",
            tone === "gold" && "bg-gold",
            tone === "amber" && "bg-amber",
            tone === "green" && "bg-emerald",
            tone === "blue" && "bg-sky-400",
            tone === "red" && "bg-crimson",
            tone === "neutral" && "bg-silver",
          )}
        />
      )}
      {children}
    </span>
  );
}
