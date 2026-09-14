import ServiceDetail from "../ServiceDetail";

export const metadata = {
  title: "CV & Portfolio",
  description: "CV and portfolio presentation services from LINETECH for clearer professional positioning and stronger digital presence.",
};

export default function CvPortfolioPage(){
  return <ServiceDetail
    className="service-cv"
    eyebrow="CV & PORTFOLIO"
    title="Present your work with clarity."
    lead="We structure professional experience, projects and personal value into a cleaner CV and portfolio presence that is easier to understand and easier to trust."
    serviceParam="CV & Portfolio"
    visualWords={["PROFILE","WORK","VALUE","PRESENCE"]}
    deliverables={[
      ["Content structure","Experience, skills and projects organized around what matters most to the target opportunity."],
      ["CV presentation","A clean professional document with stronger hierarchy, readability and consistency."],
      ["Portfolio structure","A focused way to present selected work, responsibilities and project context."],
      ["Digital presence","A clearer foundation for presenting the same professional story across relevant channels."],
    ]}
    fits={[
      ["Students & graduates","A first professional presentation that turns academic and project work into a clearer story."],
      ["Professionals","A stronger CV or portfolio when experience has grown but the current presentation has not."],
      ["Specialists & freelancers","A focused portfolio that helps clients or employers understand capabilities quickly."],
    ]}
    engagement={{
      en:{
        need:["Current CV, profile or existing portfolio if available","Target role, industry or type of opportunity","Projects, achievements and supporting links or material"],
        do:["Prioritize the strongest experience for the target","Rewrite and structure content for clarity and scanning","Design the CV and portfolio presentation as one consistent story"],
        receive:["A refined professional CV in the agreed format","A clear portfolio structure for selected work","Organized source content and agreed editable/export files"],
      },
      ar:{
        need:["السيرة الحالية أو الملف المهني أو الـPortfolio إن وجد","الوظيفة أو المجال أو نوع الفرصة المستهدفة","المشاريع والإنجازات والروابط أو المواد الداعمة"],
        do:["نرتب أقوى الخبرات حسب الهدف المستهدف","نعيد صياغة المحتوى وهيكلته ليكون أوضح وأسهل في القراءة","نصمم السيرة والـPortfolio كقصة مهنية واحدة ومتناسقة"],
        receive:["سيرة ذاتية احترافية محسنة بالصيغة المتفق عليها","هيكلة واضحة للـPortfolio والأعمال المختارة","محتوى منظم والملفات القابلة للتعديل أو التصدير المتفق عليها"],
      },
    }}
    process={[
      ["Review","We understand the target role, current material and strongest experience."],
      ["Prioritize","We decide what should lead, what supports it and what can be removed."],
      ["Present","We build the hierarchy, wording structure and visual presentation."],
      ["Finalize","We refine consistency and prepare the agreed files for practical use."],
    ]}
  />;
}
