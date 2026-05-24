import { MessageSquare } from "lucide-react";

import { StudioShell } from "@/components/shells/StudioShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Messages" };

export default async function StudioMessagesPage() {
  await requireRole(["architect", "manager", "admin"]);

  return (
    <StudioShell
      activeHref={routes.studio.messages}
      title="Messages projet"
      description="Inbox cross-projet : questions client, instructions du chef de projet, signalements internes."
    >
      <EmptyState
        icon={MessageSquare}
        caption="Inbox vide"
        title="Aucun message en attente."
        description="Les nouveaux messages sur vos projets assignés s'afficheront ici. Le détail des conversations reste dans chaque projet."
      />
    </StudioShell>
  );
}
