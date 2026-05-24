import { AppShell } from "@/components/layout/AppShell";
import { PolicyEditor } from "@/components/admin/PolicyEditor";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = { title: "Politiques applicatives — Admin Vellum" };

export default async function AdminPoliciesPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { data: policies } = await supabase
    .from("app_policies")
    .select("*")
    .order("key");

  return (
    <AppShell
      activeHref={routes.roles.admin}
      eyebrow="Administration"
      title="Politiques applicatives (GPO)"
      description="Configurez les réglages globaux de la plateforme. Chaque valeur est un JSON validé côté serveur."
    >
      <PolicyEditor policies={policies ?? []} />
    </AppShell>
  );
}
