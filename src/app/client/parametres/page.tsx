import { AppShell } from "@/components/layout/AppShell";
import { ClientSettingsPage } from "@/components/settings/ClientSettingsPage";
import { routes } from "@/lib/routes";

export default function ClientSettingsRoute() {
  return (
    <AppShell
      activeHref={routes.roles.clientSettings}
      description="Parametres client simules : profil, societe, notifications, confidentialite et facturation prevue en V2."
      eyebrow="Espace client"
      title="Parametres client"
    >
      <ClientSettingsPage />
    </AppShell>
  );
}
