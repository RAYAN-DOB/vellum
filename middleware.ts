import { NextResponse, type NextRequest } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/unauthorized",
  "/auth/callback",
  "/services",
  "/securite-confidentialite",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
  "/conditions",
]);

/**
 * Vellum role-based route gating.
 *
 * Each prefix is allowed for the listed roles. Admin can see everything.
 * The list MUST stay in sync with src/lib/routes.ts and src/lib/auth.ts.
 */
const ROLE_PREFIXES: Record<string, ReadonlyArray<string>> = {
  "/admin": ["admin"],
  "/manager": ["manager", "admin"],
  "/studio": ["architect", "manager", "admin"],
  "/client": ["client", "manager", "admin"],
};

/**
 * Legacy paths still pointing to /chef-projet, /dessinateur, /dashboard.
 * Redirect to the new canonical paths so old bookmarks keep working.
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/chef-projet": "/manager",
  "/dessinateur": "/studio",
  "/dashboard": "/client",
};

function legacyRedirect(pathname: string): string | null {
  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    if (pathname === from) return to;
    if (pathname.startsWith(from + "/")) {
      return to + pathname.slice(from.length);
    }
  }
  return null;
}

function isPublic(path: string): boolean {
  if (PUBLIC_PATHS.has(path)) return true;
  return (
    path.startsWith("/_next/") ||
    path.startsWith("/api/public/") ||
    path.startsWith("/favicon") ||
    /\.(svg|png|jpg|jpeg|webp|gif|ico|css|js|map)$/i.test(path)
  );
}

function matchPrefix(
  path: string,
): { prefix: string; allowed: ReadonlyArray<string> } | null {
  for (const [prefix, allowed] of Object.entries(ROLE_PREFIXES)) {
    if (path === prefix || path.startsWith(prefix + "/")) {
      return { prefix, allowed };
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Legacy redirects — handle before auth check.
  const legacy = legacyRedirect(pathname);
  if (legacy) {
    const url = request.nextUrl.clone();
    url.pathname = legacy;
    return NextResponse.redirect(url, 308);
  }

  // 1. Refresh the session — keeps the cookie alive for SSR.
  const { response, user, role, isActive } =
    await updateSupabaseSession(request);

  // 2. Public routes: just return the refreshed response.
  if (isPublic(pathname)) return response;

  // 3. Authenticated routes: must be signed in.
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/login") {
      url.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(url);
  }

  if (!isActive) {
    const url = request.nextUrl.clone();
    url.pathname = "/unauthorized";
    url.searchParams.set("reason", "inactive");
    return NextResponse.redirect(url);
  }

  // 4. Role-based prefix check.
  const match = matchPrefix(pathname);
  if (match && (!role || !match.allowed.includes(role))) {
    const url = request.nextUrl.clone();
    url.pathname = "/unauthorized";
    url.searchParams.set("reason", "role");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|css|js|map)$).*)",
  ],
};
