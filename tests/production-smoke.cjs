const assert = require("node:assert/strict");

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  console.error("BASE_URL is required, for example: BASE_URL=https://linetech.example.com npm run smoke:prod");
  process.exit(2);
}

async function main() {
  const base = baseUrl.replace(/\/$/, "");

  const home = await fetch(base, { redirect: "manual" });
  assert.ok(home.status >= 200 && home.status < 500, `Unexpected home status: ${home.status}`);

  const expectedHeaders = [
    "content-security-policy",
    "strict-transport-security",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
  ];
  for (const header of expectedHeaders) {
    assert.ok(home.headers.get(header), `Missing production security header: ${header}`);
  }

  const health = await fetch(`${base}/api/health`, { redirect: "manual" });
  assert.equal(health.status, 200, `Health endpoint returned ${health.status}`);
  const payload = await health.json();
  assert.equal(payload?.ok, true);
  assert.equal(payload?.backend, "linetech-worker");
  assert.equal(payload?.supabaseAuth, true);

  const admin = await fetch(`${base}/admin`, { redirect: "manual" });
  assert.ok([301,302,303,307,308].includes(admin.status), `Expected protected admin redirect, got ${admin.status}`);
  const adminLocation = admin.headers.get("location") || "";
  assert.ok(adminLocation.includes("/login"), "Unauthenticated /admin must redirect to login");

  const workspace = await fetch(`${base}/workspace`, { redirect: "manual" });
  assert.ok([301,302,303,307,308].includes(workspace.status), `Expected protected workspace redirect, got ${workspace.status}`);
  const workspaceLocation = workspace.headers.get("location") || "";
  assert.ok(workspaceLocation.includes("/login"), "Unauthenticated /workspace must redirect to login");

  console.log("PASS: LINETECH production health, security headers and protected-route redirects");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
