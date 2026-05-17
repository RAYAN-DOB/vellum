import { RoleWorkspace } from "@/components/dashboard/RoleWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function AdminWorkspacePage() {
  return (
    <AppShell
      activeHref={routes.roles.admin}
      description="Vue admin simple et fictive pour anticiper roles, confidentialite et gouvernance sans privileges reels."
      eyebrow="Vue par role"
      title="Admin MVP"
    >
      <RoleWorkspace role="admin" />
    </AppShell>
  );
}
