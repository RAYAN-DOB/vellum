import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ClientWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.client}
      description="Portail client mocke pour suivre les dossiers, documents fictifs, actions attendues, echanges et validations sans exposer de fichier sensible."
      eyebrow="Vue par role"
      title="Portail client"
    >
      <RoleWorkspace role="client" />
    </AppShell>
  );
}
