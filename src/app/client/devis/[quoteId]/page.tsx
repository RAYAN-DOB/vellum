import { notFound } from "next/navigation";

import { QuoteSheet, type QuoteSheetData } from "@/components/quotes/QuoteSheet";
import { ClientShell } from "@/components/shells/ClientShell";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuoteStatus } from "@/types/database";

export const metadata = { title: "Devis" };

type QuoteRow = {
  id: string;
  status: QuoteStatus;
  created_at: string;
  notes: string | null;
  total_amount: number | null;
  project_id: string;
  items:
    | { id: string; label: string; quantity: number; unit_price: number; total: number }[]
    | null;
  project: {
    id: string;
    reference: string | null;
    title: string;
    client_id: string;
  } | null;
};

export default async function ClientQuotePage({
  params,
}: {
  params: Promise<{ quoteId: string }>;
}) {
  const { quoteId } = await params;
  await requireRole(["client", "manager", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("quotes")
    .select(
      "*, items:quote_items(*), project:projects!inner(id, reference, title, client_id)",
    )
    .eq("id", quoteId)
    .maybeSingle();

  if (!data) notFound();

  const q = data as unknown as QuoteRow;
  const quote: QuoteSheetData = {
    id: q.id,
    reference: q.project?.reference ?? null,
    projectId: q.project?.id ?? q.project_id,
    projectTitle: q.project?.title ?? "Projet",
    status: q.status,
    createdAt: q.created_at,
    notes: q.notes,
    items: (q.items ?? []).map((it) => ({
      id: it.id,
      label: it.label,
      quantity: Number(it.quantity),
      unit_price: Number(it.unit_price),
      total: Number(it.total),
    })),
    total: Number(q.total_amount ?? 0),
  };

  return (
    <ClientShell
      activeHref={routes.client.quotes}
      eyebrow="Devis"
      title="Votre devis"
      description="Vérifiez le détail, ajoutez des options si besoin, puis acceptez et réglez en toute sécurité."
    >
      <QuoteSheet quote={quote} />
    </ClientShell>
  );
}
