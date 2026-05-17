"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, FileText, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const requestTypeOptions = [
  { label: "Creation DWG fictive", value: "Creation DWG" },
  { label: "Correction PDF fictive", value: "Correction PDF" },
  { label: "Reprise technique", value: "Reprise technique" },
  { label: "Brief projet", value: "Brief projet" },
  { label: "Revision de livrable", value: "Revision livrable" },
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
  projectName: "Projet demo - reprise de plans fictifs",
  requestType: requestTypeOptions[1].value,
  description:
    "Decrire ici le besoin sans joindre de document client reel ni information confidentielle.",
  expectedFormats: ["PDF", "DWG"],
  priority: "Normale",
  confidentiality: "NDA requis",
  desiredDueDate: "2026-06-01",
  requesterRole: "Client",
};

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
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle demande mockee</CardTitle>
          <CardDescription>
            Formulaire front uniquement : aucune sauvegarde, aucun upload, aucun
            controle serveur dans cette version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="projectName">
                Nom du projet
              </label>
              <input
                className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                id="projectName"
                onChange={(event) => updateField("projectName", event.target.value)}
                value={form.projectName}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="requestType">
                  Type de demande
                </label>
                <select
                  className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                <label className="text-sm font-medium text-neutral-700" htmlFor="priority">
                  Priorite
                </label>
                <select
                  className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              <label className="text-sm font-medium text-neutral-700" htmlFor="description">
                Description
              </label>
              <textarea
                className="min-h-32 rounded-md border border-neutral-300 bg-white px-3 py-3 text-sm leading-6 text-neutral-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                id="description"
                onChange={(event) => updateField("description", event.target.value)}
                value={form.description}
              />
            </div>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium text-neutral-700">
                Formats attendus
              </legend>
              <div className="grid gap-2 sm:grid-cols-5">
                {formatOptions.map((format) => {
                  const checked = form.expectedFormats.includes(format);

                  return (
                    <label
                      className={cn(
                        "flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition",
                        checked
                          ? "border-neutral-950 bg-neutral-950 text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
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
                <label className="text-sm font-medium text-neutral-700" htmlFor="confidentiality">
                  Confidentialite
                </label>
                <select
                  className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                <label className="text-sm font-medium text-neutral-700" htmlFor="desiredDueDate">
                  Delai souhaite
                </label>
                <input
                  className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  id="desiredDueDate"
                  onChange={(event) =>
                    updateField("desiredDueDate", event.target.value)
                  }
                  type="date"
                  value={form.desiredDueDate}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="requesterRole">
                  Role du demandeur
                </label>
                <select
                  className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                    Les vrais DWG, PDF, plans, croquis ou documents confidentiels
                    ne sont pas acceptes dans cette version. Le futur upload devra
                    passer par des controles serveur, des droits projet et une
                    journalisation.
                  </p>
                </div>
              </div>
            </div>

            <button
              className="inline-flex h-11 items-center justify-center rounded-md bg-neutral-950 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
              type="button"
            >
              Simulation locale uniquement
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:self-start">
        <Card className="bg-neutral-950 text-white">
          <CardHeader>
            <div className="flex size-11 items-center justify-center rounded-md bg-white text-neutral-950">
              <FileText className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="text-white">Apercu de la demande</CardTitle>
            <CardDescription className="text-neutral-300">
              Recapitulatif genere cote navigateur, sans sauvegarde.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {previewItems.map((item) => (
              <div
                className="rounded-md border border-white/10 bg-white/[0.06] p-3"
                key={item.label}
              >
                <p className="text-xs uppercase tracking-normal text-neutral-400">
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
                Permissions futures
              </p>
            </div>
            <p className="text-sm leading-6 text-neutral-600">
              Ce formulaire prepare les champs utiles, mais ne prouve aucune
              securite. Les futures actions serveur devront verifier le role, le
              projet, l&apos;organisation et la confidentialite.
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
              className="mt-0.5 size-5 shrink-0 text-neutral-500"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-neutral-600">
              Le delai souhaite est indicatif. Aucun workflow de validation ou
              SLA reel n&apos;est active dans cette version.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
