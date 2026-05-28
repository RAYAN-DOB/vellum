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
 * Premium empty state with glass morphism and glow effects
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
        "relative overflow-hidden rounded-2xl border border-graphite bg-slate/30 p-10 sm:p-14",
        className,
      )}
    >
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-subtle opacity-50"
      />
      
      {/* Ambient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] opacity-20 blur-[80px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(245,166,35,0.3) 0%, transparent 70%)" }}
      />
      
      <div className="relative flex max-w-xl flex-col items-start gap-5">
        {caption ? <p className="caption text-gold">{caption}</p> : null}
        {Icon ? (
          <span
            aria-hidden="true"
            className="inline-flex size-12 items-center justify-center rounded-xl border border-graphite bg-slate/50"
          >
            <Icon className="size-5 text-silver" />
          </span>
        ) : null}
        <h2 className="display text-3xl text-paper">{title}</h2>
        {description ? (
          <p className="max-w-md text-base leading-relaxed text-silver">
            {description}
          </p>
        ) : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </section>
  );
}
