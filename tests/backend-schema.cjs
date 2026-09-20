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
  schema.includes("auth.jwt() -> 'app_metadata' ->> 'role'"),
  "Admin authorization must use trusted auth app_metadata."
);

assert.ok(
  !/grant\s+[^;]+\s+to\s+anon\b/.test(schema),
  "Backend schema must not grant table access to anon."
);

assert.ok(
  schema.includes("grant usage on schema public to authenticated"),
  "Authenticated Data API access must be explicit."
);

console.log(
  `PASS: ${requiredTables.length} LINETECH backend tables are defined with RLS and authenticated-only grants`
);
