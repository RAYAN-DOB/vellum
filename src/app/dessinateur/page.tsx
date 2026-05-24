import { AppShell } from "@/components/layout/AppShell";
import { ArchitectCockpit } from "@/components/architect/ArchitectCockpit";
import { requireRole } from "@/lib/auth";
import { listProjectsForArchitect, listProjectsForManager } from "@/lib/projects";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Atelier architecte — PlanWork",
};

export default async function DrafterWorkspacePage() {
  const user = await requireRole(["architect", "manager", "admin"]);

  // Managers and admins see all projects via the manager helper.
  const projects =
    user.profile.role === "architect"
      ? await listProjectsForArchitect(user.id)
      : await listProjectsForManager();

  return (
    <AppShell
      activeHref={routes.roles.drafter}
      eyebrow="Atelier architecte"
      title="Vos projets assignés"
      description="Documents reçus, conversation client, statuts production et livrables — tout ce dont vous avez besoin pour avancer."
    >
      <ArchitectCockpit projects={projects} />
    </AppShell>
  );
}
