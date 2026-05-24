"use client";

import { ArrowUpRight, Loader2, ShieldCheck, UserCheck } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { StatusPill } from "@/components/ui/StatusPill";
import {
  assignProjectAction,
  updateProjectStatusAction,
} from "@/lib/actions/projects";
import {
  confidentialityLabels,
  projectStatusLabels,
  projectStatusTone,
  type ProjectListItem,
} from "@/lib/project-display";
import type { ProfileRow, ProjectStatus } from "@/types/database";

type Props = {
  projects: ProjectListItem[];
  architects: Pick<ProfileRow, "id" | "full_name" | "email">[];
};

const initialState = {} as { error?: string; success?: string };

function StatusUpdater({
  projectId,
  current,
}: {
  projectId: string;
  current: ProjectStatus;
}) {
  const [state, formAction] = useActionState(
    updateProjectStatusAction,
    initialState,
  );
  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="project_id" value={projectId} />
      <select
        name="status"
        defaultValue={current}
        className="h-9 rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-xs"
      >
        {Object.entries(projectStatusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <StatusSubmit />
      {state.error ? (
        <span className="text-xs text-red-600">{state.error}</span>
      ) : null}
    </form>
  );
}

function StatusSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-1 rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-xs font-medium hover:bg-[#f0eadf] disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-3 animate-spin" /> : null}
      OK
    </button>
  );
}

function Assigner({
  projectId,
  architects,
  current,
}: {
  projectId: string;
  architects: Props["architects"];
  current?: string | null;
}) {
  const [state, formAction] = useActionState(assignProjectAction, initialState);
  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="project_id" value={projectId} />
      <select
        name="architect_id"
        defaultValue={current ?? ""}
        className="h-9 rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-xs"
        required
      >
        <option value="" disabled>
          Architecte…
        </option>
        {architects.map((a) => (
          <option key={a.id} value={a.id}>
            {a.full_name ?? a.email}
          </option>
        ))}
      </select>
      <AssignSubmit />
      {state.error ? (
        <span className="text-xs text-red-600">{state.error}</span>
      ) : null}
    </form>
  );
}

function AssignSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-1 rounded-[3px] bg-[#171613] px-3 text-xs font-medium text-[#f7f3ea] hover:bg-[#2b2923] disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <UserCheck className="size-3" />
      )}
      Assigner
    </button>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

export function ManagerCockpit({ projects, architects }: Props) {
  const intake = projects.filter((p) => p.status === "intake");
  const qualified = projects.filter((p) =>
    ["qualified", "assigned"].includes(p.status),
  );
  const inProgress = projects.filter((p) =>
    ["in_progress", "review"].includes(p.status),
  );
  const delivered = projects.filter((p) =>
    ["delivered", "archived"].includes(p.status),
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-4">
        <Stat label="À qualifier" value={intake.length} tone="amber" />
        <Stat label="Qualifiés / assignés" value={qualified.length} tone="blue" />
        <Stat label="En production / revue" value={inProgress.length} tone="violet" />
        <Stat label="Livrés / archivés" value={delivered.length} tone="green" />
      </section>

      <Group title="Nouvelles demandes à qualifier" items={intake}>
        {(p) => (
          <div className="space-y-2">
            <StatusUpdater projectId={p.id} current={p.status} />
            <p className="text-xs text-[#6b665a]">
              Client : {p.client?.full_name ?? p.client?.email ?? "—"}
              {p.client?.company ? ` · ${p.client.company}` : ""}
            </p>
          </div>
        )}
      </Group>

      <Group title="Projets prêts à assigner" items={qualified}>
        {(p) => (
          <div className="space-y-2">
            <Assigner
              projectId={p.id}
              architects={architects}
              current={p.architect_id}
            />
            {p.architect?.full_name ? (
              <p className="text-xs text-[#6b665a]">
                Architecte actuel : {p.architect.full_name}
              </p>
            ) : null}
          </div>
        )}
      </Group>

      <Group title="Production en cours" items={inProgress}>
        {(p) => (
          <div className="space-y-2">
            <StatusUpdater projectId={p.id} current={p.status} />
            <p className="text-xs text-[#6b665a]">
              {p.architect?.full_name ?? "Aucun architecte"}
              {p.expected_delivery_date
                ? ` · livraison ${formatDate(p.expected_delivery_date)}`
                : ""}
            </p>
          </div>
        )}
      </Group>

      <Group title="Livrés & archivés" items={delivered} collapsedByDefault>
        {(p) => (
          <p className="text-xs text-[#6b665a]">
            Livré le {formatDate(p.updated_at)} ·{" "}
            {p.architect?.full_name ?? "—"}
          </p>
        )}
      </Group>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "blue" | "violet" | "green";
}) {
  return (
    <div className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[#8a7a5f]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#171613]">{value}</p>
      <StatusPill tone={tone} className="mt-1">
        {tone === "amber"
          ? "Action requise"
          : tone === "blue"
            ? "À assigner"
            : tone === "violet"
              ? "En cours"
              : "Clôturé"}
      </StatusPill>
    </div>
  );
}

function Group({
  title,
  items,
  children,
  collapsedByDefault = false,
}: {
  title: string;
  items: ProjectListItem[];
  children: (project: ProjectListItem) => React.ReactNode;
  collapsedByDefault?: boolean;
}) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
        {title} <span className="text-[#6b665a]">· {items.length}</span>
      </h3>
      {items.length === 0 ? (
        <p className="rounded-[4px] border border-dashed border-[#d8d0bf] bg-white/70 p-4 text-xs text-[#6b665a]">
          Aucun projet dans cette colonne.
        </p>
      ) : (
        <ul className="space-y-2">
          {(collapsedByDefault ? items.slice(0, 3) : items).map((p) => (
            <li
              key={p.id}
              className="rounded-[4px] border border-[#d8d0bf] bg-white/95 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b665a]">
                    <span className="font-mono">{p.reference}</span>
                    <StatusPill tone={projectStatusTone[p.status]}>
                      {projectStatusLabels[p.status]}
                    </StatusPill>
                    <StatusPill
                      tone={
                        p.confidentiality === "restricted"
                          ? "red"
                          : p.confidentiality === "nda_required"
                            ? "amber"
                            : "neutral"
                      }
                    >
                      <ShieldCheck className="size-3" aria-hidden />
                      {confidentialityLabels[p.confidentiality]}
                    </StatusPill>
                  </div>
                  <p className="mt-1.5 font-medium text-[#171613]">{p.title}</p>
                </div>
                <a
                  href={`/client/projets/${p.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#171613] hover:underline"
                >
                  Ouvrir
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
              <div className="mt-3">{children(p)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
