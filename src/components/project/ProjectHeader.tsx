import {
  ArrowLeft,
  CalendarDays,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { StatusPill } from "@/components/ui/StatusPill";
import {
  confidentialityLabels,
  projectStatusLabels,
  projectStatusTone,
} from "@/lib/project-display";
import type { ProjectLite } from "@/components/project/project-detail-types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function ProjectHeader({
  project,
  backHref,
}: {
  project: ProjectLite;
  backHref: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[4px] border border-line bg-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-45"
      />
      <div className="relative p-6 sm:p-8">
        <a
          href={backHref}
          className="caption inline-flex items-center gap-1.5 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Retour aux projets
        </a>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-mute">
            {project.reference ?? "Sans référence"}
          </span>
          <StatusPill tone={projectStatusTone[project.status]}>
            {projectStatusLabels[project.status]}
          </StatusPill>
          <StatusPill
            tone={
              project.confidentiality === "restricted"
                ? "red"
                : project.confidentiality === "nda_required"
                  ? "amber"
                  : "neutral"
            }
          >
            <ShieldCheck className="size-3" aria-hidden="true" />
            {confidentialityLabels[project.confidentiality]}
          </StatusPill>
        </div>

        <h2 className="display mt-4 max-w-4xl text-[clamp(2rem,6vw,4.25rem)] text-ink">
          {project.title}
        </h2>

        {project.description ? (
          <p className="mt-5 max-w-3xl whitespace-pre-line text-[15px] leading-[1.7] text-graphite">
            {project.description}
          </p>
        ) : null}

        <div className="mt-8 grid gap-px overflow-hidden rounded-[3px] border border-line bg-line sm:grid-cols-3">
          <MetaCell
            icon={UsersRound}
            label="Suivi du dossier"
            value={[
              project.manager?.full_name
                ? `Référent: ${project.manager.full_name}`
                : "Référent à confirmer",
              project.architect?.full_name
                ? `Dessinateur: ${project.architect.full_name}`
                : "Dessinateur à confirmer",
            ].join(" · ")}
          />
          <MetaCell
            icon={CalendarDays}
            label="Ouvert"
            value={formatDate(project.created_at)}
          />
          <MetaCell
            icon={CalendarDays}
            label="Livraison cible"
            value={
              project.expected_delivery_date
                ? formatDate(project.expected_delivery_date)
                : "À confirmer après qualification"
            }
          />
        </div>
      </div>
    </section>
  );
}

function MetaCell({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-paper p-4">
      <p className="caption flex items-center gap-2">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 text-[13px] leading-5 text-graphite">{value}</p>
    </div>
  );
}
