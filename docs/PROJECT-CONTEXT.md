# Company members and invitations — 2026-10-25

Continued from merged main `728a4fb` on `codex/company-members-invitations`. Implemented an owner-managed team page, internal verified-email invitation inbox, acceptance/decline, cancellation and member removal. The owner is protected from removal; invitations only create the member role. Seven-day invitation expiry is independent of future billing grace policies. No email messages are sent.

New CLI-generated migration `20261025101553_company_members_invitations.sql` adds a RLS-closed invitation table, four public security-invoker wrappers and authenticated, explicitly authorized private helpers. Privileged helpers stay in a non-exposed schema to perform atomic membership writes and verify the current auth-user email/confirmation/ban state. See `docs/company-members-setup.md` for the rationale and rollout checks. Company membership does not grant project access; existing project authorization is preserved.

Changed: company members/inbox UI and client helpers/styles, company overview, company types, Worker company APIs, migration/bootstrap snapshot, company API/database tests and the test command. Owner-only writes, live verified email, replay, expiry, cancellation, removal, tenant isolation and transactional rollback passed in actual local PostgreSQL. Full build and TypeScript passed. Browser fixtures passed 33 checks across Arabic/English at 320/390/768/1440px, including error/retry, owner/member controls, acceptance/decline, cancellation and removal. Mobile Arabic and desktop English screenshots were inspected. Hosted Auth/PostgREST remains untested.

No remote database changed: the connection again lists only Flamingo/Genan and not the configured LINETECH project. Cloudflare remains deferred by the owner. Source readiness is separate from hosted readiness. Next: company project association and per-member access, then rollout against the verified database; billing/commerce remain pending.

---

# Company application implementation — 2026-10-22

The company application slice is implemented in source: form submission/receipt, own status/history, company list/selected overview and admin review queue. `worker/companies.ts` adds bounded/validated authenticated APIs. The CLI-generated migration `20261022183607_company_applications.sql` adds three RLS tables and two security-invoker RPCs. Approval is atomic with owner membership; no project/billing entitlements are activated.

No remote database changed. The connected Supabase account listed Flamingo/Genan but not configured LINETECH project `vbaomkixvrtuuujcodii`. Apply the migration only to the verified LINETECH database and deploy the Worker before claiming the feature is active. Cloudflare sign-in/publication remains pending and was explicitly skipped by the owner. See `docs/company-applications-setup.md`.

API tests and actual PostgreSQL tests pass, including tenant isolation, anonymous denial, client role-spoof denial, replay and transactional rollback. PGlite is a pinned development dependency used only for tests. Existing auth/APIs and customer records are retained. Invitations/member management, company project permissions, paid billing and the 7-day grace policy remain unimplemented.

---

# Design refinement — 2026-10-22

The structural V2 implementation is merged into main at `1f622f2`. The design refinement unifies products/categories, knowledge, pricing, inactive modules, account overview and subscriptions. Shared `app/PlatformUI.tsx` provides scalable SVG icons, headers and empty states; `app/platform-v2.css` is the scoped responsive system. New homepage sections reuse the category card design. Secondary desktop navigation uses a native More disclosure; mobile keeps all public destinations. Company navigation is localized with active-page states.

Catalog and knowledge filters have explicit no-match states and reset actions, verified in Arabic and English. Pricing has no unapproved price/benefit promises and native expandable explanations. Account/subscription views expose retry actions and retain existing APIs/auth. Public-facing text describes what users can do without infrastructure details; inactive modules remain clearly labelled.

Local build, eight prebuild checks and TypeScript passed. Local screenshot review covered 20 AR/EN views of five pages at 390/1440px; the temporary Chromium runtime is outside the repository. Production, signed-in backend workflows, company commerce and tenant isolation remain unverified/unimplemented as documented in the V2 sitemap. Cloudflare deployment is blocked on completion of account sign-in; never claim it succeeded.

---

# LINETECH current project context — 2026-10-22

Current source: `docs/LINETECH-SITEMAP.md` V2, approved for implementation by the owner. Branch: `codex/platform-sitemap-v2`.

The new platform structure includes the public site, unified personal account, inactive company-space structure and expanded admin navigation. Existing account/project/chat/file/handover APIs and security are retained. Six standalone pages have been deleted and moved under canonical service/account routes; legacy Worker redirects preserve project parameters and old notification destinations.

Products and knowledge have working empty-catalog filters. Pricing now displays Basic, Professional and Companies with pending prices/benefits and no purchase action. Existing subscription data remains available through the authenticated account API. Product checkout, publication, licenses, invoice history, company requests/memberships, tenant isolation, invitations, per-member billing and the complete audit backend are **not implemented**. Their pages explicitly state this.

Local `npm run build` passed the eight prebuild checks and static export; `npx tsc --noEmit` passed. Migration tests cover old URLs, project query retention, nested account/company authentication and fail-closed access. Production and configured Supabase workflows have not been tested. Detailed visual QA is recorded in the final change notes when available.

No database schema/data or Supabase configuration was changed. No deployment is claimed. Next: merge reviewed structural migration, approve actual catalog and commercial policies, then implement remaining business modules with backend and authorization tests.

---

## Historical context (superseded by V2 above)

# LINETECH — Current Project Context

> **Purpose:** A handoff document for a new ChatGPT conversation, coding agent, or contributor. Read this file first, then `docs/PROJECT-CONTEXT.json`, `docs/LINETECH-SITEMAP.md`, and `README.md`.

## Current status

- **Repository:** [mohammedwaleedmousa/-LINETECH](https://github.com/mohammedwaleedmousa/-LINETECH)
- **Working branch:** `codex/sitemap-public-route-lockdown`
- **Context last updated:** 2026-10-11
- **Phase:** Public-route allowlist is merged to `main`; GitHub Actions QA failed and the failure root cause remains unconfirmed. Production deployment is not verified.
- **Current implementation:** Public document routes are restricted to the URLs in `public/sitemap.xml`. Unlisted product-category routes are blocked and category cards on `/products` are informational, not links. Required login, protected client/admin routes, API endpoints, static assets, and the non-indexable `/thank-you` handoff remain functional exceptions. Existing LINETECH UI and bilingual support are preserved.
- **Important:** This is an in-progress change. Automated tests/build have not yet been verified for this branch, no route or file was deleted, and this phase has not been merged into `main`.

## Product vision

LINETECH is a technology business combining custom digital services, its own ready-made digital products, product subscriptions, knowledge/research, and customer project workspaces. It is **not** a multi-vendor marketplace. Arabic/English and RTL/LTR are requirements.

Keep two commercial concepts separate:
1. **Custom services and their packages** — the existing `/pricing` currently represents service/package pricing.
2. **LINETECH product/platform subscriptions** — planned tiers and entitlements; do not mix these into service pricing or advertise unconfirmed prices/features.

Do not invent products, prices, plan benefits, client names, or case-study claims.

## Source-of-truth documents

1. [Target sitemap and route-retention rules](LINETECH-SITEMAP.md)
2. [Compact machine-readable context](PROJECT-CONTEXT.json)
3. [Repository README](../README.md)

When these files differ, update them together and keep this context aligned with the actual code and test results. The actual code is the source of truth for implemented behavior; sitemap documents the target.

## Existing architecture and capabilities

- Static-export Next.js frontend, served through Cloudflare Workers.
- Supabase handles authentication, PostgreSQL data, and private project storage.
- Package versions currently pinned in `package.json`: Next.js `15.5.24`, React `19.1.9`, React DOM `19.1.9`.
- Existing client lifecycle: account → project request → client workspace → project chat → files/reviews → notifications → handover.
- Existing admin capabilities described in README include project phases/status, client actions, activity history, project files, rich chat messages, handover items, and team access.
- Existing security controls described in README include Secure/HttpOnly/SameSite cookies, Supabase RLS, private project-file storage, upload type/size/signature checks, cross-origin protections, rate limits, and idempotent project-request creation. Do not weaken or bypass these.

## Target route structure

### Public website
Home; About; Services and service detail pages; service/package Pricing; approved Projects/case studies; How We Work; Service Finder; Contact; FAQ; Knowledge/research index and articles; Privacy; Terms; Start/project intake; Thank-you confirmation.

Existing named routes include `/`, `/about`, `/services`, `/services/web-development`, `/services/ecommerce-systems`, `/services/brand-identity`, `/services/cv-portfolio`, `/pricing`, `/projects`, `/projects/etqan`, `/projects/flamingo-park`, `/projects/ledgerpro`, `/how-we-work`, `/service-finder`, `/contact`, `/faq`, `/privacy`, `/terms`, `/start`, and `/thank-you`.

### Planned product catalog
- `/products` — all products, search/filter, category cards.
- `/products/category/[slug]` — products within a category.
- `/products/[slug]` — product details and supported purchase/subscription model.
- Products are LINETECH-owned. Catalog categories are not proof that a product exists or is ready to sell.

### Individual account and customer work
Existing: `/login`, `/account`, `/workspace`, `/chat`, `/handover`.

Planned: `/company-space/request` and `/company-space`. A person should have one individual account and may belong to multiple company workspaces. Company access and permissions must be enforced server-side. Expired/overdue access should be restricted by policy without deleting customer data.

### Admin
Retain and evolve `/admin`, `/admin/login`, `/admin/account`, `/admin/projects`, `/admin/clients`, `/admin/inbox`, `/admin/billing`, and `/admin/team`. Planned additions include product management, knowledge publishing, subscription entitlements, company requests/memberships, and an audit trail.

## Route-removal rule

A route missing from the sitemap is **not automatically safe to delete**. Before removing or merging a route or file, check:
- imports and component references;
- internal links, navigation, search entries, redirects, and return paths;
- Worker route protection and authentication flows;
- APIs, callbacks, health endpoints, and deployment configuration;
- tests, migrations, and external integrations.

Keep necessary system/auth/API/legal routes even when they are not visible in the main navigation. Prefer a safe redirect or consolidation where appropriate. Never delete customer data, database tables, or migrations as routine sitemap cleanup.

## QA baseline

The latest known GitHub Actions QA run is [run 38138022343](https://github.com/mohammedwaleedmousa/-LINETECH/actions/runs/38138022343), on the 2026-10-11 merge commit, and its result was **failure**. A fresh PR run also failed, but the available connector returned no step summaries and a 404 for logs; the root cause is therefore still unconfirmed. Do not guess or suppress the failing check.

The current `package.json` prebuild pipeline runs:
```bash
npm run test:deps
npm run test:localization
npm run test:routes
npm run test:backend
npm run test:auth
npm run test:worker
npm run test:e2e-contract
npm run test:navigation
```
Then run `npm run build`. Production smoke test command:
```bash
BASE_URL=https://your-production-domain npm run smoke:prod
```

## Work log

### 2026-10-11 — Public route allowlist enforcement
- Added a Cloudflare Worker allowlist matching the current public XML sitemap; unlisted public document routes return a noindex 404.
- Disabled unlisted `/products/category/[slug]` routes and removed public links to them while keeping category labels informational on `/products`.
- Added `/products/category/` to robots disallow rules and added route-policy assertions to the Worker behavior and end-to-end contract tests.
- Preserved `/login`, protected account/workspace/chat/handover/admin flows, APIs, static assets, and `/thank-you` as non-indexable/internal exceptions.
- Validation: GitHub Actions run [38138022343](https://github.com/mohammedwaleedmousa/-LINETECH/actions/runs/38138022343) failed on the merge commit. Detailed step logs were unavailable through the current connection; root cause is unconfirmed. Production build/deployment is not verified.

### 2026-10-11 — Sitemap alignment implementation
- Updated `app/SiteNav.tsx` to expose the existing `/service-finder`, `/how-we-work`, and `/contact` routes in the primary desktop/mobile navigation, with Arabic and English labels.
- Updated `public/sitemap.xml` to use the canonical `/contact` URL without a trailing slash.
- Validation status: static content review only; automated tests and production build remain pending because the QA workflow failure has not yet provided accessible step logs.
- No routes/files were deleted; this phase is on a feature branch and has not been merged to `main`.

## Work log

### 2026-10-11
- Created working branch `codex/sitemap-alignment-audit` from `main`.
- Added `docs/LINETECH-SITEMAP.md` as the target sitemap and route-retention policy.
- Included `/service-finder` after reviewing current navigation/search references.
- Added this handoff document and `docs/PROJECT-CONTEXT.json`.
- No application implementation, deletion, or merge has occurred yet.

## Next steps for any agent

1. Read this file and `docs/PROJECT-CONTEXT.json`, then read `docs/LINETECH-SITEMAP.md` and `README.md`.
2. Inspect the exact failed QA job step/logs from the latest run.
3. Inventory real app routes, navigation, imports, auth guards, APIs, and deployment dependencies.
4. Reproduce the baseline checks on the working branch and record which tests fail before edits.
5. Fix failures without weakening tests or security.
6. Classify each route outside the target sitemap as **retain**, **merge/redirect**, or **remove**, with dependency evidence.
7. Make focused, cohesive changes and verify them before proceeding.
8. **After every meaningful code or configuration change**, update `docs/PROJECT-CONTEXT.json`, `docs/PROJECT-CONTEXT.md`, and `README.md` in the same change set with the actual files changed, behavior, test commands/results, blockers, and next step.
9. Do not merge into `main` until the applicable checks pass and the change is reviewed.

## Documentation update contract

Keep these three artifacts synchronized after each meaningful change:
- `docs/PROJECT-CONTEXT.json`: concise structured state for tools/agents.
- `docs/PROJECT-CONTEXT.md`: readable handoff and work log.
- `README.md`: public project overview, implemented features, QA commands/status, and links to the two context files and sitemap.

Never mark a feature as implemented unless the code exists and the relevant checks support that claim. Record unverified items as pending.

Visual verification limitation (2026-10-22): Playwright could not start because Chromium was unavailable; browser installation failed with truncated download archives. No mobile screenshot QA or live backend validation is claimed.

Final UI verification: 50 responsive checks across 320/390/768/1024/1440px passed in Arabic and English, including desktop More navigation, mobile menu and no runtime errors.

Company UI verification: synthetic browser API fixtures passed submission failure/retry with stable key, receipt/status tracking, required rejection reason, admin approval and selected workspace; 12 responsive views at 320/390/768/1440px passed. Real SQL/RLS was verified independently; hosted Auth/PostgREST remains untested.
