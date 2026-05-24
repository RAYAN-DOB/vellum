import { AdminShell } from "@/components/shells/AdminShell";
import { StatusPill } from "@/components/ui/StatusPill";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = { title: "Audit logs — Admin Vellum" };

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SENSITIVE_ACTIONS = new Set([
  "user.role_changed",
  "user.deactivated",
  "user.invited",
  "policy.updated",
  "role.permission_granted",
  "role.permission_revoked",
]);

export default async function AdminAuditPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("audit_logs")
    .select(
      "*, actor:profiles!audit_logs_actor_id_fkey(id, full_name, email, role)",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  type AuditEntry = {
    id: string;
    created_at: string;
    action: string;
    target_type: string | null;
    target_id: string | null;
    metadata: Record<string, unknown>;
    actor: {
      id: string;
      full_name: string | null;
      email: string;
      role: string;
    } | null;
  };
  const entries = (data ?? []) as unknown as AuditEntry[];

  return (
    <AdminShell
      activeHref={routes.admin.home}
      eyebrow="Administration"
      title="Audit logs"
      description="Les 200 dernières actions sensibles enregistrées dans la plateforme."
    >
      <div className="overflow-hidden rounded-[6px] border border-[#d8d0bf] bg-white/95">
        <table className="min-w-full divide-y divide-[#e8e0d0] text-sm">
          <thead className="bg-[#f8f5ed] text-left text-xs uppercase tracking-[0.18em] text-[#8a7a5f]">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Acteur</th>
              <th className="px-4 py-3 font-medium">Cible</th>
              <th className="px-4 py-3 font-medium">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee8dc]">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-3 align-top text-xs text-[#6b665a]">
                  {formatDateTime(entry.created_at)}
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusPill
                    tone={SENSITIVE_ACTIONS.has(entry.action) ? "amber" : "neutral"}
                  >
                    {entry.action}
                  </StatusPill>
                </td>
                <td className="px-4 py-3 align-top text-xs">
                  {entry.actor?.full_name ?? "Système"}
                  {entry.actor?.role ? ` (${entry.actor.role})` : null}
                </td>
                <td className="px-4 py-3 align-top text-xs text-[#6b665a]">
                  {entry.target_type ?? "—"}
                  {entry.target_id ? (
                    <span className="ml-1 font-mono">
                      {entry.target_id.slice(0, 8)}…
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top">
                  <pre className="whitespace-pre-wrap break-words text-[10px] text-[#6b665a]">
                    {Object.keys(entry.metadata ?? {}).length > 0
                      ? JSON.stringify(entry.metadata, null, 2)
                      : "—"}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-[#6b665a]">
            Aucune action journalisée pour le moment.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
