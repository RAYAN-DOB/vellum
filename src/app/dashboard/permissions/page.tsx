import { PermissionsMatrix } from "@/components/dashboard/PermissionsMatrix";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function PermissionsPage() {
  return (
    <AppShell
      activeHref={routes.workspace.permissions}
      description="Modele de droits cible pour expliquer qui pourra voir, piloter ou valider les projets. Les controles serveur ne sont pas encore actifs."
      title="Modele de permissions"
    >
      <PermissionsMatrix />
    </AppShell>
  );
}
