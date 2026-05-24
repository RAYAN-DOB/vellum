import { Settings } from "lucide-react";

import { AdminShell } from "@/components/shells/AdminShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Paramètres" };

export default async function AdminSettingsPage() {
  await requireRole("admin");

  return (
    <AdminShell
      activeHref={routes.admin.settings}
      title="Paramètres de la plateforme"
      description="Configuration globale Vellum : branding, e-mails transactionnels, intégrations, modules activés."
    >
      <EmptyState
        icon={Settings}
        caption="Module à venir"
        title="Paramètres globaux en construction."
        description="Vous pourrez bientôt configurer ici : nom commercial affiché, modèles d'e-mails, intégrations, activation modulaire des fonctions sensibles."
        action={
          <a
            href={routes.admin.policies}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition hover:bg-iron-hover"
          >
            Configurer les politiques applicatives
          </a>
        }
      />
    </AdminShell>
  );
}
