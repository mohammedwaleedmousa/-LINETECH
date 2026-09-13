import Link from "next/link";

const services = [
  { icon: "▱", title: "Web Development", text: "Fast, polished company websites and digital experiences built for real business use.", href: "/services/web-development" },
  { icon: "</>", title: "E-commerce & Systems", text: "Commerce flows, dashboards and custom systems shaped around the way your business works.", href: "/services/ecommerce-systems" },
  { icon: "✦", title: "Brand Identity", text: "Clear visual systems that make a business feel consistent, modern and credible.", href: "/services/brand-identity" },
  { icon: "◎", title: "CV & Portfolio", text: "Professional personal presentation for careers, portfolios and stronger opportunities.", href: "/services/cv-portfolio" },
];

const projects = [
  { tag: "E-COMMERCE", title: "Flamingo Park", text: "A mobile-first retail experience for product discovery, orders and customer conversion.", cls: "project-commerce", href: "/projects/flamingo-park" },
  { tag: "MARKETPLACE", title: "Etqan", text: "A services marketplace designed to organize discovery, providers and customer journeys.", cls: "project-market", href: "/projects/etqan" },
  { tag: "BUSINESS SYSTEM", title: "LedgerPro", text: "A business system for financial records, workflows and clearer operational visibility.", cls: "project-ledger", href: "/projects/ledgerpro" },
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
      <section className="ref-hero ref-line-section">
        <div className="ref-shell ref-hero-grid">
          <div className="ref-hero-copy">
            <p className="ref-kicker">TECHNOLOGY FOR A BRIGHTER TOMORROW</p>
            <h1>Every idea<br/>starts with a line.</h1>
            <p className="ref-lead">We turn ideas into real digital products through clear design, reliable technology and disciplined execution.</p>
            <div className="ref-actions"><Link className="ref-button light" href="/start" prefetch>Let&apos;s Build <span>→</span></Link><Link className="ref-button ghost" href="/projects" prefetch>View Our Work</Link></div>
            <div className="ref-stats">
              <div><strong>01</strong><span>Founder-led</span></div>
              <div><strong>04</strong><span>Core Services</span></div>
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
            <div className="ref-heading-side"><p>We combine technology, design and engineering to deliver solutions that solve real problems.</p><Link className="ref-button ghost small" href="/services" prefetch>View All Services <span>→</span></Link></div>
          </div>
          <div className="ref-service-grid">
            {services.map((service) => <article className="ref-service-card" key={service.title}><span className="ref-service-icon">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p><Link href={service.href} prefetch>Learn more <span>→</span></Link></article>)}
          </div>
        </div>
      </section>

      <section className="ref-section ref-line-section" id="projects">
        <div className="ref-shell">
          <div className="ref-section-heading project-head">
            <div><p className="ref-kicker with-line">FEATURED PROJECTS</p><h2>Real solutions.<br/>Real impact.</h2></div>
            <div className="ref-heading-side"><p>A selection of products and systems that reflect LINETECH&apos;s practical direction.</p><Link className="ref-button ghost small" href="/projects" prefetch>View All Projects <span>→</span></Link></div>
          </div>
          <div className="ref-project-grid">
            {projects.map((project) => <article className={`ref-project-card ${project.cls}`} key={project.title}><div className="ref-project-visual"><div className="ref-project-device"><i/><i/><i/></div><div className="ref-project-shine"/></div><div className="ref-project-copy"><span className="ref-tag">{project.tag}</span><h3>{project.title}</h3><p>{project.text}</p><Link href={project.href} prefetch>View Project <span>→</span></Link></div></article>)}
          </div>
        </div>
      </section>

      <section className="ref-about ref-line-section" id="about">
        <div className="ref-shell ref-about-grid">
          <div className="ref-about-copy"><p className="ref-kicker with-line">ABOUT LINETECH</p><h2>More than technology.<br/>A smarter tomorrow.</h2><p>LINETECH is a technology company that turns ideas into real digital products. We begin with clarity, shape the right solution and build for real-world use.</p><Link className="ref-button ghost small" href="/about" prefetch>Learn more <span>→</span></Link></div>
          <div className="ref-about-art" aria-hidden="true"><div className="about-block a1"/><div className="about-block a2"/><div className="about-block a3"/><div className="about-light"/></div>
          <div className="ref-about-lockup"><span className="ref-mark big"><i/><b/></span><strong>LINETECH</strong><p>IDEAS<br/>SYSTEMS<br/>PEOPLE<br/>A BETTER<br/>TOMORROW</p><i className="lock-line"/></div>
        </div>
      </section>

      <section className="process-center ref-line-section">
        <div className="process-center-shell">
          <div className="process-center-head">
            <p>OUR PROCESS <span/></p>
            <h2>From idea to impact.</h2>
          </div>
          <div className="process-center-grid">
            {process.map(([n,t,d], index) => (
              <article key={n} className="process-center-card">
                <div className={`process-center-num ${index===1||index===2?"accent":""}`}>{n}<i/></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ref-standard ref-line-section">
        <div className="ref-shell ref-standard-grid"><div><p className="ref-kicker">OUR STANDARD</p><h2>What every<br/>client should feel.</h2></div><article className="ref-quote-card"><p>“Clear communication, a focused scope and work that feels intentional from the first line to launch.”</p><div><span>A</span><small>Alignment<br/>before execution</small></div></article><article className="ref-quote-card"><p>“A reliable process, careful decisions and a final product built for real use — not just presentation.”</p><div><span>Q</span><small>Quality<br/>in every step</small></div></article><div className="ref-round-arrows"><button aria-label="Previous">←</button><button aria-label="Next">→</button></div></div>
      </section>

      <section className="ref-cta ref-line-section" id="contact"><div className="cta-blue-line left"/><div className="cta-blue-line right"/><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">LET&apos;S BUILD TOGETHER</p><h2>Ready to turn your idea into reality?</h2><p>Start with the idea. We&apos;ll help define the first line.</p></div><Link className="ref-button light" href="/start" prefetch>Start Your Line <span>→</span></Link></div></section>
    </main>
  );
}
