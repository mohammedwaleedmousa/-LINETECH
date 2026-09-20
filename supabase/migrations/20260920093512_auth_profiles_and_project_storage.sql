-- LINETECH auth profile bootstrap and private project storage

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;
grant insert on public.profiles to supabase_auth_admin;

drop policy if exists profiles_auth_service_insert on public.profiles;
create policy profiles_auth_service_insert
on public.profiles for insert
to supabase_auth_admin
with check (true);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, company)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'LINETECH Client'
    ),
    nullif(trim(new.raw_user_meta_data ->> 'company'), '')
  );
  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public;
revoke execute on function private.handle_new_user() from anon;
revoke execute on function private.handle_new_user() from authenticated;
grant execute on function private.handle_new_user() to supabase_auth_admin;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', false, 26214400)
on conflict (id) do nothing;

drop policy if exists linetech_project_files_select on storage.objects;
create policy linetech_project_files_select
on storage.objects for select
to authenticated
using (
  bucket_id = 'project-files'
  and (
    exists (
      select 1
      from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and (
          p.client_id = (select auth.uid())
          or exists (
            select 1
            from public.project_members pm
            where pm.project_id = p.id
              and pm.user_id = (select auth.uid())
          )
        )
    )
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
);

drop policy if exists linetech_project_files_insert on storage.objects;
create policy linetech_project_files_insert
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'project-files'
  and owner_id = (select auth.uid())::text
  and (
    exists (
      select 1
      from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and (
          p.client_id = (select auth.uid())
          or exists (
            select 1
            from public.project_members pm
            where pm.project_id = p.id
              and pm.user_id = (select auth.uid())
          )
        )
    )
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
);

drop policy if exists linetech_project_files_update on storage.objects;
create policy linetech_project_files_update
on storage.objects for update
to authenticated
using (
  bucket_id = 'project-files'
  and (
    (
      owner_id = (select auth.uid())::text
      and exists (
        select 1
        from public.projects p
        where p.id::text = (storage.foldername(name))[1]
          and (
            p.client_id = (select auth.uid())
            or exists (
              select 1
              from public.project_members pm
              where pm.project_id = p.id
                and pm.user_id = (select auth.uid())
            )
          )
      )
    )
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
)
with check (
  bucket_id = 'project-files'
  and (
    owner_id = (select auth.uid())::text
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
);

drop policy if exists linetech_project_files_delete on storage.objects;
create policy linetech_project_files_delete
on storage.objects for delete
to authenticated
using (
  bucket_id = 'project-files'
  and (
    owner_id = (select auth.uid())::text
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
);
