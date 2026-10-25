# LINETECH current context — 2026-10-25

Repository: `mohammedwaleedmousa/-LINETECH`. Implementation branch: `codex/storefront-cleanup`, based on main `f8de175`. The owner asked to resolve accumulated versions/pages and implement the focused storefront described in this conversation. This document supersedes previous platform/company/research handoff text; historical details remain in git and SQL migration history.

## Approved scope

- Preserve the current home design, hero, component order, card counts and CSS cascade. Update only retired topic copy and destinations to fit active services/products/care.
- Ready-made websites and applications, product details and direct live demo links.
- Custom website/application projects, retaining existing request/workspace/chat/files/handover.
- Product one-time or monthly offers (either or both), with separate monthly after-sales care plans for products or custom projects.
- Retain projects/portfolio, pricing, about, contact, FAQ, legal, customer account and necessary admin functions.
- Remove company spaces/invitations/per-member billing, knowledge/research, brand/CV service pages, old category pages and standalone finder/process.

## Actual implementation

`lib/catalog.ts` defines bilingual products, multiple offers, licence/renewal terms, safe HTTPS previews and optional care plans. Build validation and filters support the approved model. Inventory/care arrays deliberately remain empty: no approved real products, screenshots, demo URLs, currency/prices or commercial terms were supplied.

Catalog and product detail UI render real configured data. Website publication requires an HTTPS demo. Enquiry links select a published product and known offer/care plan; WhatsApp/email messages include the product/option and require the visitor to review and send. These are enquiries, not payment/order/subscription confirmation. `/admin/products` is a read-only source publication overview, not an online editor.

`lib/navigation/route-policy.ts` owns canonical public/utility/legacy/retired paths; sitemap mirrors it. Removed page files/components/unused CSS are deleted. Company APIs no longer reach a backend. Removed document routes return 410, while consolidated service/category and legacy project routes use query-preserving 308 redirects. Auth protections, RLS, existing customer data and all SQL migrations are retained.

Shared CSS files are flattened verbatim in original cascade order into `app/site-foundation.css`; scoped new product rules live in `app/storefront.css`. Page/module styles remain. This avoids another layer of patch files while retaining the home baseline. It does not claim a full selector-level rewrite.

## Current validation

Full local build (including ten prebuild suites) and `npx tsc --noEmit` passed. 168 static references resolve to 38 app routes or existing assets. Browser verification passed 62 checks in AR/EN at 320/390/768/1440px, including empty catalog/reset, sale-model pages and absence of retired links. Home hero/font metrics, section classes/order and card counts matched the pre-cleanup export at 390/1440px in both languages. Mobile pricing and desktop home screenshots were inspected. Existing security/lifecycle and historical PostgreSQL migration tests remain in prebuild. New tests cover catalog publication rules, purchase/monthly/care models, direct-demo safety, contextual enquiries, deleted pages, API retirement, redirects and sitemap alignment. React fixture products are never published.

## Rollout and remaining work

No remote database changes are made by this cleanup. Configured LINETECH Supabase project `vbaomkixvrtuuujcodii` was not available in the connected account; do not apply changes to Flamingo/Genan. Last main GitHub Actions run did not start due to a confirmed account billing lock; Cloudflare build failed and production does not establish source parity. New deployment status must be checked after publication; never claim rollout from a merge alone.

Remaining: owner-approved real catalog data/prices/licences/care terms, database-backed catalog editing if wanted, actual product purchase/order/payment processing, multi-product subscription entitlements and renewal/cancellation, invoice/ticket capabilities, verified live deployment and Auth/PostgREST end-to-end checks. Existing legacy service subscriptions continue to use existing account/admin APIs.

## Handoff rules

Keep README and both context files aligned after meaningful changes. Use the current sitemap and route-policy registry. Preserve the home design and existing customer/security behavior. Do not invent inventory/prices/business claims; keep public unavailable states honest. Inspect imports, links, redirects, auth, tests and assets before deletion. Do not delete customer data or SQL migration history as UI cleanup.
