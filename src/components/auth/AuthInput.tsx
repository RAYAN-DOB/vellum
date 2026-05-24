import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  rightSlot?: ReactNode;
};

export function AuthInput({
  label,
  hint,
  rightSlot,
  className,
  id,
  ...props
}: AuthInputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-[#cfc6b5]">
        <span>{label}</span>
        {rightSlot}
      </span>
      <input
        {...props}
        id={inputId}
        className={cn(
          "block h-11 w-full rounded-[3px] border border-[#34312b] bg-[#0a0908] px-3 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#5e594d] focus:border-[#d7c6a4] focus:ring-2 focus:ring-[#d7c6a4]/30",
          props.disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      />
      {hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-[#8f8777]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
