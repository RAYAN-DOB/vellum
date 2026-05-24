import { ManagerShell } from "@/components/shells/ManagerShell";
import { ManagerCockpit } from "@/components/manager/ManagerCockpit";
import { requireRole } from "@/lib/auth";
import { listProjectsForManager } from "@/lib/projects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Cockpit chef de projet — Vellum",
};

export default async function ProjectManagerWorkspacePage() {
  await requireRole(["manager", "admin"]);

  const supabase = await createSupabaseServerClient();
  const [projects, { data: architects }] = await Promise.all([
    listProjectsForManager(),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "architect")
      .eq("is_active", true)
      .order("full_name", { ascending: true }),
  ]);

  return (
    <ManagerShell
      activeHref={routes.manager.home}
      eyebrow="Vue chef de projet"
      title="Cockpit qualification & assignation"
      description="Qualifiez les demandes entrantes, assignez les architectes et suivez la charge équipe."
    >
      <ManagerCockpit projects={projects} architects={architects ?? []} />
    </ManagerShell>
  );
}
