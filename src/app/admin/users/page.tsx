import { AdminShell } from "@/components/shells/AdminShell";
import { UserTable } from "@/components/admin/UserTable";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = { title: "Utilisateurs — Admin Vellum" };

export default async function AdminUsersPage() {
  const user = await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminShell
      activeHref={routes.admin.home}
      eyebrow="Administration"
      title="Utilisateurs"
      description="Gérez les comptes, leurs rôles et leur activation. Toutes les actions sont journalisées."
    >
      <UserTable users={users ?? []} currentUserId={user.id} />
    </AdminShell>
  );
}
