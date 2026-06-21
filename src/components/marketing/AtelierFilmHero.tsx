"use client";

/**
 * AtelierFilmHero — the hero centerpiece. A framed sheet of vellum on which a
 * single project drafts itself in one continuous take: a loose pencil croquis is
 * put "au propre" into clean ink walls on the EXACT same coordinates (the wobble
 * straightening is the "a real draftsman did this" beat), cotations measure
 * themselves, technical calques fan on, then the flat plan resolves into a calm
 * axonometric volume — while the titleblock REV field ticks A → B → C · VALIDÉ,
 * making "corrections suivies jusqu'au livrable" literally visible.
 *
 * Hand-authored inline SVG + one framer-motion timeline, gated by
 * useReducedMotion() + useInView(once): it plays a single time on scroll-in then
 * settles to a gentle idle (breathe + pointer tilt). No WebGL — crisp at any DPR,
 * SSR-safe, mobile + reduced-motion render the finished planche statically.
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.16, 1, 0.3, 1] as const;
const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace";

const INK = "var(--ink)";
const GRAPHITE = "var(--graphite)";
const MUTE = "var(--mute)";
const LINE = "var(--line-strong)";
const PINE = "var(--pine)";
const CANARD = "var(--canard)";

/* Step captions + titleblock state, advanced by timers in sync with the draw. */
const STEPS = [
  { caption: "CROQUIS CLIENT REÇU", rev: "—", status: "REÇU" },
  { caption: "CROQUIS BRUT", rev: "—", status: "EN COURS" },
  { caption: "MISE AU PROPRE", rev: "A", status: "EN COURS" },
  { caption: "PLAN 2D · COTÉ", rev: "B", status: "EN COURS" },
  { caption: "CALQUES TECHNIQUES", rev: "B", status: "EN COURS" },
  { caption: "APERÇU 3D · AXONOMÉTRIE", rev: "C", status: "VALIDÉ" },
] as const;
const STEP_TIMES = [0.5, 1.6, 3.0, 4.4, 6.0]; // seconds → advance to step i+1
const FINAL_STEP = STEPS.length - 1;

/* Beats (seconds) */
const B = {
  croquis: 0.5,
  ink: 1.6,
  detail: 2.7,
  cotes: 3.6,
  calques: 4.6,
  axo: 6.0,
  tags: 7.0,
};

/* Flat-plan geometry (wall centerlines) */
const OUTER = "M150 150 H560 V440 H150 Z";
const VWALL_TOP = "M360 150 V298";
const VWALL_BOT = "M360 352 V440";
const HWALL = "M360 305 H560";
const DOOR_LEAF = "M360 352 H316";
const DOOR_ARC = "M360 300 A52 52 0 0 0 316 352";
const WIN_TOP = "M214 150 H286";
const WIN_RIGHT = "M560 196 V256";

/* Axonometric massing (pre-projected, centered ~330) */
const AX = {
  shadow: { cx: 330, cy: 580, rx: 98, ry: 15 },
  groundLeft: "220,499 330,436 330,356 220,419", // L0 F0 F1 L1
  groundRight: "330,436 440,499 440,419 330,356", // F0 R0 R1 F1
  upperLeft: "220,419 330,356 330,276 220,339",
  upperRight: "330,356 440,419 440,339 330,276",
  roof: "330,276 440,339 330,402 220,339", // F2 R2 B2 L2
  floorLineL0: "220,459 330,396",
  floorLineR0: "330,396 440,459",
  floorLineL1: "220,379 330,316",
  floorLineR1: "330,316 440,379",
  // pine "becomes volume" apex edges
  ridgeL: "330,276 220,339",
  ridgeR: "330,276 440,339",
  frontEdge: "330,436 330,276",
};

const CALQUES = [
  { label: "ARCHITECTURE", tone: INK },
  { label: "ÉLECTRICITÉ", tone: CANARD },
  { label: "PLOMBERIE", tone: MUTE },
] as const;

/** A drawn ink stroke — pathLength 0→1 when playing, full when reduced. */
function Ink({
  d,
  w = 1.6,
  color = INK,
  delay = 0,
  dur = 0.8,
  play,
  reduce,
  dash,
  opacity = 1,
}: {
  d: string;
  w?: number;
  color?: string;
  delay?: number;
  dur?: number;
  play: boolean;
  reduce: boolean;
  dash?: string;
  opacity?: number;
}) {
  const common = {
    d,
    stroke: color,
    strokeWidth: w,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
    strokeDasharray: dash,
    opacity,
  };
  if (reduce) return <path {...common} />;
  return (
    <motion.path
      {...common}
      initial={{ pathLength: 0 }}
      animate={play ? { pathLength: 1 } : { pathLength: 0 }}
      transition={{ delay, duration: dur, ease: EASE }}
    />
  );
}

export function AtelierFilmHero() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const play = inView && !reduce;
  const [step, setStep] = useState(0);

  // Drive caption / titleblock steps in sync with the draw.
  useEffect(() => {
    if (!play) return;
    const timers = STEP_TIMES.map((t, i) =>
      setTimeout(() => setStep(i + 1), t * 1000),
    );
    return () => timers.forEach(clearTimeout);
  }, [play]);

  // Pointer tilt — a few degrees, spring-damped (reused from LivingBlueprintHero).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), {
    stiffness: 110,
    damping: 18,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), {
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

  const effStep = reduce ? FINAL_STEP : Math.min(step, FINAL_STEP);
  const s = STEPS[effStep];
  const validated = effStep >= FINAL_STEP;
  const showFinal = play || reduce; // calques / axo / tags resolved

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[600px]"
      style={{ perspective: 1200 }}
    >
      {/* the single sanctioned faint pine wash — hero only, ≤12% */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 rounded-[24px] bg-[radial-gradient(circle_at_72%_18%,rgba(15,118,110,0.10),transparent_46%)]"
      />

      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={
          reduce
            ? undefined
            : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }
        }
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={reduce ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="sheet relative aspect-square overflow-hidden rounded-[8px] -rotate-1"
      >
        {/* faint paper grid behind the linework */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-paper opacity-40"
        />

        <svg
          viewBox="0 0 720 720"
          aria-hidden="true"
          className="relative h-full w-full"
        >
          <defs>
            <filter id="afh-sketch" x="-6%" y="-6%" width="112%" height="112%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.018"
                numOctaves={2}
                seed={7}
                result="n"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n"
                scale={6}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {/* inner ink frame */}
          <rect
            x={16}
            y={16}
            width={688}
            height={688}
            fill="none"
            stroke={LINE}
            strokeWidth={1.5}
          />
          {/* corner datum tick — the first earned pine mark */}
          <Ink d="M150 178 V150 H178" w={2} color={PINE} delay={0.3} dur={0.4} play={play} reduce={reduce} />

          {/* caption (top-left), step-driven */}
          <g>
            <rect x={44} y={48} width={7} height={7} fill={PINE} />
            <motion.text
              key={s.caption}
              x={62}
              y={56}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.14em" }}
              fill={MUTE}
            >
              {s.caption}
            </motion.text>
          </g>

          {/* ── flat plan + cotations (ghost out when the volume resolves) ── */}
          <motion.g
            initial={{ opacity: 1 }}
            animate={reduce ? { opacity: 0.22 } : play ? { opacity: 0.22 } : { opacity: 1 }}
            transition={reduce ? { duration: 0 } : { delay: B.axo, duration: 0.8, ease: EASE }}
          >
            {/* croquis — same coordinates as the ink, hand-jittered, fades as ink lands */}
            {!reduce && (
              <motion.g
                filter="url(#afh-sketch)"
                stroke={GRAPHITE}
                strokeWidth={2.4}
                fill="none"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={play ? { opacity: [0, 0.6, 0.6, 0.14] } : { opacity: 0 }}
                transition={{ delay: B.croquis, duration: 2.0, times: [0, 0.2, 0.55, 0.92], ease: "linear" }}
              >
                <motion.path d={OUTER} initial={{ pathLength: 0 }} animate={play ? { pathLength: 1 } : { pathLength: 0 }} transition={{ delay: B.croquis, duration: 1.0, ease: EASE }} vectorEffect="non-scaling-stroke" />
                <motion.path d="M360 150 V440" initial={{ pathLength: 0 }} animate={play ? { pathLength: 1 } : { pathLength: 0 }} transition={{ delay: B.croquis + 0.2, duration: 0.8, ease: EASE }} vectorEffect="non-scaling-stroke" />
                <motion.path d={HWALL} initial={{ pathLength: 0 }} animate={play ? { pathLength: 1 } : { pathLength: 0 }} transition={{ delay: B.croquis + 0.4, duration: 0.7, ease: EASE }} vectorEffect="non-scaling-stroke" />
              </motion.g>
            )}

            {/* clean ink walls (mise au propre) */}
            <Ink d={OUTER} w={7} delay={B.ink} dur={1.0} play={play} reduce={reduce} />
            <Ink d={VWALL_TOP} w={7} delay={B.ink + 0.5} dur={0.5} play={play} reduce={reduce} />
            <Ink d={VWALL_BOT} w={7} delay={B.ink + 0.7} dur={0.4} play={play} reduce={reduce} />
            <Ink d={HWALL} w={7} delay={B.ink + 0.6} dur={0.5} play={play} reduce={reduce} />

            {/* details: door swing + windows */}
            <Ink d={DOOR_ARC} w={1.4} color={MUTE} delay={B.detail} dur={0.5} play={play} reduce={reduce} />
            <Ink d={DOOR_LEAF} w={2} delay={B.detail} dur={0.4} play={play} reduce={reduce} />
            <Ink d={WIN_TOP} w={3} color="var(--paper)" delay={B.detail} dur={0.3} play={play} reduce={reduce} />
            <Ink d={WIN_TOP} w={1.2} delay={B.detail + 0.1} dur={0.3} play={play} reduce={reduce} />
            <Ink d={WIN_RIGHT} w={3} color="var(--paper)" delay={B.detail} dur={0.3} play={play} reduce={reduce} />
            <Ink d={WIN_RIGHT} w={1.2} delay={B.detail + 0.1} dur={0.3} play={play} reduce={reduce} />

            {/* room labels */}
            <motion.g
              initial={reduce ? false : { opacity: 0 }}
              animate={showFinal ? { opacity: 1 } : { opacity: 0 }}
              transition={reduce ? { duration: 0 } : { delay: B.detail + 0.3, duration: 0.5 }}
              style={{ fontFamily: MONO }}
              fill={MUTE}
            >
              <text x={196} y={300} style={{ fontSize: 14, letterSpacing: "0.1em" }}>SÉJOUR</text>
              <text x={430} y={236} style={{ fontSize: 12, letterSpacing: "0.1em" }}>CH.</text>
              <text x={430} y={392} style={{ fontSize: 12, letterSpacing: "0.1em" }}>BAIN</text>
            </motion.g>

            {/* cotations */}
            <Ink d="M150 458 V490" w={1} color={MUTE} delay={B.cotes} dur={0.3} play={play} reduce={reduce} />
            <Ink d="M560 458 V490" w={1} color={MUTE} delay={B.cotes} dur={0.3} play={play} reduce={reduce} />
            <Ink d="M150 478 H560" w={1.1} color={MUTE} delay={B.cotes + 0.15} dur={0.6} play={play} reduce={reduce} />
            <Ink d="M138 150 H106" w={1} color={MUTE} delay={B.cotes} dur={0.3} play={play} reduce={reduce} />
            <Ink d="M138 440 H106" w={1} color={MUTE} delay={B.cotes} dur={0.3} play={play} reduce={reduce} />
            <Ink d="M120 150 V440" w={1.1} color={MUTE} delay={B.cotes + 0.15} dur={0.6} play={play} reduce={reduce} />
            <motion.g
              initial={reduce ? false : { opacity: 0 }}
              animate={showFinal ? { opacity: 1 } : { opacity: 0 }}
              transition={reduce ? { duration: 0 } : { delay: B.cotes + 0.5, duration: 0.4 }}
              style={{ fontFamily: MONO }}
              fill={MUTE}
            >
              <rect x={332} y={468} width={46} height={14} fill="var(--paper)" />
              <text x={336} y={479} style={{ fontSize: 12 }}>6,30 m</text>
              <rect x={104} y={288} width={14} height={46} fill="var(--paper)" />
              <text x={116} y={300} transform="rotate(-90 116 300)" style={{ fontSize: 12 }}>4,60 m</text>
            </motion.g>
          </motion.g>

          {/* ── calques fan (lower-left) ── */}
          <g>
            {CALQUES.map((c, i) => (
              <motion.g
                key={c.label}
                initial={reduce ? false : { opacity: 0, x: -10 }}
                animate={showFinal ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={reduce ? { duration: 0 } : { delay: B.calques + i * 0.18, duration: 0.4, ease: EASE }}
              >
                <rect x={44} y={548 + i * 40} width={172} height={32} rx={2} fill="var(--paper)" stroke={LINE} strokeWidth={1} />
                <rect x={44} y={548 + i * 40} width={3} height={32} fill={c.tone} />
                <text x={62} y={568 + i * 40} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em" }} fill={MUTE}>
                  {c.label}
                </text>
              </motion.g>
            ))}
          </g>

          {/* électricité circuit hint — canard dashed run, appears with the layer */}
          <Ink d="M250 305 V210 H470" w={1.3} color={CANARD} dash="6 6" delay={B.calques + 0.4} dur={0.8} play={play} reduce={reduce} opacity={0.75} />

          {/* ── axonometric volume (cross-fades in, rises) ── */}
          <motion.g
            initial={{ opacity: 0, y: 28 }}
            animate={showFinal ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={reduce ? { duration: 0 } : { delay: B.axo, duration: 1.1, ease: EXPO }}
          >
            {/* ground shadow */}
            <ellipse cx={AX.shadow.cx} cy={AX.shadow.cy} rx={AX.shadow.rx} ry={AX.shadow.ry} fill={INK} opacity={0.06} />
            {/* storey faces — light logic: left in shade, right lit, roof brightest */}
            <polygon points={AX.groundLeft} fill="rgba(22,25,26,0.13)" stroke={INK} strokeWidth={1.7} />
            <polygon points={AX.groundRight} fill="rgba(22,25,26,0.05)" stroke={INK} strokeWidth={1.7} />
            <polygon points={AX.upperLeft} fill="rgba(22,25,26,0.13)" stroke={INK} strokeWidth={1.7} />
            <polygon points={AX.upperRight} fill="rgba(22,25,26,0.05)" stroke={INK} strokeWidth={1.7} />
            <polygon points={AX.roof} fill="var(--paper)" stroke={INK} strokeWidth={1.7} />
            {/* floor divisions */}
            <polyline points={AX.floorLineL0} fill="none" stroke={INK} strokeWidth={0.8} opacity={0.5} />
            <polyline points={AX.floorLineR0} fill="none" stroke={INK} strokeWidth={0.8} opacity={0.5} />
            <polyline points={AX.floorLineL1} fill="none" stroke={INK} strokeWidth={0.8} opacity={0.5} />
            <polyline points={AX.floorLineR1} fill="none" stroke={INK} strokeWidth={0.8} opacity={0.5} />
            {/* the single emerald "becomes volume" moment — apex + front edges */}
            <polyline points={AX.ridgeL} fill="none" stroke={PINE} strokeWidth={2.2} strokeLinecap="round" />
            <polyline points={AX.ridgeR} fill="none" stroke={PINE} strokeWidth={2.2} strokeLinecap="round" />
            <line x1={330} y1={436} x2={330} y2={276} stroke={PINE} strokeWidth={2.2} strokeLinecap="round" />
          </motion.g>

          {/* ── titleblock / cartouche (persistent scaffolding) ── */}
          <g style={{ fontFamily: MONO }}>
            <rect x={452} y={556} width={240} height={132} fill="var(--paper)" stroke={INK} strokeWidth={1.4} />
            <rect x={452} y={556} width={240} height={30} fill="var(--vellum)" stroke={INK} strokeWidth={1.4} />
            <text x={464} y={576} style={{ fontSize: 14, letterSpacing: "0.16em" }} fill={INK}>VELLUM</text>
            <text x={576} y={576} style={{ fontSize: 9, letterSpacing: "0.12em" }} fill={MUTE}>CABINET D&apos;ÉTUDES</text>
            {/* rows */}
            <line x1={452} y1={616} x2={692} y2={616} stroke={LINE} strokeWidth={1} />
            <line x1={452} y1={646} x2={692} y2={646} stroke={LINE} strokeWidth={1} />
            <line x1={572} y1={586} x2={572} y2={688} stroke={LINE} strokeWidth={1} />
            <text x={464} y={602} style={{ fontSize: 9, letterSpacing: "0.1em" }} fill={MUTE}>REF</text>
            <text x={464} y={613} style={{ fontSize: 11 }} fill={INK}>VLM-202606-0042</text>
            <text x={584} y={602} style={{ fontSize: 9, letterSpacing: "0.1em" }} fill={MUTE}>ÉCH.</text>
            <text x={584} y={613} style={{ fontSize: 11 }} fill={INK}>1:50</text>
            <text x={464} y={634} style={{ fontSize: 9, letterSpacing: "0.1em" }} fill={MUTE}>DATE</text>
            <text x={464} y={643} style={{ fontSize: 10 }} fill={INK}>21.06.2026</text>
            <text x={584} y={634} style={{ fontSize: 9, letterSpacing: "0.1em" }} fill={MUTE}>RÉV.</text>
            <motion.text key={`rev-${s.rev}`} x={584} y={643} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ fontSize: 11 }} fill={INK}>
              {s.rev}
            </motion.text>
            <text x={464} y={666} style={{ fontSize: 9, letterSpacing: "0.1em" }} fill={MUTE}>STATUS</text>
            <motion.text key={`st-${s.status}`} x={464} y={678} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ fontSize: 11 }} fill={validated ? PINE : INK}>
              {s.status}
            </motion.text>
            {validated && (
              <motion.path
                d="M600 668 l8 8 l14 -16"
                fill="none"
                stroke={PINE}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            )}
          </g>

          {/* ── delivered file tags (idle steady state) ── */}
          <motion.g
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={showFinal ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={reduce ? { duration: 0 } : { delay: B.tags, duration: 0.4 }}
            style={{ fontFamily: MONO }}
          >
            <g>
              <rect x={232} y={648} width={92} height={28} rx={2} fill="var(--paper)" stroke={INK} strokeWidth={1.2} />
              <rect x={232} y={674} width={92} height={2} fill={INK} />
              <text x={246} y={666} style={{ fontSize: 11, letterSpacing: "0.08em" }} fill={INK}>PLAN.PDF</text>
            </g>
            <g>
              <rect x={332} y={648} width={104} height={28} rx={2} fill="var(--paper)" stroke={INK} strokeWidth={1.2} />
              <rect x={332} y={674} width={104} height={2} fill={INK} />
              <text x={346} y={666} style={{ fontSize: 11, letterSpacing: "0.08em" }} fill={INK}>PROJET.DWG</text>
            </g>
          </motion.g>
        </svg>
      </motion.div>

      {/* mobile proof strip — the SVG cartouche is decorative-small on phones,
          so the key proof is restated here in legible HTML */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:hidden">
        <span className="caption text-pine">Plan livré · Rév C · Validé</span>
        <span className="caption text-soft">PDF + DWG · révisions suivies</span>
      </div>
    </div>
  );
}

export default AtelierFilmHero;
