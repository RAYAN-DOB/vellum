# PlanWork

B2B SaaS platform to capture, qualify, produce and deliver architectural
projects (PDF, DWG, sketches, electrical/plumbing schemas).

Four roles cohabit on the same data:

- **Client** — deposits projects, uploads files, follows status, validates.
- **Architect** — works on assigned projects, sends previews, publishes deliverables.
- **Manager** *(chef de projet)* — qualifies intake, assigns architects, prepares quotes.
- **Admin** — manages users, roles, permissions, application policies and audits.

## Status

Live MVP on top of Supabase (Postgres + Auth + Storage). RLS is on for every
sensitive table, all sensitive actions are journaled in `audit_logs`. Front
remains premium / architectural (cream + graphite, fine grid, no SaaS blue).

## Stack

- Next.js 16 (App Router, Server Components, Server Actions) — Turbopack build
- React 19, TypeScript strict, Tailwind v4
- Supabase Auth + Postgres + Storage via `@supabase/ssr`
- lucide-react icons, class-variance-authority, tailwind-merge

## Quick start

```bash
cp .env.example .env.local
# Fill in your Supabase URL / anon / service-role keys

npm install
npm run dev   # http://localhost:3000
npm run build # production check
npm run lint
```

See [`docs/supabase-setup.md`](docs/supabase-setup.md) for the full provisioning
walkthrough (create project, run migrations, seed demo data).

## Environment variables

| Name                              | Visibility       | Required |
| --------------------------------- | ---------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | browser + server | yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | browser + server | yes      |
| `SUPABASE_SERVICE_ROLE_KEY`       | **server only**  | for admin invite flow |
| `NEXT_PUBLIC_SITE_URL`            | browser          | recommended |
| `TWENTY_FIRST_API_KEY`            | dev only         | optional |
| `MAGIC_MCP_API_KEY`               | dev only         | optional |

`.env*` is git-ignored except for `.env.example`.

## Routes

```
/                     landing
/login                public sign-in
/register             public sign-up (client only)
/unauthorized         403-style page with role-aware CTA

/client               cockpit client (own projects, stats)
/client/nouveau-projet         dépôt projet + upload Supabase Storage
/client/projets                table de ses projets
/client/projets/[id]           détail, messages, documents
/client/messages               inbox cross-projet
/client/parametres             profil

/chef-projet                   intake → qualification → assignation
/chef-projet/devis             quote builder

/dessinateur                   projets assignés (architect)

/admin                         dashboard admin
/admin/users                   CRUD utilisateurs, rôles, désactivation
/admin/roles                   matrice rôles × permissions
/admin/permissions             catalogue
/admin/policies                politiques applicatives (GPO)
/admin/audit                   audit log
```

## Project layout

```
src/
  app/                 routes (Next App Router)
  components/          UI primitives + role workspaces
    auth/              SignIn / SignUp / SignOut / shells
    client/            cockpit + new-project flow
    manager/           qualification & assignment cockpit
    architect/         assigned projects cockpit
    admin/             user table, permission matrix, policy editor
    project/           project detail (shared client / manager / architect)
    quotes/            quote list & line editor
    ui/                Button, StatusPill, Card, etc.
  lib/
    auth.ts            requireUser, requireRole, hasPermission
    supabase/          server, client, middleware
    actions/           server actions (auth, projects, quotes, admin, profile)
    client/upload.ts   browser-side Storage upload + signed URLs
    project-display.ts shared display constants (status labels, tones)
    projects.ts        server-only project queries
  types/
    database.ts        hand-written DB types
middleware.ts          session refresh + role-based redirects
supabase/
  migrations/0001_init_schema.sql
  migrations/0002_rls_policies.sql
  migrations/0003_storage_buckets.sql
  seed.sql             roles, permissions, demo projects
```

## Documentation

- [`docs/supabase-setup.md`](docs/supabase-setup.md) — provision the backend
- [`docs/security-rls.md`](docs/security-rls.md) — RLS policies & threat model
- [`docs/deployment.md`](docs/deployment.md) — Vercel deploy + smoke tests
- [`docs/roles-permissions.md`](docs/roles-permissions.md) — RBAC model
- [`docs/data-model.md`](docs/data-model.md) — entities & relationships
- [`docs/workflow.md`](docs/workflow.md) — project lifecycle & state machine

## What is not in scope yet

- Payment / Stripe / invoicing
- Native virus scan on uploads
- Real-time presence / typing indicators
- Multi-organisation isolation (single tenant for now)
- Native mobile apps

See [`docs/v2-roadmap.md`](docs/v2-roadmap.md) for the next milestones.
