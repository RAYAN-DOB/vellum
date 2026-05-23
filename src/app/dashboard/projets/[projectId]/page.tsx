import { notFound } from "next/navigation";

import { DetailPage } from "@/components/dashboard/DetailPage";
import { AppShell } from "@/components/layout/AppShell";
import { mockProjects, mockRequests, mockUsers } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return mockProjects.map((project) => ({ projectId: project.id }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = mockProjects.find((item) => item.id === projectId);

  if (!project) {
    notFound();
  }

  const client = mockUsers.find((item) => item.id === project.clientId);
  const manager = mockUsers.find((item) => item.id === project.projectManagerId);
  const relatedRequests = mockRequests.filter(
    (request) => request.projectId === project.id,
  );

  return (
    <AppShell
      activeHref={routes.workspace.projects}
      description="Detail statique d'un projet fictif, sans cloisonnement serveur actif."
      title="Detail projet"
    >
      <DetailPage
        description={project.description}
        fields={[
          { label: "Reference", value: project.reference },
          { label: "Client", value: client?.name ?? project.clientId },
          { label: "Chef de projet", value: manager?.name ?? "Non assigne" },
          { label: "Confidentialite", value: project.confidentiality },
          { label: "Demandes liees", value: relatedRequests.length },
          { label: "Dessinateurs", value: project.drafterIds.length || "Aucun" },
          { label: "Cree le", value: project.createdAt.slice(0, 10) },
          { label: "Fichiers", value: "Aucun fichier projet reel" },
        ]}
        historyType="projects"
        projectId={project.id}
        status={project.status}
        title={project.name}
      />
    </AppShell>
  );
}
