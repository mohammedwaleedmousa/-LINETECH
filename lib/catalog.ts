export type LocalizedText = {ar:string;en:string};
export type Billing = "purchase"|"monthly";
export type ProductOffer = {
  id:string; billing:Billing; title:LocalizedText;
  amount:number|null; currency:string; includes:LocalizedText[];
  license:LocalizedText; renewal:LocalizedText;
};
export type Product = {
  id:string;slug:string;title:LocalizedText;summary:LocalizedText;description:LocalizedText;
  category:"websites"|"mobile-apps";industry:LocalizedText;platforms:string[];
  features:LocalizedText[];screenshots:{src:string;alt:LocalizedText}[];
  demoUrl:string|null;offers:ProductOffer[];aftercareIds:string[];published:boolean;
};
export type AftercarePlan={billing:"monthly";id:string;title:LocalizedText;summary:LocalizedText;amount:number|null;currency:string;includes:LocalizedText[];terms:LocalizedText;published:boolean};
export const categories = [
  {slug:"websites",en:"Ready-made websites",ar:"مواقع جاهزة"},
  {slug:"mobile-apps",en:"Ready-made applications",ar:"تطبيقات جاهزة"},
] as const;
export const saleModels = [
  {id:"purchase",ar:"شراء لمرة واحدة",en:"One-time purchase",bodyAr:"شراء المنتج وفق الترخيص والخدمات الموضّحة في عرضه.",bodyEn:"Buy a product under its stated licence and included services."},
  {id:"monthly",ar:"اشتراك شهري",en:"Monthly subscription",bodyAr:"استخدام المنتج مقابل اشتراك شهري، وفق تفاصيل التجديد والخدمات المشمولة.",bodyEn:"Use a product through a monthly subscription with stated renewal and service terms."},
  {id:"aftercare",ar:"خدمات ما بعد البيع",en:"After-sales care",bodyAr:"صيانة ودعم وتحديثات أو استضافة للمنتجات والمشاريع، بحسب الباقة المتفق عليها.",bodyEn:"Maintenance, support, updates or hosting for products and custom projects, under the agreed care plan."},
] as const;
// Add only owner-approved, real products/prices. Test fixtures never ship here.
export const products:Product[]=[];
export const aftercarePlans:AftercarePlan[]=[];
export function safeDemoUrl(value:unknown):string|null {
  if(typeof value!=="string")return null;
  try{const url=new URL(value);return url.protocol==="https:"&&!url.username&&!url.password?url.href:null;}catch{return null;}
}
export function productHref(slug:string){return "/products/view?product="+encodeURIComponent(slug);}
export function inquiryHref(product:Product,offer:ProductOffer){
  return "/contact?"+new URLSearchParams({product:product.slug,offer:offer.id}).toString();
}
export function formatPrice(amount:number|null,currency:string,language:"ar"|"en"){
  if(amount===null)return language==="ar"?"السعر عند الاستفسار":"Price on request";
  return new Intl.NumberFormat(language==="ar"?"ar-YE":"en",{style:"currency",currency}).format(amount);
}
export function filterProducts(items:Product[],query:string,category:string,billing:string){
  const q=query.trim().toLocaleLowerCase();
  return items.filter(p=>p.published&&(!category||p.category===category)&&(!billing||p.offers.some(o=>o.billing===billing))&&(!q||[p.title.ar,p.title.en,p.summary.ar,p.summary.en,p.industry.ar,p.industry.en,...p.platforms].join(" ").toLocaleLowerCase().includes(q)));
}
export function catalogErrors(items:Product[],care:AftercarePlan[]):string[]{
  const errors:string[]=[],ids=new Set<string>(),slugs=new Set<string>();
  const localized=(v:LocalizedText|undefined)=>Boolean(v&&typeof v.ar==="string"&&v.ar.trim()&&typeof v.en==="string"&&v.en.trim());
  const price=(v:number|null,c:string)=>{if(v!==null&&(!Number.isFinite(v)||v<0))return false;try{new Intl.NumberFormat("en",{style:"currency",currency:c});return /^[A-Z]{3}$/.test(c);}catch{return false;}};
  const careIds=new Set<string>();
  for(const plan of care){if(plan.billing!=="monthly"||!plan.id||careIds.has(plan.id)||!localized(plan.title)||!localized(plan.summary)||!localized(plan.terms)||!price(plan.amount,plan.currency)||!plan.includes.length||!plan.includes.every(localized))errors.push(`Invalid care plan: ${plan.id}`);careIds.add(plan.id);}
  for(const p of items){
    if(!p.id||ids.has(p.id)||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||slugs.has(p.slug))errors.push(`Invalid/duplicate product identity: ${p.slug}`);
    ids.add(p.id);slugs.add(p.slug);
    if(!categories.some(c=>c.slug===p.category)||!localized(p.title)||!localized(p.summary)||!localized(p.description)||!localized(p.industry)||!p.features.length||!p.features.every(localized)||!p.platforms.length)errors.push(`Incomplete product: ${p.slug}`);
    if(p.demoUrl!==null&&!safeDemoUrl(p.demoUrl))errors.push(`Unsafe demo: ${p.slug}`);
    if(p.published&&p.category==="websites"&&!safeDemoUrl(p.demoUrl))errors.push(`Published website needs a real demo: ${p.slug}`);
    if(p.screenshots.some(s=>!/^\/(?!\/)[^?#]+\.(?:png|jpe?g|webp|avif)$/i.test(s.src)||!localized(s.alt)))errors.push(`Invalid screenshot: ${p.slug}`);
    const offerIds=new Set<string>();
    if(!p.offers.length)errors.push(`Missing offer: ${p.slug}`);
    for(const o of p.offers){if(!o.id||offerIds.has(o.id)||!['purchase','monthly'].includes(o.billing)||!localized(o.title)||!localized(o.license)||!localized(o.renewal)||!price(o.amount,o.currency)||!o.includes.length||!o.includes.every(localized))errors.push(`Invalid offer: ${p.slug}/${o.id}`);offerIds.add(o.id);}
    if(p.aftercareIds.some(id=>!careIds.has(id)))errors.push(`Unknown care plan: ${p.slug}`);
  }
  return errors;
}
