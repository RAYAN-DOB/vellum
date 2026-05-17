import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ClientWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.client}
      description="Vue client fictive pour suivre les demandes et livrables sans exposer de fichier sensible."
      eyebrow="Vue par role"
      title="Espace client"
    >
      <RoleWorkspace role="client" />
    </AppShell>
  );
}
