import { notFound } from "next/navigation";

import { DetailPage } from "@/components/dashboard/DetailPage";
import { AppShell } from "@/components/layout/AppShell";
import {
  mockDeliverables,
  mockProjects,
  mockRequests,
  mockUsers,
} from "@/lib/mock-data";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return mockDeliverables.map((deliverable) => ({
    deliverableId: deliverable.id,
  }));
}

export default async function DeliverableDetailPage({
  params,
}: {
  params: Promise<{ deliverableId: string }>;
}) {
  const { deliverableId } = await params;
  const deliverable = mockDeliverables.find((item) => item.id === deliverableId);

  if (!deliverable) {
    notFound();
  }

  const project = mockProjects.find((item) => item.id === deliverable.projectId);
  const request = mockRequests.find((item) => item.id === deliverable.requestId);
  const submitter = mockUsers.find((item) => item.id === deliverable.submittedById);
  const reviewer = mockUsers.find((item) => item.id === deliverable.reviewedById);

  return (
    <AppShell
      activeHref={routes.workspace.deliverables}
      description="Detail statique d'un livrable fictif, sans fichier telechargeable."
      title="Detail livrable"
    >
      <DetailPage
        description="Livrable mocke utilise pour presenter le suivi V1 sans stockage sensible."
        fields={[
          { label: "Projet", value: project?.name ?? deliverable.projectId },
          { label: "Demande", value: request?.title ?? deliverable.requestId },
          { label: "Format", value: deliverable.format.toUpperCase() },
          { label: "Nom fictif", value: deliverable.mockFileName },
          { label: "Soumis par", value: submitter?.name ?? deliverable.submittedById },
          { label: "Relu par", value: reviewer?.name ?? "Non relu" },
          { label: "Sensible", value: deliverable.isSensitive ? "Oui" : "Non" },
          { label: "Fichier", value: "Non disponible au MVP" },
        ]}
        historyType="deliverables"
        projectId={deliverable.projectId}
        status={deliverable.status}
        title={deliverable.title}
      />
    </AppShell>
  );
}
