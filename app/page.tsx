"use client";

import Localized from "./Localized";
import Link from "next/link";

const solutions = [
  { key: "web", n: "01", title: "Web Platforms", href: "/services/web-development" },
  { key: "commerce", n: "02", title: "Commerce Systems", href: "/services/ecommerce-systems" },
  { key: "business", n: "03", title: "Business Systems", href: "/projects/ledgerpro" },
] as const;

const projects = [
  { tag: "E-COMMERCE", title: "Flamingo Park", href: "/projects/flamingo-park", cls: "case-commerce", stack: ["React", "Supabase", "Cloudflare"] },
  { tag: "MARKETPLACE", title: "Etqan", href: "/projects/etqan", cls: "case-market", stack: ["React", "Supabase", "Cloudflare"] },
  { tag: "BUSINESS SYSTEM", title: "LedgerPro", href: "/projects/ledgerpro", cls: "case-ledger", stack: ["React", "Node.js", "PostgreSQL"] },
] as const;

const buildSteps = [
  ["01", "Problem"],
  ["02", "System"],
  ["03", "Build"],
  ["04", "Operation"],
] as const;

const stack = ["React", "Next.js", "Node.js", "PostgreSQL", "Supabase", "Cloudflare"];

function HeroSystemVisual(){
  return <div className="sales-system" aria-hidden="true">
    <div className="sales-system-top"><span>LINETECH</span><i/><i/><i/></div>
    <div className="sales-system-grid">
      <div className="system-node node-entry"><b>01</b><strong>Web Platforms</strong><span/></div>
      <div className="system-rail rail-a"/>
      <div className="system-core"><span className="core-ring r1"/><span className="core-ring r2"/><span className="core-dot"/><b>LINETECH</b></div>
      <div className="system-rail rail-b"/>
      <div className="system-node node-commerce"><b>02</b><strong>Commerce Systems</strong><span/></div>
      <div className="system-node node-business"><b>03</b><strong>Business Systems</strong><span/></div>
      <div className="system-monitor"><div/><div/><div/><i/></div>
      <div className="system-status"><span/><b>Operations</b><i/></div>
    </div>
  </div>;
}

function SolutionVisual({type}:{type:typeof solutions[number]["key"]}){
  if(type === "commerce") return <div className="solution-visual commerce-ui" aria-hidden="true"><div className="commerce-product"/><div className="commerce-lines"><i/><i/><i/></div><div className="commerce-total"><span/><b/></div></div>;
  if(type === "business") return <div className="solution-visual business-ui" aria-hidden="true"><div className="business-sidebar"><i/><i/><i/><i/></div><div className="business-chart"><span/><span/><span/><span/><span/></div><div className="business-row"><i/><i/><i/></div></div>;
  return <div className="solution-visual web-ui" aria-hidden="true"><div className="web-top"><i/><i/><i/></div><div className="web-main"><span/><b/><i/></div><div className="web-cards"><i/><i/><i/></div></div>;
}

export default function Home() {
  return (
    <Localized><main className="ref-home company-home sales-home" id="top">
      <section className="ref-hero ref-line-section sales-hero">
        <div className="ref-shell sales-hero-grid">
          <div className="ref-hero-copy sales-hero-copy">
            <p className="ref-kicker">TECHNOLOGY COMPANY</p>
            <h1>Digital platforms and systems built for real business.</h1>
            <p className="ref-lead">LINETECH designs and builds web platforms, commerce systems and business software around clear operational goals.</p>
            <div className="ref-actions">
              <Link className="ref-button light" href="/start" prefetch>Start Project <span>→</span></Link>
              <Link className="ref-button ghost" href="/services" prefetch>Explore Solutions</Link>
            </div>
          </div>
          <HeroSystemVisual/>
        </div>
      </section>

      <section className="visual-solutions ref-line-section" id="solutions">
        <div className="ref-shell">
          <div className="visual-section-head compact-head">
            <div><p className="ref-kicker with-line">TECHNOLOGY SOLUTIONS</p><h2>Technology built around how your business works.</h2></div>
            <Link className="ref-button ghost small" href="/services" prefetch>Explore Solutions <span>→</span></Link>
          </div>
          <div className="visual-solutions-grid">
            {solutions.map(solution => <Link className="visual-solution-card" href={solution.href} prefetch key={solution.key}>
              <div className="solution-card-top"><span>{solution.n}</span><b>↗</b></div>
              <SolutionVisual type={solution.key}/>
              <h3>{solution.title}</h3>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="system-flow-section ref-line-section">
        <div className="ref-shell system-flow-grid">
          <div className="system-flow-title">
            <p className="ref-kicker with-line">HOW WE BUILD</p>
            <h2>From business workflow to working product.</h2>
          </div>
          <div className="system-flow-map">
            {buildSteps.map(([n,label], index) => <div className="flow-step" key={n}>
              <span>{n}</span><strong>{label}</strong>{index < buildSteps.length-1 && <i/>}
            </div>)}
          </div>
        </div>
      </section>

      <section className="case-visual-section ref-line-section" id="projects">
        <div className="ref-shell">
          <div className="visual-section-head compact-head">
            <div><p className="ref-kicker with-line">CASE STUDIES</p><h2>Systems we have built around real workflows.</h2></div>
            <Link className="ref-button ghost small" href="/projects" prefetch>Case Studies <span>→</span></Link>
          </div>
          <div className="case-visual-grid">
            {projects.map(project => <Link className={`case-visual-card ${project.cls}`} href={project.href} prefetch key={project.title}>
              <div className="case-screen" aria-hidden="true">
                <div className="case-screen-bar"><i/><i/><i/></div>
                <div className="case-screen-nav"><span/><span/><span/><span/></div>
                <div className="case-screen-body"><div className="case-kpi"><i/><i/><i/></div><div className="case-chart"><span/><span/><span/><span/><span/></div><div className="case-table"><i/><i/><i/><i/></div></div>
              </div>
              <div className="case-visual-meta"><div><span className="ref-tag">{project.tag}</span><h3>{project.title}</h3></div><div className="case-stack">{project.stack.map(item=><span data-no-translate key={item}>{item}</span>)}</div></div>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="technology-strip ref-line-section">
        <div className="ref-shell technology-strip-inner">
          <div><p className="ref-kicker">TECHNOLOGY FOUNDATION</p><h2>Technology stack</h2></div>
          <div className="technology-badges">{stack.map(item=><span data-no-translate key={item}>{item}</span>)}</div>
        </div>
      </section>

      <section className="ref-cta ref-line-section sales-cta" id="contact"><div className="cta-blue-line left"/><div className="cta-blue-line right"/><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">START PROJECT</p><h2>Ready to build a real digital product?</h2><p>Start with the business problem. We will help define the right system.</p></div><Link className="ref-button light" href="/start" prefetch>Start Project <span>→</span></Link></div></section>
    </main></Localized>
  );
}
