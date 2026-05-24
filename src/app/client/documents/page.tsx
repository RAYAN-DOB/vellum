import { FileText } from "lucide-react";

import { ClientShell } from "@/components/shells/ClientShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Documents" };

export default async function ClientDocumentsPage() {
  await requireRole(["client", "manager", "admin"]);

  return (
    <ClientShell
      activeHref={routes.client.documents}
      title="Vos documents"
      description="Tous les fichiers déposés sur vos projets — plans, photos, croquis, schémas — accessibles ici. Les documents sont privés et signés."
    >
      <EmptyState
        icon={FileText}
        caption="Bibliothèque centrale"
        title="Vue documents en construction."
        description="Pour l'instant, vos documents restent visibles dans le détail de chaque projet. La vue consolidée arrive bientôt."
        action={
          <a
            href={routes.client.projects}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition hover:bg-iron-hover"
          >
            Voir mes projets
          </a>
        }
      />
    </ClientShell>
  );
}
