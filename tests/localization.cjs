const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');
const React = require('react');
const { act } = React;

const dom = new JSDOM(
  '<html><head><title>Home — LINETECH</title></head><body><div id="root"></div></body></html>',
  { url: 'https://example.test/start' }
);

for (const name of [
  'window', 'document', 'localStorage', 'MutationObserver', 'CustomEvent', 'Event',
  'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLButtonElement'
]) global[name] = dom.window[name];

global.IS_REACT_ACT_ENVIRONMENT = true;
global.requestAnimationFrame = fn => { fn(); return 0; };
if (typeof dom.window.crypto.randomUUID !== 'function') {
  Object.defineProperty(dom.window.crypto, 'randomUUID', {
    value: () => '11111111-2222-4333-8444-555555555555',
    configurable: true,
  });
}
HTMLElement.prototype.scrollIntoView = () => {};
HTMLElement.prototype.scrollTo = () => {};

let copied = '';
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'jsdom',
    clipboard: { writeText: async text => { copied = text; } },
  },
  configurable: true,
});

global.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : String(input?.url || input);
  const method = String(init.method || 'GET').toUpperCase();

  if (url === '/api/project-request' && method === 'POST') {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        data: {
          reference_number: 'LT-260920-1234',
          submitted_at: '2026-09-20T10:00:00.000Z',
        },
      }),
    };
  }

  if (url === '/api/chat/messages' && method === 'GET') {
    return {
      ok: true,
      status: 200,
      json: async () => ({ ok: true, messages: [] }),
    };
  }

  if (url === '/api/chat/messages' && method === 'POST') {
    const body = JSON.parse(String(init.body || '{}'));
    return {
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        message: {
          id: 'message-test-1',
          sender: 'client',
          kind: 'text',
          text: body.text,
          time: '12:00',
        },
      }),
    };
  }

  return {
    ok: false,
    status: 404,
    json: async () => ({ ok: false }),
  };
};

for (const ext of ['.ts', '.tsx']) {
  require.extensions[ext] = (module, filename) => module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    filename
  );
}
require.extensions['.css'] = () => {};

const originalLoad = Module._load;
Module._load = function(name, ...rest) {
  if (name === 'next/link') {
    return {
      __esModule: true,
      default: ({ prefetch, children, ...props }) => React.createElement('a', props, children),
    };
  }
  if (name === 'next/navigation') {
    return {
      usePathname: () => window.location.pathname,
      useRouter: () => ({ prefetch() {}, push() {}, replace() {} }),
    };
  }
  return originalLoad.call(this, name, ...rest);
};

const { createRoot } = require('react-dom/client');
const { setLanguage } = require('../app/Localized.tsx');
const { translate } = require('../app/translations.ts');
const root = createRoot(document.getElementById('root'));

const render = async (...components) => act(async () => {
  root.render(React.createElement(
    React.Fragment,
    {},
    ...components.map((component, index) => React.createElement(component, { key: index }))
  ));
});

const click = async element => {
  assert.ok(element, 'Expected control to exist');
  await act(async () => element.click());
};

async function fill(element, value) {
  assert.ok(element, 'Expected input to exist');
  const prototype = element.tagName === 'TEXTAREA'
    ? HTMLTextAreaElement.prototype
    : HTMLInputElement.prototype;
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

async function chooseCustomSelect(index, optionIndex = 0) {
  const triggers = [...document.querySelectorAll('.intake-step .linetech-select-trigger')];
  assert.ok(triggers[index], `Expected custom select ${index}`);
  await click(triggers[index]);
  const root = triggers[index].closest('.linetech-select');
  const options = [...root.querySelectorAll('.linetech-select-option')];
  assert.ok(options[optionIndex], `Expected option ${optionIndex}`);
  await click(options[optionIndex]);
}

const buttonContaining = text => [...document.querySelectorAll('button')]
  .find(element => element.textContent.includes(text));

(async () => {
  assert.equal(translate('Step 4 of 4', 'ar'), 'الخطوة 4 من 4');
  assert.equal(translate('Review request', 'ar'), 'مراجعة الطلب');
  assert.equal(
    translate('تم تسليم الطلب إلى LINETECH', 'ar'),
    'تم تسليم الطلب إلى لاين تك'
  );

  const Bridge = require('../app/LanguageBridge.tsx').default;
  const Nav = require('../app/SiteNav.tsx').default;
  const Intake = require('../app/start/ProjectIntake.tsx').default;

  await act(async () => setLanguage('ar'));
  await render(Bridge, Nav, Intake);
  assert.equal(document.documentElement.dir, 'rtl');
  assert.ok(document.body.textContent.includes('الخدمات'));
  assert.ok(document.body.textContent.includes('المحادثة'));
  assert.ok(document.body.textContent.includes('تسجيل الدخول'));

  await click(document.querySelector('.search-trigger'));
  await fill(document.querySelector('.site-search-field input'), 'فلامنجو');
  assert.ok(document.querySelector('.site-search-results').textContent.includes('فلامنجو بارك'));
  await click(document.querySelector('.site-search-topline button'));

  await fill(document.querySelector('input[placeholder="اسمك الكامل"]'), 'محمد');
  const contactInput = [...document.querySelectorAll('.intake-step input')]
    .find(input => input.type === 'text' && input.value === '' && input.placeholder !== 'اختياري');
  await fill(contactInput, 'mohammed@example.test');

  // Step 1: preferred contact is the first custom select; project type is the second.
  await chooseCustomSelect(1, 0);
  await click(document.querySelector('.intake-nav-end .button'));
  assert.ok(document.body.textContent.includes('ما الذي يجب أن يتحول إلى واقع؟'));

  // Step 2: choose the first available stage and goal.
  await chooseCustomSelect(0, 0);
  await chooseCustomSelect(1, 0);
  await fill(document.querySelector('.intake-step textarea'), 'موقع لشركتي');
  await click(document.querySelector('.intake-nav .button'));
  assert.ok(document.body.textContent.includes('كيف نحدد الخطوة الأولى؟'));

  // Step 3 -> final review. Review wording appears only on the final step.
  await click(document.querySelector('.intake-step .intake-nav .button'));
  assert.ok(document.body.textContent.includes('راجع طلبك قبل إتمامه.'));

  // Step 4 -> complete the request.
  await click(document.querySelector('.request-confirm input'));
  await click(document.querySelector('.request-complete-button'));
  await act(async () => Promise.resolve());
  assert.ok(document.querySelector('.request-complete-panel'));
  assert.match(document.querySelector('.request-reference strong').textContent, /^LT-\d{6}-\d{4}$/);
  assert.ok(document.body.textContent.includes('طلب مشروعك جاهز.'));

  await click(buttonContaining('انسخ تفاصيل الطلب'));
  assert.ok(copied.includes('نوع المشروع：تطوير الويب'));
  assert.ok(copied.includes('موقع لشركتي'));
  assert.ok(!copied.includes('Project type'));

  await click(document.querySelector('.desktop-language'));
  assert.equal(document.documentElement.dir, 'ltr');
  assert.ok(document.body.textContent.includes('Your project request is ready.'));
  await click(buttonContaining('Copy request details'));
  assert.ok(copied.includes('Project type：Web Development'));

  // Login UI bilingual behavior.
  const Login = require('../app/login/LoginForm.tsx').default;
  await act(async () => setLanguage('ar'));
  await render(Bridge, Login);
  await click(buttonContaining('إنشاء حساب'));
  assert.ok(document.body.textContent.includes('أنشئ مساحة عملك.'));
  await click(buttonContaining('تسجيل الدخول'));
  await click(buttonContaining('نسيت كلمة المرور'));
  assert.ok(document.body.textContent.includes('استعد حسابك.'));

  // Chat keeps client-authored message text exact while chrome remains localized.
  const Chat = require('../app/chat/ChatWorkspace.tsx').default;
  await render(Bridge, Chat);
  assert.ok(document.body.textContent.includes('محادثة المشروع'));
  await fill(document.querySelector('.chat-composer textarea'), 'Exact user message 123');
  await click(document.querySelector('.chat-send'));
  await act(async () => Promise.resolve());
  assert.equal(
    document.querySelector('.chat-message-row.client p').textContent,
    'Exact user message 123'
  );

  console.log('PASS: current Arabic/RTL nav, search, four-step request completion, login and chat flows');
  await act(async () => root.unmount());
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
