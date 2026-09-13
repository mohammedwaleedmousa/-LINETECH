const services = [
  { icon: "▱", title: "Web Development", text: "Fast, polished company websites and digital experiences built for real business use." },
  { icon: "</>", title: "E-commerce & Systems", text: "Commerce flows, dashboards and custom systems shaped around the way your business works." },
  { icon: "✦", title: "Brand Identity", text: "Clear visual systems that make a business feel consistent, modern and credible." },
  { icon: "◎", title: "CV & Portfolio", text: "Professional personal presentation for careers, portfolios and stronger opportunities." },
];

const projects = [
  { tag: "E-COMMERCE", title: "Flamingo Park", text: "A mobile-first retail experience for product discovery, orders and customer conversion.", cls: "project-commerce" },
  { tag: "MARKETPLACE", title: "Etqan", text: "A services marketplace designed to organize discovery, providers and customer journeys.", cls: "project-market" },
  { tag: "BUSINESS SYSTEM", title: "LedgerPro", text: "A business system for financial records, workflows and clearer operational visibility.", cls: "project-ledger" },
];

const process = [
  ["01", "Understand", "We define the idea, goals and the real challenge."],
  ["02", "Plan", "We shape the right structure, scope and direction."],
  ["03", "Build", "We design, develop and test with precision."],
  ["04", "Launch", "We deploy, hand over and support the next step."],
];

export default function Home() {
  return (
    <main className="ref-home" id="top">
      <header className="ref-nav ref-shell">
        <a className="ref-brand" href="#top" aria-label="LINETECH home">
          <span className="ref-mark"><i/><b/></span><strong>LINETECH</strong>
        </a>
        <nav className="ref-nav-links" aria-label="Primary navigation">
          <a className="active" href="#top">Home</a><a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a><a href="#contact">Contact</a>
        </nav>
        <div className="ref-nav-end"><span className="ref-search" aria-hidden="true">⌕</span><a className="ref-button light" href="/start">Start Your Line <span>→</span></a></div>
      </header>

      <section className="ref-hero ref-line-section">
        <div className="ref-shell ref-hero-grid">
          <div className="ref-hero-copy">
            <p className="ref-kicker">TECHNOLOGY FOR A BRIGHTER TOMORROW</p>
            <h1>Every idea<br/>starts with a line.</h1>
            <p className="ref-lead">We turn ideas into real digital products through clear design, reliable technology and disciplined execution.</p>
            <div className="ref-actions"><a className="ref-button light" href="/start">Let&apos;s Build <span>→</span></a><a className="ref-button ghost" href="#projects">View Our Work</a></div>
            <div className="ref-stats">
              <div><strong>01</strong><span>Founder-led</span></div>
              <div><strong>03</strong><span>Core Services</span></div>
              <div><strong>06</strong><span>Clear Steps</span></div>
              <div><strong>∞</strong><span>Bigger Possibilities</span></div>
            </div>
          </div>
          <div className="ref-hero-art" aria-hidden="true">
            <div className="ref-building b1"/><div className="ref-building b2"/><div className="ref-building b3"/><div className="ref-building b4"/>
            <div className="ref-light-line"/><div className="ref-diagonal"/>
            <p className="ref-art-words">CLEAN<br/>MINIMAL<br/>TECHNICAL<br/>IMPACTFUL<i/></p>
          </div>
        </div>
      </section>

      <section className="ref-section ref-line-section" id="services">
        <div className="ref-shell">
          <div className="ref-section-heading">
            <div><p className="ref-kicker with-line">OUR SERVICES</p><h2>Solutions for<br/>a smarter tomorrow.</h2></div>
            <div className="ref-heading-side"><p>We combine technology, design and engineering to deliver solutions that solve real problems.</p><a className="ref-button ghost small" href="/services">View All Services <span>→</span></a></div>
          </div>
          <div className="ref-service-grid">
            {services.map((service) => <article className="ref-service-card" key={service.title}><span className="ref-service-icon">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p><a href="/services">Learn more <span>→</span></a></article>)}
          </div>
        </div>
      </section>

      <section className="ref-section ref-line-section" id="projects">
        <div className="ref-shell">
          <div className="ref-section-heading project-head">
            <div><p className="ref-kicker with-line">FEATURED PROJECTS</p><h2>Real solutions.<br/>Real impact.</h2></div>
            <div className="ref-heading-side"><p>A selection of products and systems that reflect LINETECH&apos;s practical direction.</p><a className="ref-button ghost small" href="/projects">View All Projects <span>→</span></a></div>
          </div>
          <div className="ref-project-grid">
            {projects.map((project) => <article className={`ref-project-card ${project.cls}`} key={project.title}><div className="ref-project-visual"><div className="ref-project-device"><i/><i/><i/></div><div className="ref-project-shine"/></div><div className="ref-project-copy"><span className="ref-tag">{project.tag}</span><h3>{project.title}</h3><p>{project.text}</p><a href="/projects">View Project <span>→</span></a></div></article>)}
          </div>
        </div>
      </section>

      <section className="ref-about ref-line-section" id="about">
        <div className="ref-shell ref-about-grid">
          <div className="ref-about-copy"><p className="ref-kicker with-line">ABOUT LINETECH</p><h2>More than technology.<br/>A smarter tomorrow.</h2><p>LINETECH is a technology company that turns ideas into real digital products. We begin with clarity, shape the right solution and build for real-world use.</p><a className="ref-button ghost small" href="/about">Learn more <span>→</span></a></div>
          <div className="ref-about-art" aria-hidden="true"><div className="about-block a1"/><div className="about-block a2"/><div className="about-block a3"/><div className="about-light"/></div>
          <div className="ref-about-lockup"><span className="ref-mark big"><i/><b/></span><strong>LINETECH</strong><p>IDEAS<br/>SYSTEMS<br/>PEOPLE<br/>A BETTER<br/>TOMORROW</p><i className="lock-line"/></div>
        </div>
      </section>

      <section className="ref-process ref-line-section">
        <div className="ref-shell ref-process-grid"><div className="ref-process-title"><p className="ref-kicker with-line">OUR PROCESS</p><h2>From idea<br/>to impact.</h2></div><div className="ref-process-list">{process.map(([n,t,d], index) => <article key={n}><span className={index === 1 || index === 2 ? "blue" : ""}>{n}</span><h3>{t}</h3><p>{d}</p>{index < process.length - 1 && <b>—</b>}</article>)}</div></div>
      </section>

      <section className="ref-standard ref-line-section">
        <div className="ref-shell ref-standard-grid"><div><p className="ref-kicker">OUR STANDARD</p><h2>What every<br/>client should feel.</h2></div><article className="ref-quote-card"><p>“Clear communication, a focused scope and work that feels intentional from the first line to launch.”</p><div><span>A</span><small>Alignment<br/>before execution</small></div></article><article className="ref-quote-card"><p>“A reliable process, careful decisions and a final product built for real use — not just presentation.”</p><div><span>Q</span><small>Quality<br/>in every step</small></div></article><div className="ref-round-arrows"><button aria-label="Previous">←</button><button aria-label="Next">→</button></div></div>
      </section>

      <section className="ref-cta ref-line-section" id="contact"><div className="cta-blue-line left"/><div className="cta-blue-line right"/><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">LET&apos;S BUILD TOGETHER</p><h2>Ready to turn your idea into reality?</h2><p>Start with the idea. We&apos;ll help define the first line.</p></div><a className="ref-button light" href="/start">Start Your Line <span>→</span></a></div></section>

      <footer className="ref-footer"><div className="ref-shell ref-footer-grid"><div className="ref-footer-brand"><a className="ref-brand" href="#top"><span className="ref-mark"><i/><b/></span><strong>LINETECH</strong></a><p>Technology for a brighter tomorrow.</p></div><div><h4>Quick Links</h4><a href="#top">Home</a><a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a></div><div><h4>Services</h4><a href="/services">Web Development</a><a href="/services">Brand Identity</a><a href="/services">CV & Portfolio</a></div><div><h4>Company</h4><span>Aden, Yemen</span><a href="/start">Start Your Line</a><span>Founder-led</span></div><div className="ref-footer-words">IDEAS<br/>SYSTEMS<br/>PEOPLE<br/>A BETTER TOMORROW<i/></div></div><div className="ref-shell ref-footer-bottom"><span>© 2026 LINETECH. All rights reserved.</span><span>Every idea starts with a line.</span></div></footer>
    </main>
  );
}
