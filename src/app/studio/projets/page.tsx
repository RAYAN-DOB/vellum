import { Layers3 } from "lucide-react";

import { StudioShell } from "@/components/shells/StudioShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { listProjectsForArchitect } from "@/lib/projects";
import { routes } from "@/lib/routes";

export const metadata = { title: "Projets assignés" };

export default async function StudioProjectsPage() {
  const user = await requireRole(["architect", "manager", "admin"]);
  const projects = await listProjectsForArchitect(user.id);

  return (
    <StudioShell
      activeHref={routes.studio.projects}
      title="Projets assignés"
      description="Tous les dossiers sur lesquels vous êtes assigné comme dessinateur. Vous ne voyez que ce qui vous concerne."
    >
      {projects.length === 0 ? (
        <EmptyState
          icon={Layers3}
          caption="File de production vide"
          title="Aucun projet assigné."
          description="Le chef de projet vous assignera prochainement. Les nouveaux dossiers apparaîtront ici dès qu'ils seront qualifiés."
        />
      ) : (
        <ul className="grid gap-3">
          {projects.map((project) => (
            <li key={project.id}>
              <a
                href={routes.studio.project(project.id)}
                className="group block rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-ink hover:bg-vellum/40"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="caption">{project.reference ?? "—"}</p>
                  <span className="text-[12px] text-mute">
                    {project.status}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xl leading-tight text-ink group-hover:text-ink">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] text-mute">
                  {project.description ?? "Sans description"}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
