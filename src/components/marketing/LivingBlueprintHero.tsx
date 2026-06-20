"use client";

/**
 * LivingBlueprintHero — the hero centerpiece.
 *
 * A detailed fictional architectural plan, presented as a framed drafting sheet
 * that settles in on load and responds to the cursor with a few degrees of
 * CSS-3D tilt. Over it floats "le calque vivant": a trail of translucent dated
 * tracing-paper revisions (RÉV. A → B → C · validé) that drift gently and make
 * the promise "suivez chaque correction jusqu'au livrable" literal. Reliable,
 * on-theme, never blank — no WebGL fragility. Under reduced motion everything
 * renders statically.
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

const REVISIONS: {
  ref: string;
  date: string;
  note: string;
  done?: boolean;
}[] = [
  { ref: "RÉV. A", date: "12.05", note: "Relevé" },
  { ref: "RÉV. B", date: "18.05", note: "Corrections" },
  { ref: "RÉV. C", date: "24.05", note: "Validé", done: true },
];

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
      {/* faint pine radial wash — the only allowed gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[12px] bg-[radial-gradient(circle_at_72%_14%,rgba(31,107,71,0.12),transparent_40%)]"
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

        {/* thin pine corner tick (top-left) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 z-20 h-5 w-5 border-l border-t border-pine/70"
        />
        <span className="caption absolute right-3 top-3 z-20 text-pine">
          PLAN → VOLUME
        </span>
        <span className="caption absolute bottom-3 left-3 z-20 text-mute">
          VELLUM · AXONOMÉTRIE
        </span>
      </motion.div>

      {/* Le calque vivant — translucent dated revision trail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-14 z-30 hidden flex-col gap-3 sm:flex sm:-right-3 lg:-right-6"
      >
        {/* faint connector hairline through the stack */}
        <span className="absolute left-[14px] top-2 bottom-2 w-px bg-pine/25" />
        {REVISIONS.map((rev, i) => (
          <motion.div
            key={rev.ref}
            initial={reduce ? false : { opacity: 0, x: 14 }}
            animate={
              reduce
                ? false
                : { opacity: 1, x: 0, y: [0, i % 2 === 0 ? -5 : -3, 0] }
            }
            transition={
              reduce
                ? undefined
                : {
                    opacity: { duration: 0.5, ease: EASE, delay: 0.7 + i * 0.18 },
                    x: { duration: 0.5, ease: EASE, delay: 0.7 + i * 0.18 },
                    y: {
                      duration: 6 + i,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: 1 + i * 0.5,
                    },
                  }
            }
            className={
              "relative flex items-center gap-2.5 rounded-[4px] border px-2.5 py-1.5 backdrop-blur-[2px] " +
              (rev.done
                ? "border-pine/40 bg-pine-tint/80 shadow-[0_14px_30px_-20px_rgba(22,25,26,0.5)]"
                : "border-line-strong bg-paper/88 shadow-[0_16px_32px_-18px_rgba(22,25,26,0.5)]")
            }
          >
            <span
              className={
                "size-2 shrink-0 rounded-full " +
                (rev.done ? "bg-pine" : "border border-pine/50 bg-paper")
              }
            />
            <span className="leading-tight">
              <span className="block font-mono text-[10px] tracking-[0.08em] text-ink">
                {rev.ref} · {rev.date}
              </span>
              <span
                className={
                  "block text-[10px] " +
                  (rev.done ? "font-medium text-pine-active" : "text-mute")
                }
              >
                {rev.note}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LivingBlueprintHero;
