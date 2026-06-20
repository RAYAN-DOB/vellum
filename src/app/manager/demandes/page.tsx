import { Inbox } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { ManagerShell } from "@/components/shells/ManagerShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { listProjectsForManager } from "@/lib/projects";
import { projectStatusLabels } from "@/lib/project-display";
import { routes } from "@/lib/routes";

export const metadata = { title: "Demandes entrantes" };

export default async function ManagerRequestsPage() {
  await requireRole(["manager", "admin"]);
  const projects = await listProjectsForManager({ status: "intake" });

  return (
    <ManagerShell
      activeHref={routes.manager.requests}
      title="Demandes entrantes"
      description="File des projets clients à qualifier. Lisez le brief, vérifiez les pièces, qualifiez ou rejetez avec un mot."
    >
      {projects.length === 0 ? (
        <EmptyState
          icon={Inbox}
          caption="File vide"
          title="Aucune demande à qualifier."
          description="Toutes les demandes clients en cours sont déjà qualifiées ou en production. La file se remplit dès qu'un client dépose un nouveau projet."
        />
      ) : (
        <Reveal as="ul" stagger className="grid gap-3">
          {projects.map((project) => (
            <Reveal as="li" item key={project.id}>
              <a
                href={routes.manager.project(project.id)}
                className="lift group block rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-ink hover:bg-vellum/40"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="caption">{project.reference ?? "—"}</p>
                  <span className="text-[12px] font-medium text-amber">
                    {projectStatusLabels[project.status]}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xl leading-tight text-ink">
                  {project.title}
                </h3>
                <p className="mt-1 text-[12px] text-mute">
                  Client : {project.client?.full_name ?? project.client?.email ?? "—"}
                </p>
                <p className="mt-3 line-clamp-2 text-[13px] text-mute">
                  {project.description ?? "Sans description"}
                </p>
              </a>
            </Reveal>
          ))}
        </Reveal>
      )}
    </ManagerShell>
  );
}
