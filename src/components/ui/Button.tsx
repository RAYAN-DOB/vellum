import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex min-w-0 items-center justify-center rounded-[2px] font-medium transition duration-200 active:translate-y-px",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-paper shadow-sm hover:bg-graphite",
        secondary:
          "bg-vellum text-ink ring-1 ring-line-strong hover:bg-paper",
        outline:
          "border border-line-strong bg-paper/70 text-ink hover:bg-vellum",
        ghost:
          "bg-transparent text-mute hover:bg-vellum-dim hover:text-ink",
        danger:
          "bg-crimson text-paper shadow-sm hover:bg-[#7a2f2f] focus-visible:outline-crimson",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-sm",
        md: "h-10 gap-2 px-4 text-sm",
        lg: "h-11 gap-2.5 px-5 text-base",
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
      <span className="truncate">{children}</span>
      {icon && iconPosition === "right" ? icon : null}
    </button>
  );
}
