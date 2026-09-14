import ProjectDetail from "../ProjectDetail";

export const metadata = {
  title: "Flamingo Park",
  description: "Flamingo Park case study — a mobile-first commerce platform focused on product discovery, ordering and store operations.",
};

export default function FlamingoParkPage(){
  return <ProjectDetail
    className="project-flamingo"
    tag="E-COMMERCE"
    title="Flamingo Park"
    lead="A mobile-first commerce experience built around product discovery, faster ordering and a clearer operational flow for the store."
    summary="Flamingo Park brings the catalog, product detail, filtering, ordering and store management into one focused digital experience designed for customers using mobile first."
    challenge="The product needed to make a large catalog easier to browse while reducing friction around product choices, orders and the operational work behind them."
    approach="The experience was structured around fast discovery, clear product information, responsive interaction and an admin flow that keeps catalog and order work manageable."
    built={[
      ["Catalog & discovery","Categories, brands, filtering and product browsing structured for a growing catalog."],
      ["Product experience","Product detail flows for images, sizes, colors, availability and purchase actions."],
      ["Order journey","A clearer path from product selection to order confirmation and customer follow-up."],
      ["Store operations","Admin tools for products, content, customers, orders and store configuration."],
    ]}
    caseStudy={{
      en:{
        decisions:[
          ["Mobile first","The shopping journey prioritizes small screens because product discovery and ordering are expected to happen heavily from phones."],
          ["Choice before checkout","Size, color and availability are surfaced before order confirmation so the customer makes the important product decisions earlier."],
          ["Commerce and operations together","The customer storefront and the internal management flow were treated as one product rather than two disconnected experiences."],
        ],
        outcome:"The result is one commerce system that connects what the customer sees with the work required to keep products, content and orders organized behind the scenes.",
        outcomePoints:["Structured catalog and brand discovery","Clear product selection and ordering flow","Operational interfaces for day-to-day store management"],
      },
      ar:{
        decisions:[
          ["الموبايل أولًا","تم إعطاء رحلة التسوق على الشاشات الصغيرة الأولوية لأن اكتشاف المنتجات والطلب يحدثان بشكل كبير من الهاتف."],
          ["الاختيار قبل التأكيد","يظهر المقاس واللون والتوفر قبل تأكيد الطلب حتى يتخذ العميل أهم قرارات المنتج مبكرًا."],
          ["التجارة والتشغيل كنظام واحد","تم التعامل مع واجهة العميل وإدارة المتجر كمنتج واحد بدل تجربتين منفصلتين."],
        ],
        outcome:"النتيجة هي نظام تجارة واحد يربط ما يراه العميل بالعمل المطلوب خلف الكواليس لإدارة المنتجات والمحتوى والطلبات بصورة أوضح.",
        outcomePoints:["كتالوج واكتشاف منظم حسب الأقسام والماركات","مسار واضح لاختيار المنتج وإتمام الطلب","واجهات تشغيلية لإدارة المتجر بشكل يومي"],
      },
    }}
    stack={["React + Vite","Tailwind CSS","Supabase","Cloudflare Pages"]}
    visualWords={["DISCOVERY","COMMERCE","ORDERS","OPERATIONS"]}
  />;
}
