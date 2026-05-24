-- ============================================================================
-- PlanWork — Initial schema
-- Tables, types, indexes for the B2B SaaS platform.
-- RLS policies live in 0002_rls_policies.sql.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type app_role as enum ('client', 'architect', 'manager', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum (
    'draft','intake','qualified','assigned','in_progress','review','delivered','archived','cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_priority as enum ('low','normal','high','urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_confidentiality as enum ('standard','nda_required','restricted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_message_kind as enum ('message','system','status_change','assignment','quote','file');
exception when duplicate_object then null; end $$;

do $$ begin
  create type quote_status as enum ('draft','sent','accepted','refused','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type deliverable_status as enum ('draft','review','published','archived');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- profiles
-- One row per auth.users entry. Created via trigger.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role app_role not null default 'client',
  company text,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_is_active_idx on public.profiles(is_active);

-- ----------------------------------------------------------------------------
-- roles  &  permissions  &  role_permissions
-- Configurable RBAC. The app_role enum on profiles stays the authoritative
-- role, but the catalog of permissions per role lives in these tables so
-- admins can adjust without code changes.
-- ----------------------------------------------------------------------------
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name app_role unique not null,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  description text,
  category text,
  created_at timestamptz not null default now()
);

create index if not exists permissions_category_idx on public.permissions(category);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- ----------------------------------------------------------------------------
-- projects
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  client_id uuid not null references public.profiles(id) on delete restrict,
  manager_id uuid references public.profiles(id) on delete set null,
  architect_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  project_type text,
  status project_status not null default 'intake',
  priority project_priority not null default 'normal',
  confidentiality project_confidentiality not null default 'standard',
  expected_delivery_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_client_idx on public.projects(client_id);
create index if not exists projects_manager_idx on public.projects(manager_id);
create index if not exists projects_architect_idx on public.projects(architect_id);
create index if not exists projects_status_idx on public.projects(status);

-- Generate human-readable reference (e.g. PRJ-202605-0001) before insert.
create or replace function public.generate_project_reference()
returns trigger
language plpgsql
as $$
declare
  next_seq int;
begin
  if new.reference is null or new.reference = '' then
    select coalesce(count(*), 0) + 1 into next_seq
    from public.projects
    where created_at >= date_trunc('month', now());
    new.reference := 'PRJ-' || to_char(now(), 'YYYYMM') || '-' || lpad(next_seq::text, 4, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists projects_set_reference on public.projects;
create trigger projects_set_reference
  before insert on public.projects
  for each row execute function public.generate_project_reference();

-- ----------------------------------------------------------------------------
-- project_documents
-- ----------------------------------------------------------------------------
create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint,
  document_category text,
  created_at timestamptz not null default now()
);

create index if not exists project_documents_project_idx on public.project_documents(project_id);

-- ----------------------------------------------------------------------------
-- project_messages
-- ----------------------------------------------------------------------------
create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null,
  message_type project_message_kind not null default 'message',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists project_messages_project_idx on public.project_messages(project_id);
create index if not exists project_messages_sender_idx on public.project_messages(sender_id);

-- ----------------------------------------------------------------------------
-- project_events  (timeline)
-- ----------------------------------------------------------------------------
create table if not exists public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  label text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists project_events_project_idx on public.project_events(project_id);

-- ----------------------------------------------------------------------------
-- quotes  &  quote_items
-- ----------------------------------------------------------------------------
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  reference text,
  status quote_status not null default 'draft',
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'EUR',
  notes text,
  valid_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quotes_project_idx on public.quotes(project_id);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  label text not null,
  description text,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  total numeric(12,2) generated always as (quantity * unit_price) stored,
  position int not null default 0
);

create index if not exists quote_items_quote_idx on public.quote_items(quote_id);

-- ----------------------------------------------------------------------------
-- deliverables
-- ----------------------------------------------------------------------------
create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  file_path text,
  status deliverable_status not null default 'draft',
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deliverables_project_idx on public.deliverables(project_id);

-- ----------------------------------------------------------------------------
-- notifications
-- ----------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_unread_idx on public.notifications(user_id) where read_at is null;

-- ----------------------------------------------------------------------------
-- audit_logs
-- ----------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_target_idx on public.audit_logs(target_type, target_id);

-- ----------------------------------------------------------------------------
-- app_policies  (application-level GPO / settings managed by admins)
-- ----------------------------------------------------------------------------
create table if not exists public.app_policies (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  description text,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- updated_at helper
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

drop trigger if exists deliverables_set_updated_at on public.deliverables;
create trigger deliverables_set_updated_at
  before update on public.deliverables
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Profile auto-creation on signup
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, company)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::app_role, 'client'),
    new.raw_user_meta_data->>'company'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Helper functions used by RLS and app code
-- ----------------------------------------------------------------------------
create or replace function public.current_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_manager_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role in ('manager','admin') from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.can_access_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.projects p
    where p.id = p_project_id
      and (
        public.is_admin()
        or p.client_id = auth.uid()
        or p.manager_id = auth.uid()
        or p.architect_id = auth.uid()
        or (public.current_role() = 'manager')
      )
  );
$$;
