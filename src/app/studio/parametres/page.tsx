import { Settings } from "lucide-react";

import { StudioShell } from "@/components/shells/StudioShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Paramètres" };

export default async function StudioSettingsPage() {
  await requireRole(["architect", "manager", "admin"]);

  return (
    <StudioShell
      activeHref={routes.studio.settings}
      title="Paramètres"
      description="Préférences d'affichage, notifications projet, signature de livrable."
    >
      <EmptyState
        icon={Settings}
        caption="Module à venir"
        title="Paramètres atelier en construction."
        description="Vous pourrez bientôt personnaliser votre signature livrable, vos notifications projet et vos préférences d'affichage."
      />
    </StudioShell>
  );
}
