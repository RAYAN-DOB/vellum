import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex min-w-0 items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-[0.98]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
  ],
  {
    variants: {
      variant: {
        primary:
          "relative overflow-hidden bg-gradient-to-r from-gold via-gold to-gold-deep text-void shadow-[0_0_20px_rgba(245,166,35,0.2)] hover:shadow-[0_0_30px_rgba(245,166,35,0.3)]",
        secondary:
          "bg-slate text-paper ring-1 ring-graphite hover:bg-obsidian hover:ring-silver/30",
        outline:
          "border border-graphite bg-transparent text-paper hover:bg-slate/50 hover:border-silver/30",
        ghost:
          "bg-transparent text-silver hover:bg-slate/50 hover:text-paper",
        danger:
          "bg-crimson/20 text-crimson ring-1 ring-crimson/30 hover:bg-crimson/30",
      },
      size: {
        sm: "h-9 gap-1.5 px-4 text-sm",
        md: "h-11 gap-2 px-5 text-sm",
        lg: "h-12 gap-2.5 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  asChild?: boolean;
};

export function Button({
  className,
  variant,
  size,
  icon,
  iconPosition = "left",
  fullWidth = false,
  asChild = false,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && "w-full",
        className,
      )}
      type={type}
      {...props}
    >
      {icon && iconPosition === "left" ? icon : null}
      <span className="truncate relative z-10">{children}</span>
      {icon && iconPosition === "right" ? icon : null}
      {/* Shine effect for primary */}
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      )}
    </button>
  );
}
