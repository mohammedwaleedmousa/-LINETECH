import ServiceDetail from "../ServiceDetail";

export const metadata = {
  title: "Brand Identity",
  description: "Brand identity services from LINETECH for clear, consistent and credible visual systems.",
};

export default function BrandIdentityPage(){
  return <ServiceDetail
    className="service-brand"
    eyebrow="BRAND IDENTITY"
    title="A visual system with a clear point of view."
    lead="We build focused brand identities that make a business feel intentional, consistent and credible across the places customers actually see it."
    serviceParam="Brand Identity"
    visualWords={["IDENTITY","SYSTEM","CONSISTENCY","CLARITY"]}
    deliverables={[
      ["Visual direction","A focused look and feel that matches the business, audience and positioning."],
      ["Logo system","A practical logo direction with the core versions needed for real-world use."],
      ["Brand language","Typography, color and graphic rules that keep the identity consistent."],
      ["Usage guidance","A simple system that makes future design decisions easier and more coherent."],
    ]}
    fits={[
      ["New businesses","A strong first identity for a company that needs to enter the market with clarity."],
      ["Growing brands","A more consistent system for a business whose current visuals no longer match its direction."],
      ["Digital products","A visual foundation that can move naturally across a website, product and social presence."],
    ]}
    engagement={{
      en:{
        need:["Business story, audience and positioning","Existing logo, assets or visual material if available","References, competitors and where the identity will be used"],
        do:["Define a focused visual direction","Develop the logo, typography, color and graphic system","Prepare practical rules for consistent application"],
        receive:["The agreed logo versions and core brand assets","A coherent typography, color and graphic language","Practical usage guidance for future brand work"],
      },
      ar:{
        need:["قصة النشاط والجمهور والتموضع","الشعار أو الأصول أو المواد البصرية الحالية إن وجدت","المراجع والمنافسون والأماكن التي ستستخدم فيها الهوية"],
        do:["نحدد اتجاهًا بصريًا مركزًا","نطوّر الشعار والخطوط والألوان والنظام الرسومي","نجهز قواعد عملية للاستخدام المتناسق"],
        receive:["نسخ الشعار والأصول الأساسية المتفق عليها","نظامًا متناسقًا للخطوط والألوان والعناصر الرسومية","إرشادات استخدام عملية لأعمال الهوية المستقبلية"],
      },
    }}
    process={[
      ["Understand","We clarify the business, audience, tone and what the identity needs to communicate."],
      ["Direction","We define the visual territory before refining individual elements."],
      ["Systemize","We turn the direction into a repeatable logo, type, color and graphic system."],
      ["Deliver","We prepare the agreed assets and practical guidance for consistent use."],
    ]}
  />;
}
