const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

const routes = [
  "app/api/auth/login/route.ts",
  "app/api/auth/signup/route.ts",
  "app/api/auth/recover/route.ts",
  "app/api/auth/session/route.ts",
  "app/api/auth/update-password/route.ts",
  "app/api/auth/logout/route.ts",
];

for (const route of routes) {
  assert.ok(fs.existsSync(path.join(root, route)), `Missing auth route: ${route}`);
}

const helper = read("lib/supabase/auth-server.ts");
assert.match(helper, /httpOnly:\s*true/);
assert.match(helper, /sameSite:\s*"lax"/);
assert.match(helper, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
assert.doesNotMatch(helper, /service_role|sb_secret_/i);

const middleware = read("middleware.ts");
assert.match(middleware, /"\/workspace\/:path\*"/);
assert.match(middleware, /"\/chat\/:path\*"/);
assert.match(middleware, /refreshAuthSession/);

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

console.log("PASS: LINETECH Auth uses HttpOnly sessions and protects client routes");
