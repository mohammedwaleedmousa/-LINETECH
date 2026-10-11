# LINETECH Product Sitemap & Alignment Rules

Status: target architecture for implementation. This document is the source of truth for route and navigation decisions; it does not claim that every planned feature is already implemented.

## Principles

- Keep the existing application and reuse working routes and capabilities where they fit.
- Align visible navigation and page structure with this sitemap.
- An existing route not listed below must be assessed before removal. Keep it if it supports authentication, authorization, API callbacks, legal/compliance, system health, redirects, or a required user journey; otherwise merge it into the appropriate canonical page or remove it after checking references and tests.
- Do not delete database tables, migrations, APIs, or user data as a side effect of simplifying page navigation.
- Keep custom services separate from ready-made LINETECH products.
- LINETECH sells its own products; this is not a multi-vendor marketplace.
- Keep service project/package pricing separate from platform/product subscription tiers.
- Arabic and English, RTL and LTR, responsive behavior, accessibility, security, and tests are requirements, not optional polish.
- Do not publish invented product listings, prices, subscription benefits, client names, or project details. Use only approved content and clearly marked placeholders where necessary.

## 1. Public website

- `/` — Home
- `/about` — About LINETECH
- `/services` — Custom services overview
- `/services/web-development` — Web development
- `/services/ecommerce-systems` — E-commerce and business systems
- `/services/brand-identity` — Brand identity
- `/services/cv-portfolio` — CV and professional portfolio
- `/pricing` — Current service/package pricing; do not silently mix this with platform subscription tiers
- `/projects` — Approved portfolio and case studies
- `/projects/etqan` — Etqan case study, subject to confidentiality/content review
- `/projects/flamingo-park` — Flamingo Park case study, subject to confidentiality/content review
- `/projects/ledgerpro` — LedgerPro case study, subject to confidentiality/content review
- `/how-we-work` — Service and project delivery process
- `/contact` — Contact
- `/faq` — Frequently asked questions
- `/knowledge` — Knowledge, articles, and research index (planned)
- `/knowledge/[slug]` — Individual article/research item (planned)
- `/privacy` — Privacy policy
- `/terms` — Terms
- `/start` — Project/service intake
- `/thank-you` — Submission confirmation

## 2. Product catalog

- `/products` — Unified catalog with search, filters, and category cards; include an all-products view.
- `/products/category/[slug]` — Filtered category listing.
- `/products/[slug]` — Product detail, suitability, features, pricing model, support/update policy, and purchase or subscription action.
- Catalog categories may include websites, applications, brand assets, software/SaaS, templates, and digital tools. Categories are navigation facets, not promises that a product is available.
- A product may be one-time purchase, subscription, or a time-limited license with a renewal option. Only show the model actually supported by that product.
- Product catalog data must be structured and maintained centrally; avoid hard-coded duplicate product records across pages.

## 3. Individual account and customer workspace

- `/login` — Sign in
- `/account` — Individual account and profile
- `/workspace` — Customer project workspace
- `/chat` — Project conversations
- `/handover` — Delivery and handover
- `/company-space/request` — Request a company workspace (planned; approval by LINETECH required)
- `/company-space` — Company workspace and its projects/products/members (planned)
- A person uses one individual account and may belong to more than one company workspace.
- Company workspace approval, invitations, member access, and billing must be enforced server-side, not only hidden in the UI.
- When access expires or payment is overdue, restrict access according to policy without deleting customer projects or account data.

## 4. Platform subscriptions and billing

- Platform subscription plans are distinct from custom-service packages currently shown on `/pricing`.
- Initial plan concepts: Basic, Professional, and Business/Company. Final names, features, prices, currency support, payment providers, and billing rules must be validated before being marketed.
- Company billing may be per member. The billing start date, 7-day grace period, suspension behavior, reactivation, member removal, prorating, and manual-payment reconciliation require consistent server-side rules.
- Never imply a payment has succeeded until a trusted payment/manual reconciliation flow confirms it.

## 5. LINETECH administration

Retain and evolve the existing administrative area, including:
- `/admin` — Overview
- `/admin/login` — Admin sign-in
- `/admin/account` — Admin account
- `/admin/projects` — Projects and delivery stages
- `/admin/clients` — Clients
- `/admin/inbox` — Incoming requests/messages
- `/admin/billing` — Billing and subscriptions
- `/admin/team` — Team accounts and access

Planned administration capabilities should be added to these existing sections or to a justified new section:
- Product catalog and product content
- Knowledge/research publishing
- Subscription plans and entitlements
- Company workspace requests, memberships, and billing
- Audit trail for sensitive administrative actions

Keep owner-level control available to the business owner. Add staff roles only when needed, using least privilege and auditable access. Do not expose sensitive client project data to staff who do not need it.

## 6. Routes that are not ordinary navigation pages

Routes such as health endpoints, APIs, authentication callbacks, internal confirmation states, and not-found handling do not need to appear in the main sitemap. They must still be retained when required by the application, security model, or integrations. A page omitted from the main menu is not automatically redundant.

## Implementation order

1. Establish the real route inventory, navigation links, inbound references, API dependencies, and current QA failures.
2. Fix the failing quality gates and establish a reproducible baseline.
3. Align public navigation and current pages with the target sitemap; merge or remove only verified redundant pages/assets.
4. Build the product catalog and product-detail foundations without inventing product content.
5. Integrate individual account, subscription entitlements, and billing.
6. Add company workspace request/review, memberships, and permissions.
7. Add the knowledge/research publishing flow.
8. Expand automated tests for routes, navigation, localization, authorization, billing, and production smoke checks.

## Definition of done for each change

- Route and navigation references are valid.
- Arabic/English and RTL/LTR behavior remains correct.
- Authentication and authorization remain server-enforced and fail closed.
- Database migrations are additive and reviewed; no destructive data changes without a recovery plan.
- Automated checks and production build pass, or any external blocker is documented precisely.
- The change is reviewed on a working branch before it is merged to `main`.
