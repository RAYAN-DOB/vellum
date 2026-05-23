import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { PremiumProjectDetail } from "@/components/project/PremiumProjectDetail";
import {
  mockProjectFiles,
  mockProjectMessages,
  mockProjects,
  mockQuotePreviews,
  mockRequests,
} from "@/lib/mock-data";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return mockProjects.map((project) => ({ projectId: project.id }));
}

export default async function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = mockProjects.find((item) => item.id === projectId);

  if (!project) {
    notFound();
  }

  const files = mockProjectFiles.filter((file) => file.projectId === project.id);
  const messages = mockProjectMessages.filter(
    (message) => message.projectId === project.id,
  );
  const requests = mockRequests.filter((request) => request.projectId === project.id);
  const quote = mockQuotePreviews.find((item) => item.projectId === project.id);

  return (
    <AppShell
      activeHref={routes.roles.clientProjects}
      description="Detail client mocke : documents, echanges, demandes de precision, prochaines actions et devis futur."
      eyebrow="Espace client"
      title={project.name}
    >
      <PremiumProjectDetail
        files={files}
        messages={messages}
        project={project}
        quote={quote}
        requests={requests}
      />
    </AppShell>
  );
}
