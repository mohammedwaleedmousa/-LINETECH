# LINETECH storefront sitemap — 2026-10-25

Owner-approved focus: ready-made websites/applications with direct previews; custom website/application projects; one-time purchases, monthly product subscriptions and separate after-sales care. Preserve the home design and order. This replaces the earlier platform/company/research sitemap.

The executable route source is `lib/navigation/route-policy.ts`.

| Area | Routes | Behavior |
| --- | --- | --- |
| Home | `/` | Preserved layout, hero and section order; relevant product/care copy and active links |
| Catalog | `/products` | One catalog; website/app, search and purchase/monthly filters |
| Product detail | `/products/view?product=<slug>` | Static shell, approved catalog data, HTTPS demo, offers, licence, renewal, care; noindex |
| Custom development | `/services` | Websites/apps/stores; selection and process sections consolidated here |
| Service detail | `/services/web-development`, `/services/app-development`, `/services/ecommerce-systems` | Current custom service scope |
| Project request | `/services/request` | Existing authenticated submission and account project tracking |
| Work portfolio | `/projects` and existing three case studies | Separate from products for sale; existing content retained |
| Pricing | `/pricing`, `#purchase-options`, `#aftercare` | One-time, monthly and after-sales models; actual offer prices only from approved inventory |
| Information | `/about`, `/contact`, `/faq`, `/privacy`, `/terms` | Current support/contact channels and retained legal documents |
| Account | `/account`, `/account/profile`, `/account/orders`, `/account/subscriptions`, `/account/billing`, `/account/support` | Existing profile/subscription reads; orders/invoice/ticket capabilities still show honest inactive states |
| Project workspace | `/account/projects`, `/account/projects/messages`, `/account/projects/handover` | Existing protected project lifecycle |
| Admin | `/admin`, `/admin/projects`, `/admin/clients`, `/admin/inbox`, `/admin/billing`, `/admin/team`, `/admin/account`, `/admin/products` | Existing functions retained; catalog view is source-controlled/read-only |
| System | `/login`, `/admin/login`, `/thank-you`, `/api/*`, assets | Auth/callback and existing technical behavior retained |

## Removed and consolidated

- Knowledge/research and all company-space/account-company/admin-company pages: deleted; document routes return 410.
- Company application/member/invitation APIs: removed from Worker routing and return 410; SQL migrations/data are retained.
- Admin content/research and incomplete audit placeholder: deleted; routes return 410.
- Brand identity and CV service pages: deleted; old URLs redirect to `/services`.
- Finder and process standalone/nested pages and their unused components: deleted; old URLs redirect to `/services#choose` or `/services#process`.
- Six category pages: deleted; website/app URLs redirect to corresponding catalog filters; other old categories redirect to `/products`.
- `/start`, `/workspace`, `/chat`, `/handover`: old page files already removed; aliases continue to preserve project query parameters.
- Existing customer identities, projects, messages, files, billing records and migration history are not deleted.

## Commerce state

The catalog/model/detail/enquiry UI is implemented. Real approved products/prices and payment arrangements are not supplied, so the source catalog is empty and there is no live checkout or automatic subscription entitlement. The same product can configure one-time and monthly offers; care is independent and can also apply to custom projects. Existing legacy service subscriptions are not relabelled as product subscriptions.
