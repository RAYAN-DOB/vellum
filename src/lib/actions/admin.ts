"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import type { AppRole } from "@/types/database";

const ROLES = new Set<AppRole>(["client", "architect", "manager", "admin"]);

type ActionState = { error?: string; success?: string };

export async function updateUserRoleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireRole("admin");
  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "") as AppRole;

  if (!userId || !ROLES.has(role)) {
    return { error: "Données invalides." };
  }

  if (userId === actor.id && role !== "admin") {
    return {
      error:
        "Un administrateur ne peut pas se retirer ses propres droits depuis cette interface.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: error.message };

  await supabase.from("audit_logs").insert({
    actor_id: actor.id,
    action: "user.role_changed",
    target_type: "user",
    target_id: userId,
    metadata: { role },
  });

  revalidatePath("/admin/users");
  return { success: "Rôle mis à jour." };
}

export async function toggleUserActiveAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireRole("admin");
  const userId = String(formData.get("user_id") ?? "");
  const isActiveRaw = String(formData.get("is_active") ?? "true");
  const isActive = isActiveRaw === "true";

  if (!userId) return { error: "Utilisateur introuvable." };
  if (userId === actor.id && !isActive) {
    return { error: "Vous ne pouvez pas vous désactiver vous-même." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId);
  if (error) return { error: error.message };

  await supabase.from("audit_logs").insert({
    actor_id: actor.id,
    action: isActive ? "user.activated" : "user.deactivated",
    target_type: "user",
    target_id: userId,
  });

  revalidatePath("/admin/users");
  return { success: isActive ? "Compte activé." : "Compte désactivé." };
}

export async function inviteUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireRole("admin");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "client") as AppRole;

  if (!email || !fullName) return { error: "Email et nom requis." };
  if (!ROLES.has(role)) return { error: "Rôle invalide." };

  let admin: ReturnType<typeof createSupabaseServiceRoleClient>;
  try {
    admin = createSupabaseServiceRoleClient();
  } catch {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY non configurée — impossible d'inviter sans privilège admin.",
    };
  }

  // Create the auth user with a random password the user will reset.
  const tempPassword =
    "Tmp-" + Math.random().toString(36).slice(2, 10) + "!Aa1";
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error) return { error: error.message };

  // Trigger handle_new_user already creates the profile; force the role here.
  if (data?.user?.id) {
    const supabase = await createSupabaseServerClient();
    await supabase
      .from("profiles")
      .update({ role, full_name: fullName, is_active: true })
      .eq("id", data.user.id);

    await supabase.from("audit_logs").insert({
      actor_id: actor.id,
      action: "user.invited",
      target_type: "user",
      target_id: data.user.id,
      metadata: { email, role },
    });
  }

  revalidatePath("/admin/users");
  return {
    success: `Compte créé pour ${email}. Mot de passe temporaire : ${tempPassword} — communiquez-le et demandez à l'utilisateur de le changer immédiatement.`,
  };
}

export async function updateAppPolicyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  const valueRaw = String(formData.get("value") ?? "");

  if (!id) return { error: "Politique introuvable." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(valueRaw);
  } catch {
    return { error: "La valeur doit être un JSON valide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("app_policies")
    .update({ value: parsed, updated_by: actor.id })
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("audit_logs").insert({
    actor_id: actor.id,
    action: "policy.updated",
    target_type: "policy",
    target_id: id,
  });

  revalidatePath("/admin/policies");
  return { success: "Politique mise à jour." };
}

export async function togglePermissionForRoleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireRole("admin");
  const roleId = String(formData.get("role_id") ?? "");
  const permissionId = String(formData.get("permission_id") ?? "");
  const grant = String(formData.get("grant") ?? "true") === "true";

  if (!roleId || !permissionId) return { error: "Données invalides." };

  const supabase = await createSupabaseServerClient();
  if (grant) {
    await supabase
      .from("role_permissions")
      .upsert({ role_id: roleId, permission_id: permissionId });
  } else {
    await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", roleId)
      .eq("permission_id", permissionId);
  }

  await supabase.from("audit_logs").insert({
    actor_id: actor.id,
    action: grant ? "role.permission_granted" : "role.permission_revoked",
    target_type: "role",
    target_id: roleId,
    metadata: { permission_id: permissionId },
  });

  revalidatePath("/admin/roles");
  revalidatePath("/admin/permissions");
  return { success: grant ? "Permission accordée." : "Permission retirée." };
}
