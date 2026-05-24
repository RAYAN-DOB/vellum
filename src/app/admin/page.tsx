import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Folder,
  KeyRound,
  ShieldCheck,
  ShieldOff,
  Users,
  Workflow,
} from "lucide-react";

import { AdminShell } from "@/components/shells/AdminShell";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Console admin",
};

export default async function AdminWorkspacePage() {
  await requireRole("admin");

  const supabase = await createSupabaseServerClient();
  const [users, activeUsers, projects, policies, audit] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("app_policies").select("id", { count: "exact", head: true }),
    supabase
      .from("audit_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString()),
  ]);

  const inactiveUsers = (users.count ?? 0) - (activeUsers.count ?? 0);

  return (
    <AdminShell
      activeHref={routes.admin.home}
      title="Pilotage global"
      description="Vue d'ensemble de l'instance Vellum : utilisateurs, projets, politiques applicatives. Toutes les actions sensibles sont journalisées."
    >
      <div className="space-y-12">
        {/* Metric grid */}
        <section className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <MetricCell
            href={routes.admin.users}
            icon={Users}
            label="Utilisateurs"
            value={users.count ?? 0}
            hint={`${activeUsers.count ?? 0} actifs · ${inactiveUsers} désactivés`}
          />
          <MetricCell
            href={routes.admin.projects}
            icon={Folder}
            label="Projets supervisés"
            value={projects.count ?? 0}
            hint="Toutes phases confondues"
          />
          <MetricCell
            href={routes.admin.policies}
            icon={Workflow}
            label="Politiques actives"
            value={policies.count ?? 0}
            hint="Réglages applicatifs globaux"
          />
          <MetricCell
            href={routes.admin.audit}
            icon={Activity}
            label="Audit 7 jours"
            value={audit.count ?? 0}
            hint="Actions sensibles journalisées"
          />
        </section>

        {/* Quick access */}
        <section>
          <header className="border-b border-line pb-4">
            <h2 className="display text-2xl text-ink">Accès rapide</h2>
            <p className="mt-2 text-[14px] text-mute">
              Les quatre surfaces de contrôle de la plateforme.
            </p>
          </header>

          <div className="mt-6 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2">
            <QuickCard
              href={routes.admin.roles}
              icon={ShieldCheck}
              title="Rôles & permissions"
              body="Configurez la matrice des droits par rôle. Chaque case cochée se traduit par une politique RLS active."
            />
            <QuickCard
              href={routes.admin.permissions}
              icon={KeyRound}
              title="Catalogue de permissions"
              body="Liste source de vérité des clés de permissions reconnues par Vellum. Référence pour le code applicatif."
            />
            <QuickCard
              href={routes.admin.policies}
              icon={Workflow}
              title="Politiques applicatives"
              body="Règles globales : workflows, notifications, branding, intégrations. Ce qui se règle sans toucher au code."
            />
            <QuickCard
              href={routes.admin.audit}
              icon={Activity}
              title="Audit log"
              body="Trace immuable des actions sensibles : connexions, désactivations, exports, changements de rôle."
            />
          </div>
        </section>

        {/* Warning band */}
        <section className="relative overflow-hidden rounded-[4px] border border-line bg-vellum/50 p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid-paper opacity-30"
          />
          <div className="relative flex items-start gap-4">
            <span
              aria-hidden="true"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-paper"
            >
              <ShieldOff className="size-4 text-graphite" />
            </span>
            <div className="flex-1">
              <p className="caption">Accès total — usage tracé</p>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink">
                Vous voyez l&apos;ensemble des projets, documents et messages.
              </p>
              <p className="mt-2 text-[13px] leading-[1.6] text-mute">
                Vos actions sont enregistrées dans l&apos;audit log et
                visibles par les autres administrateurs. Tout changement de
                rôle ou désactivation laisse une trace horodatée.
              </p>
              <a
                href={routes.admin.audit}
                className="caption mt-4 inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-ink"
              >
                Consulter l&apos;audit
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function MetricCell({
  href,
  icon: Icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-4 bg-paper p-6 transition-colors hover:bg-vellum/40"
    >
      <div className="flex items-start justify-between">
        <p className="caption">{label}</p>
        <Icon className="size-4 text-mute" aria-hidden="true" />
      </div>
      <p className="font-display text-4xl leading-none text-ink">{value}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] text-mute">{hint}</p>
        <ArrowUpRight
          className="size-3.5 shrink-0 text-mute transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}

function QuickCard({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
}) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-4 bg-paper p-6 transition-colors hover:bg-vellum/40 sm:p-8"
    >
      <div className="flex items-start justify-between">
        <Icon className="size-5 text-graphite" aria-hidden="true" />
        <ArrowUpRight
          className="size-4 text-mute transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          aria-hidden="true"
        />
      </div>
      <h3 className="font-display text-xl leading-tight text-ink">{title}</h3>
      <p className="text-[13px] leading-[1.6] text-mute">{body}</p>
    </a>
  );
}
