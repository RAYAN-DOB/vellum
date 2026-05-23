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
        green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
        amber: "bg-[#f4ead7] text-[#8a5b15] ring-[#e4c887]",
        red: "bg-red-50 text-red-700 ring-red-200",
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
