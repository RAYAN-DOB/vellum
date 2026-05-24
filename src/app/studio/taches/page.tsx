import { CheckSquare } from "lucide-react";

import { StudioShell } from "@/components/shells/StudioShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Tâches" };

export default async function StudioTasksPage() {
  await requireRole(["architect", "manager", "admin"]);

  return (
    <StudioShell
      activeHref={routes.studio.tasks}
      title="Tâches de production"
      description="Checklist d'avancement par projet : reprises, cotations, calques, validations intermédiaires."
    >
      <EmptyState
        icon={CheckSquare}
        caption="Module à venir"
        title="Tableau de tâches en construction."
        description="Le module de checklist par projet sera disponible dans la prochaine itération. Les tâches sont actuellement gérées dans le fil de discussion projet."
      />
    </StudioShell>
  );
}
