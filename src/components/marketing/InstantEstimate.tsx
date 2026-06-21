"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
import { CountUp } from "@/components/motion/CountUp";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function OptionRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: { value: T; label: string; hint?: string }[];
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
              className={cn(
                "rounded-[3px] border px-3.5 py-2 text-left text-[13px] font-medium transition-colors",
                active
                  ? "border-pine bg-pine-tint text-ink"
                  : "border-line-strong bg-paper text-graphite hover:border-graphite hover:bg-vellum/50",
              )}
            >
              <span className="block">{opt.label}</span>
              {opt.hint ? (
                <span className="mt-0.5 block text-[11px] font-normal text-mute">
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
  const [kind, setKind] = useState<ProjectKind | null>(null);
  const [complexity, setComplexity] = useState<Complexity>("standard");
  const [urgency, setUrgency] = useState<Urgency>("semaine");

  const result = kind ? estimate(kind, complexity, urgency) : null;

  return (
    <section
      id="estimer"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10 lg:py-24"
    >
      {/* Cartouche header */}
      <header className="relative">
        <div className="flex items-center justify-between gap-4 border-t border-line-strong pt-2.5">
          <span className="caption">Estimation · 30 secondes</span>
          <span className="caption hidden text-soft sm:inline">
            Vellum · Indicatif
          </span>
        </div>
        <div className="relative mt-6 max-w-2xl pl-4">
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 h-[calc(100%-0.5rem)] w-px bg-pine/50"
          />
          <h2 className="display text-[clamp(1.9rem,3.6vw,2.9rem)] text-ink">
            Estimez votre projet en 30 secondes.
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-graphite">
            Une fourchette honnête, tout de suite — pour savoir où vous mettez
            les pieds. Le prix exact est confirmé par un dessinateur après
            lecture de vos fichiers.
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.82fr] lg:gap-8">
        {/* Configurator */}
        <div className="space-y-7 rounded-[4px] border border-line bg-paper p-6 sm:p-7">
          <OptionRow
            label="Type de projet"
            value={kind}
            options={ESTIMATOR_KINDS}
            onChange={setKind}
          />
          <OptionRow
            label="Niveau de détail"
            value={complexity}
            options={COMPLEXITY_OPTIONS}
            onChange={setComplexity}
          />
          <OptionRow
            label="Délai souhaité"
            value={urgency}
            options={URGENCY_OPTIONS}
            onChange={setUrgency}
          />
        </div>

        {/* Result — a small Atelier "devis" planche, with a sober beam border */}
        <div className="border-beam relative rounded-[4px] border border-line-strong bg-vellum/40 p-6 sm:p-7">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="caption">Estimation indicative</span>
            <span className="caption text-soft">EST-30S</span>
          </div>

          {result ? (
            <motion.div
              key={`${kind}-${complexity}-${urgency}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
                <p className="mt-5 font-display text-[clamp(2rem,4vw,2.75rem)] leading-none text-ink">
                  <CountUp value={result.low} format={formatEuro} />
                  <span className="px-2 text-mute">–</span>
                  <CountUp value={result.high} format={formatEuro} />
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-line bg-line text-[13px]">
                  <div className="bg-paper p-3">
                    <dt className="caption">Délai estimé</dt>
                    <dd className="mt-1 font-medium text-ink">
                      ~ {result.days} jour{result.days > 1 ? "s" : ""}
                    </dd>
                  </div>
                  <div className="bg-paper p-3">
                    <dt className="caption">Détail</dt>
                    <dd className="mt-1 font-medium text-ink">
                      {result.complexityLabel}
                    </dd>
                  </div>
                </dl>
              </motion.div>
            ) : (
              <p className="mt-6 text-[14px] leading-[1.6] text-mute">
                Choisissez un type de projet pour afficher votre fourchette de
                prix et le délai estimé.
              </p>
            )}

          <Link
            href={routes.public.deposit}
            className={cn(
              "group mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-[14px] font-medium transition",
              result
                ? "bg-pine text-paper hover:bg-pine-hover"
                : "pointer-events-none bg-vellum text-mute",
            )}
            aria-disabled={!result}
            tabIndex={result ? undefined : -1}
          >
            Déposer mon projet
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <p className="mt-3 text-center text-[11px] leading-[1.5] text-mute">
            Estimation indicative, sans engagement. Vous ne payez qu&apos;après
            un devis clair du dessinateur.
          </p>
        </div>
      </div>
    </section>
  );
}
