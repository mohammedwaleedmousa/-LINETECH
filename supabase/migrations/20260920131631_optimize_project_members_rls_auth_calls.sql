drop policy if exists project_members_select_self_or_admin
      on public.project_members;

    create policy project_members_select_self_or_admin
      on public.project_members
      for select
      to authenticated
      using (
        user_id = (select auth.uid())
        or (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
      );
