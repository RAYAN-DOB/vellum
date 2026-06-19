"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeRise, inViewport } from "@/lib/motion";

/**
 * Reusable section-reveal wrapper for the marketing landing. Fades + rises its
 * children into view once, and collapses to a no-op when the user prefers
 * reduced motion. Keeps the parent page a Server Component — only this subtree
 * opts into the client runtime.
 */
export function MotionSection({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = as === "section" ? motion.section : motion.div;

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      className={className}
      variants={fadeRise}
      initial="hidden"
      whileInView="show"
      viewport={inViewport}
    >
      {children}
    </MotionTag>
  );
}
