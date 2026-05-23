import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function DrafterWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.drafter}
      description="Plan de travail mocke pour analyser les documents, poser les bonnes questions, preparer les apercus et suivre les livrables."
      eyebrow="Vue par role"
      title="Atelier architecte"
    >
      <RoleWorkspace role="drafter" />
    </AppShell>
  );
}
