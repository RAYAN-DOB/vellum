import { FileText } from "lucide-react";

import { StudioShell } from "@/components/shells/StudioShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Documents" };

export default async function StudioDocumentsPage() {
  await requireRole(["architect", "manager", "admin"]);

  return (
    <StudioShell
      activeHref={routes.studio.documents}
      title="Documents projet"
      description="Tous les fichiers reçus pour vos projets assignés — plans existants, photos, schémas électriques, croquis. Consultables, téléchargeables, jamais modifiables hors versions."
    >
      <EmptyState
        icon={FileText}
        caption="Bibliothèque atelier"
        title="Vue documents consolidée à venir."
        description="Pour l'instant, les documents restent visibles dans le détail de chaque projet assigné."
        action={
          <a
            href={routes.studio.projects}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition hover:bg-iron-hover"
          >
            Voir mes projets assignés
          </a>
        }
      />
    </StudioShell>
  );
}
