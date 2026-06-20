import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * AtelierCard — a paper card with a hairline border, a fine paper shadow, a
 * gentle hover lift, and an optional cartouche corner tick.
 */
export function AtelierCard({
  children,
  className,
  corner = false,
}: {
  children: ReactNode;
  className?: string;
  corner?: boolean;
}) {
  return (
    <div
      className={cn(
        "lift relative rounded-[4px] border border-line bg-paper p-5 shadow-[var(--shadow-e1)] hover:border-line-strong hover:shadow-[var(--shadow-e2)]",
        className,
      )}
    >
      {corner ? (
        <span
          aria-hidden="true"
          className="absolute right-2.5 top-2.5 size-2.5 border-r border-t border-pine/40"
        />
      ) : null}
      {children}
    </div>
  );
}
