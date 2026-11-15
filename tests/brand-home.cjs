const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');const {JSDOM}=require('jsdom');
for(const language of ['en','ar']){
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync('app/page.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:n=>n==='react/jsx-runtime'?require(n):n==='next/link'?{default:({children,...p})=>React.createElement('a',p,children)}:n==='./Localized'?{useLanguage:()=>language}:n.endsWith('.css')?new Proxy({},{get:(_,k)=>k}):(()=>{throw Error(n)})()});
 const doc=new JSDOM(renderToStaticMarkup(React.createElement(module.exports.default))).window.document;
 assert.equal(doc.querySelector('main').dir,language==='ar'?'rtl':'ltr');
 assert.equal(doc.querySelectorAll('h1').length,1);
 for(const id of ['services','projects','about','contact'])assert(doc.getElementById(id));
 for(const a of doc.querySelectorAll('a[href^="#"]'))assert(doc.querySelector(a.getAttribute('href')));
 assert.equal(doc.querySelectorAll('#services a').length,4);
 assert(doc.querySelector('a[href="mailto:info@linetech.company"]'));
 assert(doc.querySelector('a[href="tel:+967773335065"]'));
 for(const a of doc.querySelectorAll('a[target="_blank"]'))assert(a.rel.includes('noopener'));
 assert(doc.body.textContent.includes(language==='ar'?'مشروع تصوّري':'CONCEPT EXPLORATION'));
 for(const im of doc.querySelectorAll('img'))assert(fs.existsSync('public'+im.getAttribute('src')));
}
console.log('PASS: EN/AR home rendering, RTL, service/contact links, anchor destinations, concept disclosure and local assets');
