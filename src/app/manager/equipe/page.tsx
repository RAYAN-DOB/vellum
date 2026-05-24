import { UsersRound } from "lucide-react";

import { ManagerShell } from "@/components/shells/ManagerShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Équipe" };

export default async function ManagerTeamPage() {
  await requireRole(["manager", "admin"]);

  return (
    <ManagerShell
      activeHref={routes.manager.team}
      title="Équipe & charge"
      description="Vue charge dessinateur : projets en cours, disponibilité, prochaines échéances."
    >
      <EmptyState
        icon={UsersRound}
        caption="Module à venir"
        title="Vue charge équipe en construction."
        description="Une vue capacité par dessinateur (projets actifs, échéances, disponibilité) sera disponible prochainement."
      />
    </ManagerShell>
  );
}
