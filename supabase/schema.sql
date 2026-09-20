-- LINETECH backend schema foundation
-- Frontend UI is intentionally untouched by this schema.
--
-- Access model:
--   1. Authenticated clients can access only their own data.
--   2. LINETECH staff access is controlled by auth app_metadata.role = 'admin'.
--   3. No anon table grants are created.
--   4. Every public table has Row Level Security enabled.
--
-- This file is the canonical schema draft to apply to the dedicated LINETECH
-- Supabase project once that project has been created and connected.

create type public.project_request_status as enum (
  'submitted',
  'reviewing',
  'scoped',
  'accepted',
  'declined'
);

create type public.project_status as enum (
  'planned',
  'active',
  'waiting_client',
  'review',
  'completed',
  'archived'
);

create type public.message_kind as enum (
  'text',
  'image',
  'audio',
  'document'
);

create type public.project_file_category as enum (
  'brief',
  'reference',
  'deliverable',
  'handover',
  'other'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  company text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_requests (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  status public.project_request_status not null default 'submitted',
  name text not null,
  company text,
  contact text not null,
  preferred_contact text not null,
  service text not null,
  stage text not null,
  goal text not null,
  audience text,
  idea text not null,
  features text,
  reference_links text,
  budget text,
  timing text,
  notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  request_id uuid unique references public.project_requests(id) on delete set null,
  client_id uuid not null references auth.users(id) on delete restrict,
  title text not null,
  status public.project_status not null default 'planned',
  phase smallint not null default 1 check (phase between 1 and 5),
  summary text,
  latest_update text,
  next_action_title text,
  next_action_body text,
  next_action_required boolean not null default false,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'client',
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table public.project_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  title text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploader_id uuid references auth.users(id) on delete set null,
  category public.project_file_category not null default 'other',
  storage_bucket text not null default 'project-files',
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint check (file_size is null or file_size >= 0),
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete restrict,
  kind public.message_kind not null default 'text',
  text text,
  edited_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    (kind = 'text' and text is not null)
    or kind <> 'text'
  )
);

create table public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  storage_bucket text not null default 'project-files',
  storage_path text not null,
  file_name text,
  mime_type text,
  file_size bigint check (file_size is null or file_size >= 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table public.handover_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index project_requests_owner_id_idx on public.project_requests(owner_id);
create index project_requests_status_idx on public.project_requests(status);
create index projects_client_id_idx on public.projects(client_id);
create index projects_status_idx on public.projects(status);
create index project_activity_project_id_created_at_idx on public.project_activity(project_id, created_at desc);
create index project_files_project_id_created_at_idx on public.project_files(project_id, created_at desc);
create index messages_conversation_id_created_at_idx on public.messages(conversation_id, created_at);
create index notifications_user_id_created_at_idx on public.notifications(user_id, created_at desc);
create index project_members_user_id_idx on public.project_members(user_id);
create index project_activity_actor_id_idx on public.project_activity(actor_id);
create index project_files_uploader_id_idx on public.project_files(uploader_id);
create index messages_sender_id_idx on public.messages(sender_id);
create index message_attachments_message_id_idx on public.message_attachments(message_id);
create index handover_items_project_id_idx on public.handover_items(project_id);
create index notifications_project_id_idx on public.notifications(project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public;
revoke execute on function public.set_updated_at() from anon;
revoke execute on function public.set_updated_at() from authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger project_requests_set_updated_at
before update on public.project_requests
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

create trigger handover_items_set_updated_at
before update on public.handover_items
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.project_requests enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_activity enable row level security;
alter table public.project_files enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.handover_items enable row level security;
alter table public.notifications enable row level security;

-- Profiles
create policy profiles_select_own_or_admin
on public.profiles for select
to authenticated
using (
  (select auth.uid()) = id
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy profiles_update_own_or_admin
on public.profiles for update
to authenticated
using (
  (select auth.uid()) = id
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  (select auth.uid()) = id
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy profiles_insert_own_or_admin
on public.profiles for insert
to authenticated
with check (
  (select auth.uid()) = id
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

-- Project requests
create policy project_requests_select_owner_or_admin
on public.project_requests for select
to authenticated
using (
  owner_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy project_requests_admin_insert
on public.project_requests for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy project_requests_admin_update
on public.project_requests for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Projects
create policy projects_select_client_member_or_admin
on public.projects for select
to authenticated
using (
  client_id = (select auth.uid())
  or exists (
    select 1
    from public.project_members pm
    where pm.project_id = projects.id
      and pm.user_id = (select auth.uid())
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy projects_admin_insert
on public.projects for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy projects_admin_update
on public.projects for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy projects_admin_delete
on public.projects for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Project members
create policy project_members_select_self_project_or_admin
on public.project_members for select
to authenticated
using (
  user_id = (select auth.uid())
  or exists (
    select 1
    from public.projects p
    where p.id = project_members.project_id
      and p.client_id = (select auth.uid())
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy project_members_admin_insert
on public.project_members for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy project_members_admin_update
on public.project_members for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy project_members_admin_delete
on public.project_members for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Project activity
create policy project_activity_select_project_access
on public.project_activity for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_activity.project_id
      and (
        p.client_id = (select auth.uid())
        or exists (
          select 1 from public.project_members pm
          where pm.project_id = p.id
            and pm.user_id = (select auth.uid())
        )
      )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy project_activity_admin_insert
on public.project_activity for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy project_activity_admin_update
on public.project_activity for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy project_activity_admin_delete
on public.project_activity for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Files metadata
create policy project_files_select_project_access
on public.project_files for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_files.project_id
      and (
        p.client_id = (select auth.uid())
        or exists (
          select 1 from public.project_members pm
          where pm.project_id = p.id
            and pm.user_id = (select auth.uid())
        )
      )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy project_files_insert_project_access
on public.project_files for insert
to authenticated
with check (
  uploader_id = (select auth.uid())
  and (
    exists (
      select 1
      from public.projects p
      where p.id = project_files.project_id
        and (
          p.client_id = (select auth.uid())
          or exists (
            select 1 from public.project_members pm
            where pm.project_id = p.id
              and pm.user_id = (select auth.uid())
          )
        )
    )
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
);

create policy project_files_admin_update
on public.project_files for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy project_files_admin_delete
on public.project_files for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Conversations
create policy conversations_select_project_access
on public.conversations for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.id = conversations.project_id
      and (
        p.client_id = (select auth.uid())
        or exists (
          select 1 from public.project_members pm
          where pm.project_id = p.id
            and pm.user_id = (select auth.uid())
        )
      )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy conversations_admin_insert
on public.conversations for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy conversations_admin_update
on public.conversations for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy conversations_admin_delete
on public.conversations for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Messages
create policy messages_select_conversation_access
on public.messages for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    join public.projects p on p.id = c.project_id
    where c.id = messages.conversation_id
      and (
        p.client_id = (select auth.uid())
        or exists (
          select 1 from public.project_members pm
          where pm.project_id = p.id
            and pm.user_id = (select auth.uid())
        )
      )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy messages_insert_conversation_access
on public.messages for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and (
    exists (
      select 1
      from public.conversations c
      join public.projects p on p.id = c.project_id
      where c.id = messages.conversation_id
        and (
          p.client_id = (select auth.uid())
          or exists (
            select 1 from public.project_members pm
            where pm.project_id = p.id
              and pm.user_id = (select auth.uid())
          )
        )
    )
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
);

create policy messages_update_own_or_admin
on public.messages for update
to authenticated
using (
  sender_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  (
    sender_id = (select auth.uid())
    and exists (
      select 1
      from public.conversations c
      join public.projects p on p.id = c.project_id
      where c.id = messages.conversation_id
        and (
          p.client_id = (select auth.uid())
          or exists (
            select 1 from public.project_members pm
            where pm.project_id = p.id
              and pm.user_id = (select auth.uid())
          )
        )
    )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

-- Message attachments
create policy message_attachments_select_message_access
on public.message_attachments for select
to authenticated
using (
  exists (
    select 1
    from public.messages m
    join public.conversations c on c.id = m.conversation_id
    join public.projects p on p.id = c.project_id
    where m.id = message_attachments.message_id
      and (
        p.client_id = (select auth.uid())
        or exists (
          select 1 from public.project_members pm
          where pm.project_id = p.id
            and pm.user_id = (select auth.uid())
        )
      )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy message_attachments_insert_own_message
on public.message_attachments for insert
to authenticated
with check (
  exists (
    select 1
    from public.messages m
    where m.id = message_attachments.message_id
      and m.sender_id = (select auth.uid())
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy message_attachments_admin_update
on public.message_attachments for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy message_attachments_admin_delete
on public.message_attachments for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Handover
create policy handover_items_select_project_access
on public.handover_items for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.id = handover_items.project_id
      and (
        p.client_id = (select auth.uid())
        or exists (
          select 1 from public.project_members pm
          where pm.project_id = p.id
            and pm.user_id = (select auth.uid())
        )
      )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy handover_items_admin_insert
on public.handover_items for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy handover_items_admin_update
on public.handover_items for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy handover_items_admin_delete
on public.handover_items for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Notifications
create policy notifications_select_own_or_admin
on public.notifications for select
to authenticated
using (
  user_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy notifications_update_own_or_admin
on public.notifications for update
to authenticated
using (
  user_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  user_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy notifications_admin_insert
on public.notifications for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy notifications_admin_delete
on public.notifications for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Data API privileges.
-- Supabase no longer guarantees that newly created tables are automatically
-- exposed to authenticated clients, so privileges are explicit.
grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.project_requests to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_members to authenticated;
grant select, insert, update, delete on public.project_activity to authenticated;
grant select, insert, update, delete on public.project_files to authenticated;
grant select, insert, update, delete on public.conversations to authenticated;
grant select, insert, update on public.messages to authenticated;
grant select, insert, update, delete on public.message_attachments to authenticated;
grant select, insert, update, delete on public.handover_items to authenticated;
grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant insert, delete on public.notifications to authenticated;

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
