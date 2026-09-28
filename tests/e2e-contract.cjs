const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

const intake = read("app/start/ProjectIntake.tsx");
const workspace = read("app/workspace/WorkspaceClient.tsx");
const chat = read("app/chat/ChatWorkspace.tsx");
const handover = read("app/handover/HandoverClient.tsx");
const client = read("worker/client.ts");
const admin = read("worker/admin.ts");
const auth = read("worker/auth.ts");
const schema = read("supabase/schema.sql");
const workerIndex = read("worker/index.ts");
const siteSurface = read("app/SiteSurface.tsx");
const adminShell = read("app/admin/AdminShell.tsx");

// 1) Account/session layer.
for (const endpoint of [
  "/api/auth/login",
  "/api/auth/session",
  "/api/auth/logout",
]) {
  assert.ok(auth.includes(endpoint), `Missing auth lifecycle endpoint: ${endpoint}`);
}
assert.ok(auth.includes("sessionCookies"));
assert.ok(auth.includes("refreshSession") || read("worker/core.ts").includes("refreshSession"));
assert.ok(auth.includes('path==="/api/account"'));
assert.ok(auth.includes('path==="/api/account/email"'));
assert.ok(auth.includes('path==="/api/auth/logout-others"'));
assert.ok(auth.includes("/profiles?select="));

// 1b) Admin stays isolated while client pages keep the normal LINETECH site chrome.
assert.ok(workerIndex.includes("adminLoginRedirect"));
assert.ok(workerIndex.includes('app_metadata?.role==="admin"'));
assert.ok(workerIndex.includes('app_metadata?.role!=="admin"'));
assert.ok(siteSurface.includes("if (admin) return"));
assert.ok(siteSurface.includes("<SiteNav />"));
assert.ok(siteSurface.includes("<SiteFooter />"));
assert.ok(!siteSurface.includes("ClientPortalShell"));
assert.ok(adminShell.includes("/admin/login"));
assert.ok(adminShell.includes("/admin/account"));

// 2) Project intake -> atomic request/project/conversation bootstrap.
assert.ok(intake.includes("/api/project-request"));
assert.ok(intake.includes("submissionKey"));
assert.ok(client.includes("/rpc/submit_project_request"));
assert.ok(client.includes("p_submission_key:submissionKey"));
assert.ok(schema.includes("p_submission_key uuid"));
assert.ok(schema.includes("'idempotent_replay'"));
assert.ok(schema.includes("insert into public.project_requests"));
assert.ok(schema.includes("insert into public.projects"));
assert.ok(schema.includes("insert into public.conversations"));

// 3) Workspace reads project state, activity and project files.
assert.ok(client.includes('path==="/api/projects"'));
assert.ok(client.includes("requestedProjectId"));
assert.ok(client.includes("projectContext"));
assert.ok(workspace.includes("/api/workspace"));
for (const table of ["project_requests","projects","project_activity","project_files"]) {
  assert.ok(client.includes(`/${table}?`), `Workspace API is not reading ${table}`);
}
assert.ok(workspace.includes("loadWorkspace"));
assert.ok(workspace.includes("visibilitychange"));
assert.ok(workspace.includes("handoverUnlocked"));

// 4) Client chat supports text + rich uploads and authenticated downloads.
assert.ok(chat.includes("/api/chat/messages"));
assert.ok(chat.includes("/api/chat/upload"));
assert.ok(client.includes('sender_role:"client"'));
assert.ok(client.includes("validateUpload(file,kind)"));
assert.ok(client.includes("/api/files/download"));
assert.ok(client.includes("/object/authenticated/"));
assert.ok(client.includes("message_attachments"));

// 5) Admin can operate lifecycle and communicate back to the client.
for (const endpoint of [
  "/api/admin/projects",
  "/api/admin/project",
  "/api/admin/files",
  "/api/admin/chat",
  "/api/admin/chat/upload",
  "/api/admin/handover",
  "/api/admin/users",
  "/api/admin/members",
]) {
  assert.ok(admin.includes(endpoint), `Missing admin lifecycle endpoint: ${endpoint}`);
}
assert.ok(admin.includes('sender_role:"company"'));
assert.ok(admin.includes("project_activity"));
assert.ok(admin.includes("notifications"));
assert.ok(admin.includes("next_action_required"));
assert.ok(admin.includes("file_status_updated"));
assert.ok(admin.includes('action_kind:"message"'));
assert.ok(admin.includes('clientProjectPath("/chat",projectId)'));
assert.ok(admin.includes('clientProjectPath("/handover",projectId)'));
assert.ok(schema.includes("action_kind text not null default 'project_update'"));
assert.ok(schema.includes("destination text not null default '/workspace'"));

// 6) Final handover exposes completed items and ready/approved delivery files.
assert.ok(handover.includes("/api/handover"));
assert.ok(handover.includes("files"));
assert.ok(client.includes("category=in.(handover,deliverable)"));
assert.ok(client.includes("status=in.(ready,approved)"));
assert.ok(client.includes('status==="completed"') || client.includes('status==="completed"'));

// 7) RLS and least privilege remain part of the lifecycle contract.
for (const table of [
  "project_requests",
  "projects",
  "project_activity",
  "project_files",
  "conversations",
  "messages",
  "message_attachments",
  "handover_items",
  "notifications",
]) {
  assert.ok(
    schema.toLowerCase().includes(`alter table public.${table} enable row level security`),
    `RLS missing from lifecycle table: ${table}`,
  );
}
assert.ok(schema.includes("'app_metadata' ->> 'role'"));
assert.ok(schema.includes("grant select, insert, update on public.messages to authenticated"));

console.log("PASS: LINETECH end-to-end lifecycle contract is wired from intake through handover");
