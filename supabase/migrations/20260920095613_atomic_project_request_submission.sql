-- Consolidate INSERT policies and add one atomic client bootstrap RPC.

drop policy if exists project_requests_admin_insert on public.project_requests;
drop policy if exists project_requests_client_insert on public.project_requests;
create policy project_requests_insert_owner_or_admin
on public.project_requests for insert
to authenticated
with check (
  (
    owner_id = (select auth.uid())
    and status = 'submitted'
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists projects_admin_insert on public.projects;
drop policy if exists projects_client_bootstrap_insert on public.projects;
create policy projects_insert_client_bootstrap_or_admin
on public.projects for insert
to authenticated
with check (
  (
    client_id = (select auth.uid())
    and status = 'planned'
    and phase = 1
    and request_id is not null
    and exists (
      select 1
      from public.project_requests pr
      where pr.id = projects.request_id
        and pr.owner_id = (select auth.uid())
        and pr.status = 'submitted'
    )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists conversations_admin_insert on public.conversations;
drop policy if exists conversations_client_bootstrap_insert on public.conversations;
create policy conversations_insert_project_client_or_admin
on public.conversations for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects p
    where p.id = conversations.project_id
      and p.client_id = (select auth.uid())
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create or replace function public.submit_project_request(
  p_name text,
  p_company text,
  p_contact text,
  p_preferred_contact text,
  p_service text,
  p_stage text,
  p_goal text,
  p_audience text,
  p_idea text,
  p_features text,
  p_reference_links text,
  p_budget text,
  p_timing text,
  p_notes text
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_reference text;
  v_request_id uuid;
  v_project_id uuid;
  v_conversation_id uuid;
  v_attempt integer := 0;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if nullif(trim(p_name), '') is null
     or nullif(trim(p_contact), '') is null
     or nullif(trim(p_service), '') is null
     or nullif(trim(p_stage), '') is null
     or nullif(trim(p_goal), '') is null
     or nullif(trim(p_idea), '') is null then
    raise exception 'Required project request fields are missing';
  end if;

  loop
    v_attempt := v_attempt + 1;
    v_reference :=
      'LT-' ||
      to_char(clock_timestamp(), 'YYMMDD') ||
      '-' ||
      lpad((floor(random() * 10000))::integer::text, 4, '0');

    exit when not exists (
      select 1
      from public.project_requests pr
      where pr.reference_number = v_reference
    );

    if v_attempt >= 20 then
      raise exception 'Could not allocate project request reference';
    end if;
  end loop;

  insert into public.project_requests (
    reference_number,
    owner_id,
    status,
    name,
    company,
    contact,
    preferred_contact,
    service,
    stage,
    goal,
    audience,
    idea,
    features,
    reference_links,
    budget,
    timing,
    notes
  )
  values (
    v_reference,
    v_user_id,
    'submitted',
    trim(p_name),
    nullif(trim(p_company), ''),
    trim(p_contact),
    trim(p_preferred_contact),
    trim(p_service),
    trim(p_stage),
    trim(p_goal),
    nullif(trim(p_audience), ''),
    trim(p_idea),
    nullif(trim(p_features), ''),
    nullif(trim(p_reference_links), ''),
    nullif(trim(p_budget), ''),
    nullif(trim(p_timing), ''),
    nullif(trim(p_notes), '')
  )
  returning id into v_request_id;

  insert into public.projects (
    request_id,
    client_id,
    title,
    status,
    phase,
    summary,
    latest_update,
    next_action_title,
    next_action_body,
    next_action_required
  )
  values (
    v_request_id,
    v_user_id,
    trim(p_service),
    'planned',
    1,
    trim(p_idea),
    'Project request submitted.',
    'Move the completed request into the project conversation.',
    'Open project chat so the request can move into scope and proposal.',
    true
  )
  returning id into v_project_id;

  insert into public.conversations (project_id)
  values (v_project_id)
  returning id into v_conversation_id;

  return jsonb_build_object(
    'request_id', v_request_id,
    'reference_number', v_reference,
    'project_id', v_project_id,
    'conversation_id', v_conversation_id,
    'submitted_at', clock_timestamp()
  );
end;
$$;

revoke execute on function public.submit_project_request(
  text,text,text,text,text,text,text,text,text,text,text,text,text,text
) from public;
revoke execute on function public.submit_project_request(
  text,text,text,text,text,text,text,text,text,text,text,text,text,text
) from anon;
grant execute on function public.submit_project_request(
  text,text,text,text,text,text,text,text,text,text,text,text,text,text
) to authenticated;
