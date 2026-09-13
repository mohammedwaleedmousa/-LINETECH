export default function ServicesPage() {
  const services = [
    ["01", "Web Development", "Business websites, landing pages and custom web experiences built for speed, clarity and growth.", "Landing pages / Business websites / Custom web apps"],
    ["02", "E-commerce & Systems", "Commerce experiences and operational systems designed around real customer and business workflows.", "E-commerce / Dashboards / Booking / Custom systems"],
    ["03", "Brand Identity", "Clear visual systems that make a business look consistent, modern and credible across digital touchpoints.", "Logo direction / Visual system / Brand guidelines"],
    ["04", "CV & Portfolio", "Professional personal presentation for people who need to show their work, experience and value clearly.", "CV / Portfolio / Personal presence"],
  ];

  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="/"><span className="mark"><i /><b /></span><span>LINETECH</span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a className="active" href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a></nav>
        <a className="button button-light nav-cta" href="/#contact">Start Your Line <span>↗</span></a>
      </header>

      <section className="inner-hero section-border">
        <div className="shell inner-hero-grid">
          <div><p className="eyebrow">OUR SERVICES</p><h1>We build the digital layer your idea needs.</h1></div>
          <p>LINETECH starts with the problem, then chooses the right combination of product thinking, design and engineering.</p>
        </div>
      </section>

      <section className="shell section service-detail-list">
        {services.map(([n,title,text,scope]) => (
          <article className="service-detail" key={n}>
            <span>{n}</span>
            <div><h2>{title}</h2><p>{text}</p></div>
            <small>{scope}</small>
            <a href="/#contact">Start a project ↗</a>
          </article>
        ))}
      </section>

      <section className="cta section-border">
        <div className="shell cta-inner"><div><p className="eyebrow">START YOUR LINE</p><h2>Not sure which service fits?</h2><p>Tell us the outcome you need. We will help define the right first line.</p></div><a className="button button-light" href="/#contact">Start Your Line <span>↗</span></a></div>
      </section>

      <footer className="footer shell"><div className="footer-bottom"><span>© 2026 LINETECH</span><a href="/">Back to home ↑</a></div></footer>
    </main>
  );
}
