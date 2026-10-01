-- Link a selected public pricing plan to a submitted project request.
alter table public.project_requests
  add column if not exists selected_plan_code text null
  references public.plan_catalog(code);

alter table public.project_requests
  drop constraint if exists project_requests_selected_plan_code_length;

alter table public.project_requests
  add constraint project_requests_selected_plan_code_length
  check (selected_plan_code is null or char_length(selected_plan_code) <= 40);

create index if not exists project_requests_selected_plan_code_idx
  on public.project_requests(selected_plan_code)
  where selected_plan_code is not null;

drop function if exists public.submit_project_request(
  uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,text
);

create or replace function public.submit_project_request(
  p_submission_key uuid,
  p_name text,
  p_company text,
  p_contact text,
  p_preferred_contact text,
  p_service text,
  p_plan text,
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
  v_submitted_at timestamptz;
  v_attempt integer := 0;
  v_plan_code text;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if p_submission_key is null then raise exception 'Submission key is required'; end if;

  select pr.id, pr.reference_number, pr.submitted_at, p.id, c.id
    into v_request_id, v_reference, v_submitted_at, v_project_id, v_conversation_id
  from public.project_requests pr
  left join public.projects p on p.request_id = pr.id
  left join public.conversations c on c.project_id = p.id
  where pr.owner_id = v_user_id and pr.submission_key = p_submission_key
  limit 1;

  if v_request_id is not null then
    return jsonb_build_object(
      'request_id',v_request_id,'reference_number',v_reference,'project_id',v_project_id,
      'conversation_id',v_conversation_id,'submitted_at',v_submitted_at,'idempotent_replay',true
    );
  end if;

  if nullif(trim(p_name),'') is null or nullif(trim(p_contact),'') is null
     or nullif(trim(p_service),'') is null or nullif(trim(p_stage),'') is null
     or nullif(trim(p_goal),'') is null or nullif(trim(p_idea),'') is null then
    raise exception 'Required project request fields are missing';
  end if;

  if nullif(trim(p_plan),'') is not null then
    select pc.code into v_plan_code
    from public.plan_catalog pc
    where pc.is_active = true and upper(pc.name) = upper(trim(p_plan))
    limit 1;
    if v_plan_code is null then raise exception 'Invalid or inactive service plan'; end if;
  end if;

  loop
    v_attempt := v_attempt + 1;
    v_reference := 'LT-' || to_char(clock_timestamp(),'YYMMDD') || '-' ||
      lpad((floor(random()*10000))::integer::text,4,'0');
    exit when not exists (
      select 1 from public.project_requests pr where pr.reference_number = v_reference
    );
    if v_attempt >= 20 then raise exception 'Could not allocate project request reference'; end if;
  end loop;

  insert into public.project_requests (
    reference_number,owner_id,submission_key,status,name,company,contact,preferred_contact,
    service,selected_plan_code,stage,goal,audience,idea,features,reference_links,budget,timing,notes
  ) values (
    v_reference,v_user_id,p_submission_key,'submitted',trim(p_name),nullif(trim(p_company),''),
    trim(p_contact),trim(p_preferred_contact),trim(p_service),v_plan_code,trim(p_stage),trim(p_goal),
    nullif(trim(p_audience),''),trim(p_idea),nullif(trim(p_features),''),
    nullif(trim(p_reference_links),''),nullif(trim(p_budget),''),nullif(trim(p_timing),''),
    nullif(trim(p_notes),'')
  ) returning id,submitted_at into v_request_id,v_submitted_at;

  insert into public.projects (
    request_id,client_id,title,status,phase,summary,latest_update,
    next_action_title,next_action_body,next_action_required
  ) values (
    v_request_id,v_user_id,trim(p_service),'planned',1,trim(p_idea),'Project request submitted.',
    'Move the completed request into the project conversation.',
    'Open project chat so the request can move into scope and proposal.',true
  ) returning id into v_project_id;

  insert into public.conversations(project_id)
  values(v_project_id)
  returning id into v_conversation_id;

  return jsonb_build_object(
    'request_id',v_request_id,'reference_number',v_reference,'project_id',v_project_id,
    'conversation_id',v_conversation_id,'submitted_at',v_submitted_at,
    'selected_plan_code',v_plan_code,'idempotent_replay',false
  );
end;
$$;

revoke execute on function public.submit_project_request(
  uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,text,text
) from public;
revoke execute on function public.submit_project_request(
  uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,text,text
) from anon;
grant execute on function public.submit_project_request(
  uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,text,text
) to authenticated;
