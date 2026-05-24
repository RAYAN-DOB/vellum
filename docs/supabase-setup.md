# Supabase setup — Vellum

This guide walks you through provisioning a Supabase project, applying the
schema, creating demo users and connecting the Next.js app.

## 1. Create the project

1. Sign in at <https://supabase.com/dashboard>.
2. **New project** → name it `planwork-prod` (or `planwork-staging`).
3. Pick the closest region (e.g. `eu-west-3` for France).
4. Copy the **Project URL**, **anon key** and **service-role key** from
   *Settings → API*. You will paste them in `.env.local`.

## 2. Apply the SQL migrations

```bash
# In the Supabase dashboard → SQL Editor, run in order:
supabase/migrations/0001_init_schema.sql
supabase/migrations/0002_rls_policies.sql
supabase/migrations/0003_storage_buckets.sql
```

> Alternative — Supabase CLI:
> ```bash
> npx supabase link --project-ref <ref>
> npx supabase db push
> ```

Verify in the SQL editor:

```sql
select tablename, rowsecurity from pg_tables where schemaname = 'public';
-- All listed tables should show rowsecurity = true.
```

## 3. Create the four demo accounts

In *Authentication → Users → Invite* (or **Add user**), create:

| Email                  | Role (set via SQL after first sign-in) |
| ---------------------- | -------------------------------------- |
| `client@planwork.dev`  | client                                 |
| `archi@planwork.dev`   | architect                              |
| `manager@planwork.dev` | manager                                |
| `admin@planwork.dev`   | admin                                  |

Each user gets a row in `public.profiles` automatically via the
`handle_new_user` trigger. Default role is `client`.

## 4. Run the seed

In the SQL Editor, paste and execute `supabase/seed.sql`. It will:

- populate the `roles`, `permissions`, `role_permissions` and `app_policies`
  tables;
- upgrade each demo email to its target role;
- create three demo projects, sample messages and notifications.

The seed is idempotent — it can be re-run safely.

## 5. Storage

`0003_storage_buckets.sql` creates three private buckets:

| Bucket               | Purpose                                |
| -------------------- | -------------------------------------- |
| `project-documents`  | Client uploads (PDF, DWG, sketches…)   |
| `project-deliverables` | Architect / manager final outputs    |
| `profile-avatars`      | Profile pictures                     |

All three are **private**. Reads use short-lived signed URLs generated from
the app (`src/lib/client/upload.ts → getSignedDocumentUrl`). Writes are
gated by RLS policies on `storage.objects` that mirror
`public.can_access_project`.

## 6. Configure the app

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...       # enabled publishable key (sb_publishable_...)
SUPABASE_SERVICE_ROLE_KEY=...           # admin-only, server-only
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start the app:

```bash
npm install
npm run dev
```

Sign in with `client@planwork.dev` / your chosen password.

## 7. Production: Vercel

Add the same four environment variables in **Vercel → Settings → Environment
Variables** for *Production*, *Preview* and *Development*. Push the branch and
let Vercel deploy.

> ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It is used only
> by server actions in `src/lib/actions/admin.ts` for admin-managed user
> invitations.
