# Publishing a real LINETECH product

The current catalog is source-controlled in `lib/catalog.ts`; the admin page is a read-only publication view. Add only owner-approved real inventory. Test fixtures belong in tests, not the product/care arrays.

Each product needs:

- Stable unique ID and lowercase hyphenated slug.
- Arabic/English title, summary, description and business area.
- Category `websites` or `mobile-apps`, supported platforms and bilingual features.
- Real local screenshot paths under `public` and bilingual alternative text.
- An HTTPS demo URL. A published website requires one; an app may omit it until a web demo exists. The UI does not invent a trial/download.
- At least one offer with unique ID, billing `purchase` or `monthly`, bilingual title, included services, licence and renewal/cancellation description. Amount is a nonnegative value or null for a quote; currency is an uppercase ISO currency code.
- Optional IDs of actual after-sales plans. A care plan has monthly billing, bilingual title/summary/inclusions/terms, price/currency and publication state. Its terms must state the actual service scope and renewal conditions.

`published=false` keeps a draft out of storefront search/details and contextual sales messages. A product may contain both billing options without duplicating its record. Care plans are separate from product ownership and can also be agreed for custom project clients.

Run `npm run build`. Catalog tests reject duplicate identities/offers, incomplete bilingual content, invalid prices/currencies, unsafe preview URLs and unknown care-plan references. Inspect both languages and narrow/desktop layouts with the real data before publishing.

Product details: `/products/view?product=<slug>`. This is a noindex static-export shell. A future server-rendered product-slug route can provide per-product SEO when a real catalog/backend is ready.

The enquiry button opens `/contact` with an approved product/offer selection. The contact view prepares a WhatsApp/email message for the visitor to send. No payment is collected and no paid order or entitlement is automatically created. Confirm the quote/payment method and record agreed service subscriptions through the existing administrative process; do not represent that legacy process as a new product payment gateway.
