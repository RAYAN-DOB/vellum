import {
  AlertTriangle,
  FileText,
  KeyRound,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Console admin — Vellum",
};

export default async function AdminWorkspacePage() {
  await requireRole("admin");

  const supabase = await createSupabaseServerClient();
  const [users, projects, policies, audit] = await Promise.all([
    supabase.from("profiles").select("id, is_active", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("app_policies").select("id", { count: "exact", head: true }),
    supabase
      .from("audit_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString()),
  ]);

  return (
    <AppShell
      activeHref={routes.roles.admin}
      eyebrow="Console admin"
      title="Pilotage global Vellum"
      description="Gérez les utilisateurs, rôles, permissions et politiques applicatives. Toutes les actions sensibles sont journalisées."
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminCard
          href="/admin/users"
          icon={<Users className="size-5" aria-hidden />}
          label="Utilisateurs"
          value={users.count ?? 0}
          hint="Gérer les comptes, rôles et activation"
        />
        <AdminCard
          href="/admin/roles"
          icon={<ShieldCheck className="size-5" aria-hidden />}
          label="Rôles & permissions"
          value="Matrice"
          hint="Configurer les droits par rôle"
        />
        <AdminCard
          href="/admin/policies"
          icon={<KeyRound className="size-5" aria-hidden />}
          label="Politiques (GPO)"
          value={policies.count ?? 0}
          hint="Réglages globaux de la plateforme"
        />
        <AdminCard
          href="/admin/audit"
          icon={<FileText className="size-5" aria-hidden />}
          label="Audit 7 jours"
          value={audit.count ?? 0}
          hint="Toutes les actions sensibles"
        />
      </section>

      <section className="mt-8 rounded-[6px] border border-[#d8d0bf] bg-[#f8f5ed] p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-amber-700"
            aria-hidden
          />
          <div>
            <p className="text-sm font-semibold text-[#171613]">
              Console administrateur — accès total
            </p>
            <p className="mt-1 text-xs text-[#6b665a]">
              Vous voyez tous les projets, documents et messages. Toutes vos
              actions sont enregistrées dans l'audit log et visibles par les
              autres administrateurs.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[6px] border border-[#d8d0bf] bg-white/95 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-[#8a7a5f]">
          Projets supervisés
        </p>
        <p className="mt-1 text-2xl font-semibold text-[#171613]">
          {projects.count ?? 0}
        </p>
        <a
          href="/chef-projet"
          className="mt-3 inline-flex text-sm font-medium text-[#171613] hover:underline"
        >
          Ouvrir le cockpit chef de projet →
        </a>
      </section>
    </AppShell>
  );
}

function AdminCard({
  href,
  icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint: string;
}) {
  return (
    <a
      href={href}
      className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-5 transition hover:border-[#171613] hover:shadow-[0_18px_40px_rgba(22,21,18,0.08)]"
    >
      <div className="flex items-center gap-2 text-[#8a7a5f]">
        {icon}
        <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-[#171613]">{value}</p>
      <p className="mt-1 text-xs text-[#6b665a]">{hint}</p>
    </a>
  );
}
