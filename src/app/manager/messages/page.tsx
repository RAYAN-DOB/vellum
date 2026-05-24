import { Mail } from "lucide-react";

import { ManagerShell } from "@/components/shells/ManagerShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Messages" };

export default async function ManagerMessagesPage() {
  await requireRole(["manager", "admin"]);

  return (
    <ManagerShell
      activeHref={routes.manager.messages}
      title="Messages projet"
      description="Inbox transverse : tous les messages des projets que vous pilotez, dans l'ordre d'arrivée."
    >
      <EmptyState
        icon={Mail}
        caption="Inbox vide"
        title="Aucun nouveau message."
        description="Les nouveaux messages sur vos projets en pilotage apparaîtront ici. Vous pouvez répondre depuis le détail projet."
      />
    </ManagerShell>
  );
}
