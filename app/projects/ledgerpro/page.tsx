import ProjectDetail from "../ProjectDetail";

export const metadata = {
  title: "LedgerPro",
  description: "LedgerPro case study — a business system focused on financial records, workflows and clearer operational visibility.",
};

export default function LedgerProPage(){
  return <ProjectDetail
    className="project-ledger"
    tag="BUSINESS SYSTEM"
    title="LedgerPro"
    lead="A business system built to organize financial records, operational workflows and the information teams need to see clearly."
    summary="LedgerPro brings core business records and workflows into a structured web platform so information is easier to manage, review and extend as operational needs grow."
    challenge="Business records become difficult to manage when information is spread across manual steps, disconnected files and inconsistent workflows."
    approach="The system was structured around clear entities, repeatable workflows and a practical interface that keeps operational data easier to understand and maintain."
    built={[
      ["Records structure","Core business and financial records organized into a consistent system."],
      ["Operational workflows","Repeatable flows for creating, updating and reviewing day-to-day information."],
      ["Dashboard visibility","Focused views that surface the information needed for clearer operational awareness."],
      ["Scalable foundation","A web architecture that can support additional business capabilities as requirements develop."],
    ]}
    caseStudy={{
      en:{
        decisions:[
          ["Structured records first","Business and financial information is organized around clear entities before adding dashboard complexity."],
          ["Repeatable workflows","Common actions follow consistent create, update and review patterns so daily work is easier to understand and maintain."],
          ["Visibility without overload","Dashboard views focus on the operational information that needs attention instead of exposing every record at once."],
        ],
        outcome:"LedgerPro turns disconnected business records into a more coherent operational product, with a structure that can support additional capabilities without rebuilding the foundation.",
        outcomePoints:["Consistent structure for business and financial records","Repeatable operational workflows across the product","A practical web foundation for extending future business capabilities"],
      },
      ar:{
        decisions:[
          ["هيكلة السجلات أولًا","تم تنظيم المعلومات التجارية والمالية حول كيانات واضحة قبل إضافة تعقيد لوحات التحكم."],
          ["سير عمل قابل للتكرار","تتبع العمليات اليومية أنماطًا موحدة للإنشاء والتحديث والمراجعة لتكون أسهل في الفهم والصيانة."],
          ["وضوح بدون ازدحام","تركز لوحات العرض على المعلومات التشغيلية التي تحتاج الانتباه بدل إظهار كل السجلات في وقت واحد."],
        ],
        outcome:"يحوّل LedgerPro السجلات التجارية المتفرقة إلى منتج تشغيلي أكثر ترابطًا، مع أساس يسمح بإضافة قدرات جديدة مستقبلًا دون إعادة بناء النظام من الصفر.",
        outcomePoints:["هيكلة موحدة للسجلات التجارية والمالية","سير عمل متكرر وواضح داخل المنتج","أساس ويب عملي يمكن توسيعه بقدرات أعمال إضافية"],
      },
    }}
    stack={["React + Vite","Node.js + Express","Sequelize","PostgreSQL"]}
    visualWords={["RECORDS","WORKFLOWS","VISIBILITY","SYSTEM"]}
  />;
}
