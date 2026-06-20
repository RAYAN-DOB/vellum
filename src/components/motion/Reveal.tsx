"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  fadeRise,
  fadeRiseItem,
  inViewport,
  staggerContainer,
} from "@/lib/motion";

type Tag = "div" | "section" | "ul" | "ol" | "li";

const tagMap = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Animate direct <Reveal item> children in sequence. */
  stagger?: boolean;
  /** This element is a stagger child; its parent <Reveal stagger> drives it. */
  item?: boolean;
};

/**
 * App-wide in-view reveal. A calm fade+rise once on scroll-in; collapses to a
 * no-op under prefers-reduced-motion. Put `stagger` on a container and `item`
 * on its children for sequenced entrances. Keeps parents as Server Components —
 * only this subtree opts into the client runtime.
 */
export function Reveal({
  children,
  className,
  as = "div",
  stagger = false,
  item = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = tagMap[as];

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  if (item) {
    return (
      <MotionTag className={className} variants={fadeRiseItem}>
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={stagger ? staggerContainer : fadeRise}
      initial="hidden"
      whileInView="show"
      viewport={inViewport}
    >
      {children}
    </MotionTag>
  );
}
