import { NextResponse, type NextRequest } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/register",
  "/unauthorized",
  "/auth/callback",
  "/services",
  "/securite-confidentialite",
  "/contact",
]);

const ROLE_PREFIXES: Record<string, ReadonlyArray<string>> = {
  "/admin": ["admin"],
  "/chef-projet": ["manager", "admin"],
  "/dessinateur": ["architect", "manager", "admin"],
  "/client": ["client", "manager", "admin"],
  "/dashboard": ["client", "architect", "manager", "admin"],
};

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

  // Always refresh the session — this keeps the cookie alive for SSR.
  const { response, user, role, isActive } =
    await updateSupabaseSession(request);

  // Public routes: just return the refreshed response.
  if (isPublic(pathname)) return response;

  // Authenticated routes: must be signed in.
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

  // Role-based prefix check.
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
