import { AdminShell } from "@/components/shells/AdminShell";
import { PermissionMatrix } from "@/components/admin/PermissionMatrix";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = { title: "Rôles & permissions — Admin Vellum" };

export default async function AdminRolesPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const [rolesResult, permissionsResult, rolePermissionsResult] =
    await Promise.all([
      supabase.from("roles").select("*").order("name"),
      supabase
        .from("permissions")
        .select("*")
        .order("category", { ascending: true })
        .order("key", { ascending: true }),
      supabase.from("role_permissions").select("*"),
    ]);

  type RoleData = {
    id: string;
    name: "client" | "architect" | "manager" | "admin";
    label: string;
    description: string | null;
    created_at: string;
  };
  type PermissionData = {
    id: string;
    key: string;
    label: string;
    description: string | null;
    category: string | null;
    created_at: string;
  };
  type RolePermissionData = { role_id: string; permission_id: string };

  const roles = (rolesResult.data ?? []) as RoleData[];
  const permissions = (permissionsResult.data ?? []) as PermissionData[];
  const rolePermissions = (rolePermissionsResult.data ?? []) as RolePermissionData[];

  const matrix: Record<string, Record<string, boolean>> = {};
  for (const rp of rolePermissions) {
    matrix[rp.role_id] ||= {};
    matrix[rp.role_id][rp.permission_id] = true;
  }

  return (
    <AdminShell
      activeHref={routes.admin.home}
      eyebrow="Administration"
      title="Matrice rôles × permissions"
      description="Activez ou retirez les permissions par rôle. L'admin conserve toujours l'accès total."
    >
      <PermissionMatrix
        roles={roles}
        permissions={permissions}
        matrix={matrix}
      />
    </AdminShell>
  );
}
