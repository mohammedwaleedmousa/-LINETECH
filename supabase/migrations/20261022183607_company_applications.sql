-- Company applications and approval. No existing tables/data are modified.
create table public.company_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users(id),
  submission_key uuid not null,
  company_name text not null check (char_length(btrim(company_name)) between 2 and 120),
  contact_name text not null check (char_length(btrim(contact_name)) between 2 and 120),
  contact_email text not null check (char_length(contact_email) <= 254 and contact_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  contact_phone text not null default '' check (char_length(contact_phone) <= 40),
  description text not null check (char_length(btrim(description)) between 10 and 2000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  decision_note text not null default '' check (char_length(decision_note) <= 1000),
  company_id uuid,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(applicant_id, submission_key),
  check (
    (status='pending' and reviewed_by is null and reviewed_at is null and company_id is null and decision_note='') or
    (status='rejected' and reviewed_by is not null and reviewed_at is not null and company_id is null and char_length(btrim(decision_note))>=3) or
    (status='approved' and reviewed_by is not null and reviewed_at is not null and company_id is not null)
  )
);
create unique index company_applications_pending_name_idx on public.company_applications(applicant_id, lower(btrim(company_name))) where status='pending';
create index company_applications_review_queue_idx on public.company_applications(status, created_at desc);
create index company_applications_reviewed_by_idx on public.company_applications(reviewed_by);
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.company_applications(id),
  owner_id uuid not null references auth.users(id),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  created_at timestamptz not null default now()
);
create index companies_owner_id_idx on public.companies(owner_id);
alter table public.company_applications add constraint company_applications_company_id_fkey foreign key (company_id) references public.companies(id);
create index company_applications_company_id_idx on public.company_applications(company_id);
create table public.company_memberships (
  company_id uuid not null references public.companies(id),
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  primary key(company_id,user_id)
);
create index company_memberships_user_id_idx on public.company_memberships(user_id);
alter table public.company_applications enable row level security;
alter table public.companies enable row level security;
alter table public.company_memberships enable row level security;
revoke all on public.company_applications,public.companies,public.company_memberships from anon,authenticated;
grant select on public.company_applications,public.companies,public.company_memberships to authenticated;
grant insert(applicant_id,submission_key,company_name,contact_name,contact_email,contact_phone,description) on public.company_applications to authenticated;
grant update(status,decision_note,company_id,reviewed_by,reviewed_at) on public.company_applications to authenticated;
grant insert on public.companies,public.company_memberships to authenticated;
create policy company_applications_read on public.company_applications for select to authenticated using (
  applicant_id=(select auth.uid()) or (select auth.jwt()->'app_metadata'->>'role')='admin'
);
create policy company_applications_submit on public.company_applications for insert to authenticated with check (
  applicant_id=(select auth.uid()) and status='pending' and coalesce((select auth.jwt()->>'is_anonymous'),'false')<>'true'
);
create policy company_applications_review on public.company_applications for update to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role')='admin')
  with check ((select auth.jwt()->'app_metadata'->>'role')='admin' and reviewed_by=(select auth.uid()));
create policy companies_read on public.companies for select to authenticated using (
  owner_id=(select auth.uid()) or (select auth.jwt()->'app_metadata'->>'role')='admin' or
  id in (select company_id from public.company_memberships where user_id=(select auth.uid()))
);
create policy companies_admin_create on public.companies for insert to authenticated with check ((select auth.jwt()->'app_metadata'->>'role')='admin');
create policy company_memberships_read on public.company_memberships for select to authenticated using (
  user_id=(select auth.uid()) or (select auth.jwt()->'app_metadata'->>'role')='admin'
);
create policy company_memberships_admin_create on public.company_memberships for insert to authenticated with check ((select auth.jwt()->'app_metadata'->>'role')='admin');

create function public.submit_company_application(p_submission_key uuid,p_company_name text,p_contact_name text,p_contact_email text,p_contact_phone text,p_description text)
returns public.company_applications language plpgsql security invoker set search_path='' as $$
declare result public.company_applications;
begin
  if auth.uid() is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then raise exception 'Authentication required' using errcode='42501'; end if;
  select * into result from public.company_applications where applicant_id=auth.uid() and submission_key=p_submission_key;
  if found then
    if result.company_name<>btrim(p_company_name) or result.contact_name<>btrim(p_contact_name) or result.contact_email<>lower(btrim(p_contact_email)) or result.contact_phone<>btrim(p_contact_phone) or result.description<>btrim(p_description) then
      raise exception 'Submission key already used' using errcode='22023';
    end if;
    return result;
  end if;
  insert into public.company_applications(applicant_id,submission_key,company_name,contact_name,contact_email,contact_phone,description)
    values(auth.uid(),p_submission_key,btrim(p_company_name),btrim(p_contact_name),lower(btrim(p_contact_email)),btrim(p_contact_phone),btrim(p_description))
    on conflict(applicant_id,submission_key) do nothing returning * into result;
  if not found then
    -- A simultaneous retry may have committed after the first select.
    select * into result from public.company_applications where applicant_id=auth.uid() and submission_key=p_submission_key;
    if result.company_name<>btrim(p_company_name) or result.contact_name<>btrim(p_contact_name) or result.contact_email<>lower(btrim(p_contact_email)) or result.contact_phone<>btrim(p_contact_phone) or result.description<>btrim(p_description) then
      raise exception 'Submission key already used' using errcode='22023';
    end if;
  end if;
  return result;
end $$;

create function public.review_company_application(p_application_id uuid,p_decision text,p_note text)
returns public.company_applications language plpgsql security invoker set search_path='' as $$
declare result public.company_applications; new_company_id uuid;
begin
  if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'role','')<>'admin' then raise exception 'Admin required' using errcode='42501'; end if;
  if p_decision not in ('approved','rejected') or p_decision is null or p_note is null or char_length(p_note)>1000 or (p_decision='rejected' and char_length(btrim(p_note))<3) then raise exception 'Invalid decision' using errcode='22023'; end if;
  select * into result from public.company_applications where id=p_application_id for update;
  if not found then raise exception 'Application not found' using errcode='P0002'; end if;
  if result.status<>'pending' then
    if result.status=p_decision and result.decision_note=btrim(p_note) then return result; end if;
    raise exception 'Application already reviewed' using errcode='40001';
  end if;
  if p_decision='approved' then
    insert into public.companies(application_id,owner_id,name) values(result.id,result.applicant_id,result.company_name) returning id into new_company_id;
    insert into public.company_memberships(company_id,user_id,role) values(new_company_id,result.applicant_id,'owner');
  end if;
  update public.company_applications set status=p_decision,decision_note=btrim(p_note),company_id=new_company_id,reviewed_by=auth.uid(),reviewed_at=now() where id=result.id returning * into result;
  return result;
end $$;
revoke all on function public.submit_company_application(uuid,text,text,text,text,text) from public,anon;
revoke all on function public.review_company_application(uuid,text,text) from public,anon;
grant execute on function public.submit_company_application(uuid,text,text,text,text,text),public.review_company_application(uuid,text,text) to authenticated;
