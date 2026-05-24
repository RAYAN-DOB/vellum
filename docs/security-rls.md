# Security & RLS — Vellum

All sensitive data lives in Postgres tables protected by Row-Level Security.
The middleware and route guards are UX (redirect early, render the right
page); the canonical security boundary is RLS.

## Threat model (MVP scope)

| Threat                                | Mitigation                                                |
| ------------------------------------- | --------------------------------------------------------- |
| Anonymous reads of any table          | RLS — every table has `enable row level security`         |
| Client A reads Client B's project     | `projects_read` policy filters by `client_id = auth.uid()` |
| Architect reads non-assigned project  | Filter by `architect_id = auth.uid()`                     |
| Anyone changes roles                  | `profiles_admin_all` + `is_admin()` helper                |
| Direct storage URL guess              | All buckets private; signed URLs only, 60s TTL            |
| Self-promotion to admin               | `profiles_update_self` blocks role changes by the user    |
| Cookie forgery to bypass middleware   | RLS still applies; queries return zero rows               |
| Service-role key leak to browser      | Lives in `SUPABASE_SERVICE_ROLE_KEY`, server-only         |

## Helper functions

All policies rely on three SQL helpers (defined in `0001_init_schema.sql`):

```sql
current_role()              -- returns the AppRole of the auth.uid() caller
is_admin()                  -- shortcut
is_manager_or_admin()       -- shortcut
can_access_project(uuid)    -- true iff caller is client/manager/architect on the project
```

These are `security definer` so they bypass the policies they themselves
reference — required to avoid recursion.

## Per-role read access

| Resource             | client                | architect             | manager           | admin |
| -------------------- | --------------------- | --------------------- | ----------------- | ----- |
| `profiles`           | self                  | self                  | all               | all   |
| `projects`           | own                   | assigned              | all               | all   |
| `project_documents`  | via `can_access_project` | via `can_access_project` | via `can_access_project` | all |
| `project_messages`   | via `can_access_project` | via `can_access_project` | via `can_access_project` | all |
| `quotes`             | own project           | assigned project      | all               | all   |
| `deliverables`       | own project           | assigned project      | all               | all   |
| `audit_logs`         | —                     | —                     | —                 | all   |

## Per-role write access

| Resource         | client   | architect       | manager         | admin |
| ---------------- | -------- | --------------- | --------------- | ----- |
| Project create   | self     | —               | self            | yes   |
| Project status   | (limited)| assigned        | all             | yes   |
| Architect assign | —        | —               | yes             | yes   |
| Upload document  | own      | assigned        | yes             | yes   |
| Quote create     | —        | —               | yes             | yes   |
| Quote accept     | own      | —               | —               | yes   |
| Manage users     | —        | —               | —               | yes   |
| Manage policies  | —        | —               | —               | yes   |

## Storage policies

Path convention: `{bucket}/{project_id}/{filename}`. The RLS policy
extracts the first path segment with `(string_to_array(name, '/'))[1]::uuid`
and re-uses `can_access_project`.

Avatars live at `profile-avatars/{user_id}/{filename}` and are scoped to the
authenticated user via `auth.uid()::text` comparison.

## Audit trail

Every sensitive action (`role_change`, `user_invited`, `policy_updated`,
`auth.sign_in`, project create / assign / status change…) writes a row to
`audit_logs` via the action helpers in `src/lib/actions/*.ts`.

The `/admin/audit` page surfaces the last 200 entries with the actor's
profile resolved.

## Known limitations / next steps

- **Email enumeration**: `signInWithPassword` returns distinguishable errors.
  Acceptable for a closed B2B platform; tighten with rate-limiting in front of
  Supabase Auth before opening signup.
- **Document virus scan**: not implemented; consider Supabase storage hooks +
  ClamAV before exposing the platform externally.
- **Per-organisation isolation**: currently a single tenant; the
  `metadata.organization_id` column on `profiles` is the natural extension
  point.
- **Soft delete**: hard-delete is currently used (`on delete cascade` /
  `set null`). For audit retention, switch to a `deleted_at` column on
  `projects` and `documents`.
