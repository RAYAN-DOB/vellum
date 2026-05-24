"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useTransition } from "react";

import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type Variant = "ghost-light" | "ghost-dark";

type Props = {
  variant?: Variant;
  className?: string;
  label?: string;
};

export function SignOutButton({
  variant = "ghost-dark",
  className,
  label = "Se déconnecter",
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOutAction())}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-[3px] px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "ghost-dark"
          ? "text-[#5e594d] hover:bg-[#eee8dc] hover:text-[#171613]"
          : "border border-[#f7f3ea]/18 text-[#d9d0bf] hover:bg-[#f7f3ea]/10 hover:text-[#f7f3ea]",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <LogOut className="size-4" aria-hidden />
      )}
      {label}
    </button>
  );
}
