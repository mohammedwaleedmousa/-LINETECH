# LINETECH

Every idea starts with a line.

Technology company turning ideas into real digital products.

## Platform status

The current production architecture is a static Next.js frontend served through Cloudflare Workers with Supabase handling authentication, PostgreSQL data and private project storage.

The implemented client lifecycle is:

`Account → Project request → Client workspace → Project chat → Files / reviews → Notifications → Handover`

The admin workspace can manage project phase/status, client actions, activity history, project files, rich chat messages, handover items and team access.

## Backend safety

- Authenticated sessions use Secure + HttpOnly + SameSite cookies.
- Public project data is protected by Supabase Row Level Security.
- Project files use the private `project-files` bucket.
- Uploads are restricted by type, size and signature checks.
- Mutating APIs reject cross-origin requests.
- Login, project-request, chat and upload flows are rate limited.
- Project-request creation is atomic and idempotent.

## QA

Before a production build, `prebuild` runs dependency, localization, route, backend-schema, auth/worker and end-to-end lifecycle contract checks.

Useful commands:

```bash
npm run test:e2e-contract
npm run build
BASE_URL=https://your-production-domain npm run smoke:prod
```

The production smoke test verifies the Worker health endpoint, security headers, public routes, and authentication redirects for Admin, Workspace, Chat and Handover.
