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

## Project roadmap and agent handoff

The target information architecture and route-retention policy are documented in [`docs/LINETECH-SITEMAP.md`](docs/LINETECH-SITEMAP.md).

For continuity across ChatGPT conversations or coding agents, read these files before starting work:

- [Current project context and work log](docs/PROJECT-CONTEXT.md) — readable handoff, current phase, decisions, QA baseline, and next steps.
- [Compact machine-readable project context](docs/PROJECT-CONTEXT.json) — structured project state for tools and agents.
- [Target sitemap](docs/LINETECH-SITEMAP.md) — intended route structure and rules for retaining/removing routes.

**Documentation rule:** After every meaningful implementation or configuration change, update `docs/PROJECT-CONTEXT.json`, `docs/PROJECT-CONTEXT.md`, and this README in the same change set. Record actual files changed, behavior, test commands/results, blockers, and the next step. Never report an unimplemented feature as complete.

**Current handoff status (2026-10-11):** The current `public/sitemap.xml` is the allowlist for public pages. The Cloudflare Worker returns a noindex 404 for unlisted public document routes; product-category URLs are not linked or exposed until added to the XML sitemap. Required login, authenticated customer/admin routes, API endpoints, static assets, and the non-indexable `/thank-you` handoff remain available for their intended flows. The current LINETECH UI and Arabic/English support are preserved. Automated tests and production build are pending; do not claim deployment success before verification.
