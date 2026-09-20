const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const workerDir = path.join(root, "worker");
const files = fs.readdirSync(workerDir)
  .filter(name => name.endsWith(".ts"))
  .map(name => path.join(workerDir, name));

assert.ok(files.length >= 4, "Expected LINETECH Worker modules");

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const result = ts.transpileModule(source, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      strict: true,
    },
  });

  const errors = (result.diagnostics || []).filter(
    diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
  );

  assert.equal(
    errors.length,
    0,
    `${path.basename(file)} has TypeScript syntax diagnostics: ${errors
      .map(error => ts.flattenDiagnosticMessageText(error.messageText, " "))
      .join("; ")}`
  );
}

const treeHasApiRoutes = fs.existsSync(path.join(root, "app", "api"));
if (treeHasApiRoutes) {
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => entry.isDirectory()
      ? walk(path.join(directory, entry.name))
      : [path.join(directory, entry.name)]);
  const routeFiles = walk(path.join(root, "app", "api"))
    .filter(file => /route\.(ts|tsx|js|jsx)$/.test(file));
  assert.equal(routeFiles.length, 0, "Static export must not contain Next Route Handlers");
}

assert.ok(!fs.existsSync(path.join(root, "middleware.ts")), "Static export must not use Next middleware");

console.log(`PASS: ${files.length} Cloudflare Worker modules transpile and static export has no Next server routes`);
