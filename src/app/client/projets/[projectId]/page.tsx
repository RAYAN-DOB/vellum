import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { requireRole } from "@/lib/auth";
import { getProjectDetail } from "@/lib/projects";
import { routes } from "@/lib/routes";

export default async function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireRole(["client", "manager", "admin"]);
  const { projectId } = await params;
  const { project, documents, messages, events } =
    await getProjectDetail(projectId);

  if (!project) notFound();

  // Client must own the project — defence in depth in addition to RLS.
  if (
    user.profile.role === "client" &&
    project.client_id !== user.id
  ) {
    notFound();
  }

  return (
    <AppShell
      activeHref={routes.roles.clientProjects}
      eyebrow="Détail projet"
      title={project.title}
      description="Documents, conversation et activité du projet. Échangez avec l'équipe en direct."
    >
      <ProjectDetailView
        project={project}
        documents={documents}
        messages={messages}
        events={events}
        currentUserId={user.id}
        currentUserRole={user.profile.role}
        canUpload={true}
      />
    </AppShell>
  );
}
