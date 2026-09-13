const projects = [
  ["E-COMMERCE", "Flamingo Park", "A mobile-first commerce platform focused on product discovery, orders and customer conversion.", "Commerce / Web Product"],
  ["BUSINESS SYSTEM", "LedgerPro", "A business platform for financial records, operational workflows and clearer day-to-day visibility.", "Business System / SaaS"],
  ["INDUSTRIAL AI", "Predictive Maintenance", "A machine-learning project focused on failure prediction and industrial maintenance decisions.", "Machine Learning / Industrial AI"],
];

export default function ProjectsPage() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="/"><span className="mark"><i /><b /></span><span>LINETECH</span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a href="/services">Services</a><a className="active" href="/projects">Projects</a><a href="/about">About</a></nav>
        <a className="button button-light nav-cta" href="/#contact">Start Your Line <span>↗</span></a>
      </header>

      <section className="inner-hero section-border">
        <div className="shell inner-hero-grid">
          <div><p className="eyebrow">SELECTED WORK</p><h1>Real products. Built around real problems.</h1></div>
          <p>Our work spans commerce, business systems and applied AI. Case-study metrics are only published when they can be verified.</p>
        </div>
      </section>

      <section className="shell section work-list">
        {projects.map(([tag,title,text,type], index) => (
          <article className="work-row" key={title}>
            <div className={`work-visual work-${index + 1}`}><span>{String(index + 1).padStart(2,"0")}</span></div>
            <div className="work-copy"><span className="pill">{tag}</span><h2>{title}</h2><p>{text}</p><small>{type}</small></div>
          </article>
        ))}
      </section>

      <section className="cta section-border"><div className="shell cta-inner"><div><p className="eyebrow">BUILD WITH LINETECH</p><h2>Your project can be the next line.</h2><p>Start with the idea. We will help shape the product.</p></div><a className="button button-light" href="/#contact">Start Your Line <span>↗</span></a></div></section>
      <footer className="footer shell"><div className="footer-bottom"><span>© 2026 LINETECH</span><a href="/">Back to home ↑</a></div></footer>
    </main>
  );
}
