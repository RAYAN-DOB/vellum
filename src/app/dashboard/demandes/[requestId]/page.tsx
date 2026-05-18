import { notFound } from "next/navigation";

import { DetailPage } from "@/components/dashboard/DetailPage";
import { AppShell } from "@/components/layout/AppShell";
import { mockProjects, mockRequests, mockUsers } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return mockRequests.map((request) => ({ requestId: request.id }));
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const request = mockRequests.find((item) => item.id === requestId);

  if (!request) {
    notFound();
  }

  const project = mockProjects.find((item) => item.id === request.projectId);
  const author = mockUsers.find((item) => item.id === request.createdById);

  return (
    <AppShell
      activeHref={routes.workspace.requests}
      description="Detail statique d'une demande fictive, sans backend ni piece jointe."
      title="Detail demande"
    >
      <DetailPage
        description={request.summary}
        fields={[
          { label: "Projet", value: project?.name ?? request.projectId },
          { label: "Type", value: request.type },
          { label: "Priorite", value: request.priority },
          { label: "Confidentialite", value: request.confidentiality },
          { label: "Formats attendus", value: request.expectedFormats.join(" + ") },
          { label: "Delai souhaite", value: request.desiredDueDate ?? "Non renseigne" },
          { label: "Demandeur", value: author?.name ?? request.createdById },
          { label: "Fichiers", value: "Aucun upload reel au MVP" },
        ]}
        historyType="requests"
        status={request.status}
        title={request.title}
      />
    </AppShell>
  );
}
