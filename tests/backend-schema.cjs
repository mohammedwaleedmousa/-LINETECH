const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const schemaPath = path.join(__dirname, "..", "supabase", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8").toLowerCase();

const requiredTables = [
  "profiles",
  "project_requests",
  "projects",
  "project_members",
  "project_activity",
  "project_files",
  "conversations",
  "messages",
  "message_attachments",
  "handover_items",
  "notifications",
];

for (const table of requiredTables) {
  assert.ok(
    schema.includes(`create table public.${table}`),
    `Missing backend table: ${table}`
  );
  assert.ok(
    schema.includes(`alter table public.${table} enable row level security`),
    `RLS is not enabled for: ${table}`
  );
}

assert.ok(
  schema.includes("'app_metadata' ->> 'role'"),
  "Admin authorization must use trusted auth app_metadata."
);

assert.ok(
  schema.includes("submit_project_request"),
  "Atomic project request RPC must be present."
);

assert.ok(
  schema.includes("security invoker"),
  "Database helper functions must preserve caller RLS with SECURITY INVOKER."
);

assert.ok(
  !/grant\s+[^;]+\s+to\s+anon\b/.test(schema),
  "Backend schema must not grant table access to anon."
);

assert.ok(
  schema.includes("revoke all on table") && schema.includes("from anon"),
  "Backend schema must explicitly revoke LINETECH table access from anon."
);

assert.ok(
  !schema.includes("project_members_select_self_project_or_admin"),
  "Project member RLS must not reintroduce the recursive projects/project_members policy."
);

assert.ok(
  schema.includes("project_members_select_self_or_admin"),
  "Non-recursive project member read policy must be present."
);

assert.ok(
  schema.includes("sender_role") &&
  schema.includes("sender_role in ('client', 'company')"),
  "Messages must distinguish client and company sender roles."
);

assert.ok(
  schema.includes("sender_role = 'company'") &&
  schema.includes("'app_metadata' ->> 'role') = 'admin'"),
  "Only admins may persist company-authored chat messages."
);

assert.ok(
  schema.includes("grant usage on schema public to authenticated"),
  "Authenticated Data API access must be explicit."
);

assert.ok(
  schema.includes("from authenticated") &&
  schema.includes("grant select, insert, update on public.messages to authenticated"),
  "Authenticated table grants must be explicitly least-privilege."
);

assert.ok(
  !/grant\s+all(?:\s+privileges)?\s+on\s+(?:table\s+)?public\./.test(schema),
  "Backend schema must not grant ALL privileges on public tables."
);

console.log(
  `PASS: ${requiredTables.length} LINETECH backend tables are defined with RLS and authenticated-only grants`
);
