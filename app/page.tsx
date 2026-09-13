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

const stack = ["React", "Next.js", "Node.js", "PostgreSQL", "Supabase", "Cloudflare"];

function HeroSystemVisual(){
  return <div className="sales-system premium-system" aria-hidden="true">
    <div className="sales-system-top"><span>LINETECH / SYSTEM</span><i/><i/><i/></div>
    <div className="premium-system-grid">
      <div className="premium-lane premium-problem">
        <span className="premium-lane-label">Problem</span>
        <div className="scatter-card s1"><i/><i/></div>
        <div className="scatter-card s2"><i/><i/><i/></div>
        <div className="scatter-card s3"><i/></div>
      </div>
      <div className="premium-core-wrap">
        <div className="premium-core-rings"><i/><i/><i/></div>
        <strong>LINETECH</strong>
        <span>System</span>
      </div>
      <div className="premium-lane premium-operation">
        <span className="premium-lane-label">Operation</span>
        <div className="operation-dashboard">
          <div className="operation-top"><i/><i/><i/></div>
          <div className="operation-kpis"><i/><i/><i/></div>
          <div className="operation-chart"><b/><b/><b/><b/><b/></div>
          <div className="operation-table"><i/><i/><i/></div>
        </div>
      </div>
      <div className="premium-connector c1"/><div className="premium-connector c2"/>
    </div>
  </div>;
}

function SolutionVisual({type}:{type:typeof solutions[number]["key"]}){
  if(type === "commerce") return <div className="solution-visual commerce-ui" aria-hidden="true"><div className="commerce-product"/><div className="commerce-lines"><i/><i/><i/></div><div className="commerce-total"><span/><b/></div></div>;
  if(type === "business") return <div className="solution-visual business-ui" aria-hidden="true"><div className="business-sidebar"><i/><i/><i/><i/></div><div className="business-chart"><span/><span/><span/><span/><span/></div><div className="business-row"><i/><i/><i/></div></div>;
  return <div className="solution-visual web-ui" aria-hidden="true"><div className="web-top"><i/><i/><i/></div><div className="web-main"><span/><b/><i/></div><div className="web-cards"><i/><i/><i/></div></div>;
}

function CaseVisual({type}:{type:string}){
  if(type === "case-commerce") return <div className="case-screen case-screen-commerce" aria-hidden="true"><div className="commerce-phone"><div/><span/><span/><b/></div><div className="commerce-catalog"><i/><i/><i/><i/></div><div className="commerce-order"><span/><span/><b/></div></div>;
  if(type === "case-market") return <div className="case-screen case-screen-market" aria-hidden="true"><div className="market-search"><i/><span/></div><div className="market-cards"><article><i/><span/><b/></article><article><i/><span/><b/></article><article><i/><span/><b/></article></div><div className="market-route"><i/><i/><i/></div></div>;
  return <div className="case-screen case-screen-ledger" aria-hidden="true"><div className="ledger-side"><i/><i/><i/><i/></div><div className="ledger-main"><div className="ledger-kpis"><i/><i/><i/></div><div className="ledger-chart"><b/><b/><b/><b/><b/></div><div className="ledger-table"><i/><i/><i/><i/></div></div></div>;
}

export default function Home() {
  return (
    <Localized><main className="ref-home company-home sales-home" id="top">
      <section className="ref-hero ref-line-section sales-hero">
        <div className="ref-shell sales-hero-grid">
          <div className="ref-hero-copy sales-hero-copy">
            <p className="ref-kicker">TECHNOLOGY COMPANY</p>
            <h1>We turn business problems into digital systems.</h1>
            <p className="ref-lead">LINETECH turns business problems and clear ideas into digital products that can be operated, maintained and improved over time.</p>
            <div className="ref-actions">
              <Link className="ref-button light" href="/start" prefetch>Start Project <span>→</span></Link>
              <Link className="ref-button ghost" href="/services" prefetch>Explore Solutions</Link>
            </div>
            <div className="sales-signal-row" aria-label="LINETECH approach">
              <span>Problem</span><i/><span>System</span><i/><span>Operation</span>
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
            {solutions.map(solution => <Link className="visual-solution-card premium-solution-card" href={solution.href} prefetch key={solution.key}>
              <div className="solution-card-top"><span>{solution.n}</span><b>↗</b></div>
              <SolutionVisual type={solution.key}/>
              <div className="premium-card-foot"><h3>{solution.title}</h3><i/></div>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="business-transform ref-line-section">
        <div className="ref-shell">
          <div className="visual-section-head compact-head transform-head">
            <div><p className="ref-kicker with-line">HOW WE BUILD</p><h2>From business workflow to working product.</h2></div>
          </div>
          <div className="transform-board" aria-hidden="true">
            <div className="transform-panel transform-problem"><span>Problem</span><div className="chaos-grid"><i/><i/><i/><i/><i/><i/></div></div>
            <div className="transform-arrow"><i/><b>→</b><i/></div>
            <div className="transform-panel transform-system"><span>System</span><div className="system-chip"><i/><i/><i/><b>LINETECH</b></div></div>
            <div className="transform-arrow"><i/><b>→</b><i/></div>
            <div className="transform-panel transform-operation"><span>Operation</span><div className="clear-grid"><i/><i/><i/><i/></div></div>
          </div>
        </div>
      </section>

      <section className="case-visual-section ref-line-section" id="projects">
        <div className="ref-shell">
          <div className="visual-section-head compact-head">
            <div><p className="ref-kicker with-line">CASE STUDIES</p><h2>Systems we have built around real workflows.</h2></div>
            <Link className="ref-button ghost small" href="/projects" prefetch>Case Studies <span>→</span></Link>
          </div>
          <div className="case-visual-grid premium-case-grid">
            {projects.map(project => <Link className={`case-visual-card premium-case-card ${project.cls}`} href={project.href} prefetch key={project.title}>
              <CaseVisual type={project.cls}/>
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
