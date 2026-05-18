import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md font-medium transition duration-200 active:translate-y-px",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)] hover:bg-slate-800 focus-visible:outline-slate-950",
        secondary:
          "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-slate-700",
        outline:
          "border border-slate-300 bg-white/70 text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-700",
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-slate-700",
        danger:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-700",
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
