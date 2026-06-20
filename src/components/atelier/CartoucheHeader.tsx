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
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  meta?: string;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative", className)}>
      <div className="flex items-center justify-between gap-4 border-t border-line-strong pt-2.5">
        <span className="caption">{eyebrow}</span>
        {meta ? (
          <span className="caption hidden text-soft sm:inline">{meta}</span>
        ) : null}
      </div>
      <div className="relative mt-6 max-w-2xl pl-4">
        <span
          aria-hidden="true"
          className="absolute left-0 top-1.5 h-[calc(100%-0.5rem)] w-px bg-pine/50"
        />
        <h2 className="display text-[clamp(1.8rem,3.4vw,2.6rem)] text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-[15px] leading-[1.6] text-graphite">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
