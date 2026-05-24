import { Sparkles } from "lucide-react";

import { StudioShell } from "@/components/shells/StudioShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Livrables" };

export default async function StudioDeliverablesPage() {
  await requireRole(["architect", "manager", "admin"]);

  return (
    <StudioShell
      activeHref={routes.studio.deliverables}
      title="Livrables à préparer"
      description="Les aperçus et livrables finaux que vous publiez pour validation client et archivage."
    >
      <EmptyState
        icon={Sparkles}
        caption="Production en attente"
        title="Aucun livrable en cours."
        description="Dès qu'un projet vous est assigné en phase production, vous pourrez déposer ici les aperçus et la version finale signée."
      />
    </StudioShell>
  );
}
