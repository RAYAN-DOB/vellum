import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function AdminWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.admin}
      description="Centre systeme mocke pour presenter roles, projets, permissions, activite et futures configurations sans privileges reels en V1."
      eyebrow="Vue par role"
      title="Console admin"
    >
      <RoleWorkspace role="admin" />
    </AppShell>
  );
}
