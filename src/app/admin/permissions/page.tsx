import { AdminShell } from "@/components/shells/AdminShell";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = { title: "Permissions — Admin Vellum" };

export default async function AdminPermissionsPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("permissions")
    .select("*")
    .order("category", { ascending: true })
    .order("key", { ascending: true });

  const permissions = (data ?? []) as Array<{
    id: string;
    key: string;
    label: string;
    description: string | null;
    category: string | null;
  }>;

  const byCategory = permissions.reduce<Record<string, typeof permissions>>(
    (acc, perm) => {
      const cat = perm.category ?? "Autre";
      (acc[cat] ||= []).push(perm);
      return acc;
    },
    {},
  );

  return (
    <AdminShell
      activeHref={routes.admin.home}
      eyebrow="Administration"
      title="Catalogue des permissions"
      description="Toutes les permissions reconnues par Vellum. Utilisez la matrice rôles pour les affecter."
    >
      <div className="space-y-6">
        {Object.entries(byCategory).map(([category, perms]) => (
          <section
            key={category}
            className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
              {category}
            </h3>
            <ul className="mt-3 space-y-2">
              {perms.map((perm) => (
                <li
                  key={perm.id}
                  className="flex flex-col gap-1 border-b border-[#eee8dc] pb-2 last:border-b-0 last:pb-0"
                >
                  <p className="font-medium text-[#171613]">{perm.label}</p>
                  <code className="text-[11px] text-[#6b665a]">{perm.key}</code>
                  {perm.description ? (
                    <p className="text-xs text-[#6b665a]">{perm.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
