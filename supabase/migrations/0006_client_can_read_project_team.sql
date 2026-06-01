-- 0006 — Allow project participants to read each other's basic profile.
--
-- Before this migration the profiles SELECT policy only matched the owner row
-- (plus admins and managers), so a CLIENT could not read the name/role of the
-- manager or architect assigned to their own project. The project header then
-- showed "Référent / Dessinateur à confirmer" and the team's messages appeared
-- as "Système" even when the project was assigned.
--
-- shares_project_with() is SECURITY DEFINER (like is_admin / current_role) so the
-- inner lookup on public.projects bypasses RLS and cannot recurse back into the
-- profiles policy. Access is limited to genuine co-participants of a shared
-- project (client / manager / architect), so it never exposes the wider user
-- directory. The application only ever selects id / full_name / role for
-- teammates (see PROJECT_RELATIONS and the message / document joins), so contact
-- details such as email and phone are not sent to the other party.

create or replace function public.shares_project_with(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.projects p
    where auth.uid() in (p.client_id, p.manager_id, p.architect_id)
      and target_profile in (p.client_id, p.manager_id, p.architect_id)
  );
$$;

revoke execute on function public.shares_project_with(uuid) from public, anon;
grant execute on function public.shares_project_with(uuid) to authenticated;

drop policy if exists "profiles_select_shared_project" on public.profiles;
create policy "profiles_select_shared_project"
on public.profiles
for select
to authenticated
using ( public.shares_project_with(id) );
