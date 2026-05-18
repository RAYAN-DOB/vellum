import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "premium-panel rounded-lg border bg-white text-slate-950",
  {
    variants: {
      tone: {
        default: "border-slate-200/80",
        muted: "border-slate-200 bg-slate-50/80 shadow-none",
        dark: "technical-grid-dark border-slate-800 bg-slate-950 text-white",
        warning: "border-amber-200 bg-amber-50 shadow-none",
      },
      interactive: {
        true: "transition duration-200 hover:-translate-y-0.5 hover:border-blue-200",
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
  return <div className={cn("space-y-1.5 p-5 sm:p-6", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold leading-6 text-slate-950", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm leading-6 text-slate-600", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-slate-200 p-5 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}
