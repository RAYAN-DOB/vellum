# Application architecture — Vellum

Next.js 16 App Router with React Server Components and Server Actions on top
of Supabase (Postgres + Auth + Storage).

## Layers

```
 ┌─────────────────────────────────────────────────────────────┐
 │  Browser                                                    │
 │   - Login / register forms (Client Components, useActionState)│
 │   - Cockpit dashboards (mix of Server + Client)             │
 │   - Direct uploads to Supabase Storage via @supabase/ssr    │
 └──────────────┬──────────────────────────────────────────────┘
                │ Server Actions  /  Route Handlers
                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │  Next.js 16 (Vercel)                                        │
 │   middleware.ts        session refresh + role redirect      │
 │   src/app/*            Server Components                    │
 │   src/lib/auth.ts      requireUser / requireRole / hasPerm  │
 │   src/lib/actions/*    Server Actions (writes)              │
 │   src/lib/supabase/    typed Supabase clients               │
 └──────────────┬──────────────────────────────────────────────┘
                │ HTTPS — SSL terminated by Supabase
                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │  Supabase                                                   │
 │   Auth     email/password, magic links, session cookies     │
 │   Postgres tables in `public`, RLS on every sensitive one   │
 │   Storage  3 private buckets, RLS-gated                     │
 └─────────────────────────────────────────────────────────────┘
```

## Why Server Actions vs API routes

Server Actions live next to the page that triggers them and benefit from the
form-action ↔ progressive-enhancement story. We use them for every write:

- `signInAction`, `signUpAction`, `signOutAction` — auth
- `createProjectAction`, `sendProjectMessageAction`, `updateProjectStatusAction`,
  `assignProjectAction` — projects
- `createQuoteAction`, `addQuoteItemAction`, `updateQuoteStatusAction` — quotes
- `updateUserRoleAction`, `toggleUserActiveAction`, `inviteUserAction`,
  `updateAppPolicyAction`, `togglePermissionForRoleAction` — admin
- `updateOwnProfileAction` — profile

Reads happen directly inside Server Components via `createSupabaseServerClient`.
RLS scopes the result automatically.

## Server / Client split

Default: every file in `src/app/` is a Server Component.

`"use client"` is added only when we need interactivity (form state,
`useTransition`, `useActionState`, file pickers).

Constants and types that need to flow across the boundary live in:

- `src/lib/project-display.ts` — `projectStatusLabels`, `projectStatusTone`,
  `ProjectListItem` (type)
- `src/types/database.ts` — hand-written row / enum types

Server-only files declare `import "server-only"` so accidental imports from a
Client Component fail loudly at build time. Today that includes
`src/lib/projects.ts` (Supabase queries).

## Authentication flow

1. User submits `/login` form → Server Action `signInAction`.
2. `signInWithPassword` succeeds → cookie set.
3. `signInAction` reads the profile, redirects to the role-aware home page.
4. Subsequent requests pass through `middleware.ts`:
   - `updateSupabaseSession` refreshes the cookie if needed.
   - For protected paths, the user's role is checked against `ROLE_PREFIXES`.
   - Unauthenticated → redirect `/login?redirect=…`.
   - Wrong role → redirect `/unauthorized?reason=role`.
5. Each Server Component calls `requireUser()` or `requireRole(...)` for
   defence in depth.
6. **Supabase RLS** still applies — even if a step above is bypassed, the
   query returns zero rows.

## File upload flow

Browser → Supabase Storage directly (saves a hop through Next.js), then the
browser inserts the `project_documents` row. Both calls are RLS-gated by
`can_access_project`. See `src/lib/client/upload.ts`.

## Notable Next.js 16 quirks

- `cookies()`, `headers()`, `params` are all **async**. Every server helper
  awaits them.
- Turbopack is the default builder for `next build`. Pin the workspace root
  via `next.config.ts → turbopack.root = __dirname` when several lockfiles
  exist on disk.
- `useActionState` returns `[state, action]` — the action only takes a
  `FormData`. State must be plain serialisable JSON.
