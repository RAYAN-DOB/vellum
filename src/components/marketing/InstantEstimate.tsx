"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import {
  COMPLEXITY_OPTIONS,
  ESTIMATOR_KINDS,
  URGENCY_OPTIONS,
  estimate,
  formatEuro,
  type Complexity,
  type ProjectKind,
  type Urgency,
} from "@/lib/estimator";
import { CartoucheHeader } from "@/components/atelier/CartoucheHeader";
import { SampleQuoteModal } from "@/components/marketing/SampleQuoteModal";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Deterministic 4-digit pseudo-ref from inputs — SSR-safe (no Date/random). */
function refDigits(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ((h % 9000) + 1000).toString();
}

function Field<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: readonly { value: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="caption mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={cn(
                "relative rounded-[2px] border px-3.5 py-2 text-left text-[13px] font-medium transition-colors",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line-strong bg-paper text-graphite hover:border-graphite hover:bg-vellum/50",
              )}
            >
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 size-2 border-l-2 border-t-2 border-pine"
                />
              ) : null}
              <span className="block">{opt.label}</span>
              {opt.hint ? (
                <span
                  className={cn(
                    "mt-0.5 block text-[11px] font-normal",
                    active ? "text-paper/65" : "text-mute",
                  )}
                >
                  {opt.hint}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InstantEstimate() {
  const reduce = useReducedMotion();
  const [kind, setKind] = useState<ProjectKind | null>(null);
  const [complexity, setComplexity] = useState<Complexity>("standard");
  const [urgency, setUrgency] = useState<Urgency>("semaine");

  const result = kind ? estimate(kind, complexity, urgency) : null;

  const cIdx = COMPLEXITY_OPTIONS.findIndex((o) => o.value === complexity);
  const uIdx = URGENCY_OPTIONS.findIndex((o) => o.value === urgency);
  const score = kind
    ? Math.min(5, Math.max(1, cIdx + 2 + (uIdx >= URGENCY_OPTIONS.length - 1 ? 1 : 0)))
    : 0;
  const ref = `VLM-202606-${refDigits(`${kind ?? "x"}-${complexity}-${urgency}`)}`;

  return (
    <section
      id="estimer"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10 lg:py-24"
    >
      <CartoucheHeader
        eyebrow="Estimation instantanée"
        meta="Devis-type · Indicatif · EUR"
        title="Votre devis indicatif."
        description="Une fourchette honnête, tout de suite — pour savoir où vous mettez les pieds. Le prix exact est confirmé par un dessinateur après lecture de vos fichiers."
      />

      <div className="sheet mt-10 overflow-hidden rounded-[4px]">
        <div className="grid lg:grid-cols-[1fr_0.82fr]">
          {/* Configurator — ruled cartouche fields */}
          <div className="space-y-7 p-6 sm:p-8">
            <Field
              label="Type de projet"
              value={kind}
              options={ESTIMATOR_KINDS}
              onChange={setKind}
            />
            <Field
              label="Niveau de détail"
              value={complexity}
              options={COMPLEXITY_OPTIONS}
              onChange={setComplexity}
            />
            <Field
              label="Délai souhaité"
              value={urgency}
              options={URGENCY_OPTIONS}
              onChange={setUrgency}
            />
          </div>

          {/* Devis titleblock */}
          <div className="relative border-t border-line bg-vellum/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
            {/* recalc pine left-edge pulse */}
            <motion.span
              aria-hidden="true"
              key={`pulse-${kind}-${complexity}-${urgency}`}
              className="absolute left-0 top-0 hidden h-full w-[2px] bg-pine lg:block"
              initial={reduce ? false : { opacity: 0.25 }}
              animate={reduce ? { opacity: 0.25 } : { opacity: [1, 0.25] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="caption">Devis-type</span>
              <span className="caption text-soft">{ref}</span>
            </div>

            <div className="mt-5">
              <p className="caption">Prix estimé</p>
              {result ? (
                <motion.p
                  key={`${result.low}-${result.high}`}
                  initial={reduce ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, ease: EASE }}
                  className="mt-1 font-mono text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-ink"
                >
                  {formatEuro(result.low)}
                  <span className="px-2 text-mute">–</span>
                  {formatEuro(result.high)}
                </motion.p>
              ) : (
                <p className="mt-1 font-mono text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-soft">
                  — €
                </p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-line bg-line">
              <div className="bg-paper p-3">
                <p className="caption">Délai</p>
                <p className="mt-1 font-mono text-[14px] text-ink">
                  {result ? `~ ${result.days} j ouvrés` : "—"}
                </p>
              </div>
              <div className="bg-paper p-3">
                <p className="caption">Complexité</p>
                <div className="mt-2 flex gap-1" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-2.5 rounded-[1px]",
                        i < score
                          ? "bg-pine"
                          : "border border-line-strong bg-paper",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="caption mt-3 text-soft">
              {result ? "Rév. B · recalculé" : "En attente de sélection"}
            </p>

            <Link
              href={routes.public.deposit}
              className={cn(
                "group relative mt-5 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-[2px] text-[14px] font-medium transition",
                result
                  ? "bg-ink text-paper hover:bg-graphite"
                  : "pointer-events-none bg-vellum text-mute",
              )}
              aria-disabled={!result}
              tabIndex={result ? undefined : -1}
            >
              {result ? (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-[3px] bg-pine"
                />
              ) : null}
              Déposer ce projet
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <p className="mt-3 text-center text-[11px] leading-[1.5] text-mute">
              Tarif exact confirmé au devis, après lecture de vos fichiers.
            </p>
            <div className="mt-3 flex justify-center">
              <SampleQuoteModal />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
