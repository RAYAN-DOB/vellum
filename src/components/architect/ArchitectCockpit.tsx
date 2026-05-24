"use client";

import { ArrowUpRight, Layers, ShieldCheck } from "lucide-react";

import { StatusPill } from "@/components/ui/StatusPill";
import {
  confidentialityLabels,
  projectStatusLabels,
  projectStatusTone,
  type ProjectListItem,
} from "@/lib/project-display";

type Props = { projects: ProjectListItem[] };

export function ArchitectCockpit({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="rounded-[6px] border border-dashed border-[#d8d0bf] bg-white/70 p-10 text-center">
        <Layers className="mx-auto size-8 text-[#8a7a5f]" aria-hidden />
        <p className="mt-3 text-sm font-medium text-[#171613]">
          Aucun projet assigné pour le moment
        </p>
        <p className="mx-auto mt-1 max-w-md text-xs text-[#6b665a]">
          Dès qu'un chef de projet vous assigne un nouveau projet, il
          apparaîtra ici. Vous recevrez aussi une notification.
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
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
          Projets actifs <span className="text-[#6b665a]">· {active.length}</span>
        </h3>
        <ul className="space-y-2">
          {active.map((p) => (
            <li
              key={p.id}
              className="rounded-[4px] border border-[#d8d0bf] bg-white/95 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b665a]">
                    <span className="font-mono">{p.reference}</span>
                    <StatusPill tone={projectStatusTone[p.status]}>
                      {projectStatusLabels[p.status]}
                    </StatusPill>
                    <StatusPill
                      tone={
                        p.confidentiality === "restricted"
                          ? "red"
                          : p.confidentiality === "nda_required"
                            ? "amber"
                            : "neutral"
                      }
                    >
                      <ShieldCheck className="size-3" aria-hidden />
                      {confidentialityLabels[p.confidentiality]}
                    </StatusPill>
                  </div>
                  <p className="mt-1.5 font-medium text-[#171613]">
                    {p.title}
                  </p>
                  <p className="mt-1 text-xs text-[#6b665a]">
                    Client : {p.client?.full_name ?? p.client?.email ?? "—"}
                    {p.manager?.full_name
                      ? ` · Manager : ${p.manager.full_name}`
                      : ""}
                  </p>
                </div>
                <a
                  href={`/client/projets/${p.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#171613] hover:underline"
                >
                  Ouvrir
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {closed.length > 0 ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
            Livrés / archivés <span className="text-[#6b665a]">· {closed.length}</span>
          </h3>
          <ul className="space-y-2">
            {closed.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-[4px] border border-[#d8d0bf] bg-[#fbfaf6] px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <span className="font-mono text-xs text-[#6b665a]">
                    {p.reference}
                  </span>
                  <span className="ml-2 text-[#171613]">{p.title}</span>
                </div>
                <a
                  href={`/client/projets/${p.id}`}
                  className="text-xs text-[#6b665a] hover:text-[#171613]"
                >
                  Revoir →
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
