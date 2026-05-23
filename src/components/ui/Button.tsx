import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-[3px] font-medium transition duration-200 active:translate-y-px",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-[#171613] text-[#f7f3ea] shadow-[0_18px_40px_rgba(22,21,18,0.22)] hover:bg-[#2b2923] focus-visible:outline-[#171613]",
        secondary:
          "bg-[#f8f5ed] text-[#171613] shadow-sm ring-1 ring-[#d8d0bf] hover:bg-white focus-visible:outline-[#171613]",
        outline:
          "border border-[#d8d0bf] bg-[#fbfaf6]/70 text-[#171613] hover:bg-[#f0eadf] focus-visible:outline-[#171613]",
        ghost:
          "bg-transparent text-[#5e594d] hover:bg-[#ebe5d7] hover:text-[#171613] focus-visible:outline-[#171613]",
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
