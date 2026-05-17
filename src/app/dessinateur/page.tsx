import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function DrafterWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.drafter}
      description="Vue dessinateur statique pour lire les briefs, suivre les retours et preparer les livrables."
      eyebrow="Vue par role"
      title="Espace dessinateur"
    >
      <RoleWorkspace role="drafter" />
    </AppShell>
  );
}
