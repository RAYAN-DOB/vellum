import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { defaultRouteForRole } from "@/lib/auth";
import type { AppRole } from "@/types/database";

/**
 * Handles the email-confirmation / magic-link redirect.
 * Supabase appends ?code=<otp> when the user clicks the confirmation link.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("redirect");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle<{ role: AppRole }>();

        const target =
          next ??
          (profile?.role ? defaultRouteForRole(profile.role) : "/client");
        return NextResponse.redirect(`${origin}${target}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=callback`);
}
