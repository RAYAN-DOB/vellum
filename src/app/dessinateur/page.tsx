import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function DrafterWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.drafter}
      description="Espace de demo pour montrer comment le dessinateur lira le brief, suivra les retours et preparera les livrables attendus."
      eyebrow="Vue par role"
      title="Espace dessinateur"
    >
      <RoleWorkspace role="drafter" />
    </AppShell>
  );
}
