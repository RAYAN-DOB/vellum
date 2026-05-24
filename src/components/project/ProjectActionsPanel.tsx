"use client";

import { Loader2, ReceiptText, Sparkles } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { StatusPill } from "@/components/ui/StatusPill";
import { updateProjectStatusAction } from "@/lib/actions/projects";
import {
  projectStatusLabels,
  projectStatusTone,
} from "@/lib/project-display";
import { routes } from "@/lib/routes";
import type { ProjectLite } from "@/components/project/project-detail-types";
import type { ProjectStatus } from "@/types/database";

const initialState = {} as { error?: string; success?: string };

const nextActionByStatus: Record<ProjectStatus, string> = {
  draft: "Compléter le brief avant transmission.",
  intake: "Le manager qualifie la demande et confirme le scope.",
  qualified: "Préparer le devis ou assigner le studio.",
  assigned: "Le studio analyse les documents et prépare les questions.",
  in_progress: "Production en cours, prochain jalon: aperçu client.",
  review: "Le client valide l'aperçu ou demande une correction.",
  delivered: "Livrables publiés, dossier prêt à archiver.",
  archived: "Historique conservé dans l'audit.",
  cancelled: "Dossier interrompu.",
};

function StatusSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[3px] bg-ink px-3 text-xs font-medium text-paper transition hover:bg-iron-hover disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? <Loader2 className="size-3 animate-spin" /> : null}
      Mettre à jour
    </button>
  );
}

export function ProjectActionsPanel({
  project,
  currentUserRole,
}: {
  project: ProjectLite;
  currentUserRole: string;
}) {
  const [state, formAction] = useActionState(
    updateProjectStatusAction,
    initialState,
  );
  const canUpdate = ["manager", "admin", "architect"].includes(currentUserRole);

  return (
    <aside className="space-y-4">
      <section className="rounded-[4px] border border-line bg-vellum/45 p-5">
        <p className="caption flex items-center gap-2">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Prochaine action
        </p>
        <p className="mt-3 text-sm leading-6 text-ink">
          {nextActionByStatus[project.status]}
        </p>
        <div className="mt-4">
          <StatusPill tone={projectStatusTone[project.status]}>
            {projectStatusLabels[project.status]}
          </StatusPill>
        </div>
      </section>

      {canUpdate ? (
        <section className="rounded-[4px] border border-line bg-paper p-5">
          <p className="caption">Pilotage</p>
          <form action={formAction} className="mt-4 space-y-3">
            <input type="hidden" name="project_id" value={project.id} />
            <label className="block">
              <span className="mb-1.5 block text-xs text-mute">
                Statut du dossier
              </span>
              <select
                className="h-10 w-full rounded-[3px] border border-line-strong bg-paper px-3 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                defaultValue={project.status}
                name="status"
              >
                {Object.entries(projectStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <StatusSubmit />
            {state.error ? (
              <p className="text-xs text-crimson">{state.error}</p>
            ) : null}
            {state.success ? (
              <p className="text-xs text-moss">{state.success}</p>
            ) : null}
          </form>
        </section>
      ) : null}

      <section className="rounded-[4px] border border-line bg-paper p-5">
        <p className="caption flex items-center gap-2">
          <ReceiptText className="size-3.5" aria-hidden="true" />
          Devis & livraison
        </p>
        <p className="mt-3 text-sm leading-6 text-graphite">
          Les devis et paiements restent contrôlés côté serveur. Le paiement en
          ligne sera activé en V2 après validation du workflow.
        </p>
        <a
          className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-line-strong px-4 text-xs font-medium text-ink transition hover:border-ink"
          href={routes.manager.quotes}
        >
          Ouvrir les devis
        </a>
      </section>
    </aside>
  );
}
