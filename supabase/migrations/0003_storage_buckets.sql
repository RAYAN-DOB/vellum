-- ============================================================================
-- Vellum — Storage buckets and policies
-- ============================================================================
-- All buckets are private. Access is controlled by RLS policies on
-- storage.objects that reference public.can_access_project / public.is_admin.
-- File paths must always start with the project_id segment, e.g.:
--   project-documents/{project_id}/{filename}
--   project-deliverables/{project_id}/{filename}
--   profile-avatars/{user_id}/{filename}
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('project-documents', 'project-documents', false),
  ('project-deliverables', 'project-deliverables', false),
  ('profile-avatars',      'profile-avatars',      false)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- project-documents
-- ----------------------------------------------------------------------------
drop policy if exists "storage project-documents read" on storage.objects;
create policy "storage project-documents read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'project-documents'
    and (
      public.is_admin()
      or public.can_access_project((string_to_array(name, '/'))[1]::uuid)
    )
  );

drop policy if exists "storage project-documents write" on storage.objects;
create policy "storage project-documents write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'project-documents'
    and public.can_access_project((string_to_array(name, '/'))[1]::uuid)
  );

drop policy if exists "storage project-documents delete" on storage.objects;
create policy "storage project-documents delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'project-documents'
    and (
      public.is_admin()
      or owner = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- project-deliverables
-- ----------------------------------------------------------------------------
drop policy if exists "storage project-deliverables read" on storage.objects;
create policy "storage project-deliverables read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'project-deliverables'
    and (
      public.is_admin()
      or public.can_access_project((string_to_array(name, '/'))[1]::uuid)
    )
  );

drop policy if exists "storage project-deliverables write" on storage.objects;
create policy "storage project-deliverables write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'project-deliverables'
    and (
      public.is_admin()
      or public.current_role() in ('manager','architect')
    )
  );

drop policy if exists "storage project-deliverables delete" on storage.objects;
create policy "storage project-deliverables delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'project-deliverables'
    and (public.is_admin() or owner = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- profile-avatars
-- ----------------------------------------------------------------------------
drop policy if exists "storage profile-avatars read" on storage.objects;
create policy "storage profile-avatars read"
  on storage.objects for select to authenticated
  using (bucket_id = 'profile-avatars');

drop policy if exists "storage profile-avatars write" on storage.objects;
create policy "storage profile-avatars write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'profile-avatars'
    and (string_to_array(name, '/'))[1] = auth.uid()::text
  );

drop policy if exists "storage profile-avatars update" on storage.objects;
create policy "storage profile-avatars update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'profile-avatars'
    and (string_to_array(name, '/'))[1] = auth.uid()::text
  );
