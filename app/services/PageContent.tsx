"use client";

import Localized from "../Localized";
import Link from "next/link";



const services = [
  {n:"01",title:"Web Development",description:"High-performance websites and web products built around clear goals, fast loading and long-term scalability.",meta:"Landing pages / Business websites / Custom web apps",href:"/services/web-development"},
  {n:"02",title:"E-commerce & Systems",description:"Commerce experiences and operational systems structured around real customer journeys and business workflows.",meta:"E-commerce / Dashboards / Booking / Custom systems",href:"/services/ecommerce-systems"},
  {n:"03",title:"Brand Identity",description:"A focused visual system that gives a business a distinctive, consistent and credible presence.",meta:"Logo direction / Visual system / Brand guidelines",href:"/services/brand-identity"},
  {n:"04",title:"CV & Portfolio",description:"Professional presentation designed to communicate experience, work and value with clarity.",meta:"CV / Portfolio / Personal presence",href:"/services/cv-portfolio"},
];

export default function ServicesPage(){return <Localized><main className="ref-page page-services">
<section className="ref-hero"><div className="ref-shell ref-hero-grid"><div className="ref-hero-copy"><p className="ref-kicker">OUR SERVICES</p><h1>Solutions for a smarter tomorrow.</h1><p>We combine clear product thinking, design and engineering to turn ideas into useful digital products.</p><div className="ref-hero-actions"><Link className="ref-btn primary" href="/start" prefetch>Start your line ↗</Link><Link className="ref-btn ghost" href="/projects" prefetch>View our work</Link></div></div><div className="ref-visual" aria-hidden="true"><div className="ref-block a"/><div className="ref-block b"/><div className="ref-block c"/><div className="ref-glow"/><div className="ref-visual-label">CLEAN<br/>MINIMAL<br/>TECHNICAL<br/>IMPACTFUL</div></div></div></section>
<section className="ref-section"><div className="ref-shell"><div className="ref-head"><div><p className="ref-kicker">WHAT WE BUILD</p><h2>Four focused services.</h2></div><p>We start with the outcome you need, then choose the right mix of strategy, design and engineering. No unnecessary complexity.</p></div><div className="ref-grid">{services.map((service)=><article className="ref-card" key={service.n}><div><span className="num">{service.n}</span><h3>{service.title}</h3><p>{service.description}</p></div><div><p className="ref-meta">{service.meta}</p><Link href={service.href} prefetch>Explore service →</Link></div></article>)}</div></div></section>
<section className="ref-section"><div className="ref-shell"><div className="ref-head"><div><p className="ref-kicker">OUR PROCESS</p><h2>From idea to launch.</h2></div><p>Every engagement follows one clear line so scope, expectations and execution stay aligned.</p></div><div className="ref-process"><div><p className="ref-kicker">PROCESS</p><h3>One clear line.</h3></div>{[["01","Understand"],["02","Define"],["03","Design"],["04","Build & Launch"]].map(([n,t])=><div key={n}><span className="ref-meta">{n}</span><h3>{t}</h3><p>{n==="01"?"We understand the business, idea and real need.":n==="02"?"We define scope, priorities and the right solution.":n==="03"?"We shape the experience before development begins.":"We develop, test, launch and prepare the next step."}</p></div>)}</div></div></section>
<section className="ref-cta"><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">START YOUR LINE</p><h2>Not sure which service fits?</h2><p>Tell us the outcome you need. We will help define the right first line.</p></div><Link className="ref-btn primary" href="/start" prefetch>Contact Us ↗</Link></div></section>
</main></Localized>}
