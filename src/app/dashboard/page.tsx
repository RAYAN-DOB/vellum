import { AppShell } from "@/components/layout/AppShell";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { routes } from "@/lib/routes";

export default function DashboardPage() {
  return (
    <AppShell
      activeHref={routes.workspace.dashboard}
      description="Vue centrale mockee pour suivre les demandes, projets et livrables sans backend, auth ou stockage fichier."
      title="Dashboard MVP"
    >
      <DashboardOverview />
    </AppShell>
  );
}
