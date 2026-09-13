const services = [
  { icon: "01", title: "Web & Apps", text: "Modern websites, e-commerce experiences and custom digital systems built for speed and scale." },
  { icon: "02", title: "E-commerce & Systems", text: "Commerce platforms, dashboards and business workflows designed around real operations." },
  { icon: "03", title: "Brand Identity", text: "Clear visual systems, brand direction and digital identity built to stay consistent as you grow." },
  { icon: "04", title: "CV & Portfolio", text: "Professional CVs and portfolio experiences that present people and work with clarity." },
];

const projects = [
  { tag: "AI / Industrial", title: "Industrial Predictive Maintenance", text: "A production-minded machine learning project for industrial maintenance and failure prediction.", type: "industrial" },
  { tag: "E-commerce", title: "Flamingo Park", text: "A mobile-first commerce experience designed around products, orders and customer conversion.", type: "commerce" },
  { tag: "Business System", title: "LedgerPro", text: "A modern business platform for financial workflows, records and operational visibility.", type: "dashboard" },
];

const steps = [
  ["01", "Understand", "We listen to the idea, the goal and the real problem behind it."],
  ["02", "Define", "We shape the scope, users, priorities and the right solution."],
  ["03", "Build", "We design, develop and test the product with precision."],
  ["04", "Launch", "We deploy, hand over and support the next stage of growth."],
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="LINETECH home">
          <span className="mark"><i /><b /></span>
          <span>LINETECH</span>
        </a>
        <nav>
          <a className="active" href="#top">Home</a>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="button button-light nav-cta" href="#contact">Start Your Line <span>→</span></a>
      </header>

      <section id="top" className="hero section-border">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">TECHNOLOGY FOR A BRIGHTER TOMORROW</p>
            <h1>Every idea<br />starts with a line.</h1>
            <p className="lead">We turn ideas into real digital products through clear design, modern technology and disciplined execution.</p>
            <div className="actions">
              <a className="button button-light" href="#contact">Let&apos;s build <span>→</span></a>
              <a className="button button-dark" href="#projects">View our work</a>
            </div>
            <div className="stats">
              <div><strong>01</strong><span>Clear vision</span></div>
              <div><strong>03</strong><span>Core services</span></div>
              <div><strong>∞</strong><span>Bigger possibilities</span></div>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="building building-a" />
            <div className="building building-b" />
            <div className="building building-c" />
            <div className="blue-line" />
            <div className="art-note">CLEAN<br />MINIMAL<br />TECHNICAL<br />IMPACTFUL</div>
          </div>
        </div>
      </section>

      <section id="services" className="section section-border shell">
        <div className="section-head">
          <div><p className="eyebrow">OUR SERVICES</p><h2>Solutions for<br />a smarter tomorrow.</h2></div>
          <p className="section-intro">We combine design, engineering and product thinking to build digital experiences that solve real problems.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <a href="#contact">Learn more <span>→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section section-border shell">
        <div className="section-head compact">
          <div><p className="eyebrow">FEATURED PROJECTS</p><h2>Real solutions.<br />Real impact.</h2></div>
          <p className="section-intro">A selection of products and systems that represent the direction of LINETECH.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className={`project-card visual-${project.type}`} key={project.title}>
              <div className="project-overlay" />
              <div className="project-content">
                <span className="pill">{project.tag}</span>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                <a href="#contact">View project <span>→</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="about section-border">
        <div className="shell about-grid">
          <div className="about-copy">
            <p className="eyebrow">ABOUT LINETECH</p>
            <h2>More than technology.<br />A smarter tomorrow.</h2>
            <p>LINETECH is a technology company focused on turning ideas into real digital products. We start with websites, systems and brand experiences, then grow toward advanced automation, AI and owned technology products.</p>
            <a className="button button-dark" href="#contact">Learn more <span>→</span></a>
          </div>
          <div className="about-art" aria-hidden="true">
            <span className="slab slab-1" /><span className="slab slab-2" /><span className="slab slab-3" />
            <div className="about-brand"><span className="mark large"><i /><b /></span><span>LINETECH</span><small>IDEAS<br />SYSTEMS<br />PEOPLE<br />A BETTER TOMORROW</small></div>
          </div>
        </div>
      </section>

      <section className="section section-border shell process">
        <div className="process-title"><p className="eyebrow">OUR PROCESS</p><h2>From idea<br />to impact.</h2></div>
        <div className="steps">
          {steps.map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </section>

      <section className="section section-border shell testimonials">
        <div><p className="eyebrow">CLIENTS</p><h2>What our<br />clients say.</h2></div>
        <article><p>“LINETECH focuses on clarity, execution and building work that can be used in the real world.”</p><span>Case study feedback</span></article>
        <article><p>“A product-minded approach: understand the problem first, then build the right solution.”</p><span>Project principle</span></article>
      </section>

      <section id="contact" className="cta section-border">
        <div className="cta-line cta-line-a" /><div className="cta-line cta-line-b" />
        <div className="shell cta-inner">
          <div><p className="eyebrow">LET&apos;S BUILD TOGETHER</p><h2>Ready to turn your idea into reality?</h2><p>Tell us what you want to build. We&apos;ll help define the first line.</p></div>
          <a className="button button-light" href="mailto:hello@linetech.com">Start Your Line <span>→</span></a>
        </div>
      </section>

      <footer className="footer shell">
        <div className="footer-brand"><a className="brand" href="#top"><span className="mark"><i /><b /></span><span>LINETECH</span></a><p>Every idea starts with a line.</p></div>
        <div><h4>Quick Links</h4><a href="#top">Home</a><a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a></div>
        <div><h4>Services</h4><a href="#services">Web & Apps</a><a href="#services">E-commerce</a><a href="#services">Brand Identity</a><a href="#services">CV & Portfolio</a></div>
        <div><h4>Company</h4><span>Aden, Yemen</span><a href="mailto:hello@linetech.com">hello@linetech.com</a><span>Founder-led technology company</span></div>
        <div className="footer-words">IDEAS<br />SYSTEMS<br />PEOPLE<br />A BETTER<br />TOMORROW</div>
        <div className="copyright">© 2026 LINETECH. All rights reserved.</div>
      </footer>
    </main>
  );
}
