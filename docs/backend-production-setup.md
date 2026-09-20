# LINETECH Backend Production Setup

The frontend UI remains static-exported and unchanged. Runtime backend traffic is handled by the Cloudflare Worker in `worker/`.

## 1. Cloudflare Worker binding

The Worker requires one deployment secret:

- `SUPABASE_PUBLISHABLE_KEY`

Get the publishable key from the LINETECH Supabase project's **Settings > API Keys** page and add it to the Cloudflare Worker as a secret.

`wrangler.jsonc` declares this secret as required, so a Worker deploy should fail rather than publish a partially configured backend when it is missing.

`SUPABASE_URL` is already configured as a non-secret Worker variable.

After deployment, verify:

```text
GET /api/health
```

Expected JSON:

```json
{"ok":true,"backend":"linetech-worker","supabaseAuth":true}
```

## 2. Supabase Auth URL configuration

In the LINETECH Supabase project, open **Authentication > URL Configuration**.

Production Site URL:

```text
https://linetech.aiengineer77.workers.dev
```

Allowed Redirect URL:

```text
https://linetech.aiengineer77.workers.dev/login
```

Signup confirmation and password recovery both return to this exact login URL. The login client handles the returned Auth hash and creates the HttpOnly Worker session.

## 3. First LINETECH administrator

The database and Worker authorize administrative operations only from trusted Supabase `app_metadata.role`.

There are intentionally no default admin users.

After the LINETECH owner account has been created and verified, assign this trusted app metadata using the Supabase Auth admin interface/API:

```json
{"role":"admin"}
```

Do not place authorization roles in `user_metadata`.

The user must receive a refreshed/new JWT after the role is changed before admin APIs recognize the new claim.

## 4. Backend verification

Protected client flow:

1. Create account / confirm email.
2. Sign in.
3. Submit a project request.
4. Confirm Workspace loads the request from Supabase.
5. Send a chat message.
6. Upload an image/document/voice note.
7. Confirm protected download works.
8. Confirm logout removes access to Workspace and Chat.

Administrative APIs:

- `GET /api/admin/projects`
- `GET|PATCH /api/admin/project`
- `GET|POST /api/admin/chat`
- `GET|POST|DELETE /api/admin/members`
- `POST|PATCH /api/admin/files`
- `GET|POST|PATCH /api/admin/handover`

Client APIs:

- `POST /api/project-request`
- `GET /api/workspace`
- `GET|POST|PATCH|DELETE /api/chat/messages`
- `POST /api/chat/upload`
- `GET /api/files/download`
- `GET|PATCH /api/notifications`
- `GET /api/handover`
- `GET /api/health`

## 5. Security rules

- Never expose a Supabase secret/service-role key in frontend code.
- Keep the project file bucket private.
- Preserve RLS on all public LINETECH tables.
- Admin authorization must continue to use trusted `app_metadata`.
- Do not replace the atomic `submit_project_request` RPC with multi-request client inserts.
- Keep Worker state-changing APIs same-origin protected.
