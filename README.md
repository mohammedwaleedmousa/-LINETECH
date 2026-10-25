# LINETECH

Every idea starts with a line.

LINETECH sells ready-made websites and applications and develops custom projects. Products can offer one-time purchase, monthly subscription, or both. After-sales care covers the agreed maintenance, support, updates and hosting for a product or custom project.

## Current implementation

- The home layout, hero, component order and visual baseline are retained. Retired section copy and destinations now point to products, custom services and after-sales care.
- One product catalog with website/application filters, bilingual search and purchase/monthly filters.
- Product detail view at `/products/view?product=<slug>` with features, screenshots, licence, renewal terms, offers and a direct HTTPS demo link in a new tab.
- Optional monthly care plans linked to products and presented separately from purchase prices.
- Contextual WhatsApp/email enquiries include the actual approved product and offer. The visitor reviews and sends the message; this does not create a paid order or activate a subscription.
- Existing authenticated custom project request → project workspace → chat/files → handover workflows remain.
- Existing account and service subscription records and admin billing remain. Product checkout, multiple product subscription entitlements and automatic payment/renewal/cancellation are not implemented.
- `/admin/products` provides a read-only publication/validation overview of the source-controlled catalog. Product editing is through `lib/catalog.ts`, not a database-backed admin editor.

No inventory, demo URLs, prices, plan benefits or customer claims have been fabricated. The real catalog and care-plan arrays are empty until the owner supplies approved product information. `npm run build` rejects invalid product identities, unsafe demos, invalid offers or missing licences/renewal terms.

## Focused navigation and retired sections

Home · Products · Services · Projects · Plans & Pricing · About · Contact · Support & FAQ · Account.

Knowledge/research, company spaces/invitations/member billing, standalone service finder/process and brand/CV services are retired from this release. Company APIs return 410; they are not routed to a backend. Company SQL migration history and existing customer/database records are retained.

`lib/navigation/route-policy.ts` is the canonical route inventory. `public/sitemap.xml` must match its public routes. Legacy project links preserve their query parameters. Former product categories redirect to catalog filters. Retired company/knowledge/admin sections return 410 before asset handling. Removed page files and unused components/styles are deleted, not copied into a second implementation.

## Architecture and security

Next.js 15.5.24 / React 19.1.9 static export, Cloudflare Worker, Supabase Auth/PostgreSQL and private project storage. Existing secure HttpOnly cookies, RLS, private file checks, request idempotency, rate limits and admin authorization are preserved. No database migration or remote data change is introduced by this cleanup.

The previous shared CSS cascade is flattened into `app/site-foundation.css` in exactly its existing order. `app/site.css` imports that baseline and scoped storefront rules. Page-specific/module styles remain. This consolidation preserves the selected home appearance; it does not claim that every historical selector has been optimized away.

## Validation

```bash
npm ci --no-audit --no-fund
npm run build
npx tsc --noEmit
npm run test:storefront
```

Prebuild retains dependency, localization, routes, backend, auth, Worker, lifecycle, navigation and historical migration checks, and adds storefront business/retirement checks. Localization tests exercise product cards, direct demo links, product details, monthly offers and contextual enquiries using fixtures removed before completion. No fixtures are in the published catalog.

Optional browser tests use a development Playwright installation:

```bash
PLAYWRIGHT_MODULE=/path/to/playwright CHROMIUM_PATH=/path/to/chromium node tests/storefront-browser.cjs
```

`HOME_BASELINE_OUT` optionally points to the pre-cleanup static export for visual metric comparison. `SCREENSHOT_DIR` optionally writes temporary screenshots. Hosted Auth/PostgREST, payment processing and deployment need separate verification.

## Handoff

Read [current context](docs/PROJECT-CONTEXT.md), [structured context](docs/PROJECT-CONTEXT.json), [sitemap](docs/LINETECH-SITEMAP.md) and [catalog publication guide](docs/CATALOG-PUBLISHING.md).

After meaningful code/config changes, update README and both context files together with actual behavior, checks and blockers. Current local verification and rollout status are recorded there. Never describe a requested purchase, local fixture or source change as a successful payment, activated subscription or verified production deployment.

Local verification: production build and TypeScript passed; all ten prebuild suites passed. 62 browser checks passed across AR/EN and 320/390/768/1440px. Home hero/font metrics, section order and card counts matched the pre-cleanup export at phone/desktop widths; screenshots reviewed. No production/payment readiness is implied.
