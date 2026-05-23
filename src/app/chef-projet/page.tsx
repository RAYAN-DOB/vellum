import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ProjectManagerWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.projectManager}
      description="Cockpit manager mocke pour qualifier les demandes entrantes, arbitrer la charge equipe, preparer les assignations et suivre les validations."
      eyebrow="Vue par role"
      title="Cockpit manager"
    >
      <RoleWorkspace role="project_manager" />
    </AppShell>
  );
}
