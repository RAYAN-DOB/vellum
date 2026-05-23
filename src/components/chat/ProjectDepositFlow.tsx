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
import { ArchitecturalGridBackground } from "@/components/ui/ArchitecturalGridBackground";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LayeredPanel } from "@/components/ui/LayeredPanel";
import {
  mockDataNotice,
  mockProjectFiles,
  mockProjectMessages,
  mockProjects,
  mockWorkflowSteps,
} from "@/lib/mock-data";
import { routes } from "@/lib/routes";

const intakeQuestions = [
  "Quel plan faut-il creer, reprendre ou corriger ?",
  "Quels documents existent deja : DWG, PDF, croquis, schema, photo ?",
  "Quel resultat faut-il livrer : apercu, version de travail ou final ?",
  "Quel niveau de confidentialite faudra-t-il appliquer en V2 ?",
] as const;

const fileTypeRail = ["DWG", "PDF", "Croquis", "Elec", "Plomberie", "Photo", "Note"] as const;

export function ProjectDepositFlow() {
  const project = mockProjects[0];
  const messages = mockProjectMessages.filter(
    (message) => message.projectId === project.id,
  );

  return (
    <div className="grid w-full min-w-0 max-w-full gap-6 overflow-hidden">
      <ArchitecturalGridBackground className="rounded-[8px] border border-[#34312b] shadow-[0_42px_120px_rgba(22,21,18,0.22)]">
        <div className="grid min-h-[760px] gap-0 xl:grid-cols-[260px_minmax(0,1fr)_340px]">
          <aside className="border-b border-[#f7f3ea]/10 bg-[#f7f3ea]/[0.035] p-4 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c6a4]">
                Documents mock
              </p>
              <Badge className="bg-[#f7f3ea]/10 text-[#d7c6a4] ring-[#f7f3ea]/16">
                7 types
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-1">
              {fileTypeRail.map((type) => (
                <div
                  className="rounded-[3px] border border-[#f7f3ea]/10 bg-[#f7f3ea]/[0.045] p-3"
                  key={type}
                >
                  <p className="text-sm font-semibold text-[#f7f3ea]">{type}</p>
                  <div className="mt-3 h-px w-full bg-[#f7f3ea]/16" />
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[3px] border border-[#e4c887]/35 bg-[#d7c6a4]/10 p-3">
              <p className="text-xs leading-5 text-[#ead9b9]">
                Aucun upload reel dans cette V1. Les cartes montrent les futurs
                emplacements de fichiers securises.
              </p>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col">
            <div className="border-b border-[#f7f3ea]/10 p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c6a4]">
                    Cockpit depot projet
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#f7f3ea] sm:text-4xl">
                    Decrire le besoin, attacher le contexte, preparer la
                    qualification.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#cfc6b5]">
                    Le client parle comme dans un chat. La plateforme transforme
                    le brief en dossier lisible pour le manager et l&apos;architecte.
                  </p>
                </div>
                <Button asChild className="bg-[#f7f3ea] text-[#171613] hover:bg-white">
                  <a href={routes.roles.clientProjects}>
                    Projets client
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[3px] border border-[#f7f3ea]/14 bg-[#f7f3ea]/8 text-[#d7c6a4]">
                  <MessageSquareText className="size-5" aria-hidden="true" />
                </span>
                <LayeredPanel dark className="max-w-2xl p-4">
                  <p className="text-sm font-semibold text-[#f7f3ea]">
                    Assistant de cadrage
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#cfc6b5]">
                    Deposez le projet comme vous l expliqueriez a un chef de
                    projet. Je structure le besoin, les documents, les points a
                    clarifier et les prochaines etapes.
                  </p>
                </LayeredPanel>
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
                        ? "max-w-2xl rounded-[4px] bg-[#f7f3ea] p-4 text-[#171613]"
                        : "max-w-2xl rounded-[4px] border border-[#f7f3ea]/12 bg-[#f7f3ea]/[0.055] p-4 text-[#f7f3ea]"
                    }
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                      {message.authorName}
                    </p>
                    <p className="mt-2 text-sm leading-6">{message.body}</p>
                  </div>
                </div>
              ))}

              <div className="grid gap-3 md:grid-cols-2">
                {intakeQuestions.map((question) => (
                  <button
                    className="min-h-12 rounded-[3px] border border-[#f7f3ea]/12 bg-[#f7f3ea]/[0.045] px-4 py-3 text-left text-sm leading-5 text-[#e8e0d0] transition hover:bg-[#f7f3ea]/[0.075]"
                    key={question}
                    type="button"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#f7f3ea]/10 p-4">
              <div className="rounded-[4px] border border-[#f7f3ea]/12 bg-[#0f0f0d]/70 p-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                  <div className="flex-1">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9a191]">
                      Message client simule
                    </label>
                    <div className="mt-2 min-h-16 rounded-[3px] border border-[#f7f3ea]/10 bg-[#f7f3ea]/[0.035] px-3 py-3 text-sm leading-6 text-[#d9d0bf]">
                      Reprendre un plan existant, nettoyer les annotations,
                      verifier les zones techniques et recevoir un apercu avant
                      devis.
                    </div>
                  </div>
                  <Button className="bg-[#f7f3ea] text-[#171613] hover:bg-white">
                    <Paperclip className="size-4" aria-hidden="true" />
                    Ajouter mock
                  </Button>
                  <Button>
                    <Send className="size-4" aria-hidden="true" />
                    Envoyer a l equipe
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <aside className="border-t border-[#f7f3ea]/10 bg-[#f7f3ea]/[0.035] p-4 xl:border-l xl:border-t-0">
            <div className="grid gap-4">
              <LayeredPanel dark className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-[3px] bg-[#f7f3ea]/10 text-[#d7c6a4]">
                    <FilePlus2 className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#a9a191]">
                      Synthese
                    </p>
                    <p className="font-semibold text-[#f7f3ea]">{project.reference}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#cfc6b5]">
                  {project.description}
                </p>
              </LayeredPanel>

              <LayeredPanel dark className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c6a4]">
                  Prochaines etapes
                </p>
                <div className="mt-4 grid gap-3">
                  {mockWorkflowSteps.slice(0, 5).map((step, index) => (
                    <div className="flex gap-3" key={step.id}>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-[3px] border border-[#f7f3ea]/12 text-xs text-[#d7c6a4]">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#f7f3ea]">
                          {step.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#a9a191]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </LayeredPanel>

              <LayeredPanel dark className="p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-6 text-[#cfc6b5]">
                    Niveau cible : documents prives, permissions serveur et
                    audit en V2. Rien de sensible dans cette V1.
                  </p>
                </div>
              </LayeredPanel>
            </div>
          </aside>
        </div>
      </ArchitecturalGridBackground>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockProjectFiles.map((file) => (
          <DocumentPreviewCard file={file} key={file.id} />
        ))}
      </section>

      <div className="rounded-[4px] border border-[#e4c887] bg-[#fbf2dd] p-4">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#8a5b15]" />
          <p className="text-sm leading-6 text-[#7a5213]">{mockDataNotice}</p>
        </div>
      </div>
    </div>
  );
}
