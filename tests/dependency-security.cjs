const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));

const expected = {
  next: "15.5.24",
  react: "19.1.9",
  "react-dom": "19.1.9",
};

for (const [name, version] of Object.entries(expected)) {
  assert.equal(pkg.dependencies?.[name], version, `${name} must remain pinned to security-patched ${version}`);
  assert.equal(lock.packages?.[""]?.dependencies?.[name], version, `package-lock root ${name} must match package.json`);
  assert.equal(lock.packages?.[`node_modules/${name}`]?.version, version, `locked ${name} must remain at ${version}`);
}

const next = lock.packages["node_modules/next"];
assert.ok(next, "Next.js lock entry is required");
assert.ok(!next.deprecated, "Patched Next.js must not carry a deprecated security warning");
assert.equal(next.dependencies?.["@next/env"], "15.5.24");

for (const [name, entry] of Object.entries(lock.packages)) {
  if (!name.startsWith("node_modules/@next/swc-")) continue;
  assert.equal(entry.version, "15.5.24", `${name} must match Next.js 15.5.24`);
  assert.match(entry.resolved || "", /^https:\/\/registry\.npmjs\.org\//, `${name} must resolve from the official npm registry`);
  assert.match(entry.integrity || "", /^sha512-/, `${name} must retain npm integrity metadata`);
}

assert.equal(lock.packages["node_modules/@next/env"]?.version, "15.5.24");
assert.equal(lock.packages["node_modules/react-dom"]?.peerDependencies?.react, "^19.1.9");

console.log("PASS: Next.js and React remain pinned to the LINETECH security baseline");
