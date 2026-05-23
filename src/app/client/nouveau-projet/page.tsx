import { ProjectDepositFlow } from "@/components/chat/ProjectDepositFlow";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ClientNewProjectPage() {
  return (
    <AppShell
      activeHref={routes.roles.clientNewProject}
      description="Cockpit V1.5 pour decrire le projet, preparer les documents fictifs et transmettre la demande."
      eyebrow="Espace client"
      title="Nouveau projet"
    >
      <ProjectDepositFlow />
    </AppShell>
  );
}
