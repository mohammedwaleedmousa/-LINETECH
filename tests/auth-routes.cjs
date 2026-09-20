const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

for (const file of [
  "worker/index.ts",
  "worker/core.ts",
  "worker/auth.ts",
  "worker/client.ts",
  "worker/admin.ts",
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing Worker backend file: ${file}`);
}

const wrangler = read("wrangler.jsonc");
assert.match(wrangler, /"main"\s*:\s*"\.\/worker\/index\.ts"/);
assert.match(wrangler, /"binding"\s*:\s*"ASSETS"/);
assert.match(wrangler, /"\/api\/\*"/);
assert.match(wrangler, /"\/workspace\*"/);
assert.match(wrangler, /"\/chat\*"/);

const workerIndex = read("worker/index.ts");
assert.match(workerIndex, /request\.headers\.get\("Origin"\)/);
assert.match(workerIndex, /origin!==url\.origin/);

const core = read("worker/core.ts");
assert.match(core, /HttpOnly/);
assert.match(core, /Secure/);
assert.match(core, /SameSite=Lax/);
assert.match(core, /SUPABASE_PUBLISHABLE_KEY/);
assert.doesNotMatch(core, /service_role|sb_secret_/i);

const workerIndexHealth = read("worker/index.ts");
assert.ok(workerIndexHealth.includes("/api/health"));
assert.ok(workerIndexHealth.includes("/health"));

const auth = read("worker/auth.ts");
for (const endpoint of [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/recover",
  "/api/auth/session",
  "/api/auth/update-password",
  "/api/auth/logout",
]) {
  assert.ok(auth.includes(endpoint), `Worker auth is missing ${endpoint}`);
}

const client = read("worker/client.ts");
for (const endpoint of [
  "/api/project-request",
  "/api/workspace",
  "/api/chat/messages",
  "/api/chat/upload",
  "/api/files/download",
  "/api/notifications",
  "/api/handover",
]) {
  assert.ok(client.includes(endpoint), `Worker client API is missing ${endpoint}`);
}

const admin = read("worker/admin.ts");
for (const endpoint of [
  "/api/admin/projects",
  "/api/admin/project",
  "/api/admin/files",
  "/api/admin/handover",
  "/api/admin/chat",
  "/api/admin/members",
]) {
  assert.ok(admin.includes(endpoint), `Worker admin API is missing ${endpoint}`);
}

const nav = read("app/SiteNav.tsx");
assert.ok(nav.includes("/api/auth/session"));
assert.ok(nav.includes("/api/auth/logout"));
assert.ok(nav.includes('"Logout"'));
assert.ok(nav.includes('"تسجيل خروج"'));

const login = read("app/login/LoginForm.tsx");
for (const endpoint of [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/recover",
  "/api/auth/session",
  "/api/auth/update-password",
]) {
  assert.ok(login.includes(endpoint), `LoginForm is not wired to ${endpoint}`);
}

assert.ok(read("app/start/ProjectIntake.tsx").includes("/api/project-request"));
assert.ok(read("app/workspace/WorkspaceClient.tsx").includes("/api/workspace"));
assert.ok(read("app/chat/ChatWorkspace.tsx").includes("/api/chat/messages"));
assert.ok(read("app/chat/ChatWorkspace.tsx").includes("/api/chat/upload"));

console.log("PASS: LINETECH Worker backend routes, secure cookies and frontend wiring are present");
