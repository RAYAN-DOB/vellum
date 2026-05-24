import { Receipt } from "lucide-react";

import { ClientShell } from "@/components/shells/ClientShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Devis" };

export default async function ClientQuotesPage() {
  await requireRole(["client", "manager", "admin"]);

  return (
    <ClientShell
      activeHref={routes.client.quotes}
      title="Vos devis"
      description="Les devis émis par le chef de projet apparaissent ici. Vous pouvez les accepter, refuser ou demander une révision."
    >
      <EmptyState
        icon={Receipt}
        caption="En attente"
        title="Aucun devis pour le moment."
        description="Dès qu'un chef de projet émet un devis sur l'un de vos projets, vous le retrouverez ici avec son détail ligne à ligne."
      />
    </ClientShell>
  );
}
