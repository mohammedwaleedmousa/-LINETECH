export default function AboutPage() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="/"><span className="mark"><i /><b /></span><span>LINETECH</span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a className="active" href="/about">About</a><a href="/start">Contact</a></nav>
        <div className="nav-actions"><a className="button button-light nav-cta" href="/start">Start Your Line <span>↗</span></a><details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><div className="mobile-menu-panel"><a href="/">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a><a href="/start">Start Your Line</a></div></details></div>
      </header>

      <section className="inner-hero premium-inner section-border">
        <div className="shell inner-hero-grid">
          <div className="inner-title"><p className="eyebrow">ABOUT LINETECH</p><h1>Every idea starts with a line.</h1><p className="inner-lead">A technology company built to turn clear thinking into real digital products.</p></div>
          <div className="inner-visual about-page-visual" aria-hidden="true"><div className="about-monolith mono-a"/><div className="about-monolith mono-b"/><div className="about-monolith mono-c"/><div className="hero-beam about-beam"/><div className="visual-core">LINETECH<small>ADEN / YEMEN</small></div></div>
        </div>
      </section>

      <section className="shell section about-story premium-story">
        <div><p className="eyebrow">THE IDEA</p><h2>A line is the beginning of something real.</h2></div>
        <div className="story-copy"><p>An idea becomes useful when it is understood, defined, designed, built and launched. LINETECH exists to carry that journey from the first line to a working product.</p><p>Today the company focuses on web development, commerce systems, brand identity and professional digital presence. The long-term direction is to keep building stronger technology products as the company grows.</p></div>
      </section>

      <section className="section-border philosophy premium-philosophy"><div className="shell philosophy-grid"><span>IDEA</span><b>→</b><span>DEFINE</span><b>→</b><span>DESIGN</span><b>→</b><span>BUILD</span><b>→</b><span>LAUNCH</span><b>→</b><span>GROW</span></div></section>

      <section className="shell section principles-grid">
        <article><span>01</span><h3>Clarity first.</h3><p>We define the real problem before choosing the technology.</p></article>
        <article><span>02</span><h3>Build for use.</h3><p>Design is only successful when the final product works in the real world.</p></article>
        <article><span>03</span><h3>Think long term.</h3><p>Every project should leave behind a stronger system, product or foundation.</p></article>
      </section>

      <section className="founder-section section-border"><div className="shell founder-block premium-founder"><div><p className="eyebrow">FOUNDER</p><h2>Mohammed Waleed</h2><p className="founder-role">Founder & CEO — LINETECH</p></div><div className="founder-statement"><span className="quote-mark">“</span><p>LINETECH is being built as a long-term technology company — focused on useful products, strong systems and work that performs beyond the presentation.</p></div></div></section>

      <section className="cta section-border"><div className="cta-beam beam-a"/><div className="cta-beam beam-b"/><div className="shell cta-inner"><div><p className="eyebrow">YOUR IDEA</p><h2>What line do you want to start?</h2><p>Bring the idea. We will help turn it into something real.</p></div><a className="button button-light" href="/start">Start Your Line <span>↗</span></a></div></section>
      <footer className="footer shell"><div className="footer-bottom"><span>© 2026 LINETECH</span><span>IDEA → PRODUCT → IMPACT</span></div></footer>
    </main>
  );
}
