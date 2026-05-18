import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ProjectManagerWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.projectManager}
      description="Espace de demo pour montrer comment le chef de projet coordonnera les demandes, les priorites, les corrections et les validations."
      eyebrow="Vue par role"
      title="Espace chef de projet"
    >
      <RoleWorkspace role="project_manager" />
    </AppShell>
  );
}
