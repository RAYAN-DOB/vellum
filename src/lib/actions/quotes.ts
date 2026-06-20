"use server";

import { revalidatePath } from "next/cache";

import { requireRole, requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { QUOTE_TEMPLATES } from "@/lib/designer-presets";
import type { QuoteStatus } from "@/types/database";

const VALID_QUOTE_STATUS = new Set<QuoteStatus>([
  "draft",
  "sent",
  "accepted",
  "refused",
  "expired",
]);

type ActionState = { error?: string; success?: string };

export async function createQuoteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole(["manager", "admin"]);
  const projectId = String(formData.get("project_id") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!projectId) return { error: "Projet manquant." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("quotes").insert({
    project_id: projectId,
    created_by: user.id,
    status: "draft",
    notes,
  });

  if (error) return { error: error.message };
  revalidatePath("/manager/devis");
  return { success: "Devis créé." };
}

export async function addQuoteItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(["manager", "admin"]);
  const quoteId = String(formData.get("quote_id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const unitPrice = Number(formData.get("unit_price") ?? 0);

  if (!quoteId || !label) return { error: "Données manquantes." };

  const supabase = await createSupabaseServerClient();
  const { error: insertError } = await supabase.from("quote_items").insert({
    quote_id: quoteId,
    label,
    quantity: Number.isFinite(quantity) ? quantity : 1,
    unit_price: Number.isFinite(unitPrice) ? unitPrice : 0,
  });

  if (insertError) return { error: insertError.message };

  // Recompute total.
  const { data: items } = await supabase
    .from("quote_items")
    .select("total")
    .eq("quote_id", quoteId);
  const total =
    items?.reduce((sum, item) => sum + Number(item.total ?? 0), 0) ?? 0;
  await supabase.from("quotes").update({ total_amount: total }).eq("id", quoteId);

  revalidatePath("/manager/devis");
  return { success: "Ligne ajoutée." };
}

export async function updateQuoteStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const quoteId = String(formData.get("quote_id") ?? "");
  const status = String(formData.get("status") ?? "") as QuoteStatus;

  if (!quoteId || !VALID_QUOTE_STATUS.has(status)) {
    return { error: "Statut invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: quote } = await supabase
    .from("quotes")
    .select("id, project:projects(client_id)")
    .eq("id", quoteId)
    .maybeSingle();

  const projectClientId =
    (quote as unknown as { project?: { client_id?: string } | null })?.project
      ?.client_id ?? null;

  if (!quote) return { error: "Devis introuvable." };

  if (
    user.profile.role === "client" &&
    (projectClientId !== user.id || !["accepted", "refused"].includes(status))
  ) {
    return { error: "Action non autorisée." };
  }

  if (!["client", "manager", "admin"].includes(user.profile.role)) {
    return { error: "Action non autorisée." };
  }

  const { error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", quoteId);
  if (error) return { error: error.message };

  revalidatePath("/manager/devis");
  return { success: "Statut mis à jour." };
}

export async function applyQuoteTemplateAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(["manager", "admin"]);
  const quoteId = String(formData.get("quote_id") ?? "");
  const templateId = String(formData.get("template_id") ?? "");
  const template = QUOTE_TEMPLATES.find((t) => t.id === templateId);

  if (!quoteId || !template) return { error: "Modèle introuvable." };

  const supabase = await createSupabaseServerClient();
  const { error: insertError } = await supabase.from("quote_items").insert(
    template.lines.map((line) => ({
      quote_id: quoteId,
      label: line.label,
      quantity: 1,
      unit_price: line.unitPrice,
    })),
  );

  if (insertError) return { error: insertError.message };

  const { data: items } = await supabase
    .from("quote_items")
    .select("total")
    .eq("quote_id", quoteId);
  const total =
    items?.reduce((sum, item) => sum + Number(item.total ?? 0), 0) ?? 0;
  await supabase.from("quotes").update({ total_amount: total }).eq("id", quoteId);

  revalidatePath("/manager/devis");
  return { success: `Modèle « ${template.label} » ajouté.` };
}
