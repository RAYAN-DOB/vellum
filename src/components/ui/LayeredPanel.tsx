import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type LayeredPanelProps = HTMLAttributes<HTMLDivElement> & {
  dark?: boolean;
};

export function LayeredPanel({
  className,
  dark = false,
  ...props
}: LayeredPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[4px] border backdrop-blur",
        "before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-white/45",
        dark
          ? "border-[#3f3b33] bg-[#171613]/82 text-[#f7f3ea] shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
          : "border-[#d8d0bf] bg-[#fbfaf6]/86 text-[#171613] shadow-[0_24px_70px_rgba(22,21,18,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
