import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: VariantProps<typeof badgeVariants>["tone"];
};

const badgeVariants = cva(
  "inline-flex max-w-full items-center rounded-[3px] px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
  {
    variants: {
      tone: {
        neutral: "bg-[#eee8dc] text-[#5e594d] ring-[#d8d0bf]",
        blue: "bg-[#e9edf0] text-[#47515a] ring-[#cbd3d8]",
        green: "bg-[#e7efe3] text-[#3a4a34] ring-[#c3d2bb]",
        amber: "bg-[#e4f0e9] text-[#154c31] ring-[#bcdac9]",
        red: "bg-[#f3e4e3] text-[#7a2e2e] ring-[#e0bdbb]",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ tone }), className)}
      {...props}
    />
  );
}
