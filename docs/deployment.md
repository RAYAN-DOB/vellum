# Deployment — Vellum

The app targets Vercel + Supabase. Everything else (CDN, image optimisation,
TLS) is handled by the platform.

## Pre-flight checklist

```bash
npm run lint
npm run build
```

Both must pass with no errors.

## Vercel

1. Connect the repo to Vercel.
2. **Project settings → Environment variables**:

   | Name                              | Where used               |
   | --------------------------------- | ------------------------ |
   | `NEXT_PUBLIC_SUPABASE_URL`        | client + server          |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | client + server          |
   | `SUPABASE_SERVICE_ROLE_KEY`       | **server only**          |
   | `NEXT_PUBLIC_SITE_URL`            | client (auth redirects)  |

   Use the enabled Supabase publishable key (`sb_publishable_...`) for
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The variable name stays unchanged because
   the Supabase client expects a public key in that slot.

3. Set the same variables in *Production*, *Preview* and *Development*.
4. Trigger a deploy. Vercel detects Next.js 16 / Turbopack automatically.

> The `turbopack.root` config in `next.config.ts` pins the project root so a
> grand-parent lockfile in the deployer's home directory cannot confuse the
> build.

## Supabase Auth → site URL

In *Authentication → URL configuration*:

- **Site URL**: `https://<your-vercel-domain>`
- **Additional redirect URLs**: include preview deployments,
  e.g. `https://*.vercel.app/auth/callback`.

Without this, the password-reset / magic-link callbacks fail with a redirect
error.

## Smoke tests after deploy

Open in incognito and verify:

| Route                              | Expectation                            |
| ---------------------------------- | -------------------------------------- |
| `/`                                | Landing renders, public                |
| `/login`                           | Form renders, sign in works            |
| `/register`                        | Client signup works                    |
| `/client` (signed in as client)    | Cockpit shows the user's projects      |
| `/admin` (signed in as client)     | Redirect → `/unauthorized?reason=role` |
| `/admin/users` (admin)             | Lists users, role / activation work    |
| `/chef-projet` (manager)           | Lists intake → can assign architect    |
| `/dessinateur` (architect)         | Lists assigned projects only           |

## Rollback

Vercel keeps the previous production deployment. *Production deployments →
… → Promote to production* restores it in seconds. Supabase migrations are
forward-only — keep them small and reviewable.
