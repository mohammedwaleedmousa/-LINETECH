-- Internal invitations: no outbound email, billing or project entitlements.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table public.company_invitations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  email text not null check (email=lower(btrim(email)) and char_length(email)<=254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  invited_by uuid not null references auth.users(id),
  status text not null default 'pending' check (status in ('pending','accepted','declined','revoked','expired')),
  expires_at timestamptz not null default (now()+interval '7 days'),
  responded_at timestamptz,
  accepted_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  check (expires_at>created_at),
  check ((status='pending' and responded_at is null and accepted_by is null)
      or (status='accepted' and responded_at is not null and accepted_by is not null)
      or (status in ('declined','revoked','expired') and responded_at is not null and accepted_by is null))
);
create unique index company_invitations_pending_email_idx on public.company_invitations(company_id,email) where status='pending';
create index company_invitations_inbox_idx on public.company_invitations(email,created_at desc) where status='pending';
create index company_invitations_company_history_idx on public.company_invitations(company_id,created_at desc);
create index company_invitations_invited_by_idx on public.company_invitations(invited_by);
create index company_invitations_accepted_by_idx on public.company_invitations(accepted_by);
alter table public.company_invitations enable row level security;
-- Only explicitly authorized RPCs may access invitations; no direct Data API grants.
revoke all on public.company_invitations from public,anon,authenticated;

-- Privileged helpers stay in a non-exposed schema. Every entry checks the live
-- user, never caller-supplied identity, JWT email or editable user_metadata.
create function private.company_actor() returns uuid language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null or coalesce(auth.jwt()->>'is_anonymous','false')='true'
    or not exists(select 1 from auth.users where id=auth.uid() and deleted_at is null and (banned_until is null or banned_until<=now())) then
    raise exception 'Authentication required' using errcode='42501';
  end if;
  return auth.uid();
end $$;

create function private.company_team(p_company_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=private.company_actor(); company public.companies; members jsonb; invitations jsonb;
begin
  select * into company from public.companies where id=p_company_id;
  if not found or not exists(select 1 from public.company_memberships where company_id=p_company_id and user_id=actor) then
    raise exception 'Company unavailable' using errcode='42501';
  end if;
  select coalesce(jsonb_agg(to_jsonb(m)),'[]'::jsonb) into members from (
    select cm.user_id,cm.role,cm.created_at,case when company.owner_id=actor then u.email else null end as email
    from public.company_memberships cm join auth.users u on u.id=cm.user_id
    where cm.company_id=p_company_id order by cm.role desc,cm.created_at limit 101
  ) m;
  invitations:='[]'::jsonb;
  if company.owner_id=actor then
    select coalesce(jsonb_agg(to_jsonb(i)),'[]'::jsonb) into invitations from (
      select id,email,case when status='pending' and expires_at<=now() then 'expired' else status end as status,expires_at,created_at
      from public.company_invitations where company_id=p_company_id order by created_at desc limit 100
    ) i;
  end if;
  return jsonb_build_object('id',company.id,'name',company.name,'owner',company.owner_id=actor,'members',members,'invitations',invitations);
end $$;

create function private.manage_company_team(p_company_id uuid,p_action text,p_email text,p_invitation_id uuid,p_user_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=private.company_actor(); company public.companies; invitation public.company_invitations; normalized_email text:=lower(btrim(p_email));
begin
  -- All mutations lock company then invitation, including acceptance/removal.
  select * into company from public.companies where id=p_company_id for update;
  if not found or company.owner_id<>actor then raise exception 'Owner required' using errcode='42501'; end if;
  if p_action='invite' then
    if normalized_email is null or char_length(normalized_email)>254 or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid email' using errcode='22023'; end if;
    if exists(select 1 from public.company_memberships cm join auth.users u on u.id=cm.user_id where cm.company_id=p_company_id and lower(u.email)=normalized_email) then
      raise exception 'Already a member' using errcode='40001';
    end if;
    update public.company_invitations set status='expired',responded_at=now() where company_id=p_company_id and email=normalized_email and status='pending' and expires_at<=now();
    select * into invitation from public.company_invitations where company_id=p_company_id and email=normalized_email and status='pending';
    if not found then
      insert into public.company_invitations(company_id,email,invited_by) values(p_company_id,normalized_email,actor) returning * into invitation;
    end if;
    return jsonb_build_object('id',invitation.id,'company_id',p_company_id);
  elsif p_action='revoke' then
    select * into invitation from public.company_invitations where id=p_invitation_id and company_id=p_company_id for update;
    if not found then raise exception 'Invitation unavailable' using errcode='P0002'; end if;
    if invitation.status='revoked' then return jsonb_build_object('id',invitation.id); end if;
    if invitation.status<>'pending' then raise exception 'Invitation already answered' using errcode='40001'; end if;
    update public.company_invitations set status='revoked',responded_at=now() where id=invitation.id;
    return jsonb_build_object('id',invitation.id);
  elsif p_action='remove' then
    if p_user_id is null or p_user_id=company.owner_id then raise exception 'Owner cannot be removed' using errcode='22023'; end if;
    delete from public.company_memberships where company_id=p_company_id and user_id=p_user_id and role='member';
    return jsonb_build_object('id',p_user_id);
  end if;
  raise exception 'Invalid action' using errcode='22023';
end $$;

create function private.my_company_invitations() returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=private.company_actor(); verified_email text; result jsonb;
begin
  select lower(email) into verified_email from auth.users where id=actor and email_confirmed_at is not null;
  select coalesce(jsonb_agg(to_jsonb(i)),'[]'::jsonb) into result from (
    select ci.id,ci.company_id,c.name as company_name,ci.email,ci.expires_at,ci.created_at
    from public.company_invitations ci join public.companies c on c.id=ci.company_id
    where ci.email=verified_email and ci.status='pending' and ci.expires_at>now()
    order by ci.created_at desc limit 100
  ) i;
  return result;
end $$;

create function private.respond_company_invitation(p_invitation_id uuid,p_action text) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=private.company_actor(); invitation public.company_invitations; target_company uuid; verified_email text;
begin
  if p_action is null or p_action not in ('accept','decline') then raise exception 'Invalid action' using errcode='22023'; end if;
  select lower(email) into verified_email from auth.users where id=actor and email_confirmed_at is not null;
  select company_id into target_company from public.company_invitations where id=p_invitation_id and email=verified_email;
  if not found then raise exception 'Invitation unavailable' using errcode='42501'; end if;
  perform 1 from public.companies where id=target_company for update;
  select * into invitation from public.company_invitations where id=p_invitation_id for update;
  if invitation.status='accepted' and p_action='accept' and invitation.accepted_by=actor
    and exists(select 1 from public.company_memberships where company_id=target_company and user_id=actor) then
    return jsonb_build_object('id',invitation.id,'company_id',target_company);
  end if;
  if invitation.status='declined' and p_action='decline' then return jsonb_build_object('id',invitation.id); end if;
  if invitation.status<>'pending' or invitation.expires_at<=now() then raise exception 'Invitation no longer active' using errcode='40001'; end if;
  if p_action='accept' then
    insert into public.company_memberships(company_id,user_id,role) values(target_company,actor,'member') on conflict(company_id,user_id) do nothing;
  end if;
  update public.company_invitations set status=case when p_action='accept' then 'accepted' else 'declined' end,responded_at=now(),accepted_by=case when p_action='accept' then actor else null end where id=invitation.id;
  return jsonb_build_object('id',invitation.id,'company_id',target_company);
end $$;

-- Public RPCs are invokers; private is deliberately NOT an exposed API schema.
create function public.company_team(p_company_id uuid) returns jsonb language sql security invoker set search_path='' as $$select private.company_team(p_company_id)$$;
create function public.manage_company_team(p_company_id uuid,p_action text,p_email text default null,p_invitation_id uuid default null,p_user_id uuid default null) returns jsonb language sql security invoker set search_path='' as $$select private.manage_company_team(p_company_id,p_action,p_email,p_invitation_id,p_user_id)$$;
create function public.my_company_invitations() returns jsonb language sql security invoker set search_path='' as $$select private.my_company_invitations()$$;
create function public.respond_company_invitation(p_invitation_id uuid,p_action text) returns jsonb language sql security invoker set search_path='' as $$select private.respond_company_invitation(p_invitation_id,p_action)$$;

revoke all on function private.company_actor(),private.company_team(uuid),private.manage_company_team(uuid,text,text,uuid,uuid),private.my_company_invitations(),private.respond_company_invitation(uuid,text) from public,anon;
revoke all on function public.company_team(uuid),public.manage_company_team(uuid,text,text,uuid,uuid),public.my_company_invitations(),public.respond_company_invitation(uuid,text) from public,anon;
grant execute on function private.company_actor(),private.company_team(uuid),private.manage_company_team(uuid,text,text,uuid,uuid),private.my_company_invitations(),private.respond_company_invitation(uuid,text) to authenticated;
grant execute on function public.company_team(uuid),public.manage_company_team(uuid,text,text,uuid,uuid),public.my_company_invitations(),public.respond_company_invitation(uuid,text) to authenticated;
