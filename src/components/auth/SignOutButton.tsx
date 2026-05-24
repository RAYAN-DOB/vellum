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
        "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "ghost"
          ? "text-mute hover:bg-vellum hover:text-ink"
          : "border border-line-strong text-graphite hover:border-ink hover:text-ink",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      {label}
    </button>
  );
}
