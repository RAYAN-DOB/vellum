import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/database";

/**
 * The project spine — the single most important comprehension surface for the
 * client. It turns the raw status into a legible 5-stage journey, says in plain
 * French what happens next, and — crucially — whether the ball is in the
 * client's court ("À vous de jouer") or Vellum's ("Vellum s'en occupe"), so the
 * demandeur is never left wondering what to do or whether to wait.
 *
 * `audience` flips the wording for internal roles (architect/manager) so the
 * same spine reads correctly from the other side of the desk.
 *
 * Pure display (Server Component); drives entirely off `status`.
 */

type Audience = "client" | "internal";

const STAGES = [
  { key: "received", label: "Reçu" },
  { key: "qualified", label: "Qualifié" },
  { key: "production", label: "En production" },
  { key: "review", label: "À valider" },
  { key: "delivered", label: "Livré" },
] as const;

/** Raw status → index of the current stage in STAGES. */
const stageIndex: Record<ProjectStatus, number> = {
  draft: 0,
  intake: 0,
  qualified: 1,
  assigned: 1,
  in_progress: 2,
  review: 3,
  delivered: 4,
  archived: 4,
  cancelled: 0,
};

type Turn = "client" | "vellum" | "done" | "cancelled";

const turnByStatus: Record<ProjectStatus, Turn> = {
  draft: "client",
  intake: "vellum",
  qualified: "vellum",
  assigned: "vellum",
  in_progress: "vellum",
  review: "client",
  delivered: "done",
  archived: "done",
  cancelled: "cancelled",
};

/** One plain-French line: what happens next (client voice). */
const nextActionByStatus: Record<ProjectStatus, string> = {
  draft: "Complétez votre dépôt et envoyez-le pour démarrer.",
  intake: "Nous analysons votre demande et revenons vers vous très vite.",
  qualified: "Nous préparons votre devis et l'organisation du projet.",
  assigned: "Un dessinateur est assigné, la production va démarrer.",
  in_progress: "Le dessinateur produit vos livrables.",
  review: "Un aperçu vous attend : validez-le ou demandez une correction.",
  delivered: "Vos livrables sont prêts au téléchargement.",
  archived: "Projet archivé — tout reste consultable.",
  cancelled: "Projet annulé. Vous pouvez le relancer à tout moment.",
};

type ChipTone = "accent" | "neutral" | "done" | "danger";

const chipByAudience: Record<Audience, Record<Turn, { label: string; tone: ChipTone }>> = {
  client: {
    client: { label: "À vous de jouer", tone: "accent" },
    vellum: { label: "Vellum s'en occupe", tone: "neutral" },
    done: { label: "Livré", tone: "done" },
    cancelled: { label: "Annulé", tone: "danger" },
  },
  internal: {
    client: { label: "En attente du client", tone: "neutral" },
    vellum: { label: "À traiter", tone: "accent" },
    done: { label: "Livré", tone: "done" },
    cancelled: { label: "Annulé", tone: "danger" },
  },
};

const toneClass: Record<ChipTone, string> = {
  accent:
    "border-[color-mix(in_srgb,var(--pine)_35%,var(--paper))] bg-pine-tint text-pine-active",
  neutral: "border-line-strong bg-vellum text-graphite",
  done: "border-[color-mix(in_srgb,var(--moss)_30%,var(--paper))] bg-[color-mix(in_srgb,var(--moss)_12%,var(--paper))] text-[color-mix(in_srgb,var(--moss)_50%,var(--ink))]",
  danger:
    "border-[color-mix(in_srgb,var(--crimson)_30%,var(--paper))] bg-[color-mix(in_srgb,var(--crimson)_10%,var(--paper))] text-[color-mix(in_srgb,var(--crimson)_55%,var(--ink))]",
};

export function ProjectTracker({
  status,
  audience = "client",
  className,
}: {
  status: ProjectStatus;
  audience?: Audience;
  className?: string;
}) {
  const cancelled = status === "cancelled";
  const current = stageIndex[status];
  const turn = turnByStatus[status];
  const chip = chipByAudience[audience][turn];

  return (
    <section
      className={cn(
        "rounded-[4px] border border-line bg-paper p-5 sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
        <div className="min-w-0">
          <p className="caption">Suivi du projet</p>
          {audience === "client" ? (
            <p className="mt-1.5 text-[14px] leading-[1.5] text-graphite">
              {nextActionByStatus[status]}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            toneClass[chip.tone],
          )}
        >
          {chip.tone === "accent" ? (
            <span aria-hidden="true" className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-pine opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-pine" />
            </span>
          ) : null}
          {chip.label}
        </span>
      </header>

      <ol className="mt-6 flex items-start">
        {STAGES.map((stage, i) => {
          const done = !cancelled && i < current;
          const isCurrent = !cancelled && i === current;
          const reached = done || isCurrent;
          return (
            <li
              key={stage.key}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {i < STAGES.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-1/2 top-[13px] h-px w-full",
                    done ? "bg-pine" : "bg-line",
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex size-7 items-center justify-center rounded-full border text-[11px] font-medium",
                  cancelled
                    ? "border-line-strong bg-vellum text-soft"
                    : done
                      ? "border-pine bg-pine text-paper"
                      : isCurrent
                        ? "border-pine bg-paper text-pine-active ring-2 ring-pine/25"
                        : "border-line-strong bg-paper text-soft",
                )}
              >
                {cancelled && i === 0 ? (
                  <X className="size-3.5 text-crimson" aria-hidden="true" />
                ) : done ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "mt-2 text-[11px] leading-tight",
                  reached ? "font-medium text-ink" : "text-mute",
                )}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
