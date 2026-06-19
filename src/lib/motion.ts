import type { Variants } from "framer-motion";

/**
 * Vellum — shared "drafting" motion language for the marketing surfaces.
 * Calm, precise, ink-settling — never bouncy. Consumers should pair these with
 * `useReducedMotion()` so transforms collapse for users who prefer less motion;
 * the globals.css `prefers-reduced-motion` block already neutralises CSS
 * animations, and these variants are kept small/opacity-led to match.
 */

/** A precise, slightly mechanical easeOut — like a line drawn against a ruler. */
export const easeDraft: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const springSnappy = {
  type: "spring",
  stiffness: 220,
  damping: 30,
} as const;

/** Section headline / block reveal. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeDraft } },
};

/** Lighter reveal for list/grid children. */
export const fadeRiseItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeDraft } },
};

/** Stagger parent for proof points / pillar cards / workflow steps. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** SVG hairline that draws itself left-to-right. */
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0.3 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: easeDraft } },
};

/** Standard `whileInView` viewport config for section reveals. */
export const inViewport = { once: true, margin: "-80px" } as const;
