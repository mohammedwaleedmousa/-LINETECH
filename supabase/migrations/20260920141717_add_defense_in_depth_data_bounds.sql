alter table public.profiles
      drop constraint if exists profiles_full_name_len,
      drop constraint if exists profiles_company_len,
      drop constraint if exists profiles_phone_len,
      add constraint profiles_full_name_len check (full_name is null or char_length(full_name) <= 120),
      add constraint profiles_company_len check (company is null or char_length(company) <= 160),
      add constraint profiles_phone_len check (phone is null or char_length(phone) <= 50);

    alter table public.project_requests
      drop constraint if exists project_requests_reference_number_len,
      drop constraint if exists project_requests_name_len,
      drop constraint if exists project_requests_company_len,
      drop constraint if exists project_requests_contact_len,
      drop constraint if exists project_requests_preferred_contact_len,
      drop constraint if exists project_requests_service_len,
      drop constraint if exists project_requests_stage_len,
      drop constraint if exists project_requests_goal_len,
      drop constraint if exists project_requests_audience_len,
      drop constraint if exists project_requests_idea_len,
      drop constraint if exists project_requests_features_len,
      drop constraint if exists project_requests_reference_links_len,
      drop constraint if exists project_requests_budget_len,
      drop constraint if exists project_requests_timing_len,
      drop constraint if exists project_requests_notes_len,
      add constraint project_requests_reference_number_len check (char_length(reference_number) <= 32),
      add constraint project_requests_name_len check (char_length(name) <= 120),
      add constraint project_requests_company_len check (company is null or char_length(company) <= 160),
      add constraint project_requests_contact_len check (char_length(contact) <= 200),
      add constraint project_requests_preferred_contact_len check (char_length(preferred_contact) <= 40),
      add constraint project_requests_service_len check (char_length(service) <= 100),
      add constraint project_requests_stage_len check (char_length(stage) <= 100),
      add constraint project_requests_goal_len check (char_length(goal) <= 200),
      add constraint project_requests_audience_len check (audience is null or char_length(audience) <= 1000),
      add constraint project_requests_idea_len check (char_length(idea) <= 5000),
      add constraint project_requests_features_len check (features is null or char_length(features) <= 5000),
      add constraint project_requests_reference_links_len check (reference_links is null or char_length(reference_links) <= 3000),
      add constraint project_requests_budget_len check (budget is null or char_length(budget) <= 100),
      add constraint project_requests_timing_len check (timing is null or char_length(timing) <= 120),
      add constraint project_requests_notes_len check (notes is null or char_length(notes) <= 5000);

    alter table public.projects
      drop constraint if exists projects_phase_range,
      drop constraint if exists projects_title_len,
      drop constraint if exists projects_summary_len,
      drop constraint if exists projects_latest_update_len,
      drop constraint if exists projects_next_action_title_len,
      drop constraint if exists projects_next_action_body_len,
      add constraint projects_phase_range check (phase between 1 and 5),
      add constraint projects_title_len check (char_length(title) <= 300),
      add constraint projects_summary_len check (summary is null or char_length(summary) <= 5000),
      add constraint projects_latest_update_len check (latest_update is null or char_length(latest_update) <= 5000),
      add constraint projects_next_action_title_len check (next_action_title is null or char_length(next_action_title) <= 300),
      add constraint projects_next_action_body_len check (next_action_body is null or char_length(next_action_body) <= 3000);

    alter table public.project_members
      drop constraint if exists project_members_role_len,
      add constraint project_members_role_len check (char_length(member_role) <= 80);

    alter table public.project_activity
      drop constraint if exists project_activity_event_type_len,
      drop constraint if exists project_activity_title_len,
      drop constraint if exists project_activity_detail_len,
      add constraint project_activity_event_type_len check (char_length(event_type) <= 80),
      add constraint project_activity_title_len check (char_length(title) <= 300),
      add constraint project_activity_detail_len check (detail is null or char_length(detail) <= 3000);

    alter table public.project_files
      drop constraint if exists project_files_storage_bucket_len,
      drop constraint if exists project_files_storage_path_len,
      drop constraint if exists project_files_file_name_len,
      drop constraint if exists project_files_mime_type_len,
      drop constraint if exists project_files_file_size_range,
      drop constraint if exists project_files_status_len,
      drop constraint if exists project_files_detail_len,
      add constraint project_files_storage_bucket_len check (char_length(storage_bucket) <= 100),
      add constraint project_files_storage_path_len check (char_length(storage_path) <= 1024),
      add constraint project_files_file_name_len check (char_length(file_name) <= 255),
      add constraint project_files_mime_type_len check (mime_type is null or char_length(mime_type) <= 150),
      add constraint project_files_file_size_range check (file_size > 0 and file_size <= 26214400),
      add constraint project_files_status_len check (char_length(status) <= 50),
      add constraint project_files_detail_len check (detail is null or char_length(detail) <= 1000);

    alter table public.messages
      drop constraint if exists messages_text_len,
      add constraint messages_text_len check (text is null or char_length(text) <= 5000);

    alter table public.message_attachments
      drop constraint if exists message_attachments_storage_bucket_len,
      drop constraint if exists message_attachments_storage_path_len,
      drop constraint if exists message_attachments_file_name_len,
      drop constraint if exists message_attachments_mime_type_len,
      drop constraint if exists message_attachments_file_size_range,
      drop constraint if exists message_attachments_duration_range,
      add constraint message_attachments_storage_bucket_len check (char_length(storage_bucket) <= 100),
      add constraint message_attachments_storage_path_len check (char_length(storage_path) <= 1024),
      add constraint message_attachments_file_name_len check (char_length(file_name) <= 255),
      add constraint message_attachments_mime_type_len check (mime_type is null or char_length(mime_type) <= 150),
      add constraint message_attachments_file_size_range check (file_size > 0 and file_size <= 15728640),
      add constraint message_attachments_duration_range check (duration_seconds is null or duration_seconds between 0 and 86400);

    alter table public.handover_items
      drop constraint if exists handover_items_title_len,
      drop constraint if exists handover_items_description_len,
      add constraint handover_items_title_len check (char_length(title) <= 300),
      add constraint handover_items_description_len check (description is null or char_length(description) <= 5000);

    alter table public.notifications
      drop constraint if exists notifications_title_len,
      drop constraint if exists notifications_body_len,
      add constraint notifications_title_len check (char_length(title) <= 300),
      add constraint notifications_body_len check (body is null or char_length(body) <= 3000);
