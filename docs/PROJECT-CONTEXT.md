# LINETECH current context — 2026-11-21

Repository: `mohammedwaleedmousa/-LINETECH`. The public-site launch pass builds on main `4baf12f`. Earlier storefront changes and SQL migration history remain in Git.

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

The primary navigation is Home, Services, Projects, About and Contact. The Services hero points to available custom services while the product catalog is empty. Service and aftercare links preselect the relevant option in the public enquiry form, which carries product and offer details into its localized draft when applicable.

`lib/navigation/route-policy.ts` owns canonical public/utility/legacy/retired paths; sitemap mirrors it. Removed page files/components/unused CSS are deleted. Company APIs no longer reach a backend. Removed document routes return 410, while consolidated service/category and legacy project routes use query-preserving 308 redirects. Auth protections, RLS, existing customer data and all SQL migrations are retained.

Shared CSS files are flattened verbatim in original cascade order into `app/site-foundation.css`; scoped new product rules live in `app/storefront.css`. Page/module styles remain. This avoids another layer of patch files while retaining the home baseline. It does not claim a full selector-level rewrite.

## Current validation

The launch pass extends the existing localization suite with checks for service and aftercare preselection, Arabic draft content, and product context in email and WhatsApp enquiries. The production build includes route, security, migration, storefront, and exported SEO checks. The prior storefront cleanup included browser layout checks at 320, 390, 768 and 1440 pixels.

## Rollout and remaining work

On 2026-11-21 the eight public URLs, sitemap, robots.txt, and browser icon returned HTTP 200 on `linetech.company`. Unauthenticated client and admin project URLs redirected to their sign-in pages. The Worker returned HTTP 503 from `/api/health` with `supabaseAuth: false`. Access to the configured LINETECH Supabase project `vbaomkixvrtuuujcodii` was denied, so the upstream failure and authenticated workflows could not be verified. No remote database changes were made.

Remaining: owner-approved real catalog data/prices/licences/care terms, database-backed catalog editing if wanted, actual product purchase/order/payment processing, multi-product subscription entitlements and renewal/cancellation, invoice/ticket capabilities, verified live deployment and Auth/PostgREST end-to-end checks. Existing legacy service subscriptions continue to use existing account/admin APIs.

## Handoff rules

Keep README and both context files aligned after meaningful changes. Use the current sitemap and route-policy registry. Preserve the home design and existing customer/security behavior. Do not invent inventory/prices/business claims; keep public unavailable states honest. Inspect imports, links, redirects, auth, tests and assets before deletion. Do not delete customer data or SQL migration history as UI cleanup.
