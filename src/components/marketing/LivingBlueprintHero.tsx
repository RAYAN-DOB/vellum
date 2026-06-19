"use client";

/**
 * LivingBlueprintHero — the hero centerpiece.
 *
 * A detailed fictional architectural plan, presented as a framed drafting sheet
 * that settles in on load and responds to the cursor with a few degrees of
 * CSS-3D tilt. Reliable, on-theme, never blank — no WebGL fragility. Under
 * reduced motion it renders the finished sheet statically.
 */

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const PLAN_SRC = "/technical-plans/vellum-plan-architecture.svg";
const EASE = [0.16, 1, 0.3, 1] as const;

export function LivingBlueprintHero() {
  const reduce = useReducedMotion();

  // Pointer tilt — a few degrees, spring-damped. Reliable CSS 3D, not WebGL.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), {
    stiffness: 110,
    damping: 18,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), {
    stiffness: 110,
    damping: 18,
  });

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[640px]"
      style={{ perspective: 1200 }}
    >
      {/* faint sienna radial wash — the only allowed gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[12px] bg-[radial-gradient(circle_at_72%_14%,rgba(159,79,56,0.12),transparent_40%)]"
      />

      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={
          reduce
            ? undefined
            : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }
        }
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="sheet relative aspect-square min-h-[28rem] overflow-hidden rounded-[10px]"
      >
        {/* faint paper grid behind the plan */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-paper opacity-40"
        />

        {/* The plan */}
        <Image
          src={PLAN_SRC}
          alt="Plan technique Vellum — aperçu d'architecture"
          fill
          priority
          sizes="(min-width: 1024px) 560px, 90vw"
          className="object-contain p-6"
        />

        {/* thin sienna corner tick (top-left) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 z-20 h-5 w-5 border-l border-t border-sienna/70"
        />
        <span className="caption absolute right-3 top-3 z-20 text-sienna">
          PLAN → VOLUME
        </span>
        <span className="caption absolute bottom-3 left-3 z-20 text-mute">
          VELLUM · AXONOMÉTRIE
        </span>
      </motion.div>
    </div>
  );
}

export default LivingBlueprintHero;
