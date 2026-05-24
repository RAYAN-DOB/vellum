import { CheckSquare, Clock, Layers3 } from "lucide-react";

import { StudioShell } from "@/components/shells/StudioShell";
import { requireRole } from "@/lib/auth";
import { listProjectsForArchitect } from "@/lib/projects";
import { projectStatusLabels } from "@/lib/project-display";
import { routes } from "@/lib/routes";

export const metadata = { title: "Tâches" };

const STATUS_TO_TASK: Record<string, string> = {
  draft: "En attente du dépôt client",
  intake: "Lecture du brief — qualification chef de projet",
  qualified: "En attente d'assignation",
  assigned: "Lancer la production : analyser les pièces, poser les questions",
  in_progress: "Produire l'aperçu et déposer pour validation",
  review: "Attente de validation client",
  delivered: "Livraison signée — clôture interne",
  archived: "Dossier archivé",
  cancelled: "Dossier annulé",
};

export default async function StudioTasksPage() {
  const user = await requireRole(["architect", "manager", "admin"]);
  const projects =
    user.profile.role === "architect"
      ? await listProjectsForArchitect(user.id)
      : [];

  const actionable = projects.filter((p) =>
    ["assigned", "in_progress", "review"].includes(p.status),
  );

  return (
    <StudioShell
      activeHref={routes.studio.tasks}
      title="Tâches de production"
      description="Action attendue par projet, dans l'ordre de priorité de la phase. Le module checklist détaillé arrive — pour l'instant : la prochaine action explicite par dossier."
    >
      <div className="space-y-12">
        {/* Stat row */}
        <section className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
          <StatCell
            label="Actions à mener"
            value={actionable.length}
            hint="Projets nécessitant votre intervention"
          />
          <StatCell
            label="Projets assignés"
            value={projects.length}
            hint="Total sur votre table de dessin"
          />
          <StatCell
            label="En attente validation"
            value={
              projects.filter((p) => p.status === "review").length
            }
            hint="Aperçus envoyés au client"
          />
        </section>

        {/* Actionable list */}
        <section>
          <header className="flex items-baseline justify-between border-b border-line pb-4">
            <h2 className="display text-2xl text-ink">Prochaines actions</h2>
            <span className="caption">{actionable.length} projet(s)</span>
          </header>

          {actionable.length === 0 ? (
            <div className="mt-6 rounded-[3px] border border-dashed border-line-strong bg-paper p-10 text-center">
              <CheckSquare
                className="mx-auto size-7 text-mute"
                aria-hidden="true"
              />
              <p className="font-display mt-4 text-xl text-ink">
                Aucune action en attente.
              </p>
              <p className="mx-auto mt-2 max-w-md text-[13px] leading-[1.6] text-mute">
                Tous vos projets actifs sont à jour. Dès qu&apos;une étape
                requiert votre intervention, elle apparaîtra ici.
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-3">
              {actionable.map((p) => (
                <li key={p.id}>
                  <a
                    href={routes.studio.project(p.id)}
                    className="group flex items-start gap-4 rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-ink hover:bg-vellum/40"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong bg-vellum/50"
                    >
                      <Clock className="size-4 text-graphite" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-mute">
                        <span className="font-mono">
                          {p.reference ?? "—"}
                        </span>
                        <span>·</span>
                        <span>{projectStatusLabels[p.status]}</span>
                      </div>
                      <p className="mt-2 font-display text-lg text-ink">
                        {p.title}
                      </p>
                      <p className="mt-1.5 text-[13px] text-graphite">
                        {STATUS_TO_TASK[p.status]}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Roadmap note */}
        <section className="rounded-[4px] border border-line bg-vellum/40 p-6">
          <p className="caption">À venir</p>
          <p className="mt-3 text-[14px] leading-[1.65] text-graphite">
            Sous-tâches assignables, deadlines internes par étape, dépendances
            entre projets. La structure est dans la base — l&apos;interface
            est en construction.
          </p>
          <a
            href={routes.studio.projects}
            className="caption mt-4 inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-ink"
          >
            <Layers3 className="size-3.5" aria-hidden="true" />
            Voir tous mes projets assignés
          </a>
        </section>
      </div>
    </StudioShell>
  );
}

function StatCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="bg-paper p-6">
      <p className="caption">{label}</p>
      <p className="font-display mt-3 text-4xl leading-none text-ink">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-mute">{hint}</p>
    </div>
  );
}
