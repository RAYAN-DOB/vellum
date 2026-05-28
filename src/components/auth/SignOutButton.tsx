"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useTransition } from "react";

import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type Variant = "ghost" | "outline";

type Props = {
  variant?: Variant;
  className?: string;
  label?: string;
};

export function SignOutButton({
  variant = "ghost",
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
        "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "ghost"
          ? "text-silver hover:bg-slate/50 hover:text-paper"
          : "border border-graphite text-silver hover:border-silver/30 hover:text-paper",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin text-gold" aria-hidden="true" />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      {label}
    </button>
  );
}
