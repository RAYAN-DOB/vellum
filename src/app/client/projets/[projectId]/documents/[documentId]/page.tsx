import { notFound } from "next/navigation";

import { DocumentReviewViewer } from "@/components/files/DocumentReviewViewer";
import { AppShell } from "@/components/layout/AppShell";
import { mockProjectFiles, mockProjects } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return mockProjectFiles.map((file) => ({
    documentId: file.id,
    projectId: file.projectId,
  }));
}

export default async function ClientDocumentReviewPage({
  params,
}: {
  params: Promise<{ documentId: string; projectId: string }>;
}) {
  const { documentId, projectId } = await params;
  const project = mockProjects.find((item) => item.id === projectId);
  const file = mockProjectFiles.find(
    (item) => item.id === documentId && item.projectId === projectId,
  );

  if (!project || !file) {
    notFound();
  }

  return (
    <AppShell
      activeHref={routes.roles.clientProjects}
      description="Viewer document mocke : calques, annotations, versions et actions de validation sans fichier reel."
      eyebrow="Revue document"
      title={file.name}
    >
      <DocumentReviewViewer file={file} project={project} />
    </AppShell>
  );
}
