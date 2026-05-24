import { AppShell } from "@/components/layout/AppShell";
import { QuoteList } from "@/components/quotes/QuoteList";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Devis — Vellum",
};

export default async function ProjectManagerQuotesPage() {
  await requireRole(["manager", "admin"]);

  const supabase = await createSupabaseServerClient();

  const [{ data: quotes }, { data: projects }] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "*, items:quote_items(*), project:projects(id, reference, title)",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, reference, title")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <AppShell
      activeHref={routes.roles.projectManagerQuotes}
      eyebrow="Vue manager"
      title="Devis"
      description="Créez et envoyez les devis liés à vos projets. Le client peut accepter ou refuser depuis son cockpit."
    >
      <QuoteList
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        quotes={(quotes ?? []) as any}
        projects={projects ?? []}
        canManage={true}
      />
    </AppShell>
  );
}
