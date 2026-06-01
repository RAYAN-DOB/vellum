import { notFound } from "next/navigation";

import { ClientShell } from "@/components/shells/ClientShell";
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

  // Client must own the project; data rules enforce the same constraint.
  if (
    user.profile.role === "client" &&
    project.client_id !== user.id
  ) {
    notFound();
  }

  return (
    <ClientShell
      activeHref={routes.client.projects}
      eyebrow="Détail projet"
      title={project.title}
      description="Résumé de la demande, fichiers envoyés, messages, devis, aperçus, corrections et livrables du dossier."
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
    </ClientShell>
  );
}
