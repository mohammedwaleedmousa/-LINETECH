# LINETECH — Platform sitemap V2

Approved for implementation by the owner on 2026-10-22. This replaces the previous sitemap and the old rule that excluded all product categories. This is an experimental platform; the sitemap is the target, not a claim that all commerce/company features work.

## Public website

| Section | Canonical routes | Implementation |
| --- | --- | --- |
| Home | `/` | Existing service/project presentation plus product categories, knowledge entry and account CTA |
| Products | `/products`, `/products/category/{websites,mobile-apps,software-saas,brand-design,templates-tools,technical-services}` | Search/type filters and category navigation; empty approved inventory |
| Services | `/services`, existing four service detail routes | Existing custom service presentation |
| Service request | `/services/request` | Existing authenticated, atomic and idempotent project-request workflow |
| Service assistance | `/services/guide`, `/services/process` | Existing finder and process, nested under services |
| Projects | `/projects`, existing case studies | Existing public portfolio; client permissions/content claims require owner review |
| Knowledge & research | `/knowledge` | Article/research/access filters; no published records |
| Plans & pricing | `/pricing` | Basic, Professional, Companies; price/benefits/limits pending approval; no checkout |
| Company | `/about`, `/contact`, `/faq` | Existing information and contact channels |
| Legal | `/privacy`, `/terms` | Existing documents retained; require final policies before commerce launch |
| Authentication | `/login`, `/login?mode=signup`, `/login?mode=forgot` | Existing login/signup/recovery and verification callback |

Product details, article/research details, checkout, licences, paid-content enforcement and product administration require approved inventory and backend implementation. No fictional product or purchasable tier is created.

## Unified personal account

| Route | Purpose | Implementation |
| --- | --- | --- |
| `/account` | Overview | Live authenticated account/subscription summary |
| `/account/profile` | Profile, security, language | Existing account settings |
| `/account/orders` | Purchases, orders and licences | Explicit inactive state; links to existing service projects |
| `/account/subscriptions` | Current subscription | Reads existing account API; no fake cancellation/renewal |
| `/account/projects` | Project requests, execution, milestones, files/reviews | Existing protected workspace |
| `/account/projects/messages` | Project messages | Existing protected chat, preserving project query |
| `/account/projects/handover` | Deliverables and acceptance | Existing protected handover |
| `/account/companies` | Memberships and invitations | Explicit inactive state and company-space request entry |
| `/account/billing` | Personal invoices/payments | Explicit inactive state |
| `/account/support` | Support | Ticket backend pending; working link to contact channels |

## Company spaces

`/company-space/request`, `/company-space`, `/company-space/projects`, `/company-space/members`, `/company-space/billing`, `/company-space/settings`.

All require sign-in. They are explicitly inactive structural pages. Authentication alone is **not** company authorization: do not expose company records until membership authorization and tenant RLS exist. No personal projects are reused as company data. Company requests need LINETECH approval; one personal account may join several companies. Per-member charges, 7-day grace, suspension/restoration and retention are required future behavior. Suspension must not automatically delete data.

## LINETECH administration

Existing `/admin`, `/admin/projects`, `/admin/clients`, `/admin/inbox`, `/admin/billing`, `/admin/team`, `/admin/account` and `/admin/login` remain. New `/admin/companies`, `/admin/products`, `/admin/content`, `/admin/audit` are protected structural pages explicitly marked inactive. Existing project activity is not presented as a complete administrative audit trail. The current owner/admin authorization remains; employee permissions require a separate implementation.

## Retired routes and retained infrastructure

| Removed standalone page | Canonical destination |
| --- | --- |
| `/start` | `/services/request` |
| `/service-finder` | `/services/guide` |
| `/how-we-work` | `/services/process` |
| `/workspace` | `/account/projects` |
| `/chat` | `/account/projects/messages` |
| `/handover` | `/account/projects/handover` |

The old page.tsx files are deleted. Reusable implementation components remain in their existing directories, imported by the canonical pages. Worker 308 redirects preserve query strings for external bookmarks and historical notification destinations. APIs, SQL migration history, account records, project records and files are retained. `/thank-you` remains a non-indexable system handoff. Legal and technical infrastructure remain required even when absent from the business navigation diagram.

Every request passes through the Worker before assets. The public XML sitemap and Worker allowlist must match. Personal/company/admin routes stay outside public discovery.

## Commercial decisions still open

Actual products/services and final categories; public case-study permissions; three subscription tiers' benefits/prices/usage; currencies and payment providers; billing cycles and member changes; licence/update/refund/retention policies; contractual acceptance stages and staff permissions. Old website package prices have been removed from public pricing/intake. Existing commercial records and admin billing are retained as legacy data, not relabelled as the new subscription tiers.

## Delivery phases

1. Public site, catalog/content structure, account and service workflows (structural migration implemented here; commerce backend outstanding).
2. Project management (existing features reused; final contract/acceptance rules outstanding).
3. Company requests, memberships, tenant isolation and member billing (outstanding).
4. SaaS integrations, analytics and enterprise operations (outstanding).
