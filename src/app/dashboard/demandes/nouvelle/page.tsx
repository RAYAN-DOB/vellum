import { ProjectDepositFlow } from "@/components/chat/ProjectDepositFlow";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function NewRequestPage() {
  return (
    <AppShell
      activeHref={routes.workspace.newRequest}
      description="Experience de depot projet en chat pleine page : documents mockes, questions de cadrage, synthese manager et limites V1."
      title="Depot projet client"
    >
      <ProjectDepositFlow />
    </AppShell>
  );
}
