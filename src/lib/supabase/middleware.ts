import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import type { AppRole } from "@/types/database";

export type SupabaseSession = {
  response: NextResponse;
  user: { id: string; email: string | null } | null;
  role: AppRole | null;
  isActive: boolean;
};

/**
 * Refresh the Supabase session cookie on every request and return the user
 * (or null) alongside the response. Also pre-fetches the profile role so
 * route-level RBAC can short-circuit without an extra round-trip.
 *
 * RLS still protects the data — this is for UX-level redirects.
 */
export async function updateSupabaseSession(
  request: NextRequest,
): Promise<SupabaseSession> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { response, user: null, role: null, isActive: false };
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { response, user: null, role: null, isActive: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle<{ role: AppRole; is_active: boolean }>();

  return {
    response,
    user: { id: user.id, email: user.email ?? null },
    role: profile?.role ?? null,
    isActive: profile?.is_active ?? false,
  };
}
