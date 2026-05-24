import { notFound } from "next/navigation";

import { StudioShell } from "@/components/shells/StudioShell";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { requireRole } from "@/lib/auth";
import { getProjectDetail } from "@/lib/projects";
import { routes } from "@/lib/routes";

export default async function StudioProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireRole(["architect", "manager", "admin"]);
  const { projectId } = await params;
  const { project, documents, messages, events } =
    await getProjectDetail(projectId);

  if (!project) notFound();

  // Architect must be assigned — defence in depth in addition to RLS.
  if (
    user.profile.role === "architect" &&
    project.architect_id !== user.id
  ) {
    notFound();
  }

  return (
    <StudioShell
      activeHref={routes.studio.projects}
      eyebrow="Atelier"
      title={project.title}
      description="Documents reçus, conversation client, dépôt d'aperçu et livrable final."
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
    </StudioShell>
  );
}
