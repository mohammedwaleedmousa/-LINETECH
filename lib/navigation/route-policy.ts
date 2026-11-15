/** Single route inventory for the focused LINETECH storefront. */
export const primaryRoutes=["/","/services","/projects","/about","/contact"] as const;
export const publicRoutes=[
  "/","/services","/projects","/about","/contact","/privacy","/terms",
] as const;
export const utilityRoutes=["/login","/admin/login","/thank-you"] as const;
export const legacyRoutes:Record<string,string>={
  "/products":"/services#catalog", "/products/view":"/services#catalog",
  "/pricing":"/services#pricing", "/faq":"/contact#faq",
  "/services/web-development":"/services#web-development",
  "/services/app-development":"/services#app-development",
  "/services/ecommerce-systems":"/services#ecommerce-systems",
  "/services/request":"/contact#request", "/start":"/contact#request",
  "/projects/flamingo-park":"/projects#flamingo-park",
  "/projects/etqan":"/projects#etqan", "/projects/ledgerpro":"/projects#ledgerpro",
  "/workspace":"/account/projects", "/chat":"/account/projects/messages", "/handover":"/account/projects/handover",
  "/service-finder":"/services#choose", "/services/guide":"/services#choose",
  "/how-we-work":"/about#process", "/services/process":"/about#process",
  "/services/brand-identity":"/services", "/services/cv-portfolio":"/services",
  "/products/category/websites":"/services?category=websites#catalog",
  "/products/category/mobile-apps":"/services?category=mobile-apps#catalog",
  "/products/category/software-saas":"/services#catalog", "/products/category/brand-design":"/services#catalog",
  "/products/category/templates-tools":"/services#catalog", "/products/category/technical-services":"/services#catalog",
};
export const retiredPrefixes=["/knowledge","/company-space","/account/companies","/admin/companies","/admin/content","/admin/audit"];
export const retiredApiPrefixes=["/api/company-applications","/api/companies","/api/company-team","/api/company-invitations","/api/admin/company-applications"];
export function isRetired(path:string){return [...retiredPrefixes,...retiredApiPrefixes].some(prefix=>path===prefix||path.startsWith(prefix+"/"));}
