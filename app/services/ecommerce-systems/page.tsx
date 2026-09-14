import ServiceDetail from "../ServiceDetail";

export const metadata = {
  title: "E-commerce & Systems",
  description: "E-commerce and business system services from LINETECH, designed around real customer journeys and operational workflows.",
};

export default function EcommerceSystemsPage(){
  return <ServiceDetail
    className="service-commerce"
    eyebrow="E-COMMERCE & SYSTEMS"
    title="Digital systems built around real workflows."
    lead="We design commerce experiences and operational systems around how customers buy and how teams actually work — keeping the flow clear from the interface to the business process behind it."
    serviceParam="E-commerce & Systems"
    visualWords={["COMMERCE","FLOW","SYSTEMS","OPERATIONS"]}
    deliverables={[
      ["Customer journey","A clear path from discovery to the action that matters, without unnecessary friction."],
      ["System structure","Roles, screens, states and workflows organized around the way the business operates."],
      ["Commerce experience","Product, cart, checkout or ordering flows shaped for clarity and practical use."],
      ["Operational view","Dashboards and management flows that make the system easier to run after launch."],
    ]}
    fits={[
      ["Retail businesses","Stores that need a stronger digital buying experience and a clearer order flow."],
      ["Service operations","Businesses that need booking, requests, dashboards or structured internal workflows."],
      ["Custom processes","Teams using manual or disconnected steps that can be turned into one focused system."],
    ]}
    engagement={{
      en:{
        need:["Products or services, pricing rules and order logic","Current operational workflow and team roles","Payment, delivery, booking or management requirements"],
        do:["Map customer and internal workflows end to end","Design the storefront, dashboard and system states","Build and test the agreed commerce or operational flow"],
        receive:["A clear customer buying or request experience","The agreed management and operational interfaces","A tested system flow with agreed access and handover"],
      },
      ar:{
        need:["المنتجات أو الخدمات وقواعد التسعير وآلية الطلب","سير العمل الحالي وأدوار الفريق","متطلبات الدفع والتوصيل والحجز أو الإدارة"],
        do:["نرسم رحلة العميل وسير العمل الداخلي من البداية للنهاية","نصمم المتجر ولوحات الإدارة وحالات النظام","نبني ونختبر مسار التجارة أو التشغيل المتفق عليه"],
        receive:["تجربة شراء أو طلب واضحة للعميل","واجهات الإدارة والتشغيل المتفق عليها","مسار نظام مختبر مع الصلاحيات والتسليم المتفق عليه"],
      },
    }}
    process={[
      ["Map the flow","We understand the customer journey and the operational steps behind it."],
      ["Define the system","We clarify roles, states, screens and the minimum useful scope."],
      ["Design & build","We shape the interface and implement the agreed workflows."],
      ["Test the process","We validate the end-to-end flow and prepare the system for real use."],
    ]}
  />;
}
