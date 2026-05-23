import { AlertTriangle, Clock3, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { DocumentPreviewCard } from "@/components/files/DocumentPreviewCard";
import { MessageThread } from "@/components/project/MessageThread";
import { ProjectTimeline } from "@/components/project/ProjectTimeline";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  mockHistory,
  mockProjectFiles,
  mockProjectMessages,
  mockWorkflowSteps,
} from "@/lib/mock-data";

type DetailField = {
  label: string;
  value: ReactNode;
};

type DetailPageProps = {
  title: string;
  description: string;
  status?: Parameters<typeof StatusBadge>[0]["value"];
  fields: DetailField[];
  historyType: keyof typeof mockHistory;
  projectId?: string;
};

export function DetailPage({
  title,
  description,
  status,
  fields,
  historyType,
  projectId,
}: DetailPageProps) {
  const history = mockHistory[historyType];
  const files = projectId
    ? mockProjectFiles.filter((file) => file.projectId === projectId)
    : [];
  const messages = projectId
    ? mockProjectMessages.filter((message) => message.projectId === projectId)
    : [];

  return (
    <div className="grid gap-6">
      <Card className="technical-grid-dark overflow-hidden bg-slate-950 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-blue-200">
                Vue de demonstration
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                {title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                {description}
              </p>
            </div>
            {status ? <StatusBadge value={status} /> : null}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>
              Informations metier fictives pour expliquer ce qui sera suivi en
              production.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                className="rounded-md border border-slate-200 bg-slate-50/80 p-4"
                key={field.label}
              >
                <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                  {field.label}
                </p>
                <div className="mt-2 text-sm font-medium text-slate-950">
                  {field.value}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique de suivi</CardTitle>
            <CardDescription>
              Exemple du journal attendu en V2. Il n&apos;est pas encore sauvegarde
              cote serveur.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative grid gap-3">
            {history.map((item) => (
              <div
                className="rounded-md border border-slate-200 bg-white p-4"
                key={`${item.date}-${item.label}`}
              >
                <div className="flex gap-3">
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <Clock3 className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {projectId ? (
        <section className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents mockes</CardTitle>
              <CardDescription>
                Fichiers fictifs pour visualiser le futur espace documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {files.map((file) => (
                <DocumentPreviewCard file={file} key={file.id} />
              ))}
            </CardContent>
          </Card>

          <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <MessageThread messages={messages} />
            <ProjectTimeline steps={mockWorkflowSteps} />
          </section>
        </section>
      ) : null}

      <Card className="border-amber-200 bg-amber-50 shadow-none">
        <CardContent className="flex gap-3 p-5">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-amber-700"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-amber-950">
              Limite importante de la V1
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              Cette page aide a comprendre le futur produit. Elle ne prouve pas
              une securite reelle : aucun controle serveur, aucune auth et aucun
              cloisonnement actif ne sont en place.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex gap-3 p-5">
          <ShieldCheck
            className="mt-0.5 size-5 shrink-0 text-blue-700"
            aria-hidden="true"
          />
          <p className="text-sm leading-6 text-slate-600">
            La V1 prepare les objets metier : projet, demande, statut,
            livrable, historique et confidentialite. Les futurs acces fichiers
            devront etre verifies cote serveur selon role, projet, organisation
            et NDA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
