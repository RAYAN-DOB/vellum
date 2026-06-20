"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type CountUpProps = {
  value: number;
  className?: string;
  /** Format the displayed number (default: rounded integer). */
  format?: (n: number) => string;
};

/**
 * Animated number that springs from 0 → value once it scrolls into view.
 * Under prefers-reduced-motion it renders the final value immediately. Used for
 * dashboard metrics, devis totals and counts.
 */
export function CountUp({
  value,
  className,
  format = (n) => String(Math.round(n)),
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, restDelta: 0.5 });

  useEffect(() => {
    if (reduce) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    if (inView) mv.set(value);
  }, [inView, value, reduce, mv, format]);

  useEffect(() => {
    if (reduce) return;
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = format(v);
    });
  }, [spring, format, reduce]);

  return (
    <span ref={ref} className={className}>
      {format(reduce ? value : 0)}
    </span>
  );
}
