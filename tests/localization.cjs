const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');
const React = require('react');
const { act } = React;

// Exercise real components in a DOM, stubbing only Next routing and browser media.
const dom = new JSDOM('<html><head><title>Home — LINETECH</title></head><body><div id="root"></div></body></html>', { url: 'https://example.test/start' });
for (const name of ['window', 'document', 'localStorage', 'MutationObserver', 'CustomEvent', 'Event', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement']) global[name] = dom.window[name];
global.IS_REACT_ACT_ENVIRONMENT = true;
global.requestAnimationFrame = fn => { fn(); return 0; };
HTMLElement.prototype.scrollIntoView = () => {};
HTMLElement.prototype.scrollTo = () => {};
let copied = '';
Object.defineProperty(global, 'navigator', { value: { userAgent: "jsdom", clipboard: { writeText: async text => { copied = text; } } }, configurable: true });
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
require.extensions['.css'] = () => {};
const originalLoad = Module._load;
Module._load = function(name, ...rest) {
  if (name === 'next/link') return { __esModule: true, default: ({ prefetch, children, ...props }) => React.createElement('a', props, children) };
  if (name === 'next/navigation') return { usePathname: () => window.location.pathname };
  return originalLoad.call(this, name, ...rest);
};
const { createRoot } = require('react-dom/client');
const { setLanguage } = require('../app/Localized.tsx');
const root = createRoot(document.getElementById('root'));
const render = async (...components) => act(async () => root.render(React.createElement(React.Fragment, {}, ...components.map((component, index) => React.createElement(component, { key: index })))));
const click = async element => { assert.ok(element, 'Control exists'); await act(async () => element.click()); };
const button = text => [...document.querySelectorAll('button')].find(el => el.textContent.includes(text));
async function fill(element, value) {
  const prototype = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  await act(async () => { Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value); element.dispatchEvent(new Event('input', { bubbles: true })); });
}
async function select(element, value) { await act(async () => { element.value = value; element.dispatchEvent(new Event('change', { bubbles: true })); }); }
function assertArabic(scope = document.body) {
  const missing = [];
  const walker = document.createTreeWalker(scope, window.NodeFilter.SHOW_TEXT);
  let node;
  while (node = walker.nextNode()) if (!node.parentElement.closest('script,style,textarea,[data-no-translate]:not([data-no-translate="false"])') && /[a-z]/i.test(node.textContent)) missing.push(node.textContent);
  for (const el of scope.querySelectorAll('[placeholder],[aria-label],[alt],[title]')) {
    for (const name of ['placeholder', 'aria-label', 'alt', 'title']) if (/[a-z]/i.test(el.getAttribute(name) || '')) missing.push(`${name}: ${el.getAttribute(name)}`);
  }
  assert.deepEqual(missing, [], 'No untranslated website text');
}
(async () => {
  // Inspect every actual production export, including content after stream boundaries.
  let exports = 0;
  function scan(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (file.endsWith('.html')) {
      const page = new JSDOM(fs.readFileSync(file, 'utf8')).window.document;
      assertArabic(page.body); exports++;
    }
  } }
  scan(path.join(__dirname, '../out'));
  assert.equal(exports, 19);
  console.log(`PASS: all ${exports} exported pages contain Arabic copy and accessible labels`);

  const Nav = require('../app/SiteNav.tsx').default;
  const Bridge = require('../app/LanguageBridge.tsx').default;
  const Intake = require('../app/start/ProjectIntake.tsx').default;
  await render(Bridge, Nav, Intake);
  assertArabic();
  await click(document.querySelector('.search-trigger')); assertArabic();
  await fill(document.querySelector('.site-search-field input'), 'فلامنجو'); assertArabic();
  assert.ok(document.querySelector('.site-search-results').textContent.includes('فلامنجو بارك'));
  await click(document.querySelector('.site-search-topline button'));
  await fill(document.querySelector('input[placeholder="اسمك الكامل"]'), 'محمد');
  await fill(document.querySelector('.intake-step input[placeholder*="التواصل"]') || document.querySelectorAll('.intake-step input')[2], 'محمد@example.test');
  const selects = document.querySelectorAll('.intake-step select');
  await select(selects[0], 'Email');
  await select(selects[1], 'Web Development');
  assert.equal(selects[1].value, 'Web Development');
  await click(document.querySelector('.intake-nav-end button')); assertArabic();
  await select(document.querySelectorAll('.intake-step select')[0], 'New idea');
  await select(document.querySelectorAll('.intake-step select')[1], 'Build credibility');
  await fill(document.querySelector('.intake-step textarea'), 'موقع لشركتي');
  await click(document.querySelector('.intake-nav .button')); assertArabic();
  await click(document.querySelector('.brief-actions .button'));
  assert.ok(copied.includes('نوع المشروع：تطوير الويب'));
  assert.ok(copied.includes('موقع لشركتي'));
  assert.ok(!copied.includes('Project type'));
  await click(document.querySelector('.desktop-language'));
  assert.equal(document.documentElement.dir, 'ltr');
  assert.equal(document.title, 'Home — LINETECH');
  assert.ok(document.querySelector('.intake-step').textContent.includes('How should we frame'));
  await click(document.querySelector('.brief-actions .button'));
  assert.ok(copied.includes('Project type：Web Development'));
  await click(document.querySelector('.desktop-language'));
  assertArabic();
  assert.equal(document.documentElement.dir, 'rtl');
  assert.equal(document.title, 'الرئيسية — لاين تك');
  console.log('PASS: Arabic search, all intake steps, stable select values, bilingual clipboard, repeated switching without losing input');

  const Login = require('../app/login/LoginForm.tsx').default;
  await render(Bridge, Login);
  await click(button('إنشاء حساب')); assertArabic();
  await act(async () => document.querySelector('input[name="email"]').reportValidity());
  assert.equal(document.querySelector('input[name="email"]').validationMessage, 'يرجى تعبئة هذا الحقل.');
  await click(button('تسجيل الدخول'));
  await click(button('نسيت كلمة المرور')); assertArabic();
  await act(async () => document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  assertArabic();
  console.log('PASS: login/signup labels, consent, recovery and submit notices');

  const Chat = require('../app/chat/ChatWorkspace.tsx').default;
  await render(Bridge, Chat); assertArabic();
  await fill(document.querySelector('.chat-composer textarea'), 'Home');
  await click(document.querySelector('.chat-send')); assertArabic();
  assert.equal(document.querySelector('.chat-message-row.client p').textContent, 'Home');
  await click(document.querySelector('.chat-message-more'));
  await click(button('تعديل الرسالة')); assertArabic();
  await fill(document.querySelector('.chat-composer textarea'), 'Services');
  await click(document.querySelector('.chat-send'));
  assert.equal(document.querySelector('.chat-message-row.client p').textContent, 'Services');
  await click(document.querySelector('.chat-message-more'));
  await click(button('حذف لدى الطرفين')); assertArabic();
  await click(document.querySelector('.chat-attach')); assertArabic();
  await click(document.querySelector('.chat-mic')); assertArabic();
  await act(async () => setLanguage('en'));
  assert.ok(document.body.textContent.includes('Voice recording is not available'));
  await act(async () => setLanguage('ar')); assertArabic();
  console.log('PASS: chat actions, error notices, and exact preservation of user messages');
  await act(async () => root.unmount());
})().catch(error => { console.error(error); process.exitCode = 1; });
