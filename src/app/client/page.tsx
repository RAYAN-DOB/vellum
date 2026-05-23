import { ClientCommandCenter } from "@/components/client/ClientCommandCenter";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ClientWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.client}
      description="Cockpit client mocke pour deposer, suivre, repondre et valider des projets techniques sans exposer de fichier sensible."
      eyebrow="Vue par role"
      title="Cockpit client"
    >
      <ClientCommandCenter />
    </AppShell>
  );
}
