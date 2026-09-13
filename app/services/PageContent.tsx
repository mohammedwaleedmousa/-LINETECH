"use client";

import Localized from "../Localized";
import Link from "next/link";

const coreSolutions = [
  {n:"01",title:"Web Development",description:"High-performance websites and web products built around clear goals, fast loading and long-term scalability.",meta:"Landing pages / Business websites / Custom web apps",href:"/services/web-development"},
  {n:"02",title:"E-commerce & Systems",description:"Commerce experiences and operational systems structured around real customer journeys and business workflows.",meta:"E-commerce / Dashboards / Booking / Custom systems",href:"/services/ecommerce-systems"},
];

const supportingServices = [
  {n:"03",title:"Brand Identity",description:"A focused visual system that gives a business a distinctive, consistent and credible presence.",meta:"Logo direction / Visual system / Brand guidelines",href:"/services/brand-identity"},
  {n:"04",title:"CV & Portfolio",description:"Professional presentation designed to communicate experience, work and value with clarity.",meta:"CV / Portfolio / Personal presence",href:"/services/cv-portfolio"},
];

export default function ServicesPage(){return <Localized><main className="ref-page page-services">
<section className="ref-hero"><div className="ref-shell ref-hero-grid"><div className="ref-hero-copy"><p className="ref-kicker">TECHNOLOGY SOLUTIONS</p><h1>Technology solutions built for real operations.</h1><p>LINETECH structures the product, user flows and technical foundation around what the business actually needs to run.</p><div className="ref-hero-actions"><Link className="ref-btn primary" href="/start" prefetch>Start Project ↗</Link><Link className="ref-btn ghost" href="/projects" prefetch>Case Studies</Link></div></div><div className="ref-visual" aria-hidden="true"><div className="ref-block a"/><div className="ref-block b"/><div className="ref-block c"/><div className="ref-glow"/></div></div></section>

<section className="ref-section"><div className="ref-shell"><div className="ref-head"><div><p className="ref-kicker">CORE TECHNOLOGY</p><h2>Core technology solutions.</h2></div><p>These are the areas where LINETECH leads with product structure, engineering and implementation.</p></div><div className="ref-grid">{coreSolutions.map((service)=><article className="ref-card" key={service.n}><div><span className="num">{service.n}</span><h3>{service.title}</h3><p>{service.description}</p></div><div><p className="ref-meta">{service.meta}</p><Link href={service.href} prefetch>Explore service →</Link></div></article>)}</div></div></section>

<section className="ref-section supporting-services-section"><div className="ref-shell"><div className="ref-head"><div><p className="ref-kicker">SUPPORTING SERVICES</p><h2>Support the product around the technology.</h2></div><p>Brand and professional presentation can support a product or company, but they are not the center of LINETECH&apos;s technology offering.</p></div><div className="ref-grid">{supportingServices.map((service)=><article className="ref-card" key={service.n}><div><span className="num">{service.n}</span><h3>{service.title}</h3><p>{service.description}</p></div><div><p className="ref-meta">{service.meta}</p><Link href={service.href} prefetch>Explore service →</Link></div></article>)}</div></div></section>

<section className="ref-section"><div className="ref-shell"><div className="ref-head"><div><p className="ref-kicker">HOW WE BUILD</p><h2>From business workflow to working product.</h2></div><p>We define the system first, then design and build the experience around the real users and operations.</p></div><div className="ref-process"><div><p className="ref-kicker">PROCESS</p><h3>One clear system.</h3></div>{[["01","Define the system"],["02","Design the experience"],["03","Build the product"],["04","Deploy and evolve"]].map(([n,t])=><div key={n}><span className="ref-meta">{n}</span><h3>{t}</h3><p>{n==="01"?"Map the users, business rules, data and real operational flow.":n==="02"?"Turn the system into clear screens, states and user journeys.":n==="03"?"Develop the agreed product with performance and maintainability in mind.":"Prepare deployment, handover and the foundation for the next version."}</p></div>)}</div></div></section>
<section className="ref-cta"><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">START PROJECT</p><h2>Have a workflow that should become a system?</h2><p>Start with the business problem. We will help define the right product and technical direction.</p></div><Link className="ref-btn primary" href="/start" prefetch>Start Project ↗</Link></div></section>
</main></Localized>}