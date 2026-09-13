export default function AboutPage() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="/"><span className="mark"><i /><b /></span><span>LINETECH</span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a className="active" href="/about">About</a></nav>
        <a className="button button-light nav-cta" href="/#contact">Start Your Line <span>↗</span></a>
      </header>

      <section className="inner-hero section-border">
        <div className="shell inner-hero-grid">
          <div><p className="eyebrow">ABOUT LINETECH</p><h1>Every idea starts with a line.</h1></div>
          <p>LINETECH is a founder-led technology company in Aden, Yemen. We turn ideas into real digital products through clear thinking, focused design and disciplined engineering.</p>
        </div>
      </section>

      <section className="shell section about-story">
        <div><p className="eyebrow">THE IDEA</p><h2>A line is the beginning of something real.</h2></div>
        <div className="story-copy"><p>An idea becomes useful when it is defined, designed, built and launched. LINETECH exists to carry that journey from the first line to a working product.</p><p>Today we focus on web products, commerce, brand identity and professional digital presence. Over time, the company grows toward automation, artificial intelligence, computer vision and owned technology products.</p></div>
      </section>

      <section className="section-border philosophy"><div className="shell philosophy-grid"><span>IDEA</span><b>→</b><span>DEFINE</span><b>→</b><span>DESIGN</span><b>→</b><span>BUILD</span><b>→</b><span>LAUNCH</span><b>→</b><span>GROW</span></div></section>

      <section className="shell section founder-block">
        <div><p className="eyebrow">FOUNDER</p><h2>Mohammed Waleed</h2><p className="founder-role">Founder & CEO — LINETECH</p></div>
        <p>LINETECH is being built as a long-term technology company, not a temporary design studio. The goal is to build useful products, strong systems and a reputation for work that performs in the real world.</p>
      </section>

      <section className="cta section-border"><div className="shell cta-inner"><div><p className="eyebrow">YOUR IDEA</p><h2>What line do you want to start?</h2><p>Bring the idea. We will help turn it into something real.</p></div><a className="button button-light" href="/#contact">Start Your Line <span>↗</span></a></div></section>
      <footer className="footer shell"><div className="footer-bottom"><span>© 2026 LINETECH</span><a href="/">Back to home ↑</a></div></footer>
    </main>
  );
}
