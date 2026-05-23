import { AppShell } from "@/components/layout/AppShell";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { routes } from "@/lib/routes";

export default function DashboardPage() {
  return (
    <AppShell
      activeHref={routes.workspace.dashboard}
      description="Vue command center pour lire les demandes a traiter, les projets actifs, les livrables a valider et les limites front mockees de la V1."
      title="Pilotage des demandes"
    >
      <DashboardOverview />
    </AppShell>
  );
}
