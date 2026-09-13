"use client";

import Localized from "./Localized";
import HomeHeroArt from "./HomeHeroArt";
import HomeWhy from "./HomeWhy";
import HomeProof from "./HomeProof";
import Link from "next/link";
import "./home-content.css";

const services = [
  { icon: "▱", title: "Web Development", text: "Fast, polished company websites and digital experiences built for real business use.", href: "/services/web-development" },
  { icon: "</>", title: "E-commerce & Systems", text: "Commerce flows, dashboards and custom systems shaped around the way your business works.", href: "/services/ecommerce-systems" },
  { icon: "✦", title: "Brand Identity", text: "Clear visual systems that make a business feel consistent, modern and credible.", href: "/services/brand-identity" },
  { icon: "◎", title: "CV & Portfolio", text: "Professional personal presentation for careers, portfolios and stronger opportunities.", href: "/services/cv-portfolio" },
];

const projects = [
  { tag: "E-COMMERCE", title: "Flamingo Park", text: "A mobile-first retail experience for product discovery, orders and customer conversion.", cls: "project-commerce", features: ["Catalog, categories and brand filters", "Product sizes, colors and ordering", "Store and order management"], href: "/projects/flamingo-park" },
  { tag: "MARKETPLACE", title: "Etqan", text: "A services marketplace designed to organize discovery, providers and customer journeys.", cls: "project-market", features: ["Service categories and discovery", "Provider profiles and customer journeys", "Marketplace administration"], href: "/projects/etqan" },
  { tag: "BUSINESS SYSTEM", title: "LedgerPro", text: "A business system for financial records, workflows and clearer operational visibility.", cls: "project-ledger", features: ["Structured financial records", "Daily business workflows", "Dashboards and operational visibility"], href: "/projects/ledgerpro" },
];

const process = [
  ["01", "Understand", "We define the idea, goals and the real challenge."],
  ["02", "Plan", "We shape the right structure, scope and direction."],
  ["03", "Build", "We design, develop and test with precision."],
  ["04", "Launch", "We deploy, hand over and support the next step."],
];

const commitments = [
  ["An agreed scope", "Pages, features, deliverables and priorities are defined before work begins."],
  ["Planned reviews", "Review stages and included revisions are agreed as part of the project scope."],
  ["A clear handover", "Source files, assets and access are handed over according to the project agreement."],
  ["Support arrangements", "Hosting, maintenance and any support after launch are defined during planning."],
];

const faqs = [
  ["How is the project price determined?", "Pricing depends on the service, scope, required features and deliverables. These details are clarified before a proposal is agreed."],
  ["How long does a project take?", "Timing depends on the type of work, scope, content readiness and feedback speed. The schedule is defined after the project is understood rather than promising one fixed duration for every project."],
  ["What do I need to prepare?", "Start with your idea, the people it serves and the result you want. If you have content, a current website or references, include them in your brief."],
  ["What happens after launch?", "The handover includes the agreed project assets and launch state. Ongoing maintenance or support can be scoped separately when needed."],
];

function ProjectVisual({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="home-project-visual" aria-hidden="true">
      <div className="home-project-window">
        <div className="home-project-window-bar">
          <span/><span/><span/>
          <b>{project.title}</b>
        </div>
        <div className="home-project-ui">
          <aside className="home-project-ui-rail"><i/><i/><i/><i/></aside>
          <div className="home-project-ui-main">
            <div className="home-project-ui-top"><span/><span/></div>
            <div className="home-project-ui-focus"><i/><b/><em/></div>
            <div className="home-project-ui-grid"><i/><i/><i/></div>
          </div>
          <div className="home-project-ui-side"><span/><i/><i/><i/></div>
        </div>
      </div>
      <div className="home-project-orbit"><i/><i/><i/></div>
    </div>
  );
}

export default function Home() {
  return (
    <Localized><main className="ref-home" id="top">
      <section className="ref-hero ref-line-section home-line-hero">
        <HomeHeroArt/>
        <div className="ref-shell ref-hero-grid">
          <div className="ref-hero-copy">
            <p className="ref-kicker">TECHNOLOGY FOR A BRIGHTER TOMORROW</p>
            <h1>Every idea<br/>starts with a line.</h1>
            <p className="ref-lead">We build websites, online stores and business systems for companies and founders, with a clear identity and an experience designed around their customers.</p>
            <div className="ref-actions"><Link className="ref-button light" href="/start" prefetch>Start Your Line <span>→</span></Link><a className="ref-button ghost" href="#projects">View Our Work <span>↓</span></a></div>
            <div className="ref-stats">
              <div><strong>01</strong><span>Founder-led</span></div>
              <div><strong>{String(services.length).padStart(2, "0")}</strong><span>Core Services</span></div>
              <div><strong>{String(process.length).padStart(2, "0")}</strong><span>Clear Steps</span></div>
              <div><strong>{String(projects.length).padStart(2, "0")}</strong><span>Selected Projects</span></div>
            </div>
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
            <div className="ref-heading-side"><p>Explore the product, the problem it addresses and the capabilities built into each project.</p><Link className="ref-button ghost small" href="/projects" prefetch>View All Projects <span>→</span></Link></div>
          </div>
          <div className="ref-project-grid home-project-showcase-grid">
            {projects.map((project, index) => (
              <article className={`ref-project-card home-project-card ${project.cls}`} key={project.title}>
                <div className="home-project-heading"><span className="ref-tag">{project.tag}</span><span className="home-project-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
                <ProjectVisual project={project}/>
                <div className="ref-project-copy">
                  <h3>{project.title}</h3><p>{project.text}</p>
                  <p className="home-feature-label">WHAT WE BUILT</p>
                  <ul className="home-project-features">{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
                  <Link href={project.href} prefetch>Explore the case study <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HomeProof/>

      <section className="ref-about ref-line-section" id="about">
        <div className="ref-shell ref-about-grid">
          <div className="ref-about-copy"><p className="ref-kicker with-line">ABOUT LINETECH</p><h2>More than technology.<br/>A smarter tomorrow.</h2><p>LINETECH is a technology company that turns ideas into real digital products. We begin with clarity, shape the right solution and build for real-world use.</p><Link className="ref-button ghost small" href="/about" prefetch>Learn more <span>→</span></Link></div>
          <div className="ref-about-art" aria-hidden="true"><div className="about-block a1"/><div className="about-block a2"/><div className="about-block a3"/><div className="about-light"/></div>
          <div className="ref-about-lockup"><span className="ref-mark big"><i/><b/></span><strong>LINETECH</strong><p>IDEAS<br/>SYSTEMS<br/>PEOPLE<br/>A BETTER<br/>TOMORROW</p><i className="lock-line"/></div>
        </div>
      </section>

      <HomeWhy/>

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

      <section className="ref-section ref-line-section home-commitments" aria-labelledby="commitments-title">
        <div className="ref-shell">
          <div className="ref-section-heading">
            <div><p className="ref-kicker with-line">OUR STANDARD</p><h2 id="commitments-title">Clear expectations.<br/>At every step.</h2></div>
            <div className="ref-heading-side"><p>Agree on the details that matter before execution, and keep decisions clear through delivery.</p></div>
          </div>
          <div className="home-commitment-grid">
            {commitments.map(([title, text], index) => <article key={title}><span className="home-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="ref-section ref-line-section home-faq" aria-labelledby="home-faq-title">
        <div className="ref-shell home-faq-grid">
          <div className="home-faq-intro"><p className="ref-kicker with-line">BEFORE WE START</p><h2 id="home-faq-title">A few clear answers.</h2><p>The essentials to help you take the first step.</p><Link className="ref-button ghost small" href="/faq" prefetch>View all questions <span>→</span></Link></div>
          <div className="home-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="ref-cta ref-line-section home-start" id="contact"><div className="cta-blue-line left"/><div className="cta-blue-line right"/><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">LET&apos;S BUILD TOGETHER</p><h2>Every idea starts with a line.</h2><p>Describe your idea, choose a service and prepare a clear brief you can copy or share.</p><p className="home-start-note">Your brief stays on your device until you choose to share it.</p></div><div className="home-start-actions"><Link className="ref-button light" href="/start" prefetch>Prepare your project brief <span>→</span></Link><Link className="home-start-help" href="/services" prefetch>Find the right service <span>→</span></Link></div></div></section>
    </main></Localized>
  );
}
