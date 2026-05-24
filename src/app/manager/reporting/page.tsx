import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Inbox,
  LineChart,
} from "lucide-react";

import { ManagerShell } from "@/components/shells/ManagerShell";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listProjectsForManager } from "@/lib/projects";
import { routes } from "@/lib/routes";

export const metadata = { title: "Reporting" };

export default async function ManagerReportingPage() {
  await requireRole(["manager", "admin"]);

  const supabase = await createSupabaseServerClient();
  const projects = await listProjectsForManager();

  const sinceWeek = new Date(Date.now() - 7 * 86400_000).toISOString();
  const sinceMonth = new Date(Date.now() - 30 * 86400_000).toISOString();

  const [{ count: intake7d }, { count: delivered7d }, { count: delivered30d }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sinceWeek),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "delivered")
        .gte("updated_at", sinceWeek),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "delivered")
        .gte("updated_at", sinceMonth),
    ]);

  const active = projects.filter(
    (p) => !["delivered", "archived", "cancelled"].includes(p.status),
  );
  const inReview = projects.filter((p) => p.status === "review");
  const intake = projects.filter((p) => p.status === "intake");

  return (
    <ManagerShell
      activeHref={routes.manager.reporting}
      title="Reporting"
      description="Indicateurs de production hebdomadaires et mensuels. Les chiffres se calculent à la volée — pas de cache."
    >
      <div className="space-y-12">
        {/* Headline metrics */}
        <section className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={Inbox}
            label="Demandes (7 j)"
            value={intake7d ?? 0}
            hint="Nouveaux projets entrants"
          />
          <Metric
            icon={Activity}
            label="Projets actifs"
            value={active.length}
            hint="Hors livrés / archivés"
          />
          <Metric
            icon={Clock}
            label="En revue"
            value={inReview.length}
            hint="Attente de validation client"
          />
          <Metric
            icon={CheckCircle2}
            label="Livrés (30 j)"
            value={delivered30d ?? 0}
            hint={`dont ${delivered7d ?? 0} cette semaine`}
          />
        </section>

        {/* Pipeline breakdown */}
        <section>
          <header className="border-b border-line pb-4">
            <h2 className="display text-2xl text-ink">Pipeline détaillé</h2>
            <p className="mt-2 text-[14px] text-mute">
              Répartition des projets actifs par statut.
            </p>
          </header>

          <div className="mt-6 overflow-hidden rounded-[3px] border border-line">
            <PipelineRow label="À qualifier" value={intake.length} total={projects.length} />
            <PipelineRow
              label="Qualifiés"
              value={projects.filter((p) => p.status === "qualified").length}
              total={projects.length}
            />
            <PipelineRow
              label="Assignés"
              value={projects.filter((p) => p.status === "assigned").length}
              total={projects.length}
            />
            <PipelineRow
              label="En production"
              value={projects.filter((p) => p.status === "in_progress").length}
              total={projects.length}
            />
            <PipelineRow
              label="En revue"
              value={inReview.length}
              total={projects.length}
            />
            <PipelineRow
              label="Livrés / archivés"
              value={
                projects.filter((p) =>
                  ["delivered", "archived"].includes(p.status),
                ).length
              }
              total={projects.length}
              last
            />
          </div>
        </section>

        {/* Roadmap */}
        <section className="rounded-[4px] border border-line bg-vellum/40 p-6">
          <p className="caption">À venir</p>
          <p className="mt-3 text-[14px] leading-[1.65] text-graphite">
            Délai moyen de qualification, taux d&apos;acceptation des devis,
            charge dessinateur sur 4 semaines glissantes, taux de réouverture
            post-livraison.
          </p>
          <a
            href={routes.manager.team}
            className="caption mt-4 inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-ink"
          >
            <LineChart className="size-3.5" aria-hidden="true" />
            Voir la charge équipe
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </section>
      </div>
    </ManagerShell>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="bg-paper p-6">
      <div className="flex items-start justify-between">
        <p className="caption">{label}</p>
        <Icon className="size-4 text-mute" aria-hidden="true" />
      </div>
      <p className="font-display mt-3 text-4xl leading-none text-ink">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-mute">{hint}</p>
    </div>
  );
}

function PipelineRow({
  label,
  value,
  total,
  last,
}: {
  label: string;
  value: number;
  total: number;
  last?: boolean;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      className={`flex items-center gap-6 bg-paper px-5 py-4 ${
        last ? "" : "border-b border-line"
      }`}
    >
      <p className="w-44 shrink-0 text-[13px] text-graphite">{label}</p>
      <div className="flex-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-ink transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <p className="w-20 shrink-0 text-right font-mono text-[12px] text-mute">
        {value} · {pct}%
      </p>
    </div>
  );
}
