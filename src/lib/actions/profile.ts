"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionState = { error?: string; success?: string };

export async function updateOwnProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) return { error: "Le nom est obligatoire." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      company: company || null,
      phone: phone || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/client/parametres");
  revalidatePath("/admin/users");
  return { success: "Profil mis à jour." };
}
