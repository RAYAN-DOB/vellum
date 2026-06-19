import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "premium-panel min-w-0 rounded-[4px] border bg-paper text-ink",
  {
    variants: {
      tone: {
        default: "border-line-strong",
        muted: "border-line-strong bg-vellum",
        dark: "drawing-line border-graphite bg-ink text-paper",
        warning: "border-line-strong bg-vellum-dim",
      },
      interactive: {
        true: "transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_18px_40px_-24px_var(--ink)]",
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
    <div className={cn("min-w-0 space-y-1.5 p-5 sm:p-6", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "break-words text-base font-semibold leading-6 text-ink",
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
      className={cn("break-words text-sm leading-6 text-mute", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("min-w-0 p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-line-strong p-5 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}
