import { PermissionsMatrix } from "@/components/dashboard/PermissionsMatrix";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function PermissionsPage() {
  return (
    <AppShell
      activeHref={routes.workspace.permissions}
      description="Matrice de permissions mockee pour clarifier l'intention produit sans pretendre securiser la V1."
      title="Permissions mockees"
    >
      <PermissionsMatrix />
    </AppShell>
  );
}
