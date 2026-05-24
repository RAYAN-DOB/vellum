import { ShieldCheck } from "lucide-react";

import { ManagerShell } from "@/components/shells/ManagerShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { listProjectsForManager } from "@/lib/projects";
import { projectStatusLabels } from "@/lib/project-display";
import { routes } from "@/lib/routes";

export const metadata = { title: "Projets" };

export default async function ManagerProjectsPage() {
  await requireRole(["manager", "admin"]);
  const projects = await listProjectsForManager();

  return (
    <ManagerShell
      activeHref={routes.manager.projects}
      title="Tous les projets"
      description="Vue plate de tous les dossiers — toutes phases confondues. Utilisez les filtres pour cibler par statut, priorité ou client."
    >
      {projects.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          caption="Pipeline vide"
          title="Aucun projet en cours."
          description="Les projets apparaîtront ici dès qu'un client en dépose un. Vous pouvez aussi en créer un manuellement via la demande entrante."
        />
      ) : (
        <ul className="grid gap-3">
          {projects.map((project) => (
            <li key={project.id}>
              <a
                href={routes.manager.project(project.id)}
                className="group block rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-ink hover:bg-vellum/40"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="caption">{project.reference ?? "—"}</p>
                  <span className="text-[12px] font-medium text-graphite">
                    {projectStatusLabels[project.status]}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xl leading-tight text-ink">
                  {project.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-mute">
                  <span>Client : {project.client?.full_name ?? "—"}</span>
                  <span>Dessinateur : {project.architect?.full_name ?? "non assigné"}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </ManagerShell>
  );
}
