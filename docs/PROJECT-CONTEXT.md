# LINETECH — Current Project Context

> **Purpose:** A handoff document for a new ChatGPT conversation, coding agent, or contributor. Read this file first, then `docs/PROJECT-CONTEXT.json`, `docs/LINETECH-SITEMAP.md`, and `README.md`.

## Current status

- **Repository:** [mohammedwaleedmousa/-LINETECH](https://github.com/mohammedwaleedmousa/-LINETECH)
- **Working branch:** `codex/sitemap-alignment-audit`
- **Context last updated:** 2026-10-11
- **Phase:** Sitemap alignment implementation and baseline QA audit.
- **Implemented on this branch:** Primary navigation now links to the existing Service Finder, How We Work, and Contact routes in both Arabic and English. `public/sitemap.xml` now uses the canonical `/contact` path without a trailing slash.
- **Important:** This is an in-progress change. Automated tests/build have not yet been verified for this commit, no route or file was deleted, and nothing has been merged into `main`.

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

The latest known GitHub Actions QA run is [run 37109102547](https://github.com/mohammedwaleedmousa/-LINETECH/actions/runs/37109102547), on `main`, created 2026-10-03, and its result was **failure**. A fresh PR run also failed, but the available connector returned no step summaries and a 404 for logs; the root cause is therefore still unconfirmed. Do not guess or suppress the failing check.

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

### 2026-10-11 — Sitemap alignment implementation
- Updated `app/SiteNav.tsx` to expose the existing `/service-finder`, `/how-we-work`, and `/contact` routes in the primary desktop/mobile navigation, with Arabic and English labels.
- Updated `public/sitemap.xml` to use the canonical `/contact` URL without a trailing slash.
- Validation status: static content review only; automated tests and production build remain pending because the QA workflow failure has not yet provided accessible step logs.
- No routes/files were deleted and nothing was merged to `main`.

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
