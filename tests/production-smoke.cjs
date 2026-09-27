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

  for (const protectedPath of ["/admin","/admin/projects","/admin/clients","/admin/team","/admin/account"]) {
    const response = await fetch(`${base}${protectedPath}`, { redirect: "manual" });
    assert.ok(
      [301,302,303,307,308].includes(response.status),
      `Expected protected ${protectedPath} redirect, got ${response.status}`,
    );
    const location = response.headers.get("location") || "";
    assert.ok(location.includes("/admin/login"), `Unauthenticated ${protectedPath} must redirect to admin login`);
    assert.ok(
      location.includes(encodeURIComponent(protectedPath)) || location.includes(`next=${protectedPath}`),
      `Protected ${protectedPath} should preserve its return path`,
    );
  }

  for (const protectedPath of ["/workspace","/chat","/handover","/account"]) {
    const response = await fetch(`${base}${protectedPath}`, { redirect: "manual" });
    assert.ok(
      [301,302,303,307,308].includes(response.status),
      `Expected protected ${protectedPath} redirect, got ${response.status}`,
    );
    const location = response.headers.get("location") || "";
    assert.ok(location.includes("/login"), `Unauthenticated ${protectedPath} must redirect to client login`);
    assert.ok(!location.includes("/admin/login"), `Client route ${protectedPath} must not use admin login`);
  }

  const adminLogin = await fetch(`${base}/admin/login`, { redirect: "manual" });
  assert.ok(adminLogin.status >= 200 && adminLogin.status < 400, `Admin login returned ${adminLogin.status}`);

  for (const publicPath of ["/privacy","/terms","/start"]) {
    const response = await fetch(`${base}${publicPath}`, { redirect: "manual" });
    assert.ok(
      response.status >= 200 && response.status < 400,
      `Public route ${publicPath} returned ${response.status}`,
    );
  }

  console.log("PASS: LINETECH production health, security headers, public routes and protected redirects");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
