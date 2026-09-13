import Link from "next/link";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about working with LINETECH, project scope, payments, revisions, launch and support.",
};

const faqs = [
  ["How do we start a project?","Start with the project brief. You can explain the idea in simple language; technical details can be defined after the goal and scope are clear."],
  ["Do I need a complete specification before contacting LINETECH?","No. A rough idea is enough to begin the conversation. The first step is understanding the outcome, then defining the useful scope."],
  ["How are payments usually structured?","For project work, the standard structure is 40% to begin, 30% during the project and 30% before final handover, unless a different structure is agreed for the project."],
  ["How long does a project take?","Timing depends on the type of work, scope, content readiness and feedback speed. The schedule is defined after the project is understood rather than promising one fixed duration for every project."],
  ["Can the scope change after work begins?","Yes, but changes that affect the agreed scope, timeline or deliverables are reviewed before they are added so the project stays controlled."],
  ["Are revisions included?","Revisions are handled within the agreed project scope. The exact review stages and what is included are defined before execution begins."],
  ["Who handles hosting and deployment?","For web projects, deployment can be prepared as part of the project. The exact hosting setup depends on the product and is agreed during planning."],
  ["What happens after launch?","The handover includes the agreed project assets and launch state. Ongoing maintenance or support can be scoped separately when needed."],
];

export default function FaqPage(){return <main className="info-page page-faq">
  <section className="info-page-hero"><div className="ref-shell"><p className="ref-kicker">FAQ</p><h1>Clear answers before we build.</h1><p>Common questions about scope, payments, revisions, launch and the way LINETECH approaches project work.</p></div></section>
  <section className="info-content"><div className="ref-shell info-content-grid"><aside className="info-content-aside"><p className="ref-kicker">WORKING TOGETHER</p><h2>Keep the process clear from the first line.</h2><p>If your question is specific to your project, send the brief and we can define it in context.</p><Link className="ref-btn ghost" href="/start" prefetch>Start Your Line ↗</Link></aside><div className="faq-list">{faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
</main>}
