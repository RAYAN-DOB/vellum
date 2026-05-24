import { ClientShell } from "@/components/shells/ClientShell";
import { ClientDashboard } from "@/components/client/ClientDashboard";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listProjectsForClient } from "@/lib/projects";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Cockpit client — Vellum",
};

export default async function ClientWorkspacePage() {
  const user = await requireRole(["client", "manager", "admin"]);
  const projects = await listProjectsForClient(user.id);
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null);

  return (
    <ClientShell
      activeHref={routes.client.home}
      description="Suivez vos projets en cours, échangez avec votre chef de projet et déposez de nouvelles demandes en quelques clics."
      eyebrow={`Connecté en tant que ${user.profile.full_name ?? user.email}`}
      title="Cockpit client"
    >
      <ClientDashboard
        user={user}
        projects={projects}
        unreadMessages={count ?? 0}
      />
    </ClientShell>
  );
}
