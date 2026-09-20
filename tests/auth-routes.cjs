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
assert.match(wrangler, /"run_worker_first"\s*:\s*true/);
assert.match(wrangler, /"observability"\s*:\s*\{/);
assert.match(wrangler, /"enabled"\s*:\s*true/);
assert.match(wrangler, /"head_sampling_rate"\s*:\s*1/);

const workerIndex = read("worker/index.ts");
assert.match(workerIndex, /request\.headers\.get\("Origin"\)/);
assert.match(workerIndex, /origin!==url\.origin/);
assert.ok(workerIndex.includes('path==="/admin"'));
assert.ok(workerIndex.includes('app_metadata?.role!=="admin"'));
assert.ok(workerIndex.includes('path==="/handover"'));
assert.ok(workerIndex.includes("withSecurityHeaders"));
assert.ok(workerIndex.includes('event:"request"'));
assert.ok(workerIndex.includes('event:"worker_error"'));

const core = read("worker/core.ts");
assert.match(core, /HttpOnly/);
assert.match(core, /Secure/);
assert.match(core, /SameSite=Lax/);
assert.match(core, /SUPABASE_PUBLISHABLE_KEY/);
assert.doesNotMatch(core, /service_role|sb_secret_/i);
assert.ok(core.includes("rateLimitAllowed"));
assert.ok(core.includes("rateLimitResponse"));
assert.ok(core.includes("Retry-After"));
for (const header of [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "X-Request-ID",
]) {
  assert.ok(core.includes(header), `Missing security response header: ${header}`);
}

const workerIndexHealth = read("worker/index.ts");
assert.ok(workerIndexHealth.includes("/api/health"));
assert.ok(workerIndexHealth.includes("/health"));

const auth = read("worker/auth.ts");
assert.ok(auth.includes('redirectUrl.searchParams.set("confirmed","1")'));
assert.ok(auth.includes('redirectUrl.searchParams.set("recovery","1")'));
for (const limiter of [
  "AUTH_LOGIN_RATE_LIMITER",
  "AUTH_SIGNUP_RATE_LIMITER",
  "AUTH_RECOVER_RATE_LIMITER",
  "AUTH_PASSWORD_RATE_LIMITER",
]) {
  assert.ok(auth.includes(limiter), `Auth route is not wired to ${limiter}`);
}
assert.ok(auth.includes('/logout?scope=local'));
assert.ok(auth.includes('/logout?scope=others'));

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
for (const limiter of [
  "PROJECT_REQUEST_RATE_LIMITER",
  "CHAT_RATE_LIMITER",
  "UPLOAD_RATE_LIMITER",
]) {
  assert.ok(client.includes(limiter), `Client route is not wired to ${limiter}`);
}
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
  "/api/admin/users",
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
assert.ok(login.includes("safeInternalNext"));
assert.ok(login.includes('value.startsWith("//")'));
assert.ok(login.includes("window.location.assign(safeInternalNext(next))"));
assert.ok(login.includes('search.get("confirmed") === "1"'));
assert.ok(login.includes('search.get("recovery") === "1"'));
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
assert.ok(client.includes('sender_role:"client"'));
assert.ok(client.includes("sender_role=eq.client"));
assert.ok(admin.includes('sender_role:"company"'));
assert.ok(admin.includes('row.sender_role==="company"'));

assert.ok(read("app/handover/HandoverClient.tsx").includes("/api/handover"));
assert.ok(read("app/workspace/WorkspaceClient.tsx").includes('href="/handover"'));

for (const file of [
  "app/admin/page.tsx",
  "app/admin/AdminClient.tsx",
  "app/handover/page.tsx",
  "app/handover/HandoverClient.tsx",
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing protected workspace file: ${file}`);
}

const adminClient = read("app/admin/AdminClient.tsx");
for (const endpoint of [
  "/api/admin/projects",
  "/api/admin/project",
  "/api/admin/files",
  "/api/admin/handover",
  "/api/admin/chat",
  "/api/admin/users",
  "/api/admin/members",
]) {
  assert.ok(adminClient.includes(endpoint), `Admin UI is not wired to ${endpoint}`);
}

console.log("PASS: LINETECH Worker backend routes, secure cookies and frontend wiring are present");
