const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),ts=require('typescript');
function load(file,deps={}){const box={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:box,exports:box.exports,require:n=>{if(n in deps)return deps[n];throw Error(n);},URL,URLSearchParams,Request,Response,Headers,Intl,console:{log(){},warn(){},error(){}},crypto:require('node:crypto').webcrypto});return box.exports;}
const model=load('lib/catalog.ts'),policy=load('lib/navigation/route-policy.ts');
const t=s=>({ar:s,en:s});
const offer={id:'once',billing:'purchase',title:t('Purchase'),amount:100,currency:'USD',includes:[t('Agreed delivery')],license:t('A defined licence'),renewal:t('No automatic recurring fee')};
const care={id:'care',billing:'monthly',title:t('Care'),summary:t('Support'),amount:10,currency:'USD',includes:[t('Maintenance')],terms:t('Monthly agreement'),published:true};
const product={id:'fixture-only',slug:'fixture-only',title:t('Demo Website'),summary:t('Store for a business'),description:t('A test product only'),category:'websites',industry:t('Retail'),platforms:['Web'],features:[t('Responsive')],screenshots:[],demoUrl:'https://demo.example.test/store',offers:[offer,{...offer,id:'monthly',billing:'monthly'}],aftercareIds:['care'],published:true};
assert.deepEqual([...model.catalogErrors(model.products,model.aftercarePlans)],[]);
assert(!model.products.some(p=>p.id==='fixture-only'),'No test inventory may be shipped as a real product');
assert.deepEqual([...model.catalogErrors([product],[care])],[]);
for(const value of ['javascript:alert(1)','data:text/html,a','http://demo.example.test','https://user:password@example.test','//example.test',null])assert.equal(model.safeDemoUrl(value),null);
assert.equal(model.safeDemoUrl(product.demoUrl),product.demoUrl);
assert.equal(model.filterProducts([product],'RETAIL','websites','monthly').length,1);
assert.equal(model.filterProducts([product],'','mobile-apps','').length,0);
assert.equal(model.filterProducts([{...product,published:false}],'','','').length,0);
assert(model.catalogErrors([{...product,demoUrl:'javascript:x'}],[care]).some(e=>e.includes('demo')));
assert(model.catalogErrors([{...product,aftercareIds:['missing']}],[care]).some(e=>e.includes('care')));
assert(model.catalogErrors([{...product,offers:[{...offer,amount:-1}]}],[care]).some(e=>e.includes('offer')));
assert(model.catalogErrors([{...product,offers:[offer,offer]}],[care]).some(e=>e.includes('offer')));
assert(model.catalogErrors([product,product],[care]).some(e=>e.includes('duplicate')));
assert.equal(new URL(model.inquiryHref(product,offer),'https://local.test').searchParams.get('offer'),'once');
const xml=fs.readFileSync('public/sitemap.xml','utf8');
assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).sort(),[...policy.publicRoutes].sort());
for(const p of [...policy.retiredPrefixes,'/services/guide','/services/process','/services/brand-identity','/services/cv-portfolio'])assert(!policy.publicRoutes.includes(p));
for(const p of ['app/company-space','app/account/companies','app/knowledge','app/admin/companies','app/admin/content','app/admin/audit','app/services/guide','app/services/process','app/service-finder','app/how-we-work','app/products/category'])assert(!fs.existsSync(p),'Retired source remains: '+p);
for(const file of ['app/SiteNav.tsx','app/SiteFooter.tsx','app/account/AccountNav.tsx','app/admin/AdminShell.tsx']){
 const source=fs.readFileSync(file,'utf8');for(const p of policy.retiredPrefixes)assert(!source.includes('"'+p+'"'),'Retired navigation destination in '+file+': '+p);
}
// Home layout stays identical; only copy/links and card data change.
const home=fs.readFileSync('app/page.tsx','utf8');
for(const component of ['HomeHeroArt','HomeProjects','HomePlatform','HomeAbout','HomeWhy'])assert(home.includes('<'+component));
assert(home.includes('Every idea<br/>starts with a line.'));
assert.equal((home.match(/<section /g)||[]).length,6);
const core={json:load('worker/core.ts').json,resolveSession:async()=>{throw Error('No auth access expected on retired routes');},withCookies:r=>r,withSecurityHeaders:r=>r};
const worker=load('worker/index.ts',{'../lib/navigation/return-path':load('lib/navigation/return-path.ts'),'../lib/navigation/route-policy':policy,'./core':core,'./auth':{},'./client':{},'./admin':{}}).default;
(async()=>{
 let assets=0;const env={ASSETS:{fetch:async()=>{assets++;return new Response('asset');}}};
 for(const p of [...policy.retiredPrefixes,...policy.retiredApiPrefixes]){
  for(const suffix of ['', '/index.html','/index.txt']){
   const response=await worker.fetch(new Request('https://local.test'+p+suffix),env);assert.equal(response.status,410,p+suffix);assert.equal(response.headers.get('Cache-Control'),'no-store');
  }
 }
 assert.equal(assets,0);
 for(const [from,to] of Object.entries(policy.legacyRoutes)){
  const response=await worker.fetch(new Request('https://local.test'+from+'?project=keep&_rsc=discard'),env);assert.equal(response.status,308);
  const target=new URL(response.headers.get('Location')),expected=new URL(to,'https://local.test');assert.equal(target.pathname,expected.pathname);assert.equal(target.hash,expected.hash);assert.equal(target.searchParams.get('project'),'keep');assert(!target.searchParams.has('_rsc'));
  if(expected.searchParams.has('category'))assert.equal(target.searchParams.get('category'),expected.searchParams.get('category'));
 }
 assert.equal(assets,0);
 console.log('PASS: two product types, purchase/monthly/care model, safe demos, publication validation, no published test inventory, retired routes/APIs, canonical redirects, sitemap and preserved home structure');
})().catch(e=>{console.error(e);process.exitCode=1;});
