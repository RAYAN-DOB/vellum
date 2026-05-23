"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, FileText, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const requestTypeOptions = [
  { label: "Creer ou reprendre un DWG", value: "Creation DWG" },
  { label: "Corriger un PDF technique", value: "Correction PDF" },
  { label: "Reprendre un plan existant", value: "Reprise technique" },
  { label: "Cadrer un brief projet", value: "Brief projet" },
  { label: "Faire reviser un livrable", value: "Revision livrable" },
] as const;

const formatOptions = ["DWG", "PDF", "PNG", "ZIP", "Autre"] as const;
const priorityOptions = ["Basse", "Normale", "Haute", "Urgente"] as const;
const confidentialityOptions = ["Standard", "NDA requis", "Restreint"] as const;
const requesterRoleOptions = [
  "Client",
  "Chef de projet",
  "Dessinateur",
  "Administrateur",
] as const;

type FormState = {
  projectName: string;
  requestType: string;
  description: string;
  expectedFormats: string[];
  priority: string;
  confidentiality: string;
  desiredDueDate: string;
  requesterRole: string;
};

const initialState: FormState = {
  projectName: "Projet demo - reprise de plans non sensibles",
  requestType: requestTypeOptions[1].value,
  description:
    "Expliquer le besoin, les contraintes et le resultat attendu sans coller de donnee client confidentielle.",
  expectedFormats: ["PDF", "DWG"],
  priority: "Normale",
  confidentiality: "NDA requis",
  desiredDueDate: "2026-06-01",
  requesterRole: "Client",
};

const controlClass =
  "h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "text-sm font-medium text-slate-700";

export function NewRequestForm() {
  const [form, setForm] = useState<FormState>(initialState);

  const previewItems = useMemo(
    () => [
      { label: "Projet", value: form.projectName },
      { label: "Type", value: form.requestType },
      { label: "Formats", value: form.expectedFormats.join(" + ") || "Aucun" },
      { label: "Priorite", value: form.priority },
      { label: "Confidentialite", value: form.confidentiality },
      { label: "Delai", value: form.desiredDueDate || "Non renseigne" },
      { label: "Demandeur", value: form.requesterRole },
    ],
    [form],
  );

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleFormat(format: string) {
    setForm((current) => {
      const expectedFormats = current.expectedFormats.includes(format)
        ? current.expectedFormats.filter((item) => item !== format)
        : [...current.expectedFormats, format];

      return { ...current, expectedFormats };
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Cadrer une demande technique</CardTitle>
          <CardDescription>
            Cette V1 montre les informations a collecter avant traitement :
            contexte projet, type de demande, formats, priorite et confidentialite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-2">
              <label className={labelClass} htmlFor="projectName">
                Nom du projet ou dossier
              </label>
              <input
                className={controlClass}
                id="projectName"
                onChange={(event) => updateField("projectName", event.target.value)}
                value={form.projectName}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <label className={labelClass} htmlFor="requestType">
                  Nature de la demande
                </label>
                <select
                  className={controlClass}
                  id="requestType"
                  onChange={(event) => updateField("requestType", event.target.value)}
                  value={form.requestType}
                >
                  {requestTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className={labelClass} htmlFor="priority">
                  Priorite percue
                </label>
                <select
                  className={controlClass}
                  id="priority"
                  onChange={(event) => updateField("priority", event.target.value)}
                  value={form.priority}
                >
                  {priorityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <label className={labelClass} htmlFor="description">
                Description du besoin
              </label>
              <textarea
                className="min-h-32 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                id="description"
                onChange={(event) => updateField("description", event.target.value)}
                value={form.description}
              />
            </div>

            <fieldset className="grid gap-3">
              <legend className={labelClass}>
                Formats de livrable attendus
              </legend>
              <div className="grid gap-2 sm:grid-cols-5">
                {formatOptions.map((format) => {
                  const checked = form.expectedFormats.includes(format);

                  return (
                    <label
                      className={cn(
                        "flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition",
                        checked
                          ? "border-slate-950 bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)]"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                      )}
                      key={format}
                    >
                      <input
                        checked={checked}
                        className="sr-only"
                        onChange={() => toggleFormat(format)}
                        type="checkbox"
                      />
                      {format}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="grid gap-2">
                <label className={labelClass} htmlFor="confidentiality">
                  Niveau de confidentialite
                </label>
                <select
                  className={controlClass}
                  id="confidentiality"
                  onChange={(event) =>
                    updateField("confidentiality", event.target.value)
                  }
                  value={form.confidentiality}
                >
                  {confidentialityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className={labelClass} htmlFor="desiredDueDate">
                  Date souhaitee
                </label>
                <input
                  className={controlClass}
                  id="desiredDueDate"
                  onChange={(event) =>
                    updateField("desiredDueDate", event.target.value)
                  }
                  type="date"
                  value={form.desiredDueDate}
                />
              </div>

              <div className="grid gap-2">
                <label className={labelClass} htmlFor="requesterRole">
                  Profil du demandeur
                </label>
                <select
                  className={controlClass}
                  id="requesterRole"
                  onChange={(event) =>
                    updateField("requesterRole", event.target.value)
                  }
                  value={form.requesterRole}
                >
                  {requesterRoleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle
                  className="mt-0.5 size-5 shrink-0 text-amber-700"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-amber-950">
                    Aucun upload reel dans le MVP
                  </p>
                  <p className="mt-1 text-sm leading-6 text-amber-900">
                    Cette V1 n&apos;accepte aucun vrai DWG, PDF, plan, croquis ou
                    document projet. L&apos;upload devra etre ajoute en V2 avec
                    stockage prive, droits serveur, liens non publics et journal
                    d&apos;acces.
                  </p>
                </div>
              </div>
            </div>

            <Button type="button">
              Mettre a jour le recapitulatif
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:self-start">
        <Card className="technical-grid-dark overflow-hidden bg-slate-950 text-white">
          <CardHeader>
            <div className="flex size-11 items-center justify-center rounded-md bg-white text-slate-950">
              <FileText className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="text-white">Recapitulatif de demo</CardTitle>
            <CardDescription className="text-slate-300">
              Apercu local uniquement : rien n&apos;est envoye, sauvegarde ou
              securise.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {previewItems.map((item) => (
              <div
                className="rounded-md border border-white/10 bg-white/[0.07] p-3 backdrop-blur"
                key={item.label}
              >
                <p className="text-xs uppercase tracking-normal text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 p-5">
            <div className="flex items-center gap-3">
              <ShieldAlert className="size-5 text-blue-700" aria-hidden="true" />
              <p className="text-sm font-semibold text-neutral-950">
                Droits a construire en V2
              </p>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Les champs de role et confidentialite preparent le modele cible.
              Ils ne remplacent pas des permissions serveur.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge tone="blue">Role</Badge>
              <Badge tone="amber">Projet</Badge>
              <Badge tone="green">NDA</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex gap-3 p-5">
            <CalendarDays
              className="mt-0.5 size-5 shrink-0 text-slate-500"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-slate-600">
              La date souhaitee aide a comprendre la priorite, mais aucun SLA ni
              workflow de validation reel n&apos;est actif dans cette V1.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
