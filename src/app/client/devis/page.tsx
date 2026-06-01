import { ClientShell } from "@/components/shells/ClientShell";
import { QuoteList } from "@/components/quotes/QuoteList";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuoteWithItems } from "@/components/quotes/QuoteList";

export const metadata = { title: "Devis" };

export default async function ClientQuotesPage() {
  const user = await requireRole(["client", "manager", "admin"]);
  const supabase = await createSupabaseServerClient();

  const query = supabase
    .from("quotes")
    .select(
      "*, items:quote_items(*), project:projects!inner(id, reference, title, client_id)",
    )
    .order("created_at", { ascending: false });

  const { data: quotes } =
    user.profile.role === "client"
      ? await query.eq("project.client_id", user.id)
      : await query;

  return (
    <ClientShell
      activeHref={routes.client.quotes}
      title="Vos devis"
      description="Les devis liés à vos dossiers apparaissent ici. Vous pouvez les accepter, les refuser ou demander une précision."
    >
      <QuoteList
        quotes={(quotes ?? []) as unknown as QuoteWithItems[]}
        projects={[]}
        canManage={false}
      />
    </ClientShell>
  );
}
