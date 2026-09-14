import ProjectDetail from "../ProjectDetail";

export const metadata = {
  title: "Etqan",
  description: "Etqan case study — a services marketplace structured around discovery, trust, categories and scalable operations.",
};

export default function EtqanPage(){
  return <ProjectDetail
    className="project-etqan"
    tag="SERVICES MARKETPLACE"
    title="Etqan"
    lead="A services marketplace designed to make finding, comparing and requesting local services clearer for customers and easier to manage operationally."
    summary="Etqan organizes providers, categories and service requests into one marketplace experience, with the structure needed to support both customer discovery and platform administration."
    challenge="A services marketplace has to make many providers and categories feel simple, while still creating enough structure for trust, discovery and future growth."
    approach="The product was shaped around clear categories, provider visibility, focused customer journeys and an admin structure that can support the marketplace as it expands."
    built={[
      ["Service discovery","Category-driven browsing that helps customers move from a need to relevant providers."],
      ["Provider structure","A consistent way to present service providers, details and the information customers need."],
      ["Customer journey","Flows for discovering, reviewing and moving toward a service request with less confusion."],
      ["Admin operations","Management areas for marketplace content, providers, customers and platform structure."],
    ]}
    caseStudy={{
      en:{
        decisions:[
          ["Need-first discovery","The experience starts from what the customer needs, then narrows into categories and relevant providers instead of making users search an unstructured list."],
          ["Consistent provider profiles","Providers follow one clear information structure so customers can compare services without relearning the interface each time."],
          ["Admin structure from day one","Provider, category, customer and content management were considered part of the product foundation, not an afterthought."],
        ],
        outcome:"Etqan became a structured marketplace concept where service discovery, provider presentation and platform management follow one consistent system.",
        outcomePoints:["Category-led path from need to provider","Consistent provider and service presentation","Administrative structure ready to support a growing marketplace"],
      },
      ar:{
        decisions:[
          ["الاكتشاف يبدأ من الاحتياج","تبدأ التجربة بما يحتاجه العميل ثم تضيق النتائج إلى الأقسام ومقدمي الخدمة المناسبين بدل قائمة غير منظمة."],
          ["ملفات مقدمي الخدمة بشكل موحد","يتبع مقدمو الخدمة هيكل معلومات واحدًا حتى يستطيع العميل المقارنة بدون تعلم واجهة مختلفة في كل مرة."],
          ["هيكلة الإدارة من البداية","تم اعتبار إدارة مقدمي الخدمة والأقسام والعملاء والمحتوى جزءًا من أساس المنتج وليس إضافة لاحقة."],
        ],
        outcome:"أصبح إتقان مفهوم سوق خدمات منظمًا، حيث يسير اكتشاف الخدمة وعرض مقدميها وإدارة المنصة داخل نظام واحد ومتناسق.",
        outcomePoints:["مسار مبني على الأقسام من الاحتياج إلى مقدم الخدمة","عرض موحد وواضح للخدمات ومقدميها","هيكلة إدارية قابلة لدعم نمو السوق"],
      },
    }}
    stack={["React + Vite","Tailwind CSS","Supabase","Cloudflare"]}
    visualWords={["SERVICES","DISCOVERY","TRUST","MARKETPLACE"]}
  />;
}
