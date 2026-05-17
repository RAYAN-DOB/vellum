import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ProjectManagerWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.projectManager}
      description="Vue chef de projet mockee pour qualifier, prioriser et suivre les demandes techniques."
      eyebrow="Vue par role"
      title="Espace chef de projet"
    >
      <RoleWorkspace role="project_manager" />
    </AppShell>
  );
}
