"use client";

import {
  ArrowLeft,
  CheckCircle2,
  FileArchive,
  FileText,
  Loader2,
  Paperclip,
  Send,
  Sparkles,
} from "lucide-react";
import { useActionState, useMemo, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { createProjectAction } from "@/lib/actions/projects";
import { uploadProjectDocumentsClient } from "@/lib/client/upload";
import { cn } from "@/lib/utils";

const documentChips = [
  "DWG",
  "PDF",
  "Croquis",
  "Schéma électrique",
  "Schéma plomberie",
  "Photo de site",
  "Note",
  "Correction",
  "Livrable attendu",
] as const;

const initialState = {} as { error?: string; success?: string; projectId?: string };

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      disabled={pending || disabled}
      icon={pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
      iconPosition="right"
      className="bg-[#f7f3ea] text-[#171613] hover:bg-white"
    >
      {pending ? "Création du projet…" : "Envoyer au chef de projet"}
    </Button>
  );
}

export function NewProjectFlow() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>(["PDF", "DWG"]);
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [confidentiality, setConfidentiality] = useState<
    "standard" | "nda_required" | "restricted"
  >("standard");
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal");
  const [uploading, startUpload] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const [state, formAction] = useActionState(createProjectAction, initialState);

  const summary = useMemo(() => {
    const trimmed = text.trim();
    return [
      {
        label: "Besoin",
        value: trimmed
          ? trimmed.slice(0, 64) + (trimmed.length > 64 ? "…" : "")
          : "À préciser dans le brief",
      },
      {
        label: "Documents",
        value:
          files.length > 0
            ? `${files.length} fichier${files.length > 1 ? "s" : ""} prêt${files.length > 1 ? "s" : ""}`
            : "Aucun fichier",
      },
      {
        label: "Confidentialité",
        value:
          confidentiality === "standard"
            ? "Standard"
            : confidentiality === "nda_required"
              ? "NDA requis"
              : "Restreint",
      },
    ];
  }, [confidentiality, files.length, text]);

  function toggleChip(chip: string) {
    setSelectedChips((current) =>
      current.includes(chip)
        ? current.filter((c) => c !== chip)
        : [...current, chip],
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...list]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    // Combine brief text with selected chips so the action persists everything.
    const briefHeader =
      selectedChips.length > 0 ? `Types : ${selectedChips.join(", ")}\n\n` : "";
    formData.set("description", briefHeader + text);
    formData.set("confidentiality", confidentiality);
    formData.set("priority", priority);
    // If a title wasn't typed, derive one from the chips.
    if (!String(formData.get("title") ?? "").trim()) {
      const generated =
        selectedChips.length > 0
          ? `Demande ${selectedChips.slice(0, 2).join(" + ")}`
          : "Nouveau projet";
      formData.set("title", generated);
    }
    formAction(formData);
  }

  // The server action creates the project and returns its ID. We then
  // run the upload from the browser (works with the storage RLS that keys
  // on auth.uid()), and finally navigate to the project page.
  const [postCreateState, setPostCreateState] = useState<{
    handled: boolean;
    projectId?: string;
  }>({ handled: false });

  if (
    state.success &&
    state.projectId &&
    !postCreateState.handled &&
    !uploading
  ) {
    setPostCreateState({ handled: true, projectId: state.projectId });
    if (files.length > 0) {
      startUpload(async () => {
        setUploadProgress(`Téléversement de ${files.length} fichier${files.length > 1 ? "s" : ""}…`);
        await uploadProjectDocumentsClient(state.projectId!, files);
        setUploadProgress(null);
        router.push(`/client/projets/${state.projectId}`);
      });
    } else {
      router.push(`/client/projets/${state.projectId}`);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070706] text-[#f8f4ea]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,244,234,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(248,244,234,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <a
          href="/client"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#cfc6b5] transition hover:text-[#f7f3ea]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour cockpit
        </a>
        <span className="hidden text-xs uppercase tracking-[0.24em] text-[#8f8777] sm:inline">
          Nouvelle demande projet
        </span>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pb-16 pt-2 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <form
          ref={formRef}
          action={handleSubmit}
          className="rounded-[8px] border border-[#34312b] bg-[#0f0e0c]/85 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8"
        >
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Décrivez votre projet, on s'occupe de la suite.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#cfc6b5]">
            Joignez vos plans, PDF ou croquis. Notre chef de projet qualifie
            votre demande et vous assigne un architecte sous 24h ouvrées.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#cfc6b5]"
              >
                Titre court (optionnel)
              </label>
              <input
                id="title"
                name="title"
                className="block h-11 w-full rounded-[3px] border border-[#34312b] bg-[#0a0908] px-3 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#5e594d] focus:border-[#d7c6a4] focus:ring-2 focus:ring-[#d7c6a4]/30"
                placeholder="Ex. Reprise PDF d'un bureau open-space"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-[#cfc6b5]">
                Type de documents concernés
              </label>
              <div className="flex flex-wrap gap-2">
                {documentChips.map((chip) => (
                  <button
                    type="button"
                    key={chip}
                    onClick={() => toggleChip(chip)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition",
                      selectedChips.includes(chip)
                        ? "border-[#d7c6a4] bg-[#d7c6a4] text-[#171613]"
                        : "border-[#34312b] bg-[#0a0908] text-[#cfc6b5] hover:border-[#d7c6a4]/60",
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="brief"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#cfc6b5]"
              >
                Décrivez votre besoin
              </label>
              <textarea
                id="brief"
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex. PDF à reprendre, ajouter arrivées électriques, corriger cotes, livrer un DWG propre + aperçu."
                className="block w-full rounded-[3px] border border-[#34312b] bg-[#0a0908] px-3 py-3 text-sm leading-6 text-[#f7f3ea] outline-none transition placeholder:text-[#5e594d] focus:border-[#d7c6a4] focus:ring-2 focus:ring-[#d7c6a4]/30"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#cfc6b5]">
                  Confidentialité
                </label>
                <select
                  value={confidentiality}
                  onChange={(e) =>
                    setConfidentiality(
                      e.target.value as typeof confidentiality,
                    )
                  }
                  className="h-11 w-full rounded-[3px] border border-[#34312b] bg-[#0a0908] px-3 text-sm text-[#f7f3ea] outline-none focus:border-[#d7c6a4] focus:ring-2 focus:ring-[#d7c6a4]/30"
                >
                  <option value="standard">Standard</option>
                  <option value="nda_required">NDA requis</option>
                  <option value="restricted">Restreint</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#cfc6b5]">
                  Urgence
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as typeof priority)
                  }
                  className="h-11 w-full rounded-[3px] border border-[#34312b] bg-[#0a0908] px-3 text-sm text-[#f7f3ea] outline-none focus:border-[#d7c6a4] focus:ring-2 focus:ring-[#d7c6a4]/30"
                >
                  <option value="normal">Standard</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#cfc6b5]">
                Pièces jointes
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-[3px] border border-dashed border-[#34312b] bg-[#0a0908] px-4 py-6 text-sm text-[#cfc6b5] transition hover:border-[#d7c6a4] hover:text-[#f7f3ea]"
              >
                <Paperclip className="size-4" aria-hidden />
                Ajouter des fichiers (PDF, DWG, image…)
              </button>
              {files.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {files.map((file, idx) => (
                    <li
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between rounded-[3px] border border-[#34312b] bg-[#0a0908] px-3 py-2 text-xs"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-[#cfc6b5]">
                        {file.name.endsWith(".dwg") ? (
                          <FileArchive className="size-4 shrink-0 text-[#d7c6a4]" />
                        ) : (
                          <FileText className="size-4 shrink-0 text-[#d7c6a4]" />
                        )}
                        <span className="truncate">{file.name}</span>
                        <span className="ml-2 shrink-0 text-[#5e594d]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-[#8f8777] hover:text-red-300"
                      >
                        retirer
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-2 text-[11px] leading-5 text-[#5e594d]">
                Les fichiers sont stockés de manière privée et accessibles
                uniquement à l'équipe assignée à votre projet.
              </p>
            </div>

            {state.error ? (
              <p
                role="alert"
                className="rounded-[3px] border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
              >
                {state.error}
              </p>
            ) : null}

            {uploadProgress ? (
              <p
                role="status"
                className="rounded-[3px] border border-[#34312b] bg-[#0a0908] px-3 py-2 text-sm text-[#cfc6b5]"
              >
                {uploadProgress}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#8f8777]">
                Vous pourrez compléter votre projet et discuter avec le chef de
                projet dès la prochaine étape.
              </p>
              <SubmitButton disabled={uploading} />
            </div>
          </div>
        </form>

        <aside className="rounded-[8px] border border-[#34312b] bg-[#0f0e0c]/85 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c6a4]">
            <Sparkles className="size-4" aria-hidden />
            Récapitulatif intelligent
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            {summary.map((row) => (
              <div
                key={row.label}
                className="rounded-[4px] border border-[#34312b] bg-[#0a0908] p-3"
              >
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[#8f8777]">
                  {row.label}
                </dt>
                <dd className="mt-1 text-[#cfc6b5]">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t border-[#34312b] pt-5 text-xs leading-5 text-[#8f8777]">
            <p className="mb-2 flex items-center gap-1 text-[#cfc6b5]">
              <CheckCircle2 className="size-4 text-emerald-400" aria-hidden />
              Sous 24h ouvrées
            </p>
            Le chef de projet qualifie votre demande, sélectionne l'architecte
            adapté et vous propose un devis si nécessaire.
          </div>
        </aside>
      </main>
    </div>
  );
}
