# Company application rollout

## Status

Application submission, status tracking, admin review, atomic approval and the approved-company read view are implemented in source and verified locally. They are not active on the hosted site until the database migration and Worker deployment both complete. The connected Supabase account did not list LINETECH's configured project (`vbaomkixvrtuuujcodii`); no remote database was changed. Do not apply this migration to Flamingo or Genan.

## Database

Apply `supabase/migrations/20261022183607_company_applications.sql` to the verified LINETECH database through the existing migration process. This file adds `company_applications`, `companies`, `company_memberships`, two invoker RPCs, indexes and RLS. It does not reset/drop existing data. `supabase/schema.sql` contains the same additions for a fresh bootstrap; do not run that entire bootstrap on an existing database.

- Applicant identity comes from `auth.uid()`, never client input.
- A submission key is unique per applicant; retries return the original request, and changed payloads cannot reuse the key.
- Each applicant has at most one pending request per normalized company name.
- Only `app_metadata.role = admin` may review a request.
- Approval locks the application, creates the company and owner membership, then records the review in one transaction.
- Rejection requires a reason that the applicant can read.
- Client writes to review/ownership/membership fields are denied by grants and RLS.
- Company visibility uses owner/member identity. Project APIs are unchanged: approval does not grant access to other personal/company projects.
- No security-definer RPC or service-role key is used.

Verification queries for the target database after migration:

```sql
select tablename, rowsecurity from pg_tables
where schemaname='public' and tablename in
 ('company_applications','companies','company_memberships');
select proname, prosecdef from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and proname in
 ('submit_company_application','review_company_application');
```

All three tables must have RLS enabled and both functions must have `prosecdef=false`. Run Supabase security/performance advisors after applying to the actual project and investigate new findings before release.

## Worker and UI

Deploy the current main source using the existing Cloudflare bindings/secrets. No additional secret or limiter namespace is required: submissions reuse the project-request limiter; reviews reuse the chat limiter with a separate hashed key prefix.

- `/company-space/request`: submit company/contact details and receive a persisted application ID.
- `/account/companies`: read own applications, decision notes and approved spaces.
- `/company-space?company=<id>`: open an authorized company record.
- `/admin/companies`: status filters, paginated review queue and approval/rejection.
- `GET/POST /api/company-applications`, `GET /api/companies`, `GET/POST /api/admin/company-applications`.

Missing tables/RPCs or upstream errors return an unavailable state; the UI never claims successful submission or review without a real server response. Body sizes are bounded while streaming. Worker checks and database RLS both enforce access.

## Validation

`npm run test:companies` executes Worker boundary tests and the actual migration/RPCs against in-memory PostgreSQL using pinned dev-only PGlite. It tests replay, rejection, cross-user/anonymous access, metadata-role spoofing and rollback of approval when membership creation fails. `npm run build` includes this suite.

Browser tests use synthetic API fixtures to verify frontend behavior independently; they are not a substitute for staging tests against Supabase Auth/PostgREST. Before enabling publicly, use separate real staging applicant/admin accounts to verify submission, rejection, approval and account isolation end-to-end.

## Still outside this slice

Invitations, additional member management, employee roles, company project permissions, paid subscriptions, 7-day payment enforcement, invoice history, notifications and a general admin audit-log product are not activated by this change. Review metadata records who made the decision and when; it is not presented as an immutable audit trail.
