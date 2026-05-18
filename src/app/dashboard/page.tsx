import { AppShell } from "@/components/layout/AppShell";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { routes } from "@/lib/routes";

export default function DashboardPage() {
  return (
    <AppShell
      activeHref={routes.workspace.dashboard}
      description="Vue centrale de demo pour comprendre les demandes a traiter, les projets en cours, les livrables a valider et les limites de la V1."
      title="Pilotage des demandes"
    >
      <DashboardOverview />
    </AppShell>
  );
}
