import { Sparkles } from "lucide-react";

import { ClientShell } from "@/components/shells/ClientShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Livrables" };

export default async function ClientDeliverablesPage() {
  await requireRole(["client", "manager", "admin"]);

  return (
    <ClientShell
      activeHref={routes.client.deliverables}
      title="Vos livrables"
      description="Les livrables techniques publiés par le dessinateur arrivent ici, signés et archivés. Vous pouvez les télécharger à tout moment."
    >
      <EmptyState
        icon={Sparkles}
        caption="Livraison finale"
        title="Aucun livrable publié."
        description="Vos livrables apparaissent ici une fois validés et signés par le chef de projet. L'historique reste consultable, jamais modifié."
      />
    </ClientShell>
  );
}
