import Link from "next/link";

type Item = [string, string];

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
};

export default function ProjectDetail({ className, tag, title, lead, summary, challenge, approach, built, stack, visualWords }: ProjectDetailProps){
  return <main className={`ref-page project-detail-page ${className}`}>
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

    <section className="ref-section project-detail-stack">
      <div className="ref-shell project-detail-stack-grid">
        <div><p className="ref-kicker">TECHNOLOGY</p><h2>Built on a practical stack.</h2><p>Technology choices support the product requirements, maintainability and deployment needs.</p></div>
        <div>{stack.map((item,index)=><span key={item}><b>{String(index+1).padStart(2,"0")}</b>{item}</span>)}</div>
      </div>
    </section>

    <section className="ref-cta"><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">YOUR NEXT PROJECT</p><h2>Have a product that needs a clearer line?</h2><p>Start with the problem. We will help shape the right product.</p></div><Link className="ref-btn primary" href="/start" prefetch>Start Your Line ↗</Link></div></section>
  </main>;
}
