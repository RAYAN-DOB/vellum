import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "premium-panel rounded-[4px] border bg-[#fbfaf6] text-[#171613]",
  {
    variants: {
      tone: {
        default: "border-[#d8d0bf]/90",
        muted: "border-[#d8d0bf] bg-[#f2ede4]/80 shadow-none",
        dark: "drawing-line border-[#3c3932] bg-[#171613] text-[#f7f3ea]",
        warning: "border-[#e4c887] bg-[#fbf2dd] shadow-none",
      },
      interactive: {
        true: "transition duration-200 hover:-translate-y-0.5 hover:border-[#b9aa8f] hover:shadow-[0_28px_85px_rgba(22,21,18,0.12)]",
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
      className={cn("text-base font-semibold leading-6 text-[#171613]", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm leading-6 text-[#6b665a]", className)} {...props} />
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
        "flex items-center justify-between gap-3 border-t border-[#d8d0bf] p-5 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}
