"use client";

import Localized from "../Localized";
import Link from "next/link";

const coreSolutions = [
  {n:"01",title:"Web Platforms",type:"web",href:"/services/web-development"},
  {n:"02",title:"Commerce Systems",type:"commerce",href:"/services/ecommerce-systems"},
  {n:"03",title:"Business Systems",type:"business",href:"/projects/ledgerpro"},
] as const;

const supportingServices = [
  {n:"04",title:"Brand Identity",href:"/services/brand-identity"},
  {n:"05",title:"CV & Portfolio",href:"/services/cv-portfolio"},
] as const;

function SolutionVisual({type}:{type:string}){
  if(type === "commerce") return <div className="solution-visual commerce-ui" aria-hidden="true"><div className="commerce-product"/><div className="commerce-lines"><i/><i/><i/></div><div className="commerce-total"><span/><b/></div></div>;
  if(type === "business") return <div className="solution-visual business-ui" aria-hidden="true"><div className="business-sidebar"><i/><i/><i/><i/></div><div className="business-chart"><span/><span/><span/><span/><span/></div><div className="business-row"><i/><i/><i/></div></div>;
  return <div className="solution-visual web-ui" aria-hidden="true"><div className="web-top"><i/><i/><i/></div><div className="web-main"><span/><b/><i/></div><div className="web-cards"><i/><i/><i/></div></div>;
}

export default function ServicesPage(){return <Localized><main className="ref-page page-services visual-catalog-page">
<section className="ref-hero"><div className="ref-shell ref-hero-grid"><div className="ref-hero-copy"><p className="ref-kicker">TECHNOLOGY SOLUTIONS</p><h1>Technology solutions built for real operations.</h1><p>LINETECH structures the product, user flows and technical foundation around what the business actually needs to run.</p><div className="ref-hero-actions"><Link className="ref-btn primary" href="/start" prefetch>Start Project ↗</Link><Link className="ref-btn ghost" href="/projects" prefetch>Case Studies</Link></div></div><div className="ref-visual solution-hero-panel" aria-hidden="true"><div className="solution-hero-grid"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="solution-hero-core"><span/><b>LINETECH</b></div></div></div></section>

<section className="visual-solutions ref-line-section"><div className="ref-shell"><div className="visual-section-head compact-head"><div><p className="ref-kicker with-line">CORE TECHNOLOGY</p><h2>Core technology solutions.</h2></div></div><div className="visual-solutions-grid">{coreSolutions.map(solution=><Link className="visual-solution-card" href={solution.href} prefetch key={solution.n}><div className="solution-card-top"><span>{solution.n}</span><b>↗</b></div><SolutionVisual type={solution.type}/><h3>{solution.title}</h3></Link>)}</div></div></section>

<section className="supporting-visual-section ref-line-section"><div className="ref-shell"><div className="visual-section-head compact-head"><div><p className="ref-kicker with-line">SUPPORTING SERVICES</p><h2>Support the product around the technology.</h2></div></div><div className="supporting-visual-grid">{supportingServices.map(service=><Link className="supporting-visual-card" href={service.href} prefetch key={service.n}><span>{service.n}</span><h3>{service.title}</h3><b>↗</b></Link>)}</div></div></section>

<section className="system-flow-section ref-line-section"><div className="ref-shell system-flow-grid"><div className="system-flow-title"><p className="ref-kicker with-line">HOW WE BUILD</p><h2>From business workflow to working product.</h2></div><div className="system-flow-map">{[["01","Problem"],["02","System"],["03","Build"],["04","Operation"]].map(([n,label],index)=><div className="flow-step" key={n}><span>{n}</span><strong>{label}</strong>{index<3&&<i/>}</div>)}</div></div></section>
<section className="ref-cta"><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">START PROJECT</p><h2>Have a workflow that should become a system?</h2><p>Start with the business problem. We will help define the right product and technical direction.</p></div><Link className="ref-btn primary" href="/start" prefetch>Start Project ↗</Link></div></section>
</main></Localized>}
