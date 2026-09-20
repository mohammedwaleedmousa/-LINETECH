const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.join(__dirname, '..');
const appDir = path.join(rootDir, 'app');
const publicDir = path.join(rootDir, 'public');

function walk(dir, visitor) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, visitor);
    else visitor(file);
  }
}

function routeFromPage(file) {
  const relativeDir = path.relative(appDir, path.dirname(file));
  const segments = relativeDir
    .split(path.sep)
    .filter(Boolean)
    .filter(segment => !segment.startsWith('(') && !segment.startsWith('@'));
  return `/${segments.join('/')}`.replace(/\/$/, '') || '/';
}

const routes = new Set(['/']);
walk(appDir, file => {
  if (path.basename(file) === 'page.tsx') routes.add(routeFromPage(file));
});

const publicAssets = new Set();
if (fs.existsSync(publicDir)) {
  walk(publicDir, file => {
    const relative = path.relative(publicDir, file).split(path.sep).join('/');
    publicAssets.add(`/${relative}`);
  });
}

const references = [];
const patterns = [
  /\bhref\s*=\s*["'](\/[^"'{}]*)["']/g,
  /\bhref\s*:\s*["'](\/[^"']*)["']/g,
];

walk(appDir, file => {
  if (!file.endsWith('.tsx')) return;
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source))) {
      const raw = match[1];
      const pathname = raw.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
      references.push({ file: path.relative(path.join(__dirname, '..'), file), raw, pathname });
    }
  }
});

const missing = references.filter(
  reference => !routes.has(reference.pathname) && !publicAssets.has(reference.pathname)
);
assert.deepEqual(
  missing,
  [],
  `Internal links without an app route:\n${missing.map(item => `${item.file}: ${item.raw}`).join('\n')}`
);

console.log(
  `PASS: ${references.length} static internal references resolve to ${routes.size} app routes or ${publicAssets.size} public assets`
);
