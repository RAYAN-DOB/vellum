import { UserRound, UsersRound } from "lucide-react";

import { ManagerShell } from "@/components/shells/ManagerShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listProjectsForManager } from "@/lib/projects";
import { routes } from "@/lib/routes";

export const metadata = { title: "Équipe" };

type Architect = {
  id: string;
  full_name: string | null;
  email: string;
  is_active: boolean;
};

export default async function ManagerTeamPage() {
  await requireRole(["manager", "admin"]);

  const supabase = await createSupabaseServerClient();
  const { data: architectsData } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_active")
    .eq("role", "architect")
    .order("full_name", { ascending: true });

  const architects = (architectsData ?? []) as Architect[];
  const projects = await listProjectsForManager();

  // Build per-architect workload.
  const workload = architects.map((a) => {
    const assigned = projects.filter(
      (p) =>
        p.architect_id === a.id &&
        !["delivered", "archived", "cancelled"].includes(p.status),
    );
    const inProgress = assigned.filter((p) =>
      ["in_progress", "review"].includes(p.status),
    );
    return { architect: a, assigned, inProgress };
  });

  // Sort by load descending.
  workload.sort((x, y) => y.assigned.length - x.assigned.length);

  return (
    <ManagerShell
      activeHref={routes.manager.team}
      title="Équipe & charge"
      description="Vue capacité par dessinateur. Visualisez la répartition avant d'assigner un nouveau projet."
    >
      {architects.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          caption="Aucun dessinateur"
          title="L'équipe est vide."
          description="Aucun compte dessinateur n'est encore provisionné. Demandez à l'administrateur d'inviter un dessinateur depuis la console admin."
          action={
            <a
              href={routes.admin.users}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition hover:bg-iron-hover"
            >
              Ouvrir l&apos;admin (utilisateurs)
            </a>
          }
        />
      ) : (
        <div className="space-y-12">
          {/* Aggregate metrics */}
          <section className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
            <Metric
              label="Dessinateurs actifs"
              value={architects.filter((a) => a.is_active).length}
              hint={`${architects.length} comptes au total`}
            />
            <Metric
              label="Projets en cours"
              value={workload.reduce((acc, w) => acc + w.assigned.length, 0)}
              hint="Assignés non livrés"
            />
            <Metric
              label="Charge moyenne"
              value={
                architects.length > 0
                  ? Math.round(
                      (workload.reduce((acc, w) => acc + w.assigned.length, 0) /
                        Math.max(1, architects.filter((a) => a.is_active).length)) *
                        10,
                    ) / 10
                  : 0
              }
              hint="Projets par dessinateur actif"
            />
          </section>

          {/* Per-architect rows */}
          <section>
            <header className="border-b border-line pb-4">
              <h2 className="display text-2xl text-ink">
                Répartition par dessinateur
              </h2>
              <p className="mt-2 text-[14px] text-mute">
                Triée par charge — du plus chargé au moins chargé.
              </p>
            </header>

            <ul className="mt-6 grid gap-3">
              {workload.map(({ architect, assigned, inProgress }) => (
                <li
                  key={architect.id}
                  className="grid gap-4 rounded-[3px] border border-line bg-paper p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-vellum/50"
                  >
                    <UserRound className="size-4 text-graphite" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg text-ink">
                        {architect.full_name ?? architect.email}
                      </p>
                      {!architect.is_active ? (
                        <span className="caption rounded-full border border-line-strong px-2 py-0.5 text-[10px]">
                          Désactivé
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[12px] text-mute">
                      {architect.email}
                    </p>
                  </div>
                  <div className="flex gap-6 text-right sm:gap-8">
                    <div>
                      <p className="caption">Assignés</p>
                      <p className="font-display mt-1 text-2xl leading-none text-ink">
                        {assigned.length}
                      </p>
                    </div>
                    <div>
                      <p className="caption">En production</p>
                      <p className="font-display mt-1 text-2xl leading-none text-ink">
                        {inProgress.length}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </ManagerShell>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="bg-paper p-6">
      <p className="caption">{label}</p>
      <p className="font-display mt-3 text-4xl leading-none text-ink">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-mute">{hint}</p>
    </div>
  );
}
