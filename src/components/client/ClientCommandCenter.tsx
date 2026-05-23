import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquareText,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import { DocumentPreviewCard } from "@/components/files/DocumentPreviewCard";
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
  mockDeliverables,
  mockProjectFiles,
  mockProjects,
  mockRequests,
} from "@/lib/mock-data";
import { routes } from "@/lib/routes";
import { workflowStatuses } from "@/lib/workflow";

const nextActions = [
  {
    title: "Question de l'equipe",
    detail: "Confirmer si les annotations rouges sont toutes prioritaires.",
    action: "Repondre",
    icon: MessageSquareText,
  },
  {
    title: "Apercu a valider",
    detail: "Un apercu fictif attend une orientation client.",
    action: "Valider",
    icon: CheckCircle2,
  },
  {
    title: "Devis en preparation",
    detail: "Le manager prepare un chiffrage mocke, paiement prevu V2.",
    action: "Consulter",
    icon: FileText,
  },
] as const;

export function ClientCommandCenter() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card tone="dark" className="overflow-hidden rounded-[32px]">
          <CardHeader className="relative">
            <div className="absolute right-6 top-6 hidden rounded-full border border-[#f7f3ea]/12 bg-[#f7f3ea]/7 px-3 py-1.5 text-xs text-[#d7c6a4] sm:block">
              Ctrl K pour naviguer
            </div>
            <span className="flex size-12 items-center justify-center rounded-full bg-[#f7f3ea] text-[#171613]">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <CardTitle className="max-w-2xl text-3xl leading-tight text-[#f7f3ea]">
              Votre cockpit client rassemble projets, questions, apercus et
              livrables.
            </CardTitle>
            <CardDescription className="max-w-2xl text-[#cfc6b5]">
              Une demo front pour comprendre le parcours futur : depot structure,
              qualification manager, production architecte, validation client.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full bg-[#f7f3ea] text-[#171613] hover:bg-white">
              <a href={routes.roles.clientNewProject}>
                Deposer un projet
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              className="rounded-full border-[#f7f3ea]/18 bg-[#f7f3ea]/6 text-[#f7f3ea] hover:bg-[#f7f3ea]/10"
              variant="outline"
            >
              <a href={routes.roles.clientMessages}>Voir les messages</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle>Prochaine etape</CardTitle>
            <CardDescription>
              Le statut doit toujours dire quoi faire ensuite.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {workflowStatuses.slice(2, 5).map((status) => (
              <div className="rounded-[22px] border border-[#d8d0bf] bg-[#f8f5ed] p-4" key={status.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#171613]">{status.label}</p>
                  <Badge tone={status.tone}>{status.owner}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#6b665a]">
                  {status.nextAction}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {nextActions.map(({ title, detail, action, icon: Icon }) => (
          <Card interactive className="rounded-[28px]" key={title}>
            <CardHeader>
              <span className="flex size-11 items-center justify-center rounded-full bg-[#171613] text-[#f7f3ea]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{detail}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="rounded-full">
                {action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {mockProjects.map((project) => {
          const requestCount = mockRequests.filter(
            (request) => request.projectId === project.id,
          ).length;
          const deliverableCount = mockDeliverables.filter(
            (deliverable) => deliverable.projectId === project.id,
          ).length;

          return (
            <Card interactive className="rounded-[30px]" key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a5f]">
                      {project.reference}
                    </p>
                    <CardTitle className="mt-2">{project.name}</CardTitle>
                  </div>
                  <Badge tone={project.status === "review" ? "green" : "amber"}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {[
                    ["Demandes", requestCount],
                    ["Documents", mockProjectFiles.filter((file) => file.projectId === project.id).length],
                    ["Livrables", deliverableCount],
                  ].map(([label, value]) => (
                    <div className="rounded-[18px] bg-[#eee8dc] p-3" key={label}>
                      <p className="text-xs text-[#8a7a5f]">{label}</p>
                      <p className="mt-1 font-semibold text-[#171613]">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="rounded-full">
                    <a href={`${routes.roles.clientProjects}/${project.id}`}>
                      Ouvrir
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <ClipboardList className="size-4" aria-hidden="true" />
                    Completer
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full">
                    <PhoneCall className="size-4" aria-hidden="true" />
                    Manager
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="rounded-[32px]">
        <CardHeader>
          <CardTitle>Documents recents</CardTitle>
          <CardDescription>
            Tous les documents ci-dessous sont fictifs et non sensibles.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockProjectFiles.slice(0, 6).map((file) => (
            <DocumentPreviewCard file={file} key={file.id} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
