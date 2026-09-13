const services = [
  { n: "01", title: "Web Development", text: "High-performance company websites, landing pages and custom digital experiences." },
  { n: "02", title: "E-commerce", text: "Modern storefronts and commerce systems designed around real customer journeys." },
  { n: "03", title: "Brand Identity", text: "Minimal, consistent visual systems that make brands look clear, modern and credible." },
  { n: "04", title: "CV & Portfolio", text: "Professional CV and portfolio experiences built to present people and work with confidence." },
];

const projects = [
  { tag: "E-COMMERCE", title: "Flamingo Park", text: "A mobile-first commerce platform designed for products, orders and conversion.", cls: "commerce" },
  { tag: "BUSINESS SYSTEM", title: "LedgerPro", text: "A clean digital system for financial records, workflows and operational visibility.", cls: "ledger" },
  { tag: "INDUSTRIAL AI", title: "Predictive Maintenance", text: "Machine-learning work focused on failure prediction and industrial decision support.", cls: "industrial" },
];

const process = [
  ["01", "Understand", "We understand the idea, the business and the real problem."],
  ["02", "Define", "We shape the scope, priorities and the right digital solution."],
  ["03", "Design", "We create a clear product experience before development begins."],
  ["04", "Build", "We develop, test and prepare the product for real use."],
  ["05", "Launch", "We deploy, hand over and support the next stage of growth."],
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="LINETECH home"><span className="mark"><i /><b /></span><span>LINETECH</span></a>
        <nav className="desktop-nav"><a className="active" href="#top">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a><a href="#contact">Contact</a></nav>
        <div className="nav-actions">
          <a className="button button-light nav-cta" href="#contact">Start Your Line <span>↗</span></a>
          <details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><div className="mobile-menu-panel"><a href="#top">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a><a href="#contact">Contact</a></div></details>
        </div>
      </header>

      <section id="top" className="hero section-border">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">TECHNOLOGY BUILDS A BRIGHTER TOMORROW</p>
            <h1>Every idea<br />starts with<br />a line.</h1>
            <p className="lead">We turn ideas into real digital products through precise design, modern technology and disciplined execution.</p>
            <div className="actions"><a className="button button-light" href="#contact">Start your line <span>↗</span></a><a className="text-link" href="/projects">Explore our work <span>→</span></a></div>
            <div className="micro-grid"><div><span>01</span><p>IDEA</p></div><div><span>02</span><p>DESIGN</p></div><div><span>03</span><p>BUILD</p></div><div><span>04</span><p>IMPACT</p></div></div>
          </div>
          <div className="hero-visual" aria-hidden="true"><div className="architecture architecture-a" /><div className="architecture architecture-b" /><div className="architecture architecture-c" /><div className="architecture architecture-d" /><div className="hero-beam" /><div className="visual-caption">LINETECH<br /><small>IDEAS / SYSTEMS / PRODUCTS</small></div></div>
        </div>
      </section>

      <section id="services" className="section shell section-border">
        <div className="section-head reference-head"><div><p className="eyebrow">OUR SERVICES</p><h2>Solutions for<br />a smarter tomorrow.</h2></div><p className="section-intro">We combine product thinking, design and engineering to turn business needs into useful digital products.</p></div>
        <div className="service-grid">{services.map((service) => <article className="service-card" key={service.title}><div className="service-top"><span>{service.n}</span><span className="plus">+</span></div><div><h3>{service.title}</h3><p>{service.text}</p></div><a href="/services">Explore service <span>↗</span></a></article>)}</div>
      </section>

      <section id="projects" className="section shell section-border">
        <div className="section-head reference-head"><div><p className="eyebrow">SELECTED WORK</p><h2>Built to work.<br />Built to grow.</h2></div><p className="section-intro">Selected products that represent LINETECH&apos;s direction: practical, clean and made for real use.</p></div>
        <div className="project-grid">{projects.map((project) => <article className={`project-card ${project.cls}`} key={project.title}><div className="project-art"><span className="screen-line line-1"/><span className="screen-line line-2"/><span className="screen-line line-3"/></div><div className="project-bottom"><span className="pill">{project.tag}</span><h3>{project.title}</h3><p>{project.text}</p><a href="/projects">View project <span>↗</span></a></div></article>)}</div>
      </section>

      <section id="about" className="about section-border">
        <div className="shell about-grid"><div className="about-copy"><p className="eyebrow">ABOUT LINETECH</p><h2>From the first line<br />to the final product.</h2><p>LINETECH is a technology company built around one simple idea: understand what needs to be built, then build it properly. We begin with digital products and grow toward advanced systems, automation and AI.</p><a className="button button-light" href="/about">About LINETECH <span>↗</span></a></div><div className="about-visual" aria-hidden="true"><div className="a-slab s1"/><div className="a-slab s2"/><div className="a-slab s3"/><div className="about-lockup"><span className="mark large"><i /><b /></span><strong>LINETECH</strong><small>EVERY IDEA STARTS WITH A LINE.</small></div></div></div>
      </section>

      <section className="section shell section-border process-section"><div className="process-intro"><p className="eyebrow">OUR PROCESS</p><h2>One clear line.<br />From idea to impact.</h2></div><div className="process-list">{process.map(([n,t,d]) => <div className="process-row" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></div>)}</div></section>

      <section className="manifesto section-border"><div className="shell manifesto-grid"><div><p className="eyebrow">WHY LINETECH</p><h2>Not concepts.<br />Real products.</h2></div><div className="manifesto-copy"><p>We do not begin with a template. We begin with the problem, the user and the outcome.</p><p>That is how a line becomes a product — and a product becomes impact.</p></div></div></section>

      <section id="contact" className="cta section-border"><div className="cta-beam beam-a"/><div className="cta-beam beam-b"/><div className="shell cta-inner"><div><p className="eyebrow">START YOUR LINE</p><h2>Have an idea worth building?</h2><p>Tell us what you want to build. We&apos;ll help define the first line.</p></div><a className="button button-light" href="/services">Explore services <span>↗</span></a></div></section>

      <footer className="footer shell"><div className="footer-main"><div className="footer-brand"><a className="brand" href="#top"><span className="mark"><i /><b /></span><span>LINETECH</span></a><p>Every idea starts with a line.</p></div><div><h4>Company</h4><a href="/about">About</a><a href="/projects">Work</a><a href="#contact">Contact</a></div><div><h4>Services</h4><a href="/services">Web Development</a><a href="/services">E-commerce</a><a href="/services">Brand Identity</a></div><div><h4>Location</h4><span>Aden, Yemen</span><span>Founder-led technology company</span></div></div><div className="footer-bottom"><span>© 2026 LINETECH</span><span>IDEA → DESIGN → BUILD → IMPACT</span></div></footer>
    </main>
  );
}
