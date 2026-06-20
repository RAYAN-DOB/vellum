"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileArchive,
  FileText,
  Loader2,
  Paperclip,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createProjectAction } from "@/lib/actions/projects";
import { uploadProjectDocumentsClient } from "@/lib/client/upload";
import {
  PUBLIC_PROJECT_DRAFT_KEY,
  type PublicProjectDraft,
} from "@/lib/intake-draft";
import { cn } from "@/lib/utils";

const needTypes = [
  "Reprise de plan",
  "Correction DWG/PDF",
  "Schéma électrique",
  "Schéma plomberie",
  "Mise au propre croquis",
  "Aperçu 3D / maquette",
  "Autre demande technique",
] as const;

const deliverables = [
  "DWG propre",
  "PDF corrigé",
  "Schéma technique",
  "Aperçu 3D",
  "Dossier complet",
] as const;

const initialState = {} as { error?: string; success?: string; projectId?: string };

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1f6b47] px-6 text-sm font-semibold text-[#fbfaf6] transition hover:bg-[#154c31] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Send className="size-4" aria-hidden="true" />
      )}
      {pending ? "Création du dossier..." : "Envoyer le dossier"}
    </button>
  );
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export function NewProjectFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState<string>(needTypes[0]);
  const [deliverable, setDeliverable] = useState<string>(deliverables[0]);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal");
  const [confidentiality, setConfidentiality] = useState<
    "standard" | "nda_required" | "restricted"
  >("standard");
  const [files, setFiles] = useState<File[]>([]);
  const [draftFiles, setDraftFiles] = useState<PublicProjectDraft["files"]>([]);
  const [draftRestored, setDraftRestored] = useState(false);
  const postCreateHandledRef = useRef(false);
  const [uploading, startUpload] = useTransition();
  const [state, formAction] = useActionState(createProjectAction, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state]);

  useEffect(() => {
    const raw = window.localStorage.getItem(PUBLIC_PROJECT_DRAFT_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as PublicProjectDraft;
      queueMicrotask(() => {
        setTitle(draft.title || `Demande ${draft.projectType}`);
        setProjectType(draft.projectType || needTypes[0]);
        setDeliverable(draft.deliverable || deliverables[0]);
        setDeadline(draft.deadline || "");
        setNotes(draft.notes || "");
        setPriority(draft.urgency || "normal");
        setDraftFiles(draft.files || []);
        setDescription(
          [
            draft.description,
            draft.needs3d ? "Besoin d'un aperçu 3D : oui" : "",
            draft.workMode === "creation"
              ? "Type de travail : création complète"
              : "Type de travail : correction ou reprise",
            draft.contactName || draft.email || draft.phone || draft.company
              ? `Contact : ${[
                  draft.contactName,
                  draft.email,
                  draft.phone,
                  draft.company,
                ]
                  .filter(Boolean)
                  .join(" · ")}`
              : "",
            draft.files?.length
              ? `Fichiers annoncés : ${draft.files.map((file) => file.name).join(", ")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n\n"),
        );
        setDraftRestored(true);
      });
    } catch {
      window.localStorage.removeItem(PUBLIC_PROJECT_DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (!state.success || !state.projectId || postCreateHandledRef.current) return;

    postCreateHandledRef.current = true;
    window.localStorage.removeItem(PUBLIC_PROJECT_DRAFT_KEY);

    if (files.length > 0) {
      startUpload(async () => {
        toast.success(
          `Téléversement de ${files.length} fichier${files.length > 1 ? "s" : ""}...`,
        );
        await uploadProjectDocumentsClient(state.projectId!, files, "source");
        router.push(`/client/projets/${state.projectId}`);
      });
      return;
    }

    router.push(`/client/projets/${state.projectId}`);
  }, [
    files,
    router,
    startUpload,
    state.projectId,
    state.success,
  ]);

  const summary = useMemo(
    () => [
      { label: "Besoin", value: projectType },
      { label: "Livrable", value: deliverable },
      {
        label: "Fichiers",
        value:
          files.length > 0
            ? `${files.length} fichier${files.length > 1 ? "s" : ""} prêt${files.length > 1 ? "s" : ""}`
            : draftFiles.length > 0
              ? `${draftFiles.length} fichier${draftFiles.length > 1 ? "s" : ""} à joindre`
              : "À ajouter si disponible",
      },
      {
        label: "Prochaine étape",
        value:
          priority === "urgent"
            ? "Analyse prioritaire"
            : "Analyse du dossier",
      },
    ],
    [deliverable, draftFiles.length, files.length, priority, projectType],
  );

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(event.target.files ?? []);
    setFiles((current) => [...current, ...list]);
    event.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(formData: FormData) {
    const fullDescription = [
      description,
      deadline ? `Délai souhaité : ${deadline}` : "",
      notes ? `Remarques : ${notes}` : "",
      files.length > 0
        ? `Fichiers joints : ${files.map((file) => file.name).join(", ")}`
        : draftFiles.length > 0
          ? `Fichiers à joindre : ${draftFiles.map((file) => file.name).join(", ")}`
          : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    formData.set("title", title || `${projectType} - ${deliverable}`);
    formData.set("description", fullDescription);
    formData.set("project_type", projectType);
    formData.set("priority", priority);
    formData.set("confidentiality", confidentiality);
    formAction(formData);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#151410] text-[#fbfaf6]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,250,246,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(251,250,246,0.16) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_22%_0%,rgba(47,125,86,0.24),transparent_38%),linear-gradient(180deg,rgba(21,20,16,0.2),rgba(21,20,16,0))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#0c0b09] to-transparent" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <a
          href="/client"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#d8d0bf] transition hover:text-[#fbfaf6]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour espace client
        </a>
        <span className="hidden text-xs uppercase tracking-[0.22em] text-[#9b9183] sm:inline">
          Dossier projet
        </span>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pb-16 pt-2 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <form
          action={handleSubmit}
          className="rounded-[8px] border border-[#3b352e] bg-[#1c1a16]/88 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur sm:p-8"
        >
          <h1 className="display text-[clamp(2.3rem,5vw,4rem)] text-[#fbfaf6]">
            Vérifiez votre dossier avant envoi.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#d8d0bf]">
            Complétez le besoin, ajoutez les fichiers réels si vous les avez,
            puis envoyez le dossier. Un dessinateur pourra ensuite poser les
            questions utiles, préparer un devis et partager les aperçus.
          </p>

          {draftRestored ? (
            <div className="mt-6 rounded-[5px] border border-[#2f7d56]/35 bg-[#2f7d56]/10 px-4 py-3 text-sm leading-6 text-[#cfe0d4]">
              Votre brouillon commencé sans compte a été repris ici.
            </div>
          ) : null}

          <div className="mt-8 grid gap-6">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                Titre du dossier
              </span>
              <input
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 block h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#2f7d56] focus:ring-2 focus:ring-[#2f7d56]/20"
                placeholder="Ex. Reprise PDF d'un bureau open-space"
              />
            </label>

            <div>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                Type de besoin
              </span>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {needTypes.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setProjectType(type)}
                    className={cn(
                      "min-h-14 rounded-[4px] border px-4 py-3 text-left text-sm transition",
                      projectType === type
                        ? "border-[#2f7d56] bg-[#1f6b47] text-[#fbfaf6]"
                        : "border-[#3b352e] bg-[#100f0d] text-[#d8d0bf] hover:border-[#746d62] hover:bg-[#201d18]",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                Description
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={7}
                className="mt-2 block w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 py-3 text-sm leading-6 text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#2f7d56] focus:ring-2 focus:ring-[#2f7d56]/20"
                placeholder="Expliquez les corrections, contraintes, dimensions connues, formats attendus."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                  Livrable
                </span>
                <select
                  value={deliverable}
                  onChange={(event) => setDeliverable(event.target.value)}
                  className="mt-2 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none focus:border-[#2f7d56] focus:ring-2 focus:ring-[#2f7d56]/20"
                >
                  {deliverables.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                  Urgence
                </span>
                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as typeof priority)
                  }
                  className="mt-2 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none focus:border-[#2f7d56] focus:ring-2 focus:ring-[#2f7d56]/20"
                >
                  <option value="normal">Standard</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                  Confidentialité
                </span>
                <select
                  value={confidentiality}
                  onChange={(event) =>
                    setConfidentiality(event.target.value as typeof confidentiality)
                  }
                  className="mt-2 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none focus:border-[#2f7d56] focus:ring-2 focus:ring-[#2f7d56]/20"
                >
                  <option value="standard">Standard</option>
                  <option value="nda_required">Accès limité</option>
                  <option value="restricted">Très confidentiel</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                  Délai souhaité
                </span>
                <input
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="mt-2 block h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#2f7d56] focus:ring-2 focus:ring-[#2f7d56]/20"
                  placeholder="Ex. fin de semaine, 10 jours"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                  Remarques
                </span>
                <input
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-2 block h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#2f7d56] focus:ring-2 focus:ring-[#2f7d56]/20"
                  placeholder="Format, contraintes, éléments manquants"
                />
              </label>
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#b9ad9d]">
                Pièces jointes
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 flex w-full items-center justify-center gap-3 rounded-[5px] border border-dashed border-[#4c4339] bg-[#100f0d] px-4 py-7 text-sm text-[#d8d0bf] transition hover:border-[#2f7d56] hover:bg-[#201d18]"
              >
                <Paperclip className="size-4 text-[#2f7d56]" aria-hidden="true" />
                Ajouter des fichiers PDF, DWG, images ou croquis
              </button>

              {files.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-3 py-2 text-xs"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-[#d8d0bf]">
                        {file.name.toLowerCase().endsWith(".dwg") ? (
                          <FileArchive className="size-4 shrink-0 text-[#2f7d56]" />
                        ) : (
                          <FileText className="size-4 shrink-0 text-[#2f7d56]" />
                        )}
                        <span className="truncate">{file.name}</span>
                        <span className="shrink-0 text-[#746d62]">
                          {formatBytes(file.size)}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#9b9183] transition hover:bg-[#2a251f] hover:text-[#9ec9b4]"
                        aria-label={`Retirer ${file.name}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {files.length === 0 && draftFiles.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {draftFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-3 py-2 text-xs"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-[#d8d0bf]">
                        <FileText className="size-4 shrink-0 text-[#2f7d56]" />
                        <span className="truncate">{file.name}</span>
                      </span>
                      <span className="shrink-0 text-[#9b9183]">à joindre</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <p className="mt-2 text-[11px] leading-5 text-[#9b9183]">
                Vos pièces restent attachées au dossier et visibles uniquement
                par les personnes qui travaillent sur votre demande.
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#3b352e] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-xs leading-5 text-[#9b9183]">
                Vous pourrez répondre aux questions du dessinateur, recevoir les
                aperçus et demander des corrections dans le fil du projet.
              </p>
              <SubmitButton disabled={uploading} />
            </div>
          </div>
        </form>

        <aside className="min-w-0 rounded-[8px] border border-[#3b352e] bg-[#1c1a16]/88 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur lg:sticky lg:top-8 lg:self-start">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c58a73]">
            <Sparkles className="size-4" aria-hidden="true" />
            Dossier prêt
          </div>

          <dl className="mt-5 grid gap-3">
            {summary.map((row) => (
              <div
                key={row.label}
                className="rounded-[5px] border border-[#3b352e] bg-[#100f0d] p-3"
              >
                <dt className="text-[11px] uppercase tracking-[0.18em] text-[#9b9183]">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm text-[#fbfaf6]">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-[5px] border border-[#5f6f55]/35 bg-[#5f6f55]/10 p-4 text-xs leading-5 text-[#cbd4c2]">
            <p className="mb-2 flex items-center gap-2 text-[#e5eddc]">
              <CheckCircle2 className="size-4 text-[#8ba07d]" aria-hidden="true" />
              Analyse après envoi
            </p>
            L'équipe vérifie les pièces reçues, confirme les éléments manquants
            et prépare un devis si nécessaire.
          </div>

          <a
            href="/client"
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#4c4339] text-sm font-medium text-[#d8d0bf] transition hover:border-[#2f7d56] hover:text-[#fbfaf6]"
          >
            Revenir à l'espace client
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </aside>
      </main>
    </div>
  );
}
