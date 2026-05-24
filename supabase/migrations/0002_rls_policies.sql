-- ============================================================================
-- PlanWork — Row-Level Security policies
-- See docs/security-rls.md for the full rationale.
-- ============================================================================

alter table public.profiles            enable row level security;
alter table public.roles               enable row level security;
alter table public.permissions         enable row level security;
alter table public.role_permissions    enable row level security;
alter table public.projects            enable row level security;
alter table public.project_documents   enable row level security;
alter table public.project_messages    enable row level security;
alter table public.project_events      enable row level security;
alter table public.quotes              enable row level security;
alter table public.quote_items         enable row level security;
alter table public.deliverables        enable row level security;
alter table public.notifications       enable row level security;
alter table public.audit_logs          enable row level security;
alter table public.app_policies        enable row level security;

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin
  on public.profiles for select
  using (
    id = auth.uid()
    or public.is_admin()
    or public.current_role() = 'manager'
  );

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    -- self-update may not change role or active state
    and role = (select role from public.profiles where id = auth.uid())
    and is_active = (select is_active from public.profiles where id = auth.uid())
  );

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- roles / permissions / role_permissions  (catalog — read-everyone, admin-write)
-- ----------------------------------------------------------------------------
drop policy if exists roles_read on public.roles;
create policy roles_read on public.roles for select using (auth.role() = 'authenticated');

drop policy if exists roles_admin_write on public.roles;
create policy roles_admin_write on public.roles for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists permissions_read on public.permissions;
create policy permissions_read on public.permissions for select using (auth.role() = 'authenticated');

drop policy if exists permissions_admin_write on public.permissions;
create policy permissions_admin_write on public.permissions for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists role_permissions_read on public.role_permissions;
create policy role_permissions_read on public.role_permissions for select using (auth.role() = 'authenticated');

drop policy if exists role_permissions_admin_write on public.role_permissions;
create policy role_permissions_admin_write on public.role_permissions for all
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- projects
-- ----------------------------------------------------------------------------
drop policy if exists projects_read on public.projects;
create policy projects_read on public.projects for select
  using (
    public.is_admin()
    or client_id = auth.uid()
    or manager_id = auth.uid()
    or architect_id = auth.uid()
    or public.current_role() = 'manager'
  );

drop policy if exists projects_insert_client on public.projects;
create policy projects_insert_client on public.projects for insert
  with check (
    client_id = auth.uid()
    or public.is_manager_or_admin()
  );

drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects for update
  using (
    public.is_admin()
    or public.current_role() = 'manager'
    or client_id = auth.uid()           -- a client can edit basic fields of their own project
    or architect_id = auth.uid()        -- assigned architect can update status
  )
  with check (
    public.is_admin()
    or public.current_role() = 'manager'
    or client_id = auth.uid()
    or architect_id = auth.uid()
  );

drop policy if exists projects_delete_admin on public.projects;
create policy projects_delete_admin on public.projects for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- project_documents
-- ----------------------------------------------------------------------------
drop policy if exists project_documents_read on public.project_documents;
create policy project_documents_read on public.project_documents for select
  using (public.can_access_project(project_id));

drop policy if exists project_documents_insert on public.project_documents;
create policy project_documents_insert on public.project_documents for insert
  with check (
    public.can_access_project(project_id)
    and uploaded_by = auth.uid()
  );

drop policy if exists project_documents_delete on public.project_documents;
create policy project_documents_delete on public.project_documents for delete
  using (
    public.is_admin()
    or uploaded_by = auth.uid()
  );

-- ----------------------------------------------------------------------------
-- project_messages
-- ----------------------------------------------------------------------------
drop policy if exists project_messages_read on public.project_messages;
create policy project_messages_read on public.project_messages for select
  using (public.can_access_project(project_id));

drop policy if exists project_messages_insert on public.project_messages;
create policy project_messages_insert on public.project_messages for insert
  with check (
    public.can_access_project(project_id)
    and sender_id = auth.uid()
  );

-- ----------------------------------------------------------------------------
-- project_events
-- ----------------------------------------------------------------------------
drop policy if exists project_events_read on public.project_events;
create policy project_events_read on public.project_events for select
  using (public.can_access_project(project_id));

drop policy if exists project_events_insert on public.project_events;
create policy project_events_insert on public.project_events for insert
  with check (public.can_access_project(project_id));

-- ----------------------------------------------------------------------------
-- quotes / quote_items
-- ----------------------------------------------------------------------------
drop policy if exists quotes_read on public.quotes;
create policy quotes_read on public.quotes for select
  using (public.can_access_project(project_id));

drop policy if exists quotes_manage_manager on public.quotes;
create policy quotes_manage_manager on public.quotes for all
  using (public.is_manager_or_admin())
  with check (public.is_manager_or_admin());

drop policy if exists quote_items_read on public.quote_items;
create policy quote_items_read on public.quote_items for select
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_items.quote_id
        and public.can_access_project(q.project_id)
    )
  );

drop policy if exists quote_items_manage_manager on public.quote_items;
create policy quote_items_manage_manager on public.quote_items for all
  using (public.is_manager_or_admin())
  with check (public.is_manager_or_admin());

-- ----------------------------------------------------------------------------
-- deliverables
-- ----------------------------------------------------------------------------
drop policy if exists deliverables_read on public.deliverables;
create policy deliverables_read on public.deliverables for select
  using (public.can_access_project(project_id));

drop policy if exists deliverables_write_team on public.deliverables;
create policy deliverables_write_team on public.deliverables for all
  using (
    public.is_admin()
    or public.current_role() in ('manager','architect')
  )
  with check (
    public.is_admin()
    or public.current_role() in ('manager','architect')
  );

-- ----------------------------------------------------------------------------
-- notifications
-- ----------------------------------------------------------------------------
drop policy if exists notifications_self on public.notifications;
create policy notifications_self on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists notifications_update_self on public.notifications;
create policy notifications_update_self on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists notifications_insert_authenticated on public.notifications;
create policy notifications_insert_authenticated on public.notifications for insert
  with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- audit_logs
-- ----------------------------------------------------------------------------
drop policy if exists audit_logs_read_admin on public.audit_logs;
create policy audit_logs_read_admin on public.audit_logs for select
  using (public.is_admin());

drop policy if exists audit_logs_insert_authenticated on public.audit_logs;
create policy audit_logs_insert_authenticated on public.audit_logs for insert
  with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- app_policies
-- ----------------------------------------------------------------------------
drop policy if exists app_policies_read on public.app_policies;
create policy app_policies_read on public.app_policies for select
  using (auth.role() = 'authenticated');

drop policy if exists app_policies_write_admin on public.app_policies;
create policy app_policies_write_admin on public.app_policies for all
  using (public.is_admin()) with check (public.is_admin());
