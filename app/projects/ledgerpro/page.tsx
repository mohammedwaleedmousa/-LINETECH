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
    stack={["React + Vite","Node.js + Express","Sequelize","PostgreSQL"]}
    visualWords={["RECORDS","WORKFLOWS","VISIBILITY","SYSTEM"]}
  />;
}
