import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole, ProfileRow } from "@/types/database";

export type SessionUser = {
  id: string;
  email: string;
  profile: ProfileRow;
};

/**
 * Return the current authenticated user + profile, or null if not signed in.
 * Cache-friendly: every call hits Supabase's getUser() which verifies the JWT.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) return null;
  if (!profile.is_active) return null;

  return {
    id: user.id,
    email: user.email ?? profile.email,
    profile,
  };
}

/**
 * Force authentication. Redirects to /login if no user.
 */
export async function requireUser(redirectTo: string = "/login"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Force one of the allowed roles. Redirects to /unauthorized otherwise.
 */
export async function requireRole(
  allowed: AppRole | AppRole[],
): Promise<SessionUser> {
  const user = await requireUser();
  const allowedList = Array.isArray(allowed) ? allowed : [allowed];
  if (!allowedList.includes(user.profile.role)) {
    redirect("/unauthorized");
  }
  return user;
}

/**
 * Check a permission key for the current user. Reads role_permissions.
 * Admin always returns true.
 */
export async function hasPermission(permissionKey: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  if (user.profile.role === "admin") return true;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("role_permissions")
    .select("permission_id, permissions!inner(key), roles!inner(name)")
    .eq("roles.name", user.profile.role)
    .eq("permissions.key", permissionKey)
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
}

/**
 * Map an AppRole to its default landing route.
 */
export function defaultRouteForRole(role: AppRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "manager":
      return "/manager";
    case "architect":
      return "/studio";
    case "client":
    default:
      return "/client";
  }
}

/**
 * Alias kept for clarity. Same as defaultRouteForRole().
 */
export const getHomePathForRole = defaultRouteForRole;

export const roleLabels: Record<AppRole, string> = {
  client: "Client",
  architect: "Dessinateur",
  manager: "Chef de projet",
  admin: "Administrateur",
};
