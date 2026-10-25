/** Single route inventory for the focused LINETECH storefront. */
export const publicRoutes=[
  "/","/products","/services","/services/web-development","/services/app-development","/services/ecommerce-systems","/services/request",
  "/projects","/projects/flamingo-park","/projects/etqan","/projects/ledgerpro","/pricing","/about","/contact","/faq","/privacy","/terms",
] as const;
export const utilityRoutes=["/login","/admin/login","/thank-you","/products/view"] as const;
export const legacyRoutes:Record<string,string>={
  "/start":"/services/request","/workspace":"/account/projects","/chat":"/account/projects/messages","/handover":"/account/projects/handover",
  "/service-finder":"/services#choose","/services/guide":"/services#choose","/how-we-work":"/services#process","/services/process":"/services#process",
  "/services/brand-identity":"/services","/services/cv-portfolio":"/services",
  "/products/category/websites":"/products?category=websites","/products/category/mobile-apps":"/products?category=mobile-apps",
  "/products/category/software-saas":"/products","/products/category/brand-design":"/products","/products/category/templates-tools":"/products","/products/category/technical-services":"/products",
};
export const retiredPrefixes=["/knowledge","/company-space","/account/companies","/admin/companies","/admin/content","/admin/audit"];
export const retiredApiPrefixes=["/api/company-applications","/api/companies","/api/company-team","/api/company-invitations","/api/admin/company-applications"];
export function isRetired(path:string){return [...retiredPrefixes,...retiredApiPrefixes].some(prefix=>path===prefix||path.startsWith(prefix+"/"));}
