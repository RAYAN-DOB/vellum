import type { ComponentType, ReactNode, SVGProps } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  action?: ReactNode;
  caption?: string;
  className?: string;
};

/**
 * Editorial empty state used across role apps for stubbed/empty surfaces.
 * Keeps the same drafted feel as the marketing surface.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  caption,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[4px] border border-line bg-paper p-10 sm:p-14",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-40"
      />
      <div className="relative flex max-w-xl flex-col items-start gap-5">
        {caption ? <p className="caption">{caption}</p> : null}
        {Icon ? (
          <span
            aria-hidden="true"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-vellum/50"
          >
            <Icon className="size-5 text-graphite" />
          </span>
        ) : null}
        <h2 className="display text-3xl text-ink">{title}</h2>
        {description ? (
          <p className="max-w-md text-[15px] leading-[1.65] text-graphite">
            {description}
          </p>
        ) : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </section>
  );
}
