import { notFound } from "next/navigation";

import { DocumentPreviewCard } from "@/components/files/DocumentPreviewCard";
import { AppShell } from "@/components/layout/AppShell";
import { MessageThread } from "@/components/project/MessageThread";
import { ProjectTimeline } from "@/components/project/ProjectTimeline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  mockProjectFiles,
  mockProjectMessages,
  mockProjects,
  mockQuotePreviews,
  mockRequests,
  mockWorkflowSteps,
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
      <div className="grid gap-6">
        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <Card className="technical-grid-dark overflow-hidden bg-slate-950 text-white">
            <CardHeader>
              <Badge className="bg-white/10 text-blue-100 ring-white/15" tone="blue">
                {project.reference}
              </Badge>
              <CardTitle className="text-white">{project.name}</CardTitle>
              <CardDescription className="text-slate-300">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {["Completer la demande", "Contacter le manager", "Valider un apercu"].map(
                (action) => (
                  <Button key={action} variant="secondary">
                    {action}
                  </Button>
                ),
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prochaine action</CardTitle>
              <CardDescription>
                Le manager doit confirmer les formats finaux avant assignation.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-600">
              <p>{requests.length} demande(s) liee(s) au projet.</p>
              <p>{files.length} document(s) fictif(s) prepares.</p>
              <p>{quote?.note ?? "Aucun devis reel dans cette V1."}</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {files.map((file) => (
            <DocumentPreviewCard file={file} key={file.id} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <MessageThread messages={messages} />
          <ProjectTimeline steps={mockWorkflowSteps} />
        </section>
      </div>
    </AppShell>
  );
}
