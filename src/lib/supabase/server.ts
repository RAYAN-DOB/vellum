import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * `cookies()` is async in Next.js 16, so callers must `await` this factory.
 * In a read-only Server Component context, setting cookies will throw inside
 * Next — we swallow the error so the client can still be used for reads.
 *
 * We intentionally do NOT pass a `Database` generic. With hand-written types
 * the Postgrest builder occasionally narrows row types to `never`, which
 * makes every `select(...)` unusable. Callers cast results where needed.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies — safe to ignore.
          }
        },
      },
    },
  );
}

/**
 * Admin (service-role) client. Bypasses RLS. NEVER expose to a browser.
 * Only call from trusted server code where the action is already authorised
 * by other means (admin-only routes, scheduled jobs, etc.).
 */
export function createSupabaseServiceRoleClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Service-role operations are disabled.",
    );
  }
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    },
  );
}
