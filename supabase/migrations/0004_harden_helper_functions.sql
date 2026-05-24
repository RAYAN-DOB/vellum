-- Harden trigger/helper functions before production.
-- Trigger functions do not need to be callable through the API, and all
-- plpgsql helpers pin their search_path to avoid role-mutable resolution.

create or replace function public.generate_project_reference()
returns trigger
language plpgsql
set search_path = public, pg_temp
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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
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

revoke execute on function public.generate_project_reference() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
