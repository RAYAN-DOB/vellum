"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  FileArchive,
  FileText,
  Image as ImageIcon,
  Pause,
  Play,
  Ruler,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
   ProductDemoFilm — un aperçu honnête du dossier, présenté comme une planche
   à dessin (cartouche, lignes de cote, papier calque). Aucune imitation de
   navigateur ni d'enregistrement d'écran. Données fictives et explicites.
   Section autonome (id="demo").
   ────────────────────────────────────────────────────────────────────────── */

type ProductDemoFilmProps = {
  /** Emplacement pour une vraie démo MP4. Si fourni, la planche animée est remplacée. */
  demoSrc?: string;
};

const BEAT_MS = 3400;

/** Easing unique — courbe « tracée », sans rebond. */
const EASE = [0.16, 1, 0.3, 1] as const;

const BEATS = [
  { n: "01", caption: "Dépôt des pièces" },
  { n: "02", caption: "Question du dessinateur" },
  { n: "03", caption: "Devis et aperçu" },
  { n: "04", caption: "Correction annotée" },
  { n: "05", caption: "Livrable validé" },
] as const;

const BEAT_COUNT = BEATS.length;

/* ── motion primitives — opacité + ~8px, durées courtes, easing unique ───── */

const t = (duration: number, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE,
});

const stageVariants: Variants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0, transition: t(0.32) },
  exit: { opacity: 0, y: -8, transition: t(0.2) },
};

/** Parent qui ordonne ses enfants en cascade mesurée (non élastique). */
const sheetParent: Variants = {
  center: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const riseIn: Variants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0, transition: t(0.2) },
};

const fadeIn: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: t(0.32) },
};

/* ── presentational helpers ──────────────────────────────────────────────── */

/** Mono reference label inside the title-block. */
function Ref({ children }: { children: React.ReactNode }) {
  return (
    <span className="caption text-[9.5px] leading-none text-mute">
      {children}
    </span>
  );
}

/** A drafted hairline that draws itself in. */
function DraftLine({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px origin-left bg-line-strong ${className}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={t(0.32, delay)}
    />
  );
}

/** A small plan drawing rendered as SVG, with optional drawn strokes. */
function PlanThumb({
  className = "",
  drawn = false,
  accentOpening = false,
}: {
  className?: string;
  drawn?: boolean;
  accentOpening?: boolean;
}) {
  const stroke = drawn
    ? {
        initial: { pathLength: 0 as number },
        animate: { pathLength: 1 as number },
      }
    : {};
  return (
    <div
      className={`relative overflow-hidden rounded-[4px] border border-line-strong bg-vellum ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grid-paper-dense opacity-60" />
      <svg
        viewBox="0 0 160 110"
        className="relative h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.g
          fill="none"
          stroke="var(--graphite)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          transition={t(0.32, 0.12)}
          {...stroke}
        >
          <rect x="18" y="20" width="124" height="70" />
          <line x1="78" y1="20" x2="78" y2="90" />
          <rect x="18" y="20" width="60" height="34" />
          <line x1="78" y1="58" x2="142" y2="58" />
        </motion.g>
        {/* opening — moved 15cm in the correction beat */}
        <motion.rect
          x={accentOpening ? 96 : 88}
          y="20"
          width="14"
          height="6"
          fill="none"
          stroke={accentOpening ? "var(--sienna)" : "var(--graphite)"}
          strokeWidth="1.4"
          transition={t(0.32)}
        />
        {/* sienna dimension line — the datum */}
        <g stroke="var(--sienna)" strokeWidth="1.4">
          <line x1="18" y1="100" x2="142" y2="100" />
          <line x1="18" y1="97" x2="18" y2="103" />
          <line x1="142" y1="97" x2="142" y2="103" />
        </g>
      </svg>
    </div>
  );
}

/** Right-hand annotation column shared across beats so frame never feels empty. */
function AnnotationColumn({
  title,
  rows,
  footer,
}: {
  title: string;
  rows: { k: string; v: string; accent?: boolean }[];
  footer?: React.ReactNode;
}) {
  return (
    <motion.aside
      variants={riseIn}
      className="flex h-full flex-col gap-3 border-l border-line pl-5"
    >
      <Ref>{title}</Ref>
      <DraftLine delay={0.06} />
      <ul className="flex flex-1 flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.k} className="flex items-baseline justify-between gap-3">
            <span className="caption text-[9.5px] normal-case tracking-normal text-soft">
              {r.k}
            </span>
            <span
              className={`text-[12px] font-medium tabular-nums ${
                r.accent ? "text-sienna" : "text-graphite"
              }`}
            >
              {r.v}
            </span>
          </li>
        ))}
      </ul>
      {footer ? <div className="pt-1">{footer}</div> : null}
    </motion.aside>
  );
}

/* ── beats ───────────────────────────────────────────────────────────────── */

/** 01 — Dépôt des pièces : focal file list + manifest column. */
function BeatDepot() {
  const files = [
    { icon: FileText, label: "facade-nord.pdf", meta: "PDF · 2,4 Mo" },
    { icon: FileArchive, label: "niveau-r+1.dwg", meta: "DWG · 1,1 Mo" },
    { icon: ImageIcon, label: "croquis-main.jpg", meta: "Croquis · 880 Ko" },
  ];
  return (
    <motion.div
      variants={sheetParent}
      initial="enter"
      animate="center"
      className="grid h-full grid-cols-[1.5fr_1fr] gap-6"
    >
      <div className="flex flex-col justify-center gap-3">
        <motion.div variants={riseIn}>
          <Ref>Pièces déposées · 3 fichiers</Ref>
        </motion.div>
        {files.map((f) => (
          <motion.div
            key={f.label}
            variants={riseIn}
            className="flex items-center gap-3 rounded-[4px] border border-line bg-paper px-3.5 py-2.5"
          >
            <span className="grid size-8 place-items-center rounded-[3px] bg-vellum text-graphite">
              <f.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-ink">
                {f.label}
              </span>
              <span className="caption block text-[10px] normal-case tracking-normal text-soft">
                {f.meta}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
      <AnnotationColumn
        title="Bordereau"
        rows={[
          { k: "Format", v: "PDF · DWG · JPG" },
          { k: "Total", v: "4,4 Mo" },
          { k: "Réception", v: "Complète", accent: true },
        ]}
        footer={
          <span className="caption inline-flex items-center gap-1.5 text-[10px] text-mute">
            <Check className="size-3.5 text-sienna" aria-hidden="true" />
            Indexé au dossier
          </span>
        }
      />
    </motion.div>
  );
}

/** 02 — Question du dessinateur : focal note + reference column. */
function BeatQuestion() {
  return (
    <motion.div
      variants={sheetParent}
      initial="enter"
      animate="center"
      className="grid h-full grid-cols-[1.5fr_1fr] gap-6"
    >
      <div className="flex flex-col justify-center gap-4">
        <motion.div variants={riseIn} className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-vellum text-[12px] font-medium text-graphite">
            N
          </span>
          <span>
            <span className="block text-[13px] font-medium leading-tight text-ink">
              Nora
            </span>
            <span className="caption block text-[10px] text-mute">
              Dessinatrice
            </span>
          </span>
        </motion.div>
        <motion.div
          variants={riseIn}
          className="rounded-[4px] border border-line bg-paper px-4 py-3.5"
        >
          <Ref>Question · avant traçage des coupes</Ref>
          <p className="mt-2 text-[14px] leading-[1.6] text-graphite">
            Pouvez-vous confirmer la hauteur sous plafond au R+1&nbsp;? Je cale
            les coupes dessus.
          </p>
        </motion.div>
      </div>
      <AnnotationColumn
        title="Repère"
        rows={[
          { k: "Niveau", v: "R+1" },
          { k: "Donnée", v: "HSP", accent: true },
          { k: "Statut", v: "En attente" },
        ]}
        footer={
          <span className="caption inline-flex items-center gap-1.5 text-[10px] text-mute">
            <Ruler className="size-3.5 text-mute" aria-hidden="true" />
            Bloque le traçage
          </span>
        }
      />
    </motion.div>
  );
}

/** 03 — Devis + aperçu : focal quote + plan preview column. */
function BeatDevis() {
  const lines = [
    { label: "Reprise plans 2D", val: "640 €" },
    { label: "Aperçu d'avancement", val: "280 €" },
    { label: "Mise au net DWG", val: "180 €" },
  ];
  return (
    <motion.div
      variants={sheetParent}
      initial="enter"
      animate="center"
      className="grid h-full grid-cols-[1.4fr_1fr] gap-6"
    >
      <motion.div
        variants={riseIn}
        className="flex flex-col justify-center rounded-[4px] border border-line bg-paper p-4"
      >
        <Ref>Devis · VLM-2418</Ref>
        <DraftLine delay={0.08} className="mt-2.5" />
        <ul className="mt-3 space-y-2.5">
          {lines.map((l) => (
            <li
              key={l.label}
              className="flex items-baseline justify-between gap-3 text-[12.5px]"
            >
              <span className="text-graphite">{l.label}</span>
              <span className="shrink-0 font-medium tabular-nums text-ink">
                {l.val}
              </span>
            </li>
          ))}
        </ul>
        <DraftLine delay={0.18} className="mt-3" />
        <div className="mt-3 flex items-baseline justify-between">
          <span className="caption text-[10px] text-mute">Total</span>
          <span className="font-display text-[28px] leading-none text-sienna">
            1 100 €
          </span>
        </div>
      </motion.div>
      <div className="flex h-full flex-col justify-center gap-3 border-l border-line pl-5">
        <motion.div variants={riseIn}>
          <Ref>Aperçu · façade nord</Ref>
        </motion.div>
        <motion.div variants={fadeIn}>
          <PlanThumb className="aspect-[16/11] w-full" drawn />
        </motion.div>
        <motion.span
          variants={riseIn}
          className="caption text-[9.5px] normal-case tracking-normal text-soft"
        >
          Échelle 1:50 · indicatif
        </motion.span>
      </div>
    </motion.div>
  );
}

/** 04 — Correction annotée : focal annotated plan + change-note column. */
function BeatCorrection() {
  return (
    <motion.div
      variants={sheetParent}
      initial="enter"
      animate="center"
      className="grid h-full grid-cols-[1.5fr_1fr] gap-6"
    >
      <div className="flex flex-col justify-center gap-3">
        <motion.div variants={riseIn}>
          <Ref>Aperçu · révision demandée</Ref>
        </motion.div>
        <motion.div variants={fadeIn} className="relative">
          <PlanThumb className="aspect-[16/10] w-full" accentOpening />
          <motion.div
            variants={riseIn}
            className="absolute left-[60%] top-[14%] flex flex-col items-start"
          >
            <span className="rounded-[4px] border border-sienna/40 bg-paper px-2.5 py-1.5 text-[11px] font-medium text-ink shadow-[0_10px_24px_-18px_rgba(13,13,12,0.45)]">
              Décaler l&apos;ouverture de 15&nbsp;cm
            </span>
            <span
              aria-hidden="true"
              className="mt-1 ml-3 h-4 w-px bg-sienna"
            />
          </motion.div>
        </motion.div>
      </div>
      <AnnotationColumn
        title="Modification"
        rows={[
          { k: "Élément", v: "Ouverture R+1" },
          { k: "Décalage", v: "+15 cm", accent: true },
          { k: "Annotations", v: "1" },
        ]}
        footer={
          <span className="caption inline-flex items-center gap-1.5 text-[10px] text-mute">
            <ArrowRight className="size-3.5 text-mute" aria-hidden="true" />
            À reporter sur le DWG
          </span>
        }
      />
    </motion.div>
  );
}

/** 05 — Livrable validé : focal deliverables + sign-off column. */
function BeatLivrable() {
  const files = [
    { icon: FileArchive, label: "plan-final.dwg", meta: "DWG propre · 1,3 Mo" },
    { icon: FileText, label: "dossier-complet.pdf", meta: "PDF · 3,8 Mo" },
  ];
  return (
    <motion.div
      variants={sheetParent}
      initial="enter"
      animate="center"
      className="grid h-full grid-cols-[1.5fr_1fr] gap-6"
    >
      <div className="flex flex-col justify-center gap-3">
        <motion.div variants={riseIn}>
          <Ref>Dossier validé · livrables</Ref>
        </motion.div>
        {files.map((f) => (
          <motion.div
            key={f.label}
            variants={riseIn}
            className="flex items-center gap-3 rounded-[4px] border border-line bg-paper px-4 py-3"
          >
            <span className="grid size-9 place-items-center rounded-[3px] bg-vellum text-graphite">
              <f.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-ink">
                {f.label}
              </span>
              <span className="caption block text-[10px] normal-case tracking-normal text-soft">
                {f.meta}
              </span>
            </span>
            <CheckCircle2 className="size-5 text-moss" aria-hidden="true" />
            <span className="grid size-8 place-items-center rounded-full border border-line-strong text-graphite">
              <Download className="size-4" aria-hidden="true" />
            </span>
          </motion.div>
        ))}
      </div>
      <AnnotationColumn
        title="Visa"
        rows={[
          { k: "Révisions", v: "Soldées" },
          { k: "Conformité", v: "Validée", accent: true },
          { k: "Disponibilité", v: "Permanente" },
        ]}
        footer={
          <span className="caption inline-flex items-center gap-1.5 text-[10px] text-moss">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Livrable prêt
          </span>
        }
      />
    </motion.div>
  );
}

/* ── static (reduced-motion) frame — final beat, no animation ────────────── */

function StaticLivrableFrame() {
  const files = [
    { icon: FileArchive, label: "plan-final.dwg", meta: "DWG propre · 1,3 Mo" },
    { icon: FileText, label: "dossier-complet.pdf", meta: "PDF · 3,8 Mo" },
  ];
  return (
    <div className="grid h-full grid-cols-[1.5fr_1fr] gap-6">
      <div className="flex flex-col justify-center gap-3">
        <Ref>Dossier validé · livrables</Ref>
        {files.map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-3 rounded-[4px] border border-line bg-paper px-4 py-3"
          >
            <span className="grid size-9 place-items-center rounded-[3px] bg-vellum text-graphite">
              <f.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-ink">
                {f.label}
              </span>
              <span className="caption block text-[10px] normal-case tracking-normal text-soft">
                {f.meta}
              </span>
            </span>
            <CheckCircle2 className="size-5 text-moss" aria-hidden="true" />
            <span className="grid size-8 place-items-center rounded-full border border-line-strong text-graphite">
              <Download className="size-4" aria-hidden="true" />
            </span>
          </div>
        ))}
      </div>
      <aside className="flex h-full flex-col gap-3 border-l border-line pl-5">
        <Ref>Visa</Ref>
        <span className="block h-px bg-line-strong" />
        <ul className="flex flex-1 flex-col gap-2.5">
          {[
            { k: "Révisions", v: "Soldées", accent: false },
            { k: "Conformité", v: "Validée", accent: true },
            { k: "Disponibilité", v: "Permanente", accent: false },
          ].map((r) => (
            <li key={r.k} className="flex items-baseline justify-between gap-3">
              <span className="caption text-[9.5px] normal-case tracking-normal text-soft">
                {r.k}
              </span>
              <span
                className={`text-[12px] font-medium tabular-nums ${
                  r.accent ? "text-sienna" : "text-graphite"
                }`}
              >
                {r.v}
              </span>
            </li>
          ))}
        </ul>
        <span className="caption inline-flex items-center gap-1.5 pt-1 text-[10px] text-moss">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          Livrable prêt
        </span>
      </aside>
    </div>
  );
}

function renderBeat(index: number) {
  switch (index) {
    case 0:
      return <BeatDepot />;
    case 1:
      return <BeatQuestion />;
    case 2:
      return <BeatDevis />;
    case 3:
      return <BeatCorrection />;
    default:
      return <BeatLivrable />;
  }
}

/* ── main component ──────────────────────────────────────────────────────── */

export function ProductDemoFilm({ demoSrc }: ProductDemoFilmProps) {
  const prefersReduced = useReducedMotion();
  const hasVideo = Boolean(demoSrc);
  const isAnimated = !hasVideo && !prefersReduced;

  const [beat, setBeat] = useState(prefersReduced ? BEAT_COUNT - 1 : 0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-advance — gated on animated mode, play state and tab visibility.
  useEffect(() => {
    if (!isAnimated || !playing) {
      clear();
      return;
    }

    const start = () => {
      clear();
      intervalRef.current = setInterval(() => {
        setBeat((b) => (b + 1) % BEAT_COUNT);
      }, BEAT_MS);
    };

    const onVisibility = () => {
      if (document.hidden) clear();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clear();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isAnimated, playing, clear]);

  const goTo = useCallback(
    (i: number) => {
      if (!isAnimated) return;
      setBeat(i);
    },
    [isAnimated],
  );

  const togglePlay = useCallback(() => {
    if (!isAnimated) return;
    setPlaying((p) => !p);
  }, [isAnimated]);

  const activeBeat = BEATS[beat] ?? BEATS[BEAT_COUNT - 1];
  const shownBeat = prefersReduced ? BEATS[BEAT_COUNT - 1] : activeBeat;

  return (
    <section
      id="demo"
      className="relative overflow-hidden border-b border-line bg-paper"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
        <header className="mx-auto max-w-2xl text-center">
          <span className="caption text-mute">Aperçu du dossier</span>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">
            Une planche qui se compose,
            <br />
            <span className="italic">étape après étape.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-graphite">
            Du dépôt des pièces au livrable validé, chaque étape du parcours
            Vellum tient dans un seul fil, clair et suivi.
          </p>
        </header>

        {/* ── drafting sheet ─────────────────────────────────────────────── */}
        <div className="mx-auto mt-14 max-w-4xl">
          <div className="sheet overflow-hidden rounded-[6px]">
            {/* title-block — cartouche */}
            <div className="flex items-center gap-4 border-b border-line bg-vellum/60 px-4 py-2.5">
              <Ref>VLM-2418 · DOSSIER TÉMOIN · ÉCHELLE 1:50</Ref>
              <span className="ml-auto flex items-center gap-2.5">
                <Ref>PLANCHE</Ref>
                <span className="caption text-[9.5px] tabular-nums text-sienna">
                  {shownBeat.n} / 0{BEAT_COUNT}
                </span>
              </span>
            </div>

            {/* stage — fixed 16/10, with extension-line framing */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid-paper-dense opacity-40"
              />
              {/* faint dimension ticks at the corners of the drawing area */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-5 border border-dashed border-line"
              />
              <span
                aria-hidden="true"
                className="caption pointer-events-none absolute right-5 top-2 text-[9px] text-soft"
              >
                {shownBeat.caption}
              </span>

              {/* content well, inset within the extension lines */}
              <div className="absolute inset-5 p-5 sm:p-7">
                {hasVideo ? (
                  <video
                    src={demoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : prefersReduced ? (
                  <StaticLivrableFrame />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={beat}
                      variants={stageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="h-full w-full"
                    >
                      {renderBeat(beat)}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* caption rail — measured crossfade */}
            <div className="flex items-center gap-3 border-t border-line bg-vellum/60 px-4 py-2.5">
              <span className="caption text-[9.5px] text-sienna">
                {shownBeat.n}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={prefersReduced ? "static" : beat}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={t(0.2)}
                  className="caption text-[10px] normal-case tracking-normal text-graphite"
                >
                  {shownBeat.caption}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* ── controls — play/pause + dimension rail ─────────────────────── */}
          {isAnimated && (
            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Mettre en pause" : "Lire l'aperçu"}
                aria-pressed={playing}
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-paper text-ink transition-colors hover:border-graphite hover:bg-vellum/60"
              >
                {playing ? (
                  <Pause className="size-4" aria-hidden="true" />
                ) : (
                  <Play className="size-4 translate-x-px" aria-hidden="true" />
                )}
              </button>

              {/* dimension rail with 5 ticks */}
              <div className="flex w-full items-center gap-3">
                <div className="relative flex-1">
                  <div className="h-px w-full bg-line-strong" />
                  <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between">
                    {BEATS.map((b, i) => {
                      const active = i === beat;
                      return (
                        <button
                          key={b.n}
                          type="button"
                          onClick={() => goTo(i)}
                          aria-label={`Aller à l'étape ${b.n} · ${b.caption}`}
                          aria-current={active ? "step" : undefined}
                          className="group grid cursor-pointer place-items-center p-2"
                        >
                          <span
                            className={`block h-3 w-px transition-colors ${
                              active ? "bg-sienna" : "bg-line-strong"
                            } group-hover:bg-graphite`}
                          />
                          <span
                            className={`mt-0.5 block size-1.5 rounded-full transition-colors ${
                              active
                                ? "bg-sienna"
                                : "bg-line-strong group-hover:bg-graphite"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <span className="caption shrink-0 text-[10px] tabular-nums text-mute">
                  {beat + 1} / {BEAT_COUNT}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
