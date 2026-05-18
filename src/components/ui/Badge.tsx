import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: VariantProps<typeof badgeVariants>["tone"];
};

const badgeVariants = cva(
  "inline-flex max-w-full items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
  {
    variants: {
      tone: {
        neutral: "bg-slate-100 text-slate-700 ring-slate-200",
        blue: "bg-blue-50 text-blue-700 ring-blue-200",
        green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        amber: "bg-amber-50 text-amber-800 ring-amber-200",
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
