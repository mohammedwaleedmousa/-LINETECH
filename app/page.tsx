"use client";

import Localized from "./Localized";
import Link from "next/link";

const solutions = [
  { icon: "▱", title: "Web platforms", text: "Fast, scalable web products for companies, services and digital businesses.", href: "/services/web-development" },
  { icon: "</>", title: "Commerce systems", text: "Commerce flows, ordering, dashboards and operations connected in one clear product.", href: "/services/ecommerce-systems" },
  { icon: "⌘", title: "Business software", text: "Structured workflows and internal systems that replace scattered manual work.", href: "/projects/ledgerpro" },
  { icon: "✦", title: "Brand systems", text: "Visual systems that support a digital product with consistency and credibility.", href: "/services/brand-identity" },
];

const projects = [
  { tag: "E-COMMERCE", title: "Flamingo Park", text: "A mobile-first retail experience for product discovery, orders and customer conversion.", cls: "project-commerce", href: "/projects/flamingo-park" },
  { tag: "MARKETPLACE", title: "Etqan", text: "A services marketplace designed to organize discovery, providers and customer journeys.", cls: "project-market", href: "/projects/etqan" },
  { tag: "BUSINESS SYSTEM", title: "LedgerPro", text: "A business system for financial records, workflows and clearer operational visibility.", cls: "project-ledger", href: "/projects/ledgerpro" },
];

const process = [
  ["01", "Define the system", "Map the users, business rules, data and real operational flow."],
  ["02", "Design the experience", "Turn the system into clear screens, states and user journeys."],
  ["03", "Build the product", "Develop the agreed product with performance and maintainability in mind."],
  ["04", "Deploy and evolve", "Prepare deployment, handover and the foundation for the next version."],
];

const stack = ["React", "Next.js", "Node.js", "PostgreSQL", "Supabase", "Cloudflare"];

export default function Home() {
  return (
    <Localized><main className="ref-home company-home" id="top">
      <section className="ref-hero ref-line-section">
        <div className="ref-shell ref-hero-grid">
          <div className="ref-hero-copy">
            <p className="ref-kicker">TECHNOLOGY COMPANY</p>
            <h1>Digital platforms and systems built for real business.</h1>
            <p className="ref-lead">LINETECH designs and builds web platforms, commerce systems and business software around clear operational goals.</p>
            <div className="ref-actions">
              <Link className="ref-button light" href="/services" prefetch>Explore Solutions <span>→</span></Link>
              <Link className="ref-button ghost" href="/start" prefetch>Start Project</Link>
            </div>
            <div className="ref-stats">
              <div><strong>01</strong><span>Web Platforms</span></div>
              <div><strong>02</strong><span>Commerce Systems</span></div>
              <div><strong>03</strong><span>Business Systems</span></div>
              <div><strong>04</strong><span>Product Delivery</span></div>
            </div>
          </div>
          <div className="ref-hero-art company-system-art" aria-hidden="true">
            <div className="ref-building b1"/><div className="ref-building b2"/><div className="ref-building b3"/><div className="ref-building b4"/>
            <div className="ref-light-line"/><div className="ref-diagonal"/>
          </div>
        </div>
      </section>

      <section className="ref-section ref-line-section" id="solutions">
        <div className="ref-shell">
          <div className="ref-section-heading">
            <div><p className="ref-kicker with-line">TECHNOLOGY SOLUTIONS</p><h2>Technology built around how your business works.</h2></div>
            <div className="ref-heading-side"><p>From customer-facing platforms to operational systems, we design the right structure before we build the product.</p><Link className="ref-button ghost small" href="/services" prefetch>Explore Solutions <span>→</span></Link></div>
          </div>
          <div className="ref-service-grid">
            {solutions.map((solution) => <article className="ref-service-card company-solution-card" key={solution.title}><span className="ref-service-icon">{solution.icon}</span><h3>{solution.title}</h3><p>{solution.text}</p><Link href={solution.href} prefetch>Learn more <span>→</span></Link></article>)}
          </div>
        </div>
      </section>

      <section className="process-center ref-line-section company-process">
        <div className="process-center-shell">
          <div className="process-center-head">
            <p>HOW WE BUILD <span/></p>
            <h2>A product engineering process, not a portfolio workflow.</h2>
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

      <section className="ref-section ref-line-section tech-foundation-section">
        <div className="ref-shell tech-foundation-grid">
          <div className="tech-foundation-copy">
            <p className="ref-kicker with-line">TECHNOLOGY FOUNDATION</p>
            <h2>Practical technology for products that need to stay fast and maintainable.</h2>
            <p>Our stack is selected around the product, not around trends.</p>
          </div>
          <div className="tech-stack-grid" aria-label="Technology stack">
            {stack.map((item,index)=><div className="tech-stack-item" key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></div>)}
          </div>
        </div>
      </section>

      <section className="ref-section ref-line-section" id="projects">
        <div className="ref-shell">
          <div className="ref-section-heading project-head">
            <div><p className="ref-kicker with-line">CASE STUDIES</p><h2>Systems we have built around real workflows.</h2></div>
            <div className="ref-heading-side"><p>These case studies show how LINETECH approaches commerce, marketplaces and business operations as products — not just interfaces.</p><Link className="ref-button ghost small" href="/projects" prefetch>Case Studies <span>→</span></Link></div>
          </div>
          <div className="ref-project-grid">
            {projects.map((project) => <article className={`ref-project-card ${project.cls}`} key={project.title}><div className="ref-project-visual"><div className="ref-project-device"><i/><i/><i/></div><div className="ref-project-shine"/></div><div className="ref-project-copy"><span className="ref-tag">{project.tag}</span><h3>{project.title}</h3><p>{project.text}</p><Link href={project.href} prefetch>View Project <span>→</span></Link></div></article>)}
          </div>
        </div>
      </section>

      <section className="ref-about ref-line-section company-about" id="company">
        <div className="ref-shell ref-about-grid">
          <div className="ref-about-copy"><p className="ref-kicker with-line">COMPANY</p><h2>Built as a technology company from day one.</h2><p>LINETECH focuses on useful digital products, clear systems and engineering decisions that support real business use.</p><Link className="ref-button ghost small" href="/about" prefetch>Company <span>→</span></Link></div>
          <div className="ref-about-art" aria-hidden="true"><div className="about-block a1"/><div className="about-block a2"/><div className="about-block a3"/><div className="about-light"/></div>
          <div className="ref-about-lockup"><span className="ref-mark big"><i/><b/></span><strong>LINETECH</strong><i className="lock-line"/></div>
        </div>
      </section>

      <section className="ref-standard ref-line-section">
        <div className="ref-shell ref-standard-grid"><div><p className="ref-kicker">OUR STANDARD</p><h2>What every<br/>client should feel.</h2></div><article className="ref-quote-card"><p>“Clear communication, a focused scope and work that feels intentional from the first line to launch.”</p><div><span>A</span><small>Alignment<br/>before execution</small></div></article><article className="ref-quote-card"><p>“A reliable process, careful decisions and a final product built for real use — not just presentation.”</p><div><span>Q</span><small>Quality<br/>in every step</small></div></article></div>
      </section>

      <section className="ref-cta ref-line-section" id="contact"><div className="cta-blue-line left"/><div className="cta-blue-line right"/><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">START PROJECT</p><h2>Ready to build a real digital product?</h2><p>Start with the business problem. We will help define the right system.</p></div><Link className="ref-button light" href="/start" prefetch>Start Project <span>→</span></Link></div></section>
    </main></Localized>
  );
}