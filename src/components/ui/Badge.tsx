import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: VariantProps<typeof badgeVariants>["tone"];
};

const badgeVariants = cva(
  "inline-flex max-w-full items-center rounded-lg px-3 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      tone: {
        neutral: "bg-slate/50 text-silver ring-graphite",
        gold: "bg-gold/10 text-gold ring-gold/30",
        green: "bg-emerald/10 text-emerald ring-emerald/30",
        amber: "bg-amber/10 text-amber ring-amber/30",
        red: "bg-crimson/10 text-crimson ring-crimson/30",
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
