import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * GlowCard — a paper card with a slow emerald beam travelling around its border
 * (futuristic, but sober: a thin pine arc, never neon). Pure CSS (see
 * globals .border-beam); freezes under prefers-reduced-motion. Use sparingly on
 * a single focal card (a price, a featured plan).
 */
export function GlowCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-beam rounded-[4px] border border-line bg-paper",
        className,
      )}
    >
      {children}
    </div>
  );
}
