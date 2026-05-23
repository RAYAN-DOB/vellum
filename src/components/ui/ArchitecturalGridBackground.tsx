import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ArchitecturalGridBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: "dark" | "paper";
};

export function ArchitecturalGridBackground({
  children,
  className,
  tone = "dark",
  ...props
}: ArchitecturalGridBackgroundProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        tone === "dark"
          ? "architectural-surface drawing-line text-[#f7f3ea]"
          : "paper-grid bg-[#f4f1ea] text-[#171613]",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[#f7f3ea]/25" />
      {children}
    </div>
  );
}
