alter table public.profiles
  add column if not exists email text;

update public.profiles p
set email = lower(u.email)
from auth.users u
where u.id = p.id
  and u.email is not null
  and p.email is distinct from lower(u.email);

alter table public.profiles
  drop constraint if exists profiles_email_len,
  add constraint profiles_email_len
    check (email is null or char_length(email) <= 320);

create index if not exists profiles_email_lower_idx
  on public.profiles(lower(email))
  where email is not null;

create or replace function private.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.email is not distinct from old.email then
    return new;
  end if;

  update public.profiles
  set email = case when new.email is null then null else lower(new.email) end,
      updated_at = now()
  where id = new.id;

  return new;
end;
$$;

revoke execute on function private.sync_profile_email() from public;
revoke execute on function private.sync_profile_email() from anon;
revoke execute on function private.sync_profile_email() from authenticated;

drop trigger if exists zz_linetech_sync_profile_email on auth.users;
create trigger zz_linetech_sync_profile_email
after insert or update on auth.users
for each row execute function private.sync_profile_email();
