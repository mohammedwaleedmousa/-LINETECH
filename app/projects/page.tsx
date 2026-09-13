const projects = [
  { tag:"E-COMMERCE", title:"Flamingo Park", text:"A mobile-first commerce platform focused on product discovery, orders and customer conversion.", type:"Commerce / Web Product", cls:"showcase-commerce" },
  { tag:"BUSINESS SYSTEM", title:"LedgerPro", text:"A business platform for financial records, operational workflows and clearer day-to-day visibility.", type:"Business System / SaaS", cls:"showcase-ledger" },
  { tag:"INDUSTRIAL AI", title:"Predictive Maintenance", text:"A machine-learning project focused on failure prediction and industrial maintenance decisions.", type:"Machine Learning / Industrial AI", cls:"showcase-industrial" },
];

export default function ProjectsPage() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="/"><span className="mark"><i /><b /></span><span>LINETECH</span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a href="/services">Services</a><a className="active" href="/projects">Projects</a><a href="/about">About</a></nav>
        <div className="nav-actions"><a className="button button-light nav-cta" href="/#contact">Start Your Line <span>↗</span></a><details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><div className="mobile-menu-panel"><a href="/">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a><a href="/#contact">Contact</a></div></details></div>
      </header>

      <section className="inner-hero premium-inner section-border">
        <div className="shell inner-hero-grid">
          <div className="inner-title"><p className="eyebrow">SELECTED WORK</p><h1>Real products. Built around real problems.</h1><div className="inner-actions"><a className="button button-light" href="/#contact">Build with us ↗</a><span className="project-note">CASE STUDIES / 2026</span></div></div>
          <div className="inner-visual projects-visual" aria-hidden="true"><div className="project-plane plane-a"/><div className="project-plane plane-b"/><div className="project-plane plane-c"/><div className="hero-beam project-beam"/><div className="visual-core">WORK<small>PRODUCTS / SYSTEMS / AI</small></div></div>
        </div>
      </section>

      <section className="shell section page-intro-row"><p className="eyebrow">OUR APPROACH</p><p>We present work as products, not decoration. Each project starts with a real problem, a clear user and a result worth building toward.</p></section>

      <section className="shell section showcase-list">
        {projects.map((project, index) => (
          <article className="showcase" key={project.title}>
            <div className={`showcase-art ${project.cls}`}><span className="showcase-index">0{index + 1}</span><div className="showcase-device"><i/><i/><i/></div><div className="showcase-glow"/></div>
            <div className="showcase-copy"><span className="pill">{project.tag}</span><h2>{project.title}</h2><p>{project.text}</p><div className="showcase-meta"><span>{project.type}</span><span>LINETECH / SELECTED WORK</span></div></div>
          </article>
        ))}
      </section>

      <section className="section-border capability-strip"><div className="shell"><span>CHALLENGE</span><i/> <span>APPROACH</span><i/> <span>PRODUCT</span><i/> <span>TECHNOLOGY</span><i/> <span>IMPACT</span></div></section>

      <section className="cta section-border"><div className="cta-beam beam-a"/><div className="cta-beam beam-b"/><div className="shell cta-inner"><div><p className="eyebrow">BUILD WITH LINETECH</p><h2>Your project can be the next line.</h2><p>Start with the idea. We will help shape the product.</p></div><a className="button button-light" href="/#contact">Start Your Line <span>↗</span></a></div></section>
      <footer className="footer shell"><div className="footer-bottom"><span>© 2026 LINETECH</span><span>BUILT FOR REAL USE.</span></div></footer>
    </main>
  );
}
