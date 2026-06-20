"use client";

import { ArrowUpRight, Loader2, ShieldCheck, UserCheck } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
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
import { routes } from "@/lib/routes";
import type { ProfileRow, ProjectStatus } from "@/types/database";

type Props = {
  projects: ProjectListItem[];
  architects: Pick<ProfileRow, "id" | "full_name" | "email">[];
};

const initialState = {} as { error?: string; success?: string };

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
    <div className="space-y-12">
      {/* Pipeline metrics */}
      <section className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-4">
        <Stat label="À qualifier" value={intake.length} accent="amber" />
        <Stat label="Qualifiés / assignés" value={qualified.length} accent="ink" />
        <Stat label="En production / revue" value={inProgress.length} accent="ink" />
        <Stat label="Livrés / archivés" value={delivered.length} accent="moss" />
      </section>

      <Group title="Nouvelles demandes à qualifier" items={intake}>
        {(p) => (
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <p className="text-[12px] text-mute">
              Client : {p.client?.full_name ?? p.client?.email ?? "—"}
              {p.client?.company ? ` · ${p.client.company}` : ""}
            </p>
            <StatusUpdater projectId={p.id} current={p.status} />
          </div>
        )}
      </Group>

      <Group title="Projets prêts à assigner" items={qualified}>
        {(p) => (
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <p className="text-[12px] text-mute">
              {p.architect?.full_name
                ? `Dessinateur actuel : ${p.architect.full_name}`
                : "Aucun dessinateur assigné"}
            </p>
            <Assigner
              projectId={p.id}
              architects={architects}
              current={p.architect_id}
            />
          </div>
        )}
      </Group>

      <Group title="Production en cours" items={inProgress}>
        {(p) => (
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <p className="text-[12px] text-mute">
              {p.architect?.full_name ?? "Aucun dessinateur"}
              {p.expected_delivery_date
                ? ` · livraison ${formatDate(p.expected_delivery_date)}`
                : ""}
            </p>
            <StatusUpdater projectId={p.id} current={p.status} />
          </div>
        )}
      </Group>

      <Group title="Livrés & archivés" items={delivered} collapsedByDefault>
        {(p) => (
          <p className="mt-3 text-[12px] text-mute">
            Livré le {formatDate(p.updated_at)} ·{" "}
            {p.architect?.full_name ?? "—"}
          </p>
        )}
      </Group>
    </div>
  );
}

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
        className="h-9 cursor-pointer rounded-[3px] border border-line-strong bg-paper px-2.5 text-[12px] text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/15"
      >
        {Object.entries(projectStatusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <StatusSubmit />
      {state.error ? (
        <span className="text-[11px] text-crimson">{state.error}</span>
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
      className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-[3px] border border-line-strong bg-paper px-2.5 text-[12px] font-medium text-ink transition hover:border-ink hover:bg-vellum/40 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : null}
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
        className="h-9 cursor-pointer rounded-[3px] border border-line-strong bg-paper px-2.5 text-[12px] text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/15"
        required
      >
        <option value="" disabled>
          Dessinateur…
        </option>
        {architects.map((a) => (
          <option key={a.id} value={a.id}>
            {a.full_name ?? a.email}
          </option>
        ))}
      </select>
      <AssignSubmit />
      {state.error ? (
        <span className="text-[11px] text-crimson">{state.error}</span>
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
      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[3px] bg-ink px-3 text-[12px] font-medium text-paper transition hover:bg-iron-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
      ) : (
        <UserCheck className="size-3" aria-hidden="true" />
      )}
      Assigner
    </button>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "amber" | "ink" | "moss";
}) {
  const dot =
    accent === "amber"
      ? "bg-amber"
      : accent === "moss"
        ? "bg-moss"
        : "bg-ink";
  return (
    <div className="bg-paper p-5">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`inline-block size-1.5 rounded-full ${dot}`}
        />
        <p className="caption">{label}</p>
      </div>
      <p className="font-display mt-3 text-4xl leading-none text-ink">
        <CountUp value={value} />
      </p>
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
      <header className="mb-4 flex items-baseline gap-3 border-b border-line pb-3">
        <h3 className="display text-xl text-ink">{title}</h3>
        <span className="caption">· {items.length}</span>
      </header>
      {items.length === 0 ? (
        <p className="rounded-[3px] border border-dashed border-line-strong bg-paper px-4 py-5 text-center text-[12px] text-mute">
          Aucun projet dans cette colonne.
        </p>
      ) : (
        <Reveal as="ul" stagger className="grid gap-3">
          {(collapsedByDefault ? items.slice(0, 3) : items).map((p) => (
            <Reveal
              as="li"
              item
              key={p.id}
              className="lift rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-line-strong"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-mute">
                      {p.reference ?? "—"}
                    </span>
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
                      <ShieldCheck className="size-3" aria-hidden="true" />
                      {confidentialityLabels[p.confidentiality]}
                    </StatusPill>
                  </div>
                  <p className="mt-2 font-display text-lg text-ink">
                    {p.title}
                  </p>
                </div>
                <a
                  href={routes.manager.project(p.id)}
                  className="caption inline-flex cursor-pointer shrink-0 items-center gap-1.5 transition-colors hover:text-ink"
                >
                  Ouvrir
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </div>
              {children(p)}
            </Reveal>
          ))}
        </Reveal>
      )}
    </section>
  );
}
