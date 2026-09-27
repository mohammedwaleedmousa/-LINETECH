alter table public.notifications
  add column if not exists action_kind text not null default 'project_update',
  add column if not exists destination text not null default '/workspace';

alter table public.notifications
  drop constraint if exists notifications_action_kind_allowed,
  drop constraint if exists notifications_destination_safe,
  add constraint notifications_action_kind_allowed
    check (action_kind in ('project_update','message','file','handover')),
  add constraint notifications_destination_safe
    check (
      char_length(destination) between 1 and 500
      and left(destination,1) = '/'
      and left(destination,2) <> '//'
    );

create index if not exists notifications_user_unread_created_at_idx
  on public.notifications(user_id, created_at desc)
  where read_at is null;
