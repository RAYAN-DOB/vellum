"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  CheckCircle2,
  Download,
  FileArchive,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquareText,
  Pause,
  Play,
  ReceiptText,
  Sparkles,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
   ProductDemoFilm — faux screen-recording of the Vellum journey.
   Self-contained landing section (id="demo"). All copy is fictional.
   ────────────────────────────────────────────────────────────────────────── */

type ProductDemoFilmProps = {
  /** Future real-MP4 slot. When provided, the animated timeline is bypassed. */
  demoSrc?: string;
};

const SCENE_MS = 3200;

const SCENES = [
  { n: "01", caption: "Vous déposez vos plans" },
  { n: "02", caption: "Le dessinateur vous pose une question" },
  { n: "03", caption: "Vous recevez un devis et un aperçu" },
  { n: "04", caption: "Une correction est annotée sur le plan" },
  { n: "05", caption: "Votre livrable est prêt à télécharger" },
] as const;

const SCENE_COUNT = SCENES.length;

/* ── shared inline variants ─────────────────────────────────────────────── */

const stageVariants: Variants = {
  enter: { opacity: 0, y: 14 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
  },
};

const staggerParent: Variants = {
  center: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const dropIn: Variants = {
  enter: { opacity: 0, y: -18, rotate: -3 },
  center: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

const slideUp: Variants = {
  enter: { opacity: 0, y: 22 },
  center: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

const wordIn: Variants = {
  enter: { opacity: 0, y: 6 },
  center: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

const sealIn: Variants = {
  enter: { opacity: 0, scale: 1.6, rotate: -14 },
  center: {
    opacity: 1,
    scale: 1,
    rotate: -7,
    transition: { type: "spring", stiffness: 520, damping: 15, delay: 0.55 },
  },
};

const pinPop: Variants = {
  enter: { opacity: 0, scale: 0, y: -10 },
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 600, damping: 16, delay: 0.45 },
  },
};

const toastIn: Variants = {
  enter: { opacity: 0, y: 16 },
  center: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 22, delay: 0.5 },
  },
};

/* ── small presentational helpers ───────────────────────────────────────── */

function FileChip({
  icon: Icon,
  label,
  meta,
}: {
  icon: typeof FileText;
  label: string;
  meta: string;
}) {
  return (
    <motion.div
      variants={dropIn}
      className="flex items-center gap-3 rounded-[5px] border border-line bg-paper px-3.5 py-2.5 shadow-[0_8px_20px_-14px_rgba(13,13,12,0.25)]"
    >
      <span className="grid size-8 place-items-center rounded-[4px] bg-vellum text-sienna">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium text-ink">
          {label}
        </span>
        <span className="caption block text-[10px] normal-case tracking-normal text-soft">
          {meta}
        </span>
      </span>
    </motion.div>
  );
}

function PlanThumb({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[5px] border border-line-strong bg-vellum ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grid-paper-dense opacity-70" />
      <svg
        viewBox="0 0 160 110"
        className="relative h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          fill="none"
          stroke="var(--graphite)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        >
          <rect x="18" y="20" width="124" height="70" />
          <line x1="78" y1="20" x2="78" y2="90" />
          <rect x="18" y="20" width="60" height="34" />
          <line x1="78" y1="58" x2="142" y2="58" />
          <line x1="40" y1="20" x2="40" y2="14" />
          <line x1="40" y1="90" x2="40" y2="96" />
        </g>
        <g stroke="var(--sienna)" strokeWidth="1.4">
          <line x1="18" y1="100" x2="142" y2="100" />
          <line x1="18" y1="97" x2="18" y2="103" />
          <line x1="142" y1="97" x2="142" y2="103" />
        </g>
      </svg>
    </div>
  );
}

/* ── individual scenes ──────────────────────────────────────────────────── */

function SceneDepot() {
  return (
    <motion.div
      variants={staggerParent}
      initial="enter"
      animate="center"
      className="flex h-full flex-col justify-center gap-5 px-[7%]"
    >
      <motion.span
        variants={wordIn}
        className="caption text-[10px] text-mute"
      >
        Nouveau dossier · Dépôt des pièces
      </motion.span>
      <div className="grid gap-2.5 sm:grid-cols-3">
        <FileChip icon={FileText} label="facade-nord.pdf" meta="PDF · 2,4 Mo" />
        <FileChip icon={FileArchive} label="niveau-r+1.dwg" meta="DWG · 1,1 Mo" />
        <FileChip icon={ImageIcon} label="croquis-main.jpg" meta="Croquis · 880 Ko" />
      </div>
      <motion.div variants={wordIn} className="mt-1">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="caption text-[10px] text-mute">Téléversement</span>
          <span className="caption text-[10px] text-sienna">100 %</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-vellum-dim">
          <motion.div
            className="h-full rounded-full bg-sienna"
            initial={{ width: "8%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function SceneQuestion() {
  const words = useMemo(
    () =>
      "Pouvez-vous confirmer la hauteur sous plafond au R+1 avant que je trace les coupes ?".split(
        " ",
      ),
    [],
  );
  return (
    <motion.div
      variants={staggerParent}
      initial="enter"
      animate="center"
      className="flex h-full flex-col justify-center gap-4 px-[7%]"
    >
      <motion.div variants={wordIn} className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-sienna text-[12px] font-medium text-paper">
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
        <span className="caption ml-auto flex items-center gap-1.5 text-[10px] text-mute">
          <MessageSquareText className="size-3.5 text-sienna" aria-hidden="true" />
          En ligne
        </span>
      </motion.div>

      <motion.div
        variants={slideUp}
        className="max-w-[88%] self-start rounded-[10px] rounded-tl-[3px] border border-line bg-paper px-4 py-3 shadow-[0_14px_30px_-22px_rgba(13,13,12,0.4)]"
      >
        <p className="flex flex-wrap gap-x-1.5 gap-y-1 text-[14px] leading-[1.6] text-graphite">
          <motion.span variants={staggerParent} className="contents">
            {words.map((w, i) => (
              <motion.span key={`${w}-${i}`} variants={wordIn}>
                {w}
              </motion.span>
            ))}
          </motion.span>
        </p>
      </motion.div>
    </motion.div>
  );
}

function SceneDevis() {
  const lines = [
    { label: "Reprise plans 2D — façades + coupes", val: "640 €" },
    { label: "Aperçu 3D d'avancement", val: "280 €" },
    { label: "Mise au net DWG", val: "180 €" },
  ];
  return (
    <motion.div
      variants={staggerParent}
      initial="enter"
      animate="center"
      className="grid h-full grid-cols-[1.35fr_1fr] items-center gap-5 px-[7%]"
    >
      <motion.div
        variants={slideUp}
        className="relative rounded-[7px] border border-line bg-paper p-4 shadow-[0_18px_40px_-26px_rgba(13,13,12,0.4)]"
      >
        <div className="mb-3 flex items-center gap-2">
          <ReceiptText className="size-4 text-sienna" aria-hidden="true" />
          <span className="caption text-[10px] text-mute">
            Devis · VLM-2418
          </span>
        </div>
        <ul className="space-y-2">
          {lines.map((l) => (
            <motion.li
              key={l.label}
              variants={wordIn}
              className="flex items-baseline justify-between gap-3 border-b border-line/70 pb-2 text-[12.5px] last:border-0"
            >
              <span className="text-graphite">{l.label}</span>
              <span className="shrink-0 font-medium text-ink">{l.val}</span>
            </motion.li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between text-[13px]">
          <span className="caption text-[10px] text-mute">Total</span>
          <span className="font-display text-2xl text-ink">1 100 €</span>
        </div>

        <motion.div
          variants={sealIn}
          className="pointer-events-none absolute -right-3 -top-3 grid size-[58px] place-items-center rounded-full border-2 border-sienna bg-paper/95 text-center"
        >
          <span className="caption text-[9px] leading-tight text-sienna">
            Accepté
          </span>
        </motion.div>
      </motion.div>

      <motion.div variants={slideUp} className="space-y-2">
        <PlanThumb className="aspect-[16/11] w-full" />
        <span className="caption flex items-center gap-1.5 text-[10px] text-mute">
          <ImageIcon className="size-3.5" aria-hidden="true" />
          Aperçu · façade nord
        </span>
      </motion.div>
    </motion.div>
  );
}

function SceneCorrection() {
  return (
    <motion.div
      variants={staggerParent}
      initial="enter"
      animate="center"
      className="flex h-full flex-col items-center justify-center gap-4 px-[7%]"
    >
      <motion.span variants={wordIn} className="caption text-[10px] text-mute">
        Aperçu · révision demandée
      </motion.span>
      <motion.div variants={slideUp} className="relative w-[68%]">
        <PlanThumb className="aspect-[16/10] w-full" />

        <motion.div
          variants={pinPop}
          className="absolute left-[58%] top-[34%] flex -translate-x-1/2 -translate-y-full flex-col items-center"
        >
          <span className="rounded-[6px] border border-sienna/40 bg-paper px-2.5 py-1.5 text-[11px] font-medium text-ink shadow-[0_12px_26px_-18px_rgba(13,13,12,0.5)]">
            Décaler l&apos;ouverture de 15&nbsp;cm
          </span>
          <MapPin
            className="-mt-0.5 size-6 fill-sienna text-sienna drop-shadow-[0_4px_6px_rgba(159,79,56,0.35)]"
            aria-hidden="true"
          />
        </motion.div>
      </motion.div>
      <motion.span
        variants={wordIn}
        className="caption text-[10px] text-sienna"
      >
        1 annotation · à corriger
      </motion.span>
    </motion.div>
  );
}

function SceneLivrable() {
  const files = [
    { icon: FileArchive, label: "plan-final.dwg", meta: "DWG propre · 1,3 Mo" },
    { icon: FileText, label: "dossier-complet.pdf", meta: "PDF · 3,8 Mo" },
  ];
  return (
    <motion.div
      variants={staggerParent}
      initial="enter"
      animate="center"
      className="flex h-full flex-col justify-center gap-3.5 px-[7%]"
    >
      <motion.div variants={wordIn} className="flex items-center gap-2">
        <Sparkles className="size-4 text-moss" aria-hidden="true" />
        <span className="caption text-[10px] text-mute">
          Dossier validé · livrables disponibles
        </span>
      </motion.div>

      {files.map((f) => (
        <motion.div
          key={f.label}
          variants={slideUp}
          className="flex items-center gap-3 rounded-[6px] border border-line bg-paper px-4 py-3 shadow-[0_12px_28px_-20px_rgba(13,13,12,0.35)]"
        >
          <span className="grid size-9 place-items-center rounded-[5px] bg-vellum text-graphite">
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
          <span className="grid size-9 place-items-center rounded-full border border-line-strong text-graphite">
            <Download className="size-4" aria-hidden="true" />
          </span>
        </motion.div>
      ))}

      <motion.div
        variants={toastIn}
        className="mt-1 flex items-center gap-2.5 self-start rounded-full border border-moss/30 bg-moss/10 px-4 py-2"
      >
        <CheckCircle2 className="size-4 text-moss" aria-hidden="true" />
        <span className="text-[12.5px] font-medium text-graphite">
          Livrable prêt
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ── static reduced-motion frame ────────────────────────────────────────── */

function StaticLivrableFrame() {
  const files = [
    { icon: FileArchive, label: "plan-final.dwg", meta: "DWG propre · 1,3 Mo" },
    { icon: FileText, label: "dossier-complet.pdf", meta: "PDF · 3,8 Mo" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3.5 px-[7%]">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-moss" aria-hidden="true" />
        <span className="caption text-[10px] text-mute">
          Dossier validé · livrables disponibles
        </span>
      </div>
      {files.map((f) => (
        <div
          key={f.label}
          className="flex items-center gap-3 rounded-[6px] border border-line bg-paper px-4 py-3"
        >
          <span className="grid size-9 place-items-center rounded-[5px] bg-vellum text-graphite">
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
          <span className="grid size-9 place-items-center rounded-full border border-line-strong text-graphite">
            <Download className="size-4" aria-hidden="true" />
          </span>
        </div>
      ))}
      <div className="mt-1 flex items-center gap-2.5 self-start rounded-full border border-moss/30 bg-moss/10 px-4 py-2">
        <CheckCircle2 className="size-4 text-moss" aria-hidden="true" />
        <span className="text-[12.5px] font-medium text-graphite">
          Livrable validé
        </span>
      </div>
    </div>
  );
}

function renderScene(index: number) {
  switch (index) {
    case 0:
      return <SceneDepot />;
    case 1:
      return <SceneQuestion />;
    case 2:
      return <SceneDevis />;
    case 3:
      return <SceneCorrection />;
    default:
      return <SceneLivrable />;
  }
}

/* ── main component ─────────────────────────────────────────────────────── */

export function ProductDemoFilm({ demoSrc }: ProductDemoFilmProps) {
  const prefersReduced = useReducedMotion();
  const hasVideo = Boolean(demoSrc);
  const isAnimated = !hasVideo && !prefersReduced;

  const [scene, setScene] = useState(prefersReduced ? SCENE_COUNT - 1 : 0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Autoplay loop — gated on animated mode, playing state, and tab visibility.
  useEffect(() => {
    if (!isAnimated || !playing) {
      clear();
      return;
    }

    const start = () => {
      clear();
      intervalRef.current = setInterval(() => {
        setScene((s) => (s + 1) % SCENE_COUNT);
      }, SCENE_MS);
    };

    const onVisibility = () => {
      if (document.hidden) {
        clear();
      } else {
        start();
      }
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
      setScene(i);
    },
    [isAnimated],
  );

  const togglePlay = useCallback(() => {
    if (!isAnimated) return;
    setPlaying((p) => !p);
  }, [isAnimated]);

  const timecode = `00:0${(scene % SCENE_COUNT) + 1}`;
  const activeCaption = SCENES[scene] ?? SCENES[SCENE_COUNT - 1];

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
          <span className="caption text-mute">Aperçu produit</span>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">
            Regardez un dossier
            <br />
            <span className="italic">prendre forme.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-graphite">
            Du dépôt des plans au livrable validé, chaque étape du parcours
            Vellum se déroule dans un seul fil clair et suivi.
          </p>
        </header>

        {/* ── browser/device shell ──────────────────────────────────────── */}
        <div className="mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden rounded-[14px] border border-graphite/30 bg-ink shadow-[0_50px_90px_-50px_rgba(13,13,12,0.55),0_18px_36px_-22px_rgba(13,13,12,0.3)]">
            {/* chrome bar */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="size-3 rounded-full bg-sienna" />
                <span className="size-3 rounded-full bg-moss" />
                <span className="size-3 rounded-full bg-mute" />
              </div>
              <div className="mx-auto flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5">
                <span className="size-1.5 rounded-full bg-moss" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-tight text-paper/70">
                  app.vellum.studio/dossier
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="size-2 animate-pulse rounded-full bg-sienna"
                  aria-hidden="true"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60">
                  REC
                </span>
                <span className="hidden font-mono text-[10px] tabular-nums text-paper/40 sm:inline">
                  {timecode}
                </span>
              </div>
            </div>

            {/* stage — fixed 16/10 */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid-paper-dense opacity-50"
              />

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
                <div className="absolute inset-0">
                  <StaticLivrableFrame />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scene}
                    variants={stageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    {renderScene(scene)}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* scene index marker, lives over the stage */}
              {!hasVideo && (
                <div className="pointer-events-none absolute right-4 top-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                    {prefersReduced ? SCENES[SCENE_COUNT - 1].n : activeCaption.n}
                  </span>
                </div>
              )}
            </div>

            {/* caption strip */}
            <div className="flex items-center gap-3 border-t border-white/10 bg-ink px-4 py-3">
              <span className="font-mono text-[11px] text-sienna">
                {prefersReduced ? SCENES[SCENE_COUNT - 1].n : activeCaption.n}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={prefersReduced ? "static-caption" : scene}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-[11px] tracking-tight text-paper/80"
                >
                  {prefersReduced
                    ? "Livrable validé"
                    : activeCaption.caption}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* ── controls + progress rail ──────────────────────────────────── */}
          {!hasVideo && !prefersReduced && (
            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Mettre en pause" : "Lire la démo"}
                aria-pressed={playing}
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-paper text-ink transition hover:border-graphite hover:bg-vellum/60"
              >
                {playing ? (
                  <Pause className="size-4" aria-hidden="true" />
                ) : (
                  <Play className="size-4 translate-x-px" aria-hidden="true" />
                )}
              </button>

              {/* dimension-line progress rail with 5 ticks */}
              <div className="flex w-full items-center gap-3">
                <div className="relative flex-1">
                  <div className="h-px w-full bg-line-strong" />
                  <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between">
                    {SCENES.map((s, i) => {
                      const active = i === scene;
                      return (
                        <button
                          key={s.n}
                          type="button"
                          onClick={() => goTo(i)}
                          aria-label={`Aller à l'étape ${s.n} · ${s.caption}`}
                          aria-current={active ? "step" : undefined}
                          className="group grid cursor-pointer place-items-center p-2"
                        >
                          <span
                            className={`block h-3 w-px transition-colors ${
                              active ? "bg-sienna" : "bg-line-strong"
                            } group-hover:bg-graphite`}
                          />
                          <span
                            className={`mt-0.5 block size-2 rounded-full transition-all ${
                              active
                                ? "scale-100 bg-sienna"
                                : "scale-90 bg-line-strong group-hover:bg-graphite"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-mute">
                  {scene + 1} / {SCENE_COUNT}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
