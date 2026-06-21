"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type Ripple = { id: number; x: number; y: number };

/**
 * InkButton — the primary action. On click an ink drop diffuses from the cursor
 * (no AnimatePresence — each ripple removes itself on animation end, which is
 * robust under React 19). Reduced-motion skips the ripple.
 */
export function InkButton({
  children,
  className,
  onClick,
  type = "button",
  square = false,
  tone = "ink",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Squared drafting button (rounded-[2px]) instead of the pill. */
  square?: boolean;
  /** ink = near-black fill (default, emerald rationed); paper = inverse for ink panels. */
  tone?: "ink" | "paper";
}) {
  const reduce = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!reduce) {
      const rect = event.currentTarget.getBoundingClientRect();
      setRipples((cur) => [
        ...cur,
        {
          id: Date.now() + Math.random(),
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        },
      ]);
    }
    onClick?.(event);
  }

  const rippleTone = tone === "paper" ? "bg-ink/15" : "bg-paper/40";

  return (
    <button
      type={type}
      onClick={handleClick}
      className={cn(
        "relative inline-flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden px-6 text-[14px] font-medium transition active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
        square ? "rounded-[2px]" : "rounded-full",
        square
          ? tone === "paper"
            ? "bg-paper text-ink hover:bg-vellum"
            : "bg-ink text-paper hover:bg-graphite"
          : "bg-pine text-paper hover:bg-pine-hover",
        className,
      )}
      {...props}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden="true"
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 7, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          onAnimationComplete={() =>
            setRipples((cur) => cur.filter((x) => x.id !== r.id))
          }
          className={cn(
            "pointer-events-none absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full",
            rippleTone,
          )}
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
