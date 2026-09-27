alter table public.project_files
      drop constraint if exists project_files_bucket_fixed,
      drop constraint if exists project_files_mime_allowed,
      drop constraint if exists project_files_path_safe,
      add constraint project_files_bucket_fixed check (storage_bucket = 'project-files'),
      add constraint project_files_mime_allowed check (
        mime_type is null or mime_type in (
          'image/jpeg','image/png','image/gif','image/webp',
          'audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-wav',
          'application/pdf','text/plain','text/csv',
          'application/zip','application/x-zip-compressed',
          'application/msword','application/vnd.ms-excel','application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        )
      ),
      add constraint project_files_path_safe check (
        storage_path <> ''
        and storage_path !~ '(^|/)\.\.?(/|$)'
        and left(storage_path,1) <> '/'
      );

    alter table public.message_attachments
      drop constraint if exists message_attachments_bucket_fixed,
      drop constraint if exists message_attachments_mime_allowed,
      drop constraint if exists message_attachments_path_safe,
      add constraint message_attachments_bucket_fixed check (storage_bucket = 'project-files'),
      add constraint message_attachments_mime_allowed check (
        mime_type is null or mime_type in (
          'image/jpeg','image/png','image/gif','image/webp',
          'audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-wav',
          'application/pdf','text/plain','text/csv',
          'application/zip','application/x-zip-compressed',
          'application/msword','application/vnd.ms-excel','application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        )
      ),
      add constraint message_attachments_path_safe check (
        storage_path <> ''
        and storage_path !~ '(^|/)\.\.?(/|$)'
        and left(storage_path,1) <> '/'
      );

    alter table public.messages
      drop constraint if exists messages_content_shape,
      add constraint messages_content_shape check (
        (
          kind = 'text'
          and (deleted_at is not null or (text is not null and char_length(text) > 0))
        )
        or
        (
          kind <> 'text'
          and text is null
        )
      );
