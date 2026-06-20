import { cn } from "@/lib/utils";

/**
 * Atelier mini-charts — pure SVG/CSS, no chart library. Server-safe, fully
 * on-brand (pine on paper, hairline rules). Deliberately simple: a horizontal
 * bar set and a donut gauge cover the admin cockpit needs without a heavy dep.
 */

export function BarChart({
  data,
  className,
}: {
  data: { label: string; value: number; hint?: string }[];
  className?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={cn("space-y-3", className)}>
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-baseline justify-between text-[12px]">
            <span className="truncate text-graphite">{d.label}</span>
            <span className="ml-3 shrink-0 font-mono text-ink">
              {d.hint ?? d.value}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-vellum">
            <div
              className="h-full rounded-full bg-pine"
              style={{ width: `${Math.round((d.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  value,
  total,
  label,
  sublabel,
}: {
  value: number;
  total: number;
  label: string;
  sublabel?: string;
}) {
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  return (
    <div className="flex items-center gap-5">
      <svg
        viewBox="0 0 100 100"
        className="size-24 shrink-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--vellum-dim)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--pine)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="min-w-0">
        <p className="font-display text-[2.25rem] leading-none text-ink">
          {Math.round(pct * 100)}%
        </p>
        <p className="caption mt-1.5">{label}</p>
        {sublabel ? (
          <p className="mt-0.5 text-[12px] text-mute">{sublabel}</p>
        ) : null}
      </div>
    </div>
  );
}
