import { ProjectDepositFlow } from "@/components/chat/ProjectDepositFlow";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ClientNewProjectPage() {
  return (
    <AppShell
      activeHref={routes.roles.clientNewProject}
      description="Experience centrale V1.5 : le client decrit son projet dans un chat pleine page et prepare des documents fictifs."
      eyebrow="Espace client"
      title="Nouveau projet"
    >
      <ProjectDepositFlow />
    </AppShell>
  );
}
