# Database bootstrap and billing baseline

`schema.sql` is the canonical fresh-database bootstrap. It includes the plan catalog,
client subscriptions, RLS, seed plans, and the selected-plan project request RPC.
Run it only against a new project; it is not a production upgrade script.

The billing tables were originally created outside the repository migration history.
`billing-baseline.sql` recovers their schema and public catalog values inspected on
2026-10-02. It creates missing tables and inserts missing plan codes without replacing
existing tables, policies, or plan values. It contains no customer records.

The existing selected-plan migration now includes this prerequisite so a fresh replay
does not reference a missing `plan_catalog`. Already-applied migrations will not rerun;
this repair does not require replaying migration history on production. The same SQL
is included in the canonical bootstrap. Keep these definitions synchronized when
changing billing schema.

Worker billing queries use `started_at`, `current_period_start`, and
`current_period_end`, matching the inspected production schema. A SQL reset/replay
against a disposable Supabase project is still required to validate a clean bootstrap;
static schema tests do not substitute for that integration check.
