import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BorderBeamProps = HTMLAttributes<HTMLDivElement>;

export function BorderBeam({ className, ...props }: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-[inherit] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(96,165,250,0.9)_70deg,transparent_140deg,transparent_360deg)] p-px opacity-70 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor] motion-safe:animate-spin motion-safe:[animation-duration:9s]" />
    </div>
  );
}
