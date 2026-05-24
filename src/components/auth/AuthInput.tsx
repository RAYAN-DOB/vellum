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
      <span className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-mute">
        <span>{label}</span>
        {rightSlot}
      </span>
      <input
        {...props}
        id={inputId}
        className={cn(
          "block h-11 w-full rounded-[3px] border border-line-strong bg-paper px-3.5 text-[14px] text-ink outline-none transition placeholder:text-soft hover:border-graphite focus:border-ink focus:ring-2 focus:ring-ink/15",
          props.disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      />
      {hint ? (
        <span className="mt-2 block text-[12px] leading-5 text-mute">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
