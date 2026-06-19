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
  Sparkles,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  { label: "Détails", title: "Précisez les livrables et le délai." },
  { label: "Envoi", title: "Votre dossier est prêt." },
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
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
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

  const lastStep = steps.length - 1;

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
      contactName: "",
      email: "",
      files,
      createdAt: new Date().toISOString(),
    }),
    [
      deadline,
      deliverable,
      description,
      files,
      needs3d,
      notes,
      projectType,
      urgency,
      workMode,
    ],
  );

  // The account is NEVER required up front. As soon as the client reaches the
  // final step, the draft is persisted locally so they can create their space
  // (or sign in) in one click — the project is created from the draft inside
  // the authenticated workspace.
  useEffect(() => {
    if (step === lastStep) {
      window.localStorage.setItem(
        PUBLIC_PROJECT_DRAFT_KEY,
        JSON.stringify(draft),
      );
    }
  }, [step, lastStep, draft]);

  const canContinue =
    step === 1 ? description.trim().length >= 20 : true;

  function goTo(target: number) {
    setDirection(target > step ? 1 : -1);
    setStep(Math.max(0, Math.min(target, lastStep)));
  }

  function next() {
    if (step < lastStep) goTo(step + 1);
  }

  function back() {
    if (step > 0) goTo(step - 1);
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
  const progress = (step / lastStep) * 100;

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir * 28,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir * -28,
    }),
  };

  return (
    <section className="relative overflow-hidden bg-[#151410] text-[#fbfaf6]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper-dense opacity-55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_18%_-10%,rgba(159,79,56,0.28),transparent_42%)]"
      />
      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-8 px-6 pb-16 pt-32 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-10 lg:pt-36">
        <div className="min-w-0">
          {/* Progress line */}
          <div className="mb-6 h-px w-full overflow-hidden bg-[#3b352e]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#9f4f38] to-[#b46a4c]"
              initial={false}
              animate={{ width: `${Math.max(progress, 4)}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-2">
            {steps.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition",
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
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0 : 0.32, ease: "easeOut" }}
                >
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
                              "min-h-20 cursor-pointer rounded-[4px] border p-4 text-left transition",
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
                          autoFocus
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
                          className="flex min-h-44 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[6px] border border-dashed border-[#4c4339] bg-[#100f0d] px-6 text-center transition hover:border-[#b46a4c] hover:bg-[#201d18]"
                        >
                          <Paperclip className="size-7 text-[#b46a4c]" aria-hidden="true" />
                          <span className="font-display text-2xl text-[#fbfaf6]">
                            Ajouter PDF, DWG, images, croquis ou notes
                          </span>
                          <span className="max-w-md text-[13px] leading-5 text-[#b9ad9d]">
                            Optionnel à cette étape. Les fichiers seront joints en
                            sécurité dans votre espace — Vellum garde la liste de
                            ce que vous voulez transmettre.
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
                                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#9b9183] transition hover:bg-[#2a251f] hover:text-[#e8b4a1]"
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
                            className="mt-3 h-12 w-full cursor-pointer rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
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
                            <span className="caption">Niveau d&apos;urgence</span>
                            <select
                              value={urgency}
                              onChange={(event) =>
                                setUrgency(
                                  event.target.value as PublicProjectDraft["urgency"],
                                )
                              }
                              className="mt-3 h-12 w-full cursor-pointer rounded-[4px] border border-[#3b352e] bg-[#100f0d] px-4 text-sm text-[#fbfaf6] outline-none focus:border-[#b46a4c] focus:ring-2 focus:ring-[#b46a4c]/20"
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
                                  : "À joindre dans votre espace"
                              }
                            />
                            <Summary
                              label="Délai"
                              value={deadline || "À définir ensemble"}
                            />
                          </dl>
                        </div>

                        <div className="rounded-[6px] border border-[#9f4f38]/35 bg-[#9f4f38]/10 p-5">
                          <p className="caption flex items-center gap-2 text-[#e8b4a1]">
                            <Sparkles className="size-3.5" aria-hidden="true" />
                            Dernière étape
                          </p>
                          <h2 className="mt-3 font-display text-2xl text-[#fbfaf6]">
                            Créez votre espace pour envoyer ce dossier, échanger
                            avec le dessinateur, recevoir les aperçus et
                            télécharger les livrables.
                          </h2>
                          <p className="mt-3 flex items-center gap-2 text-[13px] leading-6 text-[#d8d0bf]">
                            <CheckCircle2 className="size-4 shrink-0 text-[#8ba07d]" aria-hidden="true" />
                            Votre brouillon est conservé dans ce navigateur et
                            repris automatiquement après connexion.
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <a
                            href={`${routes.public.register}?redirect=${authRedirect}`}
                            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9f4f38] px-6 text-sm font-medium text-[#fbfaf6] transition hover:bg-[#7b3828]"
                          >
                            Créer mon espace et envoyer
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </a>
                          <a
                            href={`${routes.public.login}?redirect=${authRedirect}`}
                            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-[#4c4339] px-6 text-sm font-medium text-[#d8d0bf] transition hover:border-[#b46a4c] hover:text-[#fbfaf6]"
                          >
                            J&apos;ai déjà un compte
                          </a>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex items-center justify-between gap-3 border-t border-[#3b352e] pt-6">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#4c4339] px-5 text-sm font-medium text-[#d8d0bf] transition hover:border-[#b46a4c] hover:text-[#fbfaf6] disabled:pointer-events-none disabled:opacity-35"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Retour
                </button>
                {step < lastStep ? (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canContinue}
                    className="group inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9f4f38] px-6 text-sm font-medium text-[#fbfaf6] transition hover:bg-[#7b3828] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Continuer
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 text-[12px] font-medium text-[#8ba07d]">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    Brouillon enregistré
                  </span>
                )}
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
                Commencez maintenant. Le compte n&apos;est demandé qu&apos;à
                l&apos;envoi.
              </p>
              <p className="mt-3 text-[13px] leading-6 text-paper/65">
                Aucune friction : préparez votre demande librement. Les fichiers
                réels seront ajoutés dans votre espace sécurisé après connexion.
              </p>

              <dl className="mt-5 grid gap-2 border-t border-paper/10 pt-4 text-[13px]">
                <MiniRow label="Besoin" value={projectType} />
                <MiniRow label="Livrable" value={deliverable} />
                <MiniRow
                  label="Pièces"
                  value={files.length > 0 ? `${files.length} listée${files.length > 1 ? "s" : ""}` : "—"}
                />
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="caption text-paper/45">{label}</dt>
      <dd className="truncate text-right text-paper/85">{value}</dd>
    </div>
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
        "flex min-h-16 cursor-pointer items-center justify-between gap-3 rounded-[4px] border p-4 text-left transition",
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
