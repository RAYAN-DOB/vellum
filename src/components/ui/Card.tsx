import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "min-w-0 rounded-2xl border text-paper transition-all duration-300",
  {
    variants: {
      tone: {
        default: "border-graphite bg-slate/30 card-elevated",
        muted: "border-graphite/50 bg-obsidian/50",
        dark: "border-graphite bg-void",
        warning: "border-amber/30 bg-amber/10",
        glass: "glass",
      },
      interactive: {
        true: "hover:border-gold/30 hover:shadow-[0_0_40px_rgba(245,166,35,0.1)] cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      interactive: false,
    },
  },
);

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, tone, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ tone, interactive }), className)}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("min-w-0 space-y-2 p-6", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "break-words text-lg font-semibold leading-6 text-paper",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("break-words text-sm leading-6 text-silver", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("min-w-0 p-6 pt-0", className)} {...props} />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-graphite p-6",
        className,
      )}
      {...props}
    />
  );
}
