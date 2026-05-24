"use client";

import {
  ArrowLeft,
  CheckCircle2,
  FileArchive,
  FileText,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useActionState, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  confidentialityLabels,
  projectStatusLabels,
  projectStatusTone,
} from "@/lib/project-display";
import type {
  ProjectDocumentRow,
  ProjectEventRow,
  ProjectMessageRow,
  ProjectStatus,
} from "@/types/database";
import { sendProjectMessageAction } from "@/lib/actions/projects";
import { uploadProjectDocumentsClient } from "@/lib/client/upload";
import { cn } from "@/lib/utils";

type ProjectLite = {
  id: string;
  reference: string | null;
  title: string;
  description: string | null;
  status: ProjectStatus;
  confidentiality: "standard" | "nda_required" | "restricted";
  expected_delivery_date: string | null;
  created_at: string;
  updated_at: string;
  client: { full_name: string | null } | null;
  manager: { full_name: string | null } | null;
  architect: { full_name: string | null } | null;
};

type Message = ProjectMessageRow & {
  sender: { id: string; full_name: string | null; role: string } | null;
};

type DocumentItem = ProjectDocumentRow & {
  uploader: { id: string; full_name: string | null; role: string } | null;
};

type Props = {
  project: ProjectLite;
  documents: DocumentItem[];
  messages: Message[];
  events: ProjectEventRow[];
  currentUserId: string;
  currentUserRole: string;
  canUpload: boolean;
};

const initialState = {} as { error?: string; success?: string };

function MessageSendButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      icon={pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
      iconPosition="right"
    >
      {pending ? "Envoi…" : "Envoyer"}
    </Button>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBytes(size: number | null): string {
  if (!size) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export function ProjectDetailView({
  project,
  documents,
  messages,
  events,
  currentUserId,
  currentUserRole,
  canUpload,
}: Props) {
  const router = useRouter();
  const [messageState, sendMessage] = useActionState(
    sendProjectMessageAction,
    initialState,
  );
  const [uploading, startUpload] = useTransition();
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (list.length === 0) return;
    startUpload(async () => {
      setUploadFeedback(`Téléversement de ${list.length} fichier${list.length > 1 ? "s" : ""}…`);
      const { uploaded, failed } = await uploadProjectDocumentsClient(
        project.id,
        list,
      );
      setUploadFeedback(
        failed > 0
          ? `${uploaded} fichier(s) ajouté(s), ${failed} échec(s).`
          : `${uploaded} fichier${uploaded > 1 ? "s" : ""} ajouté${uploaded > 1 ? "s" : ""}.`,
      );
      router.refresh();
    });
  }

  const peopleLabel = [
    project.manager?.full_name && `Chef de projet : ${project.manager.full_name}`,
    project.architect?.full_name && `Architecte : ${project.architect.full_name}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      <a
        href="/client/projets"
        className="inline-flex items-center gap-1 text-sm text-[#6b665a] hover:text-[#171613]"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Tous les projets
      </a>

      <section className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-5 shadow-[0_18px_50px_rgba(22,21,18,0.07)] sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b665a]">
          <span className="font-mono">{project.reference}</span>
          <span>·</span>
          <StatusPill tone={projectStatusTone[project.status]}>
            {projectStatusLabels[project.status]}
          </StatusPill>
          <StatusPill
            tone={
              project.confidentiality === "restricted"
                ? "red"
                : project.confidentiality === "nda_required"
                  ? "amber"
                  : "neutral"
            }
          >
            <ShieldCheck className="size-3" aria-hidden />
            {confidentialityLabels[project.confidentiality]}
          </StatusPill>
        </div>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#171613] sm:text-3xl">
          {project.title}
        </h2>
        {project.description ? (
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#3c382f]">
            {project.description}
          </p>
        ) : null}
        {peopleLabel ? (
          <p className="mt-3 text-xs text-[#6b665a]">{peopleLabel}</p>
        ) : (
          <p className="mt-3 text-xs text-[#6b665a]">
            En attente d'assignation par le chef de projet.
          </p>
        )}
        {project.expected_delivery_date ? (
          <p className="mt-1 text-xs text-[#6b665a]">
            Livraison estimée :{" "}
            <strong className="font-medium text-[#171613]">
              {new Date(project.expected_delivery_date).toLocaleDateString(
                "fr-FR",
                { day: "2-digit", month: "long", year: "numeric" },
              )}
            </strong>
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Documents */}
          <section
            id="documents"
            className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-5"
          >
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
                Documents ({documents.length})
              </h3>
              {canUpload ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon={
                      uploading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Paperclip className="size-3.5" />
                      )
                    }
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Téléversement…" : "Ajouter un document"}
                  </Button>
                </div>
              ) : null}
            </header>
            {uploadFeedback ? (
              <p className="mt-2 text-xs text-[#6b665a]">{uploadFeedback}</p>
            ) : null}
            {documents.length === 0 ? (
              <p className="mt-4 rounded-[4px] border border-dashed border-[#d8d0bf] bg-[#fbfaf6] p-6 text-center text-xs text-[#6b665a]">
                Aucun document pour le moment.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-[4px] border border-[#e8e0d0] bg-[#fbfaf6]/85 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2 text-sm">
                      {doc.file_name.toLowerCase().endsWith(".dwg") ? (
                        <FileArchive className="size-4 shrink-0 text-[#8a7a5f]" />
                      ) : (
                        <FileText className="size-4 shrink-0 text-[#8a7a5f]" />
                      )}
                      <span className="truncate font-medium text-[#171613]">
                        {doc.file_name}
                      </span>
                      <span className="text-xs text-[#6b665a]">
                        {formatBytes(doc.file_size)}
                      </span>
                    </div>
                    <div className="shrink-0 text-xs text-[#6b665a]">
                      {doc.uploader?.full_name ?? "—"} ·{" "}
                      {formatDateTime(doc.created_at)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Messages */}
          <section
            id="messages"
            className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-5"
          >
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
                Conversation projet ({messages.length})
              </h3>
              <MessageSquare className="size-4 text-[#8a7a5f]" aria-hidden />
            </header>

            <ul className="mt-4 space-y-3">
              {messages.length === 0 ? (
                <li className="rounded-[4px] border border-dashed border-[#d8d0bf] bg-[#fbfaf6] p-6 text-center text-xs text-[#6b665a]">
                  Aucun message — démarrez la conversation.
                </li>
              ) : (
                messages.map((message) => {
                  const isSelf = message.sender_id === currentUserId;
                  return (
                    <li
                      key={message.id}
                      className={cn(
                        "rounded-[4px] border p-3 text-sm",
                        isSelf
                          ? "ml-12 border-[#171613] bg-[#171613] text-[#f7f3ea]"
                          : "mr-12 border-[#e8e0d0] bg-[#fbfaf6] text-[#171613]",
                      )}
                    >
                      <div
                        className={cn(
                          "mb-1 flex items-center justify-between text-xs",
                          isSelf ? "text-[#cfc6b5]" : "text-[#6b665a]",
                        )}
                      >
                        <span className="font-medium">
                          {message.sender?.full_name ?? "Système"}
                          {message.sender?.role
                            ? ` · ${message.sender.role}`
                            : null}
                        </span>
                        <span>{formatDateTime(message.created_at)}</span>
                      </div>
                      <p className="whitespace-pre-line leading-6">
                        {message.body}
                      </p>
                    </li>
                  );
                })
              )}
            </ul>

            <form action={sendMessage} className="mt-5">
              <input type="hidden" name="project_id" value={project.id} />
              <label htmlFor="message-body" className="sr-only">
                Votre message
              </label>
              <textarea
                id="message-body"
                name="body"
                rows={3}
                required
                placeholder="Écrire un message à l'équipe…"
                className="block w-full rounded-[3px] border border-[#d8d0bf] bg-white px-3 py-2 text-sm text-[#171613] outline-none transition placeholder:text-[#9d9279] focus:border-[#171613] focus:ring-2 focus:ring-[#171613]/15"
              />
              {messageState.error ? (
                <p
                  role="alert"
                  className="mt-2 rounded-[3px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                >
                  {messageState.error}
                </p>
              ) : null}
              {messageState.success ? (
                <p
                  role="status"
                  className="mt-2 rounded-[3px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                >
                  {messageState.success}
                </p>
              ) : null}
              <div className="mt-3 flex justify-end">
                <MessageSendButton />
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-[6px] border border-[#d8d0bf] bg-[#f8f5ed] p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8a7a5f]">
              <Sparkles className="size-3.5" aria-hidden /> Prochaine étape
            </p>
            <p className="mt-2 text-sm text-[#171613]">
              {project.status === "intake"
                ? "Le chef de projet va qualifier votre demande sous 24h ouvrées."
                : project.status === "qualified" || project.status === "assigned"
                  ? "Un architecte va prendre en charge votre projet."
                  : project.status === "in_progress"
                    ? "Production en cours. Vous recevrez une notification pour la revue."
                    : project.status === "review"
                      ? "Aperçu disponible — validez ou demandez une correction."
                      : project.status === "delivered"
                        ? "Projet livré. Vous pouvez archiver ou réouvrir un avenant."
                        : "Projet clôturé."}
            </p>
          </div>

          <div className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#8a7a5f]">
              Activité récente
            </h4>
            <ol className="mt-3 space-y-3">
              {events.length === 0 ? (
                <li className="text-xs text-[#6b665a]">
                  Aucune activité enregistrée.
                </li>
              ) : (
                events.slice(0, 6).map((event) => (
                  <li key={event.id} className="flex gap-2 text-xs">
                    <CheckCircle2
                      className="mt-0.5 size-3.5 shrink-0 text-emerald-600"
                      aria-hidden
                    />
                    <div>
                      <p className="font-medium text-[#171613]">
                        {event.label ?? event.event_type}
                      </p>
                      <p className="text-[#6b665a]">
                        {formatDateTime(event.created_at)}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ol>
          </div>

          {currentUserRole === "manager" || currentUserRole === "admin" ? (
            <div className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-4 text-xs text-[#6b665a]">
              <p>Vous regardez ce projet en tant que {currentUserRole}.</p>
              <a
                className="mt-2 inline-block text-[#171613] underline-offset-2 hover:underline"
                href="/manager"
              >
                Ouvrir dans la file de qualification
              </a>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
