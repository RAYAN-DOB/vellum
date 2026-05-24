import { LineChart } from "lucide-react";

import { ManagerShell } from "@/components/shells/ManagerShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Reporting" };

export default async function ManagerReportingPage() {
  await requireRole(["manager", "admin"]);

  return (
    <ManagerShell
      activeHref={routes.manager.reporting}
      title="Reporting"
      description="Indicateurs de production : volume entrant, délais moyens, taux de validation, charge équipe."
    >
      <EmptyState
        icon={LineChart}
        caption="Module à venir"
        title="Tableau de reporting en construction."
        description="Un cockpit indicateurs (entrants, délais, validations, charge) sera disponible une fois que l'historique projet sera suffisant pour produire des tendances utiles."
      />
    </ManagerShell>
  );
}
