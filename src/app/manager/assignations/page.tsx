import { UserSquare2 } from "lucide-react";

import { ManagerShell } from "@/components/shells/ManagerShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { listProjectsForManager } from "@/lib/projects";
import { projectStatusLabels } from "@/lib/project-display";
import { routes } from "@/lib/routes";

export const metadata = { title: "Assignations" };

export default async function ManagerAssignmentsPage() {
  await requireRole(["manager", "admin"]);
  const qualified = await listProjectsForManager({ status: "qualified" });

  return (
    <ManagerShell
      activeHref={routes.manager.assignments}
      title="Projets à assigner"
      description="Dossiers qualifiés en attente d'un dessinateur. Choisissez selon disponibilité et compétence."
    >
      {qualified.length === 0 ? (
        <EmptyState
          icon={UserSquare2}
          caption="Aucun projet en attente"
          title="Tous les projets qualifiés sont assignés."
          description="Quand un projet passe à l'état « Qualifié », il apparaît ici pour assignation à un dessinateur."
        />
      ) : (
        <ul className="grid gap-3">
          {qualified.map((project) => (
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
                <p className="mt-2 text-[12px] text-mute">
                  Client : {project.client?.full_name ?? "—"} ·{" "}
                  Priorité : {project.priority}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </ManagerShell>
  );
}
