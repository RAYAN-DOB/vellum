import {
  ArrowRight,
  CheckCircle2,
  FileText,
  LockKeyhole,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { DocumentPreviewCard } from "@/components/files/DocumentPreviewCard";
import { MessageThread } from "@/components/project/MessageThread";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { mockDataNotice } from "@/lib/mock-data";
import { routes } from "@/lib/routes";
import { quoteLineItems, workflowStatuses } from "@/lib/workflow";
import type { ProjectFile } from "@/types/file";
import type { ProjectMessage } from "@/types/message";
import type { Project } from "@/types/project";
import type { QuotePreview } from "@/types/quote";
import type { ProjectRequest } from "@/types/request";

type PremiumProjectDetailProps = {
  project: Project;
  files: ProjectFile[];
  messages: ProjectMessage[];
  requests: ProjectRequest[];
  quote?: QuotePreview;
};

export function PremiumProjectDetail({
  project,
  files,
  messages,
  requests,
  quote,
}: PremiumProjectDetailProps) {
  const activeStatuses = workflowStatuses.slice(1, 9);

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card tone="dark" className="overflow-hidden rounded-[32px]">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[#f7f3ea]/10 text-[#d7c6a4] ring-[#f7f3ea]/18">
                {project.reference}
              </Badge>
              <Badge tone="green">{project.status}</Badge>
              <Badge tone={project.confidentiality === "restricted" ? "amber" : "neutral"}>
                {project.confidentiality}
              </Badge>
            </div>
            <CardTitle className="max-w-3xl text-3xl leading-tight text-[#f7f3ea]">
              {project.name}
            </CardTitle>
            <CardDescription className="max-w-3xl text-[#cfc6b5]">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {[
              "Completer ma demande",
              "Valider un apercu",
              "Contacter manager",
            ].map((action, index) => (
              <Button
                className={
                  index === 0
                    ? "rounded-full bg-[#f7f3ea] text-[#171613] hover:bg-white"
                    : "rounded-full border-[#f7f3ea]/18 bg-[#f7f3ea]/6 text-[#f7f3ea] hover:bg-[#f7f3ea]/10"
                }
                key={action}
                variant={index === 0 ? "primary" : "outline"}
              >
                {action}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle>Responsable actuel</CardTitle>
            <CardDescription>
              Le manager orchestre qualification, devis et assignation.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Client", "Claire Martin"],
              ["Manager", "Samir Bernard"],
              ["Architecte", "Nora Petit"],
            ].map(([role, name]) => (
              <div
                className="flex items-center justify-between rounded-[20px] border border-[#d8d0bf] bg-[#f8f5ed] px-4 py-3"
                key={role}
              >
                <span className="text-sm text-[#6b665a]">{role}</span>
                <span className="text-sm font-semibold text-[#171613]">{name}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {activeStatuses.map((status) => (
          <Card
            className="rounded-[24px] shadow-none"
            key={status.id}
            tone={status.id === "in_production" ? "muted" : "default"}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a5f]">
                  {status.dateLabel}
                </span>
                <Badge tone={status.tone}>{status.owner}</Badge>
              </div>
              <p className="mt-3 font-semibold text-[#171613]">{status.label}</p>
              <p className="mt-2 text-sm leading-6 text-[#6b665a]">
                {status.nextAction}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle>Documents projet</CardTitle>
            <CardDescription>
              Apercus fictifs : aucun vrai fichier n&apos;est stocke.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {files.map((file) => (
              <a
                className="block rounded-[24px] transition hover:-translate-y-0.5"
                href={`${routes.roles.clientProjects}/${project.id}/documents/${file.id}`}
                key={file.id}
              >
                <DocumentPreviewCard file={file} />
              </a>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle>Decisions client</CardTitle>
            <CardDescription>
              Les actions ci-dessous sont simulees pour presenter la V2.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              { label: "Repondre a une question", icon: MessageSquareText },
              { label: "Demander une correction", icon: FileText },
              { label: "Valider l'orientation", icon: CheckCircle2 },
              { label: "Consulter devis mocke", icon: ReceiptText },
            ].map(({ label, icon: Icon }) => (
              <button
                className="flex items-center justify-between gap-3 rounded-full border border-[#d8d0bf] bg-[#fbfaf6] px-4 py-3 text-sm font-semibold text-[#171613] transition hover:bg-white"
                key={label}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4 text-[#7b6b4f]" aria-hidden="true" />
                  {label}
                </span>
                <ArrowRight className="size-4 text-[#8a7a5f]" aria-hidden="true" />
              </button>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.82fr]">
        <MessageThread messages={messages} />

        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle>Devis mocke</CardTitle>
            <CardDescription>
              {quote?.note ?? "Aucun paiement reel dans cette V1."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quoteLineItems.map((line) => (
              <div className="rounded-[20px] border border-[#d8d0bf] bg-[#f8f5ed] p-4" key={line.label}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#171613]">{line.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#6b665a]">
                      {line.detail}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-[#7b6b4f]">{line.amount}</span>
                </div>
              </div>
            ))}
            <div className="rounded-[20px] border border-[#e4c887] bg-[#fbf2dd] p-4 text-sm leading-6 text-[#7a5213]">
              Paiement prevu en V2, non disponible dans cette demonstration.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Confidentialite", detail: mockDataNotice, icon: LockKeyhole },
          { title: "Demandes liees", detail: `${requests.length} demande(s) rattachee(s) au projet.`, icon: UserRoundCheck },
          { title: "Audit futur", detail: "Toutes les actions serveur devront etre rejouees et journalisees en V2.", icon: ShieldCheck },
        ].map(({ title, detail, icon: Icon }) => (
          <Card className="rounded-[28px]" key={title}>
            <CardHeader>
              <span className="flex size-11 items-center justify-center rounded-full bg-[#171613] text-[#f7f3ea]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
