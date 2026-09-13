import ProjectBriefForm from "./ProjectBriefForm";
import "./start.css";

export const metadata = {
  title: "Start Your Line",
  description: "Start a project with LINETECH and turn your idea into a clear digital product brief.",
};

export default function StartPage() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="/"><span className="mark"><i /><b /></span><span>LINETECH</span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a><a className="active" href="/start">Contact</a></nav>
        <div className="nav-actions"><a className="button button-light nav-cta" href="#brief">Start Your Line <span>↘</span></a><details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><div className="mobile-menu-panel"><a href="/">Home</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/about">About</a><a href="#brief">Project brief</a></div></details></div>
      </header>

      <section className="start-hero section-border">
        <div className="shell start-hero-grid">
          <div className="start-copy">
            <p className="eyebrow">START YOUR LINE</p>
            <h1>Tell us what you want to build.</h1>
            <p>Start with the idea — even if it is still rough. This brief helps turn it into a clear first line: what the product is, who it is for, and what needs to happen next.</p>
            <div className="start-steps" aria-label="Project intake steps"><span>01 IDEA</span><i>→</i><span>02 DEFINE</span><i>→</i><span>03 NEXT STEP</span></div>
          </div>
          <div className="start-visual" aria-hidden="true"><div className="start-line line-a"/><div className="start-line line-b"/><div className="start-line line-c"/><div className="start-node node-a"/><div className="start-node node-b"/><div className="start-node node-c"/><span>LINETECH / PROJECT INTAKE</span></div>
        </div>
      </section>

      <section id="brief" className="shell start-workspace section-border">
        <div className="brief-intro">
          <p className="eyebrow">PROJECT BRIEF</p>
          <h2>One clear line before we build.</h2>
          <p>Fill in what you know. You do not need to have every answer yet.</p>
          <div className="brief-notes"><div><span>01</span><p>No technical knowledge required.</p></div><div><span>02</span><p>Your answers stay in your browser until you choose to copy or share them.</p></div><div><span>03</span><p>We use the brief to clarify scope before execution.</p></div></div>
        </div>
        <ProjectBriefForm />
      </section>

      <section className="section-border start-principles"><div className="shell"><div><span>CLARITY</span><p>Define the real need.</p></div><div><span>DESIGN</span><p>Shape the right experience.</p></div><div><span>BUILD</span><p>Execute with discipline.</p></div><div><span>IMPACT</span><p>Launch something useful.</p></div></div></section>

      <footer className="footer shell"><div className="footer-main"><div className="footer-brand"><a className="brand" href="/"><span className="mark"><i /><b /></span><span>LINETECH</span></a><p>Every idea starts with a line.</p></div><div><h4>Company</h4><a href="/about">About</a><a href="/projects">Work</a><a href="/services">Services</a></div><div><h4>Start</h4><a href="#brief">Project brief</a><a href="/services">Choose a service</a></div><div><h4>Location</h4><span>Aden, Yemen</span><span>Founder-led technology company</span></div></div><div className="footer-bottom"><span>© 2026 LINETECH</span><span>IDEA → DEFINE → BUILD → IMPACT</span></div></footer>
    </main>
  );
}
