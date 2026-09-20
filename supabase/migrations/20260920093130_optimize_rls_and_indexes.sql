-- LINETECH RLS and index optimization

create index if not exists project_members_user_id_idx on public.project_members(user_id);
create index if not exists project_activity_actor_id_idx on public.project_activity(actor_id);
create index if not exists project_files_uploader_id_idx on public.project_files(uploader_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists message_attachments_message_id_idx on public.message_attachments(message_id);
create index if not exists handover_items_project_id_idx on public.handover_items(project_id);
create index if not exists notifications_project_id_idx on public.notifications(project_id);

drop policy if exists profiles_select_own_or_admin on public.profiles;

drop policy if exists profiles_update_own_or_admin on public.profiles;

drop policy if exists profiles_insert_own_or_admin on public.profiles;

drop policy if exists project_requests_select_owner_or_admin on public.project_requests;

drop policy if exists project_requests_admin_insert on public.project_requests;

drop policy if exists project_requests_admin_update on public.project_requests;

drop policy if exists projects_select_client_member_or_admin on public.projects;

drop policy if exists projects_admin_write on public.projects;

drop policy if exists project_members_select_self_project_or_admin on public.project_members;

drop policy if exists project_members_admin_write on public.project_members;

drop policy if exists project_activity_select_project_access on public.project_activity;

drop policy if exists project_activity_admin_write on public.project_activity;

drop policy if exists project_files_select_project_access on public.project_files;

drop policy if exists project_files_insert_project_access on public.project_files;

drop policy if exists project_files_admin_update_delete on public.project_files;

drop policy if exists conversations_select_project_access on public.conversations;

drop policy if exists conversations_admin_write on public.conversations;

drop policy if exists messages_select_conversation_access on public.messages;

drop policy if exists messages_insert_conversation_access on public.messages;

drop policy if exists messages_update_own_or_admin on public.messages;

drop policy if exists message_attachments_select_message_access on public.message_attachments;

drop policy if exists message_attachments_insert_own_message on public.message_attachments;

drop policy if exists message_attachments_admin_update_delete on public.message_attachments;

drop policy if exists handover_items_select_project_access on public.handover_items;

drop policy if exists handover_items_admin_write on public.handover_items;

drop policy if exists notifications_select_own_or_admin on public.notifications;

drop policy if exists notifications_update_own_or_admin on public.notifications;

drop policy if exists notifications_admin_insert_delete on public.notifications;

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
