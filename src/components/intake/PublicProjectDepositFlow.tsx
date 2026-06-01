"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileArchive,
  FileText,
  Image as ImageIcon,
  Paperclip,
  PenTool,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  PUBLIC_PROJECT_DRAFT_KEY,
  type PublicDraftFile,
  type PublicProjectDraft,
} from "@/lib/intake-draft";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Besoin", title: "Quel type de travail faut-il préparer ?" },
  { label: "Description", title: "Expliquez ce que vous voulez obtenir." },
  { label: "Fichiers", title: "Ajoutez les pièces disponibles." },
  { label: "Attentes", title: "Précisez les livrables et le délai." },
  { label: "Coordonnées", title: "Où l'équipe peut-elle vous répondre ?" },
  { label: "Confirmation", title: "Votre dossier est prêt à être envoyé." },
] as const;

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

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function iconForFile(file: PublicDraftFile) {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".dwg") || lower.endsWith(".dxf")) return FileArchive;
  if (file.type.startsWith("image/")) return ImageIcon;
  return FileText;
}

export function PublicProjectDepositFlow() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [projectType, setProjectType] = useState<string>(needTypes[0]);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<PublicDraftFile[]>([]);
  const [deliverable, setDeliverable] = useState<string>(deliverables[0]);
  const [deadline, setDeadline] = useState("");
  const [urgency, setUrgency] = useState<PublicProjectDraft["urgency"]>("normal");
  const [notes, setNotes] = useState("");
  const [needs3d, setNeeds3d] = useState(false);
  const [workMode, setWorkMode] =
    useState<PublicProjectDraft["workMode"]>("correction");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(PUBLIC_PROJECT_DRAFT_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as PublicProjectDraft;
      queueMicrotask(() => {
        setProjectType(draft.projectType || needTypes[0]);
        setDescription(draft.description || "");
        setFiles(draft.files || []);
        setDeliverable(draft.deliverable || deliverables[0]);
        setDeadline(draft.deadline || "");
        setUrgency(draft.urgency || "normal");
        setNotes(draft.notes || "");
        setNeeds3d(Boolean(draft.needs3d));
        setWorkMode(draft.workMode || "correction");
        setContactName(draft.contactName || "");
        setEmail(draft.email || "");
        setPhone(draft.phone || "");
        setCompany(draft.company || "");
      });
    } catch {
      window.localStorage.removeItem(PUBLIC_PROJECT_DRAFT_KEY);
    }
  }, []);

  const draft = useMemo<PublicProjectDraft>(
    () => ({
      projectType,
      title: `${projectType} - ${deliverable}`,
      description,
      deliverable,
      deadline,
      urgency,
      notes,
      needs3d,
      workMode,
      contactName,
      email,
      phone,
      company,
      files,
      createdAt: new Date().toISOString(),
    }),
    [
      company,
      contactName,
      deadline,
      deliverable,
      description,
      email,
      files,
      needs3d,
      notes,
      phone,
      projectType,
      urgency,
      workMode,
    ],
  );

  const canContinue =
    step === 0
      ? Boolean(projectType)
      : step === 1
        ? description.trim().length >= 20
        : step === 4
          ? Boolean(contactName.trim()) && /\S+@\S+\.\S+/.test(email)
          : true;

  function persistDraft() {
    window.localStorage.setItem(PUBLIC_PROJECT_DRAFT_KEY, JSON.stringify(draft));
    setSaved(true);
  }

  function next() {
    if (step === steps.length - 1) {
      persistDraft();
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setSaved(false);
    setStep((current) => Math.max(current - 1, 0));
  }

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    event.target.value = "";
    setFiles((current) => [...current, ...selected]);
  }

  const authRedirect = encodeURIComponent(routes.client.newProject);

  return (
    <section className="relative overflow-hidden bg-[#151410] text-[#fbfaf6]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper-dense opacity-55"
      />
      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-8 px-6 pb-16 pt-32 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-10 lg:pt-36">
        <div className="min-w-0">
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {steps.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setStep(index)}
                  className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition",
                  index === step
                    ? "border-[#b46a4c] bg-[#9f4f38] text-[#fbfaf6]"
                    : index < step
                      ? "border-[#5f6f55]/40 bg-[#5f6f55]/12 text-[#cbd4c2]"
                      : "border-[#3b352e] bg-[#1c1a16] text-[#b9ad9d] hover:border-[#746d62] hover:text-[#fbfaf6]",
                )}
              >
                {index < step ? (
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                ) : (
                  <span className="font-mono">{index + 1}</span>
                )}
                {item.label}
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-[8px] border border-[#3b352e] bg-[#1c1a16]/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.36)] backdrop-blur sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid-paper opacity-35"
            />
            <div className="relative">
              <h1 className="display max-w-3xl text-[clamp(2.2rem,5.5vw,4.25rem)] text-[#fbfaf6]">
                {steps[step].title}
              </h1>

              <div className="mt-8">
                {step === 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {needTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setProjectType(type)}
                        className={cn(
                          "min-h-20 rounded-[4px] border p-4 text-left transition",
                          projectType === type
                            ? "border-[#b46a4c] bg-[#9f4f38] text-[#fbfaf6]"
                            : "border-[#3b352e] bg-[#100f0d] text-[#d8d0bf] hover:border-[#746d62] hover:bg-[#201d18]",
                        )}
                      >
                        <span className="text-[15px] font-semibold">{type}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {step === 1 ? (
                  <label className="block">
                    <span className="caption">Description du projet</span>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={9}
                      className="mt-3 block w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 py-3 text-[15px] leading-7 text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                      placeholder="Expliquez ce que vous voulez obtenir, les contraintes, les corrections à faire, les dimensions connues, les fichiers disponibles."
                    />
                    <span className="mt-2 block text-[12px] text-[#b9ad9d]">
                      Quelques lignes suffisent. Vous pourrez compléter après
                      échange avec le dessinateur.
                    </span>
                  </label>
                ) : null}

                {step === 2 ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.dwg,.dxf,image/*,.txt,.doc,.docx"
                      className="hidden"
                      onChange={handleFiles}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex min-h-44 w-full flex-col items-center justify-center gap-3 rounded-[6px] border border-dashed border-[#4c4339] bg-[#100f0d] px-6 text-center transition hover:border-[#b46a4c] hover:bg-[#201d18]"
                    >
                      <Paperclip className="size-7 text-[#b46a4c]" aria-hidden="true" />
                      <span className="font-display text-2xl text-[#fbfaf6]">
                        Ajouter PDF, DWG, images, croquis ou notes
                      </span>
                      <span className="max-w-md text-[13px] leading-5 text-[#b9ad9d]">
                        Les fichiers seront joints après création de votre
                        espace. Pour l'instant, Vellum garde la liste de ce que
                        vous voulez transmettre.
                      </span>
                    </button>

                    {files.length > 0 ? (
                      <ul className="mt-4 grid gap-2">
                        {files.map((file, index) => {
                          const Icon = iconForFile(file);
                          return (
                            <li
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between gap-3 rounded-[4px] border border-[#3b352e] bg-[#100f0d] p-3"
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <Icon
                                  className="size-4 shrink-0 text-[#b46a4c]"
                                  aria-hidden="true"
                                />
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-medium text-[#fbfaf6]">
                                    {file.name}
                                  </span>
                                  <span className="text-[11px] text-[#9b9183]">
                                    {formatBytes(file.size)}
                                  </span>
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setFiles((current) =>
                                    current.filter((_, itemIndex) => itemIndex !== index),
                                  )
                                }
                                className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#9b9183] transition hover:bg-[#2a251f] hover:text-[#e8b4a1]"
                                aria-label={`Retirer ${file.name}`}
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="grid gap-5">
                    <label className="block">
                      <span className="caption">Livrable attendu</span>
                      <select
                        value={deliverable}
                        onChange={(event) => setDeliverable(event.target.value)}
                        className="mt-3 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                      >
                        {deliverables.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="caption">Délai souhaité</span>
                        <input
                          value={deadline}
                          onChange={(event) => setDeadline(event.target.value)}
                          className="mt-3 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                          placeholder="Ex. fin de semaine, 10 jours, urgent"
                        />
                      </label>
                      <label className="block">
                        <span className="caption">Niveau d'urgence</span>
                        <select
                          value={urgency}
                          onChange={(event) =>
                            setUrgency(
                              event.target.value as PublicProjectDraft["urgency"],
                            )
                          }
                          className="mt-3 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                        >
                          <option value="normal">Standard</option>
                          <option value="high">Élevé</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <ToggleCard
                        active={needs3d}
                        label="Besoin d'un aperçu 3D"
                        onClick={() => setNeeds3d((value) => !value)}
                      />
                      <ToggleCard
                        active={workMode === "creation"}
                        label="Création complète"
                        onClick={() =>
                          setWorkMode((value) =>
                            value === "creation" ? "correction" : "creation",
                          )
                        }
                      />
                    </div>

                    <label className="block">
                      <span className="caption">Remarques</span>
                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        rows={4}
                        className="mt-3 block w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 py-3 text-sm leading-6 text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                        placeholder="Contraintes, formats finaux, pièces manquantes, précisions utiles."
                      />
                    </label>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="caption">Nom</span>
                        <input
                          value={contactName}
                          onChange={(event) => setContactName(event.target.value)}
                          className="mt-3 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                          placeholder="Prénom Nom"
                        />
                      </label>
                      <label className="block">
                        <span className="caption">Email</span>
                        <input
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          type="email"
                          className="mt-3 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                          placeholder="vous@entreprise.com"
                        />
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="caption">Téléphone optionnel</span>
                        <input
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          className="mt-3 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                          placeholder="+33..."
                        />
                      </label>
                      <label className="block">
                        <span className="caption">Entreprise optionnelle</span>
                        <input
                          value={company}
                          onChange={(event) => setCompany(event.target.value)}
                          className="mt-3 h-12 w-full rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none transition placeholder:text-[#746d62] focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
                          placeholder="Atelier ou société"
                        />
                      </label>
                    </div>
                  </div>
                ) : null}

                {step === 5 ? (
                  <div className="grid gap-5">
                    <div className="rounded-[6px] border border-[#3b352e] bg-[#100f0d] p-5">
                      <p className="caption">Récapitulatif</p>
                      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <Summary label="Besoin" value={projectType} />
                        <Summary label="Livrable" value={deliverable} />
                        <Summary
                          label="Fichiers"
                          value={
                            files.length > 0
                              ? `${files.length} pièce${files.length > 1 ? "s" : ""} à joindre`
                              : "À joindre après connexion"
                          }
                        />
                        <Summary
                          label="Contact"
                          value={contactName || "À renseigner"}
                        />
                      </dl>
                    </div>

                    <div className="rounded-[6px] border border-[#9f4f38]/35 bg-[#9f4f38]/10 p-5">
                      <h2 className="font-display text-2xl text-[#fbfaf6]">
                        Créez votre espace pour envoyer ce projet, échanger avec
                        le dessinateur, recevoir les aperçus et télécharger les
                        livrables.
                      </h2>
                      <p className="mt-3 text-[14px] leading-6 text-[#d8d0bf]">
                        Votre brouillon est conservé dans ce navigateur. Après
                        inscription ou connexion, il sera repris dans l'espace
                        client pour créer le projet réel.
                      </p>
                    </div>

                    {saved ? (
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                          href={`${routes.public.register}?redirect=${authRedirect}`}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#9f4f38] px-6 text-sm font-medium text-[#fbfaf6] transition hover:bg-[#7b3828]"
                        >
                          Créer mon espace
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </a>
                        <a
                          href={`${routes.public.login}?redirect=${authRedirect}`}
                          className="inline-flex h-12 items-center justify-center rounded-full border border-[#4c4339] px-6 text-sm font-medium text-[#d8d0bf] transition hover:border-[#b46a4c] hover:text-[#fbfaf6]"
                        >
                          J'ai déjà un compte
                        </a>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mt-10 flex flex-col gap-3 border-t border-[#3b352e] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#4c4339] px-5 text-sm font-medium text-[#d8d0bf] transition hover:border-[#b46a4c] hover:text-[#fbfaf6] disabled:pointer-events-none disabled:opacity-35"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!canContinue}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#9f4f38] px-6 text-sm font-medium text-[#fbfaf6] transition hover:bg-[#7b3828] disabled:pointer-events-none disabled:opacity-50"
                >
                  {step === steps.length - 1
                    ? saved
                      ? "Brouillon enregistré"
                      : "Enregistrer le brouillon"
                    : "Continuer"}
                  {saved && step === steps.length - 1 ? (
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="relative min-w-0 lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[6px] border border-line-strong bg-ink text-paper shadow-[0_28px_70px_rgba(13,13,12,0.2)]">
            <div className="relative h-64 border-b border-paper/10 bg-paper">
              <Image
                src="/technical-plans/vellum-plan-architecture.svg"
                alt="Plan technique Vellum"
                fill
                className="object-cover p-4"
                sizes="390px"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-sienna px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-paper">
                dossier brouillon
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-paper/70">
                <PenTool className="size-4 text-sienna" aria-hidden="true" />
                <span className="caption text-paper/55">Parcours guidé</span>
              </div>
              <p className="mt-4 font-display text-2xl leading-tight text-paper">
                Commencez maintenant. Le compte n'est demandé qu'à l'envoi.
              </p>
              <p className="mt-3 text-[13px] leading-6 text-paper/65">
                Vous pouvez préparer votre demande sans friction. Les fichiers
                réels seront ajoutés dans votre espace sécurisé après connexion.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ToggleCard({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-16 items-center justify-between gap-3 rounded-[4px] border p-4 text-left transition",
        active
          ? "border-[#b46a4c] bg-[#9f4f38] text-[#fbfaf6]"
          : "border-[#3b352e] bg-[#100f0d] text-[#d8d0bf] hover:border-[#746d62]",
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border",
          active
            ? "border-[#fbfaf6] text-[#fbfaf6]"
            : "border-[#746d62] text-transparent",
        )}
      >
        <CheckCircle2 className="size-4" aria-hidden="true" />
      </span>
    </button>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="caption">{label}</dt>
      <dd className="mt-1 text-[#fbfaf6]">{value}</dd>
    </div>
  );
}
