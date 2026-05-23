import {
  AlertTriangle,
  ArrowRight,
  FilePlus2,
  MessageSquareText,
  Paperclip,
  Send,
  ShieldCheck,
} from "lucide-react";

import { DocumentPreviewCard } from "@/components/files/DocumentPreviewCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  mockDataNotice,
  mockProjectFiles,
  mockProjectMessages,
  mockProjects,
  mockWorkflowSteps,
} from "@/lib/mock-data";
import { routes } from "@/lib/routes";

const intakeQuestions = [
  "Quel type de plan souhaitez-vous creer, corriger ou reprendre ?",
  "Quels documents existent deja : DWG, PDF, croquis, schema elec, plomberie, photos ?",
  "Quel est le resultat attendu : apercu, version de travail, livrable final ?",
  "Quel niveau de confidentialite ou NDA faut-il prevoir en V2 ?",
] as const;

export function ProjectDepositFlow() {
  const project = mockProjects[0];
  const files = mockProjectFiles;
  const messages = mockProjectMessages.filter(
    (message) => message.projectId === project.id,
  );

  return (
    <div className="grid w-full min-w-0 max-w-full gap-6 overflow-hidden xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 text-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]">
        <div className="technical-grid-dark relative overflow-hidden border-b border-white/10 p-5 sm:p-6">
          <BorderBeam className="opacity-45" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-normal text-blue-300">
                Chat projet pleine page
              </p>
              <h2 className="mt-2 max-w-full break-words text-2xl font-semibold tracking-normal text-white sm:text-3xl">
                Deposer un projet technique complet
              </h2>
              <p className="mt-3 max-w-3xl break-words text-sm leading-6 text-slate-300">
                Le client decrit son besoin, prepare ses documents fictifs et
                obtient une synthese lisible pour le manager.
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-white text-slate-950 hover:bg-blue-50 sm:w-auto"
            >
              <a href={routes.roles.clientProjects}>
                Voir projets client
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid min-h-[620px] lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-b border-white/10 bg-white/[0.04] p-4 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">
              Documents prepares
            </p>
            <div className="mt-4 grid gap-3">
              {files.slice(0, 5).map((file) => (
                <div
                  className="rounded-md border border-white/10 bg-white/[0.06] p-3"
                  key={file.id}
                >
                  <p className="truncate text-sm font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{file.sizeLabel}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
              Aucun vrai fichier n&apos;est accepte en V1. Cette liste illustre les
              types de documents prevus.
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
              <div className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white">
                  <MessageSquareText className="size-4" aria-hidden="true" />
                </span>
                <div className="max-w-2xl rounded-lg border border-white/10 bg-white/[0.07] p-4">
                  <p className="text-sm font-semibold text-white">
                    Assistant projet
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Bonjour. Decrivez le projet, les contraintes et les
                    documents disponibles. Je prepare une synthese exploitable
                    pour le manager.
                  </p>
                </div>
              </div>

              {messages.map((message) => (
                <div
                  className={
                    message.authorRole === "client"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                  key={message.id}
                >
                  <div
                    className={
                      message.authorRole === "client"
                        ? "max-w-2xl rounded-lg bg-white p-4 text-slate-950"
                        : "max-w-2xl rounded-lg border border-white/10 bg-white/[0.07] p-4 text-white"
                    }
                  >
                    <p className="text-xs font-semibold uppercase tracking-normal opacity-70">
                      {message.authorName}
                    </p>
                    <p className="mt-2 text-sm leading-6">{message.body}</p>
                  </div>
                </div>
              ))}

              <div className="grid gap-3 md:grid-cols-2">
                {intakeQuestions.map((question) => (
                  <button
                    className="min-h-11 rounded-md border border-white/10 bg-white/[0.05] px-4 py-3 text-left text-sm leading-5 text-slate-200 transition hover:bg-white/[0.09]"
                    key={question}
                    type="button"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="text-xs font-semibold uppercase tracking-normal text-slate-400">
                      Message client mocke
                    </label>
                    <div className="mt-2 min-h-16 rounded-md border border-white/10 bg-slate-950/70 px-3 py-3 text-sm leading-6 text-slate-300">
                      Je souhaite reprendre un plan existant, corriger les zones
                      techniques et recevoir un apercu avant devis.
                    </div>
                  </div>
                  <Button className="bg-white text-slate-950 hover:bg-blue-50">
                    <Paperclip className="size-4" aria-hidden="true" />
                    Ajouter mock
                  </Button>
                  <Button>
                    <Send className="size-4" aria-hidden="true" />
                    Simuler envoi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="grid min-w-0 gap-6 xl:self-start">
        <Card>
          <CardHeader>
            <div className="flex size-11 items-center justify-center rounded-md bg-slate-950 text-white">
              <FilePlus2 className="size-5" aria-hidden="true" />
            </div>
            <CardTitle>Synthese projet</CardTitle>
            <CardDescription>
              Ce panneau montre ce que le manager recevra apres depot.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="font-semibold text-slate-950">{project.name}</p>
              <p className="mt-1 text-slate-600">{project.description}</p>
            </div>
            {mockWorkflowSteps.slice(0, 4).map((step) => (
              <div className="flex gap-3" key={step.id}>
                <span className="mt-1 size-2 rounded-full bg-blue-600" />
                <p className="leading-6 text-slate-600">{step.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50 shadow-none">
          <CardContent className="flex gap-3 p-5">
            <AlertTriangle
              className="mt-0.5 size-5 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-amber-900">{mockDataNotice}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex gap-3 p-5">
            <ShieldCheck
              className="mt-0.5 size-5 shrink-0 text-blue-700"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-slate-600">
              La V2 devra ajouter comptes, stockage prive, permissions serveur,
              audit log et URLs de fichiers non publiques.
            </p>
          </CardContent>
        </Card>
      </aside>

      <section className="min-w-0 xl:col-span-2">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {files.map((file) => (
            <DocumentPreviewCard file={file} key={file.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
