# Company members and internal invitations

Source implemented on 2026-10-25; hosted rollout remains pending. No remote database or Cloudflare deployment was changed. The connected Supabase account still lists Flamingo and Genan, but not configured LINETECH project `vbaomkixvrtuuujcodii`.

## Behavior

- The approved company owner can create a member invitation by email, cancel a pending invitation and remove a member. Owner removal/transfer and custom roles are not supported.
- Invitations appear under `/account/companies` for a signed-in account with that exact verified email. They expire after seven days. No email delivery service is used or message sent.
- Acceptance creates only the existing `member` role; rejection creates no membership. The owner and members can view the roster; only the owner sees member emails and invitation history.
- Removal immediately revokes the membership-based company view. An old accepted invitation cannot restore a removed membership. A fresh owner invitation is required.
- Repeated creation of the same pending invitation and successful acceptance retries are idempotent. Revoked/expired/declined invitations cannot be accepted.
- Company cards refresh after acceptance; opening a company preserves its ID in the members navigation.
- Rosters display the first 100 members (and disclose truncation); owners see the latest 100 invitations. The inbox shows the latest 100 pending invitations, with a refresh action after responses. These display bounds are not billing or plan limits.

Company project permissions, member billing, payment grace/suspension policies and settings remain separate work. Joining a company does not grant project access or create a paid subscription.

## Migration and access controls

Apply `20261025101553_company_members_invitations.sql` **after** `20261022183607_company_applications.sql`, only to the verified LINETECH database. The fresh-bootstrap snapshot also includes the additions; do not run the full snapshot on an existing database.

The migration adds `company_invitations` with RLS and no direct `anon`/`authenticated` table grants. Public RPC wrappers use `SECURITY INVOKER`. Privileged implementation functions live in the `private` schema, with empty search paths, explicit authenticated EXECUTE grants and an auth-user check on every entry. Keep `private` outside Supabase's exposed API schemas. No service-role key is introduced.

An authenticated user can invoke the explicitly granted helper functions, but they still enforce ownership/identity in their bodies. The helpers are privileged because invitation acceptance must atomically write a membership without granting arbitrary membership INSERT access, and recipient identity must use the current protected auth record. They do not trust JWT email or user metadata. Email confirmation, deletion and ban state are read from `auth.users`; ordinary Data API clients receive no access to that table.

All team writes lock the company before invitation/membership updates, serializing invitation acceptance, cancellation, reinvitation and removal. A failing membership insert rolls back the invitation decision. Existing project tables, RLS and APIs remain unchanged.

API:

- `GET /api/company-team?company=<uuid>`: authorized roster, owner flag, owner-only invitation history.
- `POST /api/company-team`: `invite` with email, `revoke` with invitation ID, or `remove` with member ID; company ID required.
- `GET /api/company-invitations`: current verified recipient's inbox.
- `POST /api/company-invitations`: `accept` or `decline` with invitation ID.

The Worker forwards only validated fields through the user's access token, preserves refreshed cookies, bounds streamed JSON bodies to 16 KiB and uses the existing project-request limiter with a distinct key. Missing RPCs/schema return unavailable rather than a false empty/success state.

## Verification and rollout

`npm run test:companies` covers the existing company application suites plus new API and actual PostgreSQL/PGlite invitation tests. New checks cover identity spoofing, owner/member permissions, tenant isolation, replay, cancellation, expiry, removal, unverified/changed email, anonymous/banned accounts and transactional rollback.

Before live use:

1. Verify the target project and apply both company migrations through the deployment process.
2. Run security/performance advisors on that project. Confirm invitations have RLS, table grants remain closed, public wrappers are invokers, helper EXECUTE is not granted to PUBLIC/anon, and `private` is not API-exposed.
3. Deploy the Worker and static build together. Cloudflare remains deferred by the owner.
4. Test with distinct real owner, invited member and unrelated accounts through Supabase Auth/PostgREST. Verify email change, cancellation and removed-member access. Local SQL and browser fixtures do not replace this staging verification.


Optional browser fixtures are committed in `tests/company-members-browser.cjs`. After `npm run build`, run with Playwright installed in your development environment:

```bash
node tests/company-members-browser.cjs
```

The script starts its own local static server by default. `PLAYWRIGHT_MODULE` can point to an external Playwright package, `CHROMIUM_PATH` to a browser binary, and `SCREENSHOT_DIR` to a temporary image directory. No browser package is added to the production dependencies. The local run passed 33 checks across both languages and 320/390/768/1440px; mobile Arabic and desktop English screenshots were reviewed.
