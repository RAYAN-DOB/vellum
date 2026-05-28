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
      <span className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.1em] text-dim">
        <span>{label}</span>
        {rightSlot}
      </span>
      <input
        {...props}
        id={inputId}
        className={cn(
          "block h-12 w-full rounded-xl border border-graphite bg-obsidian/50 px-4 text-sm text-paper outline-none transition placeholder:text-dim hover:border-silver/30 focus:border-gold focus:bg-obsidian focus:ring-2 focus:ring-gold/20",
          props.disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      />
      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-dim">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
