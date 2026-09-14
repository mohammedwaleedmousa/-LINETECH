"use client";

import Localized, { useLanguage } from "../Localized";
import Link from "next/link";

type Item = [string, string];
type CaseStudyCopy = {
  decisions: Item[];
  outcome: string;
  outcomePoints: string[];
};

type ProjectDetailProps = {
  className: string;
  tag: string;
  title: string;
  lead: string;
  summary: string;
  challenge: string;
  approach: string;
  built: Item[];
  stack: string[];
  visualWords: string[];
  caseStudy: {
    en: CaseStudyCopy;
    ar: CaseStudyCopy;
  };
};

const caseLabels = {
  en: {
    decisionsKicker: "KEY PRODUCT DECISIONS",
    decisionsTitle: "The choices behind the product.",
    decisionsLead: "A case study is not only what was built. These are the decisions that shaped the experience and kept the product focused.",
    outcomeKicker: "THE OUTCOME",
    outcomeTitle: "A clearer product system.",
    outcomeLead: "The outcome is described through the delivered product structure and experience — without invented performance claims.",
  },
  ar: {
    decisionsKicker: "قرارات المنتج الرئيسية",
    decisionsTitle: "القرارات التي شكّلت المنتج.",
    decisionsLead: "دراسة الحالة ليست فقط ما تم بناؤه. هذه أهم القرارات التي شكّلت التجربة وحافظت على تركيز المنتج.",
    outcomeKicker: "النتيجة",
    outcomeTitle: "نظام منتج أكثر وضوحًا.",
    outcomeLead: "نصف النتيجة من خلال هيكل المنتج والتجربة التي تم تنفيذها، بدون اختراع أرقام أداء غير حقيقية.",
  },
} as const;

export default function ProjectDetail({ className, tag, title, lead, summary, challenge, approach, built, stack, visualWords, caseStudy }: ProjectDetailProps){
  const language = useLanguage();
  const c = caseStudy[language];
  const labels = caseLabels[language];

  return <Localized><main className={`ref-page project-detail-page ${className}`}>
    <section className="project-detail-hero">
      <div className="ref-shell project-detail-hero-grid">
        <div className="project-detail-hero-copy">
          <Link className="project-detail-back" href="/projects" prefetch>Projects <span>↗</span></Link>
          <p className="ref-kicker">{tag}</p>
          <h1>{title}</h1>
          <p className="project-detail-lead">{lead}</p>
          <div className="ref-hero-actions"><Link className="ref-btn primary" href="/start" prefetch>Build with us ↗</Link><Link className="ref-btn ghost" href="/projects" prefetch>All projects</Link></div>
        </div>
        <div className="project-detail-visual" aria-hidden="true"><span>LINETECH / CASE STUDY</span><div>{visualWords.map((word)=><strong key={word}>{word}</strong>)}</div><i/></div>
      </div>
    </section>

    <section className="ref-section project-detail-overview">
      <div className="ref-shell project-detail-overview-grid">
        <div><p className="ref-kicker">OVERVIEW</p><h2>The product in one line.</h2></div>
        <p>{summary}</p>
      </div>
    </section>

    <section className="ref-section">
      <div className="ref-shell project-detail-story-grid">
        <article><span>01</span><p className="ref-kicker">THE CHALLENGE</p><h2>What needed to become clearer.</h2><p>{challenge}</p></article>
        <article><span>02</span><p className="ref-kicker">THE APPROACH</p><h2>Structure before complexity.</h2><p>{approach}</p></article>
      </div>
    </section>

    <section className="ref-section">
      <div className="ref-shell">
        <div className="ref-head"><div><p className="ref-kicker">WHAT WE BUILT</p><h2>The working parts.</h2></div><p>The case study focuses on the product structure and implemented capabilities rather than invented performance claims.</p></div>
        <div className="project-detail-built-grid">
          {built.map(([title,text],index)=><article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="ref-section project-case-decisions">
      <div className="ref-shell">
        <div className="ref-head">
          <div><p className="ref-kicker">{labels.decisionsKicker}</p><h2>{labels.decisionsTitle}</h2></div>
          <p>{labels.decisionsLead}</p>
        </div>
        <div className="project-case-decision-grid">
          {c.decisions.map(([decisionTitle, text], index) => (
            <article key={decisionTitle}><span>{String(index + 1).padStart(2,"0")}</span><h3>{decisionTitle}</h3><p>{text}</p></article>
          ))}
        </div>
      </div>
    </section>

    <section className="ref-section project-case-outcome">
      <div className="ref-shell project-case-outcome-grid">
        <div>
          <p className="ref-kicker">{labels.outcomeKicker}</p>
          <h2>{labels.outcomeTitle}</h2>
          <p className="project-case-outcome-lead">{labels.outcomeLead}</p>
        </div>
        <div className="project-case-outcome-card">
          <p>{c.outcome}</p>
          <div>{c.outcomePoints.map((point,index)=><span key={point}><b>{String(index+1).padStart(2,"0")}</b>{point}</span>)}</div>
        </div>
      </div>
    </section>

    <section className="ref-section project-detail-stack">
      <div className="ref-shell project-detail-stack-grid">
        <div><p className="ref-kicker">TECHNOLOGY</p><h2>Built on a practical stack.</h2><p>Technology choices support the product requirements, maintainability and deployment needs.</p></div>
        <div>{stack.map((item,index)=><span key={item}><b>{String(index+1).padStart(2,"0")}</b>{item}</span>)}</div>
      </div>
    </section>

    <section className="ref-cta"><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">YOUR NEXT PROJECT</p><h2>Have a product that needs a clearer line?</h2><p>Start with the problem. We will help shape the right product.</p></div><Link className="ref-btn primary" href="/start" prefetch>Start Your Line ↗</Link></div></section>
  </main></Localized>;
}
