import { CalendarRange } from "lucide-react";

import { StudioShell } from "@/components/shells/StudioShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Planning" };

export default async function StudioPlanningPage() {
  await requireRole(["architect", "manager", "admin"]);

  return (
    <StudioShell
      activeHref={routes.studio.planning}
      title="Planning de production"
      description="Vue calendrier de vos deadlines : aperçus à fournir, livraisons attendues, jalons internes."
    >
      <EmptyState
        icon={CalendarRange}
        caption="Module à venir"
        title="Planning visuel en construction."
        description="Une vue Gantt légère par projet assigné est prévue. Pour l'instant, les échéances figurent dans le détail projet."
      />
    </StudioShell>
  );
}
