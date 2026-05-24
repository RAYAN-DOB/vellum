-- ============================================================================
-- Vellum - Realtime publications and business notification triggers
-- ============================================================================

alter table public.projects replica identity full;
alter table public.project_messages replica identity full;
alter table public.project_documents replica identity full;
alter table public.notifications replica identity full;

drop policy if exists quotes_client_decision on public.quotes;
create policy quotes_client_decision on public.quotes for update
  using (
    exists (
      select 1
      from public.projects p
      where p.id = quotes.project_id
        and p.client_id = auth.uid()
    )
  )
  with check (
    status in ('accepted', 'refused')
    and exists (
      select 1
      from public.projects p
      where p.id = quotes.project_id
        and p.client_id = auth.uid()
    )
  );

do $$
declare
  table_name text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach table_name in array array[
      'projects',
      'project_messages',
      'project_documents',
      'notifications'
    ]
    loop
      if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = table_name
      ) then
        execute format('alter publication supabase_realtime add table public.%I', table_name);
      end if;
    end loop;
  end if;
end $$;

create or replace function public.vellum_project_link(
  p_project_id uuid,
  p_role app_role
)
returns text
language sql
stable
set search_path = public, pg_temp
as $$
  select case p_role
    when 'client' then '/client/projets/' || p_project_id::text
    when 'architect' then '/studio/projets/' || p_project_id::text
    when 'manager' then '/manager/projets/' || p_project_id::text
    when 'admin' then '/admin/projects'
    else '/client/projets/' || p_project_id::text
  end;
$$;

create or replace function public.vellum_notify_project_users(
  p_project_id uuid,
  p_actor_id uuid,
  p_title text,
  p_body text,
  p_include_team_fallback boolean default false,
  p_client_only boolean default false
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.notifications (user_id, project_id, title, body, link)
  select distinct recipient.id,
    p_project_id,
    p_title,
    p_body,
    public.vellum_project_link(p_project_id, recipient.role)
  from public.profiles recipient
  join public.projects project on project.id = p_project_id
  where recipient.is_active = true
    and recipient.id is not null
    and (p_actor_id is null or recipient.id <> p_actor_id)
    and (
      (p_client_only and recipient.id = project.client_id)
      or (
        not p_client_only
        and recipient.id in (
          project.client_id,
          project.manager_id,
          project.architect_id
        )
      )
      or (
        p_include_team_fallback
        and recipient.role in ('manager', 'admin')
      )
    );
end;
$$;

create or replace function public.vellum_notify_new_message()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  actor_name text;
  project_title text;
begin
  select coalesce(profile.full_name, profile.email, 'Un membre')
    into actor_name
  from public.profiles profile
  where profile.id = new.sender_id;

  select title into project_title
  from public.projects
  where id = new.project_id;

  perform public.vellum_notify_project_users(
    new.project_id,
    new.sender_id,
    'Nouveau message projet',
    coalesce(actor_name, 'Un membre') || ' a ecrit sur "' || coalesce(project_title, 'un projet') || '".',
    false,
    false
  );

  return new;
end;
$$;

create or replace function public.vellum_notify_new_document()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.vellum_notify_project_users(
    new.project_id,
    new.uploaded_by,
    'Document ajoute',
    new.file_name || ' est disponible dans le dossier.',
    true,
    false
  );

  return new;
end;
$$;

create or replace function public.vellum_notify_status_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status is distinct from old.status then
    perform public.vellum_notify_project_users(
      new.id,
      null,
      'Statut projet mis a jour',
      'Votre projet est passe de ' || old.status::text || ' a ' || new.status::text || '.',
      false,
      true
    );
  end if;

  return new;
end;
$$;

create or replace function public.vellum_notify_quote_sent()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status = 'sent' and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    perform public.vellum_notify_project_users(
      new.project_id,
      new.created_by,
      'Devis pret a consulter',
      'Un devis Vellum est disponible pour validation.',
      false,
      true
    );
  end if;

  return new;
end;
$$;

create or replace function public.vellum_notify_deliverable_published()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status = 'published' and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    perform public.vellum_notify_project_users(
      new.project_id,
      new.uploaded_by,
      'Livrable publie',
      coalesce(new.title, 'Un livrable') || ' est pret dans votre espace client.',
      false,
      true
    );
  end if;

  return new;
end;
$$;

drop trigger if exists vellum_project_messages_notify on public.project_messages;
create trigger vellum_project_messages_notify
  after insert on public.project_messages
  for each row execute function public.vellum_notify_new_message();

drop trigger if exists vellum_project_documents_notify on public.project_documents;
create trigger vellum_project_documents_notify
  after insert on public.project_documents
  for each row execute function public.vellum_notify_new_document();

drop trigger if exists vellum_projects_status_notify on public.projects;
create trigger vellum_projects_status_notify
  after update of status on public.projects
  for each row execute function public.vellum_notify_status_change();

drop trigger if exists vellum_quotes_sent_notify on public.quotes;
create trigger vellum_quotes_sent_notify
  after insert or update of status on public.quotes
  for each row execute function public.vellum_notify_quote_sent();

drop trigger if exists vellum_deliverables_published_notify on public.deliverables;
create trigger vellum_deliverables_published_notify
  after insert or update of status on public.deliverables
  for each row execute function public.vellum_notify_deliverable_published();

revoke execute on function public.vellum_project_link(uuid, app_role) from anon, authenticated;
revoke execute on function public.vellum_notify_project_users(uuid, uuid, text, text, boolean, boolean) from anon, authenticated;
revoke execute on function public.vellum_notify_new_message() from anon, authenticated;
revoke execute on function public.vellum_notify_new_document() from anon, authenticated;
revoke execute on function public.vellum_notify_status_change() from anon, authenticated;
revoke execute on function public.vellum_notify_quote_sent() from anon, authenticated;
revoke execute on function public.vellum_notify_deliverable_published() from anon, authenticated;
