import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ClientWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.client}
      description="Espace de demo pour montrer comment un client suivra ses projets, ses demandes et ses livrables sans exposer de fichier sensible dans la V1."
      eyebrow="Vue par role"
      title="Espace client"
    >
      <RoleWorkspace role="client" />
    </AppShell>
  );
}
