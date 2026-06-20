import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * DatumPin — a small key fact pinned to a plan: an emerald datum dot, a mono
 * label and a value. Used for délai, révisions, références.
 */
export function DatumPin({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="relative flex size-2.5 items-center justify-center"
      >
        <span className="absolute size-2.5 rounded-full bg-pine/20" />
        <span className="size-1 rounded-full bg-pine" />
      </span>
      <span className="caption">{label}</span>
      <span className="font-mono text-[13px] text-ink">{value}</span>
    </div>
  );
}
