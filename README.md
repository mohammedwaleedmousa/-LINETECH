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

**Current handoff status (2026-10-22):** V2 platform sitemap implementation is on `codex/platform-sitemap-v2`. Existing service intake, account settings, projects, messages and handover are reused under the new structure. Six old standalone page routes are removed and redirect to their canonical service/account destinations. Product and knowledge sections have empty-catalog filters. Public pricing now shows Basic, Professional and Companies without unapproved prices or purchase actions. Company spaces, product/content administration and audit pages explicitly identify their inactive state; memberships, commerce, tenant RLS and per-member billing still require implementation. Existing database records and migration history remain unchanged. All asset requests run through the Worker. Local build (including all eight prebuild checks) and TypeScript checks passed. Production deployment and database-backed smoke testing remain unverified.

Visual verification limitation (2026-10-22): Playwright could not start because Chromium was unavailable; browser installation failed with truncated download archives. No mobile screenshot QA or live backend validation is claimed.

## Design refinement — 2026-10-22

The V2 pages now share a responsive dark/blue design system: illustrated headers, category icons, searchable catalogs, explicit empty states, plan cards and expandable policy answers. Account/subscription pages include clear loading/error states and retry actions. Desktop navigation groups secondary pages under More; company navigation follows the selected language. No catalog inventory, prices or business capabilities were fabricated.

The structural V2 change was merged into main at `1f622f2da5ce7deb0217c0b8c729e0ec08bdf6a5`. Cloudflare publication remains pending account sign-in. The prior browser-install blocker was resolved for local development using a temporary Chromium runtime; no browser dependency was added to this repository. Local screenshot review covered AR/EN products, knowledge, pricing, account and company pages at 390px and 1440px. Build, localization interaction checks and TypeScript pass. This is local UI validation, not production or authenticated backend validation.

Final UI verification: 50 responsive checks across 320/390/768/1024/1440px passed in Arabic and English, including desktop More navigation, mobile menu and no runtime errors.

## Company applications — 2026-10-22

Company request submission, status tracking, admin approval/rejection and the approved-company overview now have backend/UI implementations. Approval creates the company and owner membership atomically; applicant identity and company visibility are enforced in PostgreSQL RLS. Repeated submissions reuse a stable key. Payment, invitations and company project access are not enabled by approval.

**Rollout pending:** the configured LINETECH Supabase project is not available through the current connection. No remote database was modified and Cloudflare remains unpublished. Apply the new migration to the verified LINETECH database, then deploy the Worker; see [company rollout](docs/company-applications-setup.md). Missing schema/RPCs produce an unavailable state rather than false success.

`npm run test:companies` runs API boundary tests and real PostgreSQL migration/RPC/RLS tests using pinned dev-only PGlite. The build now includes this suite. Local tests verify idempotency, review authorization, rejection reasons, company isolation and rollback on membership failure.

Company UI verification: synthetic browser API fixtures passed submission failure/retry with stable key, receipt/status tracking, required rejection reason, admin approval and selected workspace; 12 responsive views at 320/390/768/1440px passed. Real SQL/RLS was verified independently; hosted Auth/PostgREST remains untested.
