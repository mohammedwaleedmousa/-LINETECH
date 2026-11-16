/* Inspect the emitted HTML, rather than only the metadata source. Run after next build. */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const paths = ['/', '/services', '/services/after-sales-care', '/projects', '/about', '/contact', '/privacy', '/terms'];
const titles = new Set();
const descriptions = new Set();
const closingTitles = new Set();
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&quot;', '"');
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([,k,v])=>[k,decode(v)]));
for (const path of paths) {
  const html = fs.readFileSync(`out${path === '/' ? '' : path}/index.html`, 'utf8');
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(m=>attributes(m[0]));
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(m=>attributes(m[0]));
  const value = key => meta.find(m=>m.name === key || m.property === key)?.content;
  const canonical = `https://linetech.company${path === '/' ? '/' : path + '/'}`;
  const canonicalLinks = links.filter(l=>l.rel === 'canonical');
  assert.equal(canonicalLinks.length, 1, `${path}: one canonical required`);
  assert.equal(canonicalLinks[0].href, canonical);
  assert.equal(value('og:url'), canonical);
  assert.ok(!value('robots')?.includes('noindex'), `${path}: public page must be indexable`);
  const title = decode(html.match(/<title>(.*?)<\/title>/)[1]);
  const description = value('description');
  assert.ok(title.includes('LINETECH'));
  assert.ok(description?.length > 60);
  assert.ok(!titles.has(title), `Duplicate title: ${path}`);
  assert.ok(!descriptions.has(description), `Duplicate description: ${path}`);
  titles.add(title); descriptions.add(description);
  for (const href of ['/brand/linetech-mark-transparent.ico','/brand/linetech-mark-transparent.svg','/brand/linetech-mark-transparent-192.png','/brand/apple-touch-icon.png','/brand/safari-pinned-tab.svg']) {
    assert.ok(links.some(l=>l.href.split('?')[0] === href), `${path}: missing ${href}`);
    assert.ok(fs.existsSync(`out${href}`));
  }
  const closingTitle = decode(html.match(/<section\b[^>]*(?:class="[^"]*ref-cta[^"]*"|data-footer-cta)[\s\S]*?<h2[^>]*>(.*?)<\/h2>/)?.[1] || "");
  assert.ok(closingTitle,`${path}: closing title must be present`);
  assert.ok(!closingTitles.has(closingTitle),`${path}: closing CTA title must be unique`);
  closingTitles.add(closingTitle);
  const ctas = [...html.matchAll(/<section\b[^>]*class="[^"]*ref-cta[^"]*"|<section\b[^>]*data-footer-cta/g)];
  assert.equal(ctas.length,1,`${path}: exactly one closing CTA`);
  if (['/services','/services/after-sales-care','/contact','/privacy','/terms'].includes(path)) {
    assert.ok(/<section[^>]*data-footer-cta[\s\S]*?<\/section><footer/.test(html),`${path}: CTA must directly precede footer`);
  } else assert.ok(!html.includes('data-footer-cta'),`${path}: existing CTA must stay unchanged`);
  assert.equal(value('og:image'), 'https://linetech.company/brand/social-card.png');
  const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  assert.equal(data.length,1);
  assert.equal(data[0]['@graph'][0].url,canonical);
  if (path === '/') {
    const organization = data[0]['@graph'].find(n=>n['@type'] === 'Organization');
    assert.equal(organization.name,'LINETECH');
    assert.equal(organization.email,'info@linetech.company');
    assert.ok(data[0]['@graph'].some(n=>n['@type'] === 'WebSite'));
  } else assert.ok(data[0]['@graph'].some(n=>n['@type'] === 'BreadcrumbList'));
}
for (const path of ['/login','/admin/login','/account','/thank-you']) {
  const html = fs.readFileSync(`out${path}/index.html`,'utf8');
  assert.ok(/<meta name="robots" content="[^"]*noindex/.test(html),`${path}: private page must stay noindex`);
}
const sitemap = fs.readFileSync('out/sitemap.xml','utf8');
assert.equal([...sitemap.matchAll(/<loc>/g)].length,paths.length);
for (const path of paths) assert.ok(sitemap.includes(`https://linetech.company${path === '/' ? '/' : path + '/'}</loc>`));
console.log('PASS: emitted metadata, unique canonicals, structured data, new brand icons, eight sitemap URLs and private noindex');
