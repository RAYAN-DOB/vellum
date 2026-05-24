import { notFound } from "next/navigation";

import { ManagerShell } from "@/components/shells/ManagerShell";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { requireRole } from "@/lib/auth";
import { getProjectDetail } from "@/lib/projects";
import { routes } from "@/lib/routes";

export default async function ManagerProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireRole(["manager", "admin"]);
  const { projectId } = await params;
  const { project, documents, messages, events } =
    await getProjectDetail(projectId);

  if (!project) notFound();

  return (
    <ManagerShell
      activeHref={routes.manager.projects}
      eyebrow="Détail projet"
      title={project.title}
      description="Qualifiez, assignez, échangez avec le client et le dessinateur. Vous avez un contrôle complet sur ce dossier."
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
    </ManagerShell>
  );
}
