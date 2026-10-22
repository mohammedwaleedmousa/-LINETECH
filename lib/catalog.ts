export const categories = [
 {slug:"websites",en:"Websites",ar:"مواقع الويب"},
 {slug:"mobile-apps",en:"Mobile applications",ar:"تطبيقات الجوال"},
 {slug:"software-saas",en:"Software & SaaS",ar:"البرامج ومنصات SaaS"},
 {slug:"brand-design",en:"Brand & design",ar:"الهوية البصرية والتصميم"},
 {slug:"templates-tools",en:"Templates & digital tools",ar:"القوالب والأدوات الرقمية"},
 {slug:"technical-services",en:"Other technical solutions",ar:"حلول تقنية أخرى"},
] as const;
export type Product={id:string;slug:string;title:{ar:string;en:string};category:string;offer:"purchase"|"subscription";price:number|null};
// Publish approved inventory here after product/licence/payment decisions are made.
export const products:Product[]=[];
