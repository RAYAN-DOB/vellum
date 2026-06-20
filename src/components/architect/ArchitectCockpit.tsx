"use client";

import { ArrowUpRight, Layers3, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  confidentialityLabels,
  projectStatusLabels,
  projectStatusTone,
  type ProjectListItem,
} from "@/lib/project-display";
import { routes } from "@/lib/routes";

type Props = { projects: ProjectListItem[] };

export function ArchitectCockpit({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="rounded-[3px] border border-dashed border-line-strong bg-paper p-12 text-center">
        <Layers3 className="mx-auto size-7 text-mute" aria-hidden="true" />
        <p className="font-display mt-4 text-xl text-ink">
          Aucun projet assigné pour le moment.
        </p>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-[1.6] text-mute">
          Dès qu&apos;un chef de projet vous assigne un projet, il apparaît
          ici. Vous recevez aussi une notification dans votre messagerie.
        </p>
      </div>
    );
  }

  const active = projects.filter(
    (p) => !["delivered", "archived", "cancelled"].includes(p.status),
  );
  const closed = projects.filter((p) =>
    ["delivered", "archived"].includes(p.status),
  );

  return (
    <div className="space-y-12">
      <Group title="Projets actifs" count={active.length}>
        <Reveal as="ul" stagger className="grid gap-3">
          {active.map((p) => (
            <Reveal as="li" item key={p.id}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </Reveal>
      </Group>

      {closed.length > 0 ? (
        <Group title="Livrés & archivés" count={closed.length}>
          <ul className="overflow-hidden rounded-[3px] border border-line">
            {closed.map((p, i) => (
              <li
                key={p.id}
                className={
                  i > 0
                    ? "border-t border-line"
                    : ""
                }
              >
                <a
                  href={routes.studio.project(p.id)}
                  className="flex items-center justify-between gap-4 bg-paper px-5 py-4 text-[13px] transition-colors hover:bg-vellum/40"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] text-mute">
                      {p.reference ?? "—"}
                    </span>
                    <span className="ml-3 truncate text-ink">{p.title}</span>
                  </div>
                  <span className="caption transition-colors group-hover:text-ink">
                    Revoir →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Group>
      ) : null}
    </div>
  );
}

function Group({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-4 flex items-baseline gap-3 border-b border-line pb-3">
        <h3 className="display text-xl text-ink">{title}</h3>
        <span className="caption">· {count}</span>
      </header>
      {children}
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <a
      href={routes.studio.project(project.id)}
      className="lift group flex flex-col gap-3 rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-ink hover:bg-vellum/40 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-mute">
            {project.reference ?? "—"}
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
        <p className="mt-2 font-display text-lg text-ink">{project.title}</p>
        <p className="mt-1 text-[12px] text-mute">
          Client : {project.client?.full_name ?? project.client?.email ?? "—"}
          {project.manager?.full_name
            ? ` · Chef de projet : ${project.manager.full_name}`
            : ""}
        </p>
      </div>
      <span className="caption inline-flex shrink-0 items-center gap-1.5 text-mute transition-colors group-hover:text-ink">
        Ouvrir
        <ArrowUpRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}
