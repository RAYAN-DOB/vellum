import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function AdminWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.admin}
      description="Espace de demo pour expliquer la future gouvernance : roles, projets sensibles, cloisonnement et journalisation, sans privileges reels en V1."
      eyebrow="Vue par role"
      title="Espace admin"
    >
      <RoleWorkspace role="admin" />
    </AppShell>
  );
}
