const services = [
  ["01", "Web Development", "High-performance websites and web products designed around clear goals, fast loading and long-term scalability.", "Landing pages / Business websites / Custom web apps"],
  ["02", "E-commerce & Systems", "Commerce experiences and operational systems built around real customer journeys and business workflows.", "E-commerce / Dashboards / Booking / Custom systems"],
  ["03", "Brand Identity", "A focused visual system that gives the business a distinctive, consistent and credible presence across every digital touchpoint.", "Logo direction / Visual system / Brand guidelines"],
  ["04", "CV & Portfolio", "Professional personal presentation designed to communicate experience, work and value with clarity.", "CV / Portfolio / Personal presence"],
];

export default function ServicesPage() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="/"><span className="mark"><i /><b /></span><span>LINETECH</span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a className="active" href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a></nav>
        <div className="nav-actions">
          <a className="button button-light nav-cta" href="/#contact">Start Your Line <span>↗</span></a>
          <details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><div className="mobile-menu-panel"><a href="/">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a><a href="/#contact">Contact</a></div></details>
        </div>
      </header>

      <section className="inner-hero premium-inner section-border">
        <div className="shell inner-hero-grid">
          <div className="inner-title"><p className="eyebrow">OUR SERVICES</p><h1>We build the digital layer your idea needs.</h1><div className="inner-actions"><a className="button button-light" href="/#contact">Start a project ↗</a><a className="text-link" href="/projects">See our work →</a></div></div>
          <div className="inner-visual services-visual" aria-hidden="true"><div className="visual-grid-lines"/><div className="visual-orbit orbit-a"/><div className="visual-orbit orbit-b"/><div className="visual-core">LINETECH<small>DESIGN / BUILD / GROW</small></div></div>
        </div>
      </section>

      <section className="shell section page-intro-row">
        <p className="eyebrow">WHAT WE BUILD</p>
        <p>We start with the outcome you need, then choose the right mix of strategy, design and engineering. No unnecessary complexity. No template-first thinking.</p>
      </section>

      <section className="shell section service-detail-list premium-list">
        {services.map(([n,title,text,scope], index) => (
          <article className="service-detail" key={n}>
            <div className="service-number">{n}</div>
            <div className="service-detail-copy"><span className="service-kicker">{index < 2 ? "BUILD YOUR BUSINESS" : "BUILD YOUR PRESENCE"}</span><h2>{title}</h2><p>{text}</p></div>
            <small>{scope}</small>
            <a className="circle-link" href="/#contact" aria-label={`Start ${title}`}>↗</a>
          </article>
        ))}
      </section>

      <section className="section-border capability-strip"><div className="shell"><span>CLARITY</span><i/> <span>PERFORMANCE</span><i/> <span>RESPONSIVE</span><i/> <span>SCALABILITY</span><i/> <span>REAL USE</span></div></section>

      <section className="cta section-border"><div className="cta-beam beam-a"/><div className="cta-beam beam-b"/><div className="shell cta-inner"><div><p className="eyebrow">START YOUR LINE</p><h2>Not sure which service fits?</h2><p>Tell us the outcome you need. We will help define the right first line.</p></div><a className="button button-light" href="/#contact">Start Your Line <span>↗</span></a></div></section>

      <footer className="footer shell"><div className="footer-bottom"><span>© 2026 LINETECH</span><span>EVERY IDEA STARTS WITH A LINE.</span></div></footer>
    </main>
  );
}
