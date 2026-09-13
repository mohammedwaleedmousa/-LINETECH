"use client";

import Localized from "../Localized";
import Link from "next/link";

const projects=[
  {tag:"E-COMMERCE",title:"Flamingo Park",href:"/projects/flamingo-park",cls:"case-commerce",stack:["React","Supabase","Cloudflare"]},
  {tag:"SERVICES MARKETPLACE",title:"Etqan",href:"/projects/etqan",cls:"case-market",stack:["React","Supabase","Cloudflare"]},
  {tag:"BUSINESS SYSTEM",title:"LedgerPro",href:"/projects/ledgerpro",cls:"case-ledger",stack:["React","Node.js","PostgreSQL"]},
] as const;

function CaseVisual({type}:{type:string}){
  if(type === "case-commerce") return <div className="case-screen case-screen-commerce" aria-hidden="true"><div className="commerce-phone"><div/><span/><span/><b/></div><div className="commerce-catalog"><i/><i/><i/><i/></div><div className="commerce-order"><span/><span/><b/></div></div>;
  if(type === "case-market") return <div className="case-screen case-screen-market" aria-hidden="true"><div className="market-search"><i/><span/></div><div className="market-cards"><article><i/><span/><b/></article><article><i/><span/><b/></article><article><i/><span/><b/></article></div><div className="market-route"><i/><i/><i/></div></div>;
  return <div className="case-screen case-screen-ledger" aria-hidden="true"><div className="ledger-side"><i/><i/><i/><i/></div><div className="ledger-main"><div className="ledger-kpis"><i/><i/><i/></div><div className="ledger-chart"><b/><b/><b/><b/><b/></div><div className="ledger-table"><i/><i/><i/><i/></div></div></div>;
}

export default function ProjectsPage(){return <Localized><main className="ref-page page-projects visual-catalog-page">
<section className="ref-hero"><div className="ref-shell ref-hero-grid"><div className="ref-hero-copy"><p className="ref-kicker">CASE STUDIES</p><h1>Selected systems, not a portfolio gallery.</h1><p>Each case study explains the product problem, system structure and what was actually built.</p><div className="ref-hero-actions"><Link className="ref-btn primary" href="/start" prefetch>Start Project ↗</Link><Link className="ref-btn ghost" href="/services" prefetch>Explore Solutions</Link></div></div><div className="ref-visual case-hero-panel" aria-hidden="true"><div className="case-hero-screen"><div className="case-hero-side"><i/><i/><i/><i/></div><div className="case-hero-main"><div className="case-hero-kpis"><i/><i/><i/></div><div className="case-hero-chart"><span/><span/><span/><span/><span/></div><div className="case-hero-table"><i/><i/><i/><i/></div></div></div></div></div></section>

<section className="case-visual-section ref-line-section"><div className="ref-shell"><div className="visual-section-head compact-head"><div><p className="ref-kicker with-line">SYSTEMS IN PRACTICE</p><h2>Three different products. Three different operational problems.</h2></div></div><div className="case-visual-grid premium-case-grid">{projects.map(project=><Link className={`case-visual-card premium-case-card ${project.cls}`} href={project.href} prefetch key={project.title}><CaseVisual type={project.cls}/><div className="case-visual-meta"><div><span className="ref-tag">{project.tag}</span><h3>{project.title}</h3></div><div className="case-stack">{project.stack.map(item=><span data-no-translate key={item}>{item}</span>)}</div></div></Link>)}</div></div></section>

<section className="system-flow-section ref-line-section"><div className="ref-shell system-flow-grid"><div className="system-flow-title"><p className="ref-kicker with-line">HOW WE EVALUATE A PRODUCT</p><h2>Business logic before visual polish.</h2></div><div className="system-flow-map">{[["01","Problem"],["02","System"],["03","Product"],["04","Operation"]].map(([n,label],index)=><div className="flow-step" key={n}><span>{n}</span><strong>{label}</strong>{index<3&&<i/>}</div>)}</div></div></section>
<section className="ref-cta"><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">START PROJECT</p><h2>Have an operation that needs a better system?</h2><p>Tell us how the business works today. We will help define what the product should become.</p></div><Link className="ref-btn primary" href="/start" prefetch>Start Project ↗</Link></div></section>
</main></Localized>}
