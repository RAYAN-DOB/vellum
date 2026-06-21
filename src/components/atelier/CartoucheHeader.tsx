import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * CartoucheHeader — the drafting title-block used across Vellum: a top rule with
 * mono references framing the edges, an emerald datum edge, and a serif title.
 */
export function CartoucheHeader({
  eyebrow,
  title,
  meta,
  description,
  dark = false,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  meta?: string;
  description?: ReactNode;
  /** Dark-section variant: light title/text, cyan eyebrow, gradient datum edge. */
  dark?: boolean;
  className?: string;
}) {
  return (
    <header className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center justify-between gap-4 border-t pt-2.5",
          dark ? "border-white/15" : "border-line-strong",
        )}
      >
        <span
          className={cn(
            "caption",
            dark && "!text-[color-mix(in_srgb,var(--cyan)_55%,var(--paper))]",
          )}
        >
          {eyebrow}
        </span>
        {meta ? (
          <span
            className={cn(
              "caption hidden sm:inline",
              dark ? "!text-paper/40" : "text-soft",
            )}
          >
            {meta}
          </span>
        ) : null}
      </div>
      <div className="relative mt-6 max-w-2xl pl-4">
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-1.5 h-[calc(100%-0.5rem)] w-px",
            dark ? "bg-[image:var(--gradient-pine-cyan)]" : "bg-pine/50",
          )}
        />
        <h2
          className={cn(
            "display text-[clamp(1.8rem,3.4vw,2.6rem)]",
            dark ? "text-paper" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-3 text-[15px] leading-[1.6]",
              dark ? "text-paper/75" : "text-graphite",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
