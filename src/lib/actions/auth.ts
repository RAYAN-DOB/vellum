"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { defaultRouteForRole } from "@/lib/auth";
import type { AppRole } from "@/types/database";

const ALLOWED_SIGNUP_ROLES: AppRole[] = ["client"];

type ActionState = {
  error?: string;
  success?: string;
};

function safeRedirect(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirect(formData.get("redirect"));

  if (!email || !password) {
    return { error: "Email et mot de passe sont obligatoires." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Identifiants invalides ou compte désactivé." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Connexion impossible. Réessayez." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut();
    return {
      error:
        "Votre compte est désactivé. Contactez un administrateur PlanWork.",
    };
  }

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: "auth.sign_in",
    target_type: "user",
    target_id: user.id,
  });

  redirect(redirectTo ?? defaultRouteForRole(profile.role));
}

export async function signUpAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const requestedRole = String(formData.get("role") ?? "client") as AppRole;

  if (!email || !password || !fullName) {
    return { error: "Nom, email et mot de passe sont obligatoires." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (!ALLOWED_SIGNUP_ROLES.includes(requestedRole)) {
    return { error: "Rôle non autorisé à l'inscription publique." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        company: company || null,
        role: requestedRole,
      },
    },
  });

  if (error) {
    return { error: error.message || "Inscription impossible." };
  }

  // If email confirmation is disabled, the user is signed in right away.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success:
        "Compte créé. Vérifiez votre email pour confirmer puis connectez-vous.",
    };
  }

  redirect(defaultRouteForRole(requestedRole));
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "auth.sign_out",
      target_type: "user",
      target_id: user.id,
    });
  }
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
