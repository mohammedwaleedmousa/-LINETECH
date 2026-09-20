-- Allow authenticated clients to submit their own request and bootstrap
-- the planned project/conversation needed by the existing workspace/chat UI.
-- Clients still cannot change project state, phase, or commercial decisions.

drop policy if exists project_requests_client_insert on public.project_requests;
create policy project_requests_client_insert
on public.project_requests for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and status = 'submitted'
);

drop policy if exists projects_client_bootstrap_insert on public.projects;
create policy projects_client_bootstrap_insert
on public.projects for insert
to authenticated
with check (
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
);

drop policy if exists conversations_client_bootstrap_insert on public.conversations;
create policy conversations_client_bootstrap_insert
on public.conversations for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects p
    where p.id = conversations.project_id
      and p.client_id = (select auth.uid())
  )
);

alter table public.project_files
  add column if not exists status text not null default 'ready'
    check (status in ('in-progress', 'ready', 'review', 'approved')),
  add column if not exists detail text,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists project_files_set_updated_at on public.project_files;
create trigger project_files_set_updated_at
before update on public.project_files
for each row execute function public.set_updated_at();
