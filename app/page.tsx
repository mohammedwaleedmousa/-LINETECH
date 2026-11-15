"use client";

import Localized from "./Localized";
import HomeHeroArt from "./HomeHeroArt";
import HomeProjects from "./HomeProjects";
import HomeAbout from "./HomeAbout";
import Link from "next/link";
import "./home-content.css";

const services = [
  { icon: "▱", title: "Web Development", text: "Fast, polished company websites and digital experiences built for real business use.", href: "/services#web-development" },
  { icon: "</>", title: "E-commerce & Systems", text: "Commerce flows, dashboards and custom systems shaped around the way your business works.", href: "/services#ecommerce-systems" },
  { icon: "✦", title: "Application Development", text: "Mobile applications shaped around your users, workflows and project requirements.", href: "/services#app-development" },
  { icon: "◎", title: "After-sales Care", text: "Maintenance, support and updates that keep your website or application moving forward.", href: "/services#aftercare" },
];

export default function Home() {
  return (
    <Localized><main className="ref-home" id="top" data-viewport-page>
      <section className="ref-hero ref-line-section home-line-hero" data-viewport-hero>
        <HomeHeroArt/>
        <div className="ref-shell ref-hero-grid" data-viewport-hero-body>
          <div className="ref-hero-copy">
            <p className="ref-kicker">TECHNOLOGY FOR A BRIGHTER TOMORROW</p>
            <h1>Every idea<br/>starts with a line.</h1>
            <p className="ref-lead">Websites, applications and business systems built around your idea.</p>
            <div className="ref-actions"><Link className="ref-button light" href="/contact#request" prefetch>Start Your Line <span>→</span></Link><a className="ref-button ghost" href="#projects">View Our Work <span>↓</span></a></div>
          </div>
        </div>
      </section>

      <section className="ref-section ref-line-section" id="services">
        <div className="ref-shell">
          <div className="ref-section-heading">
            <div><p className="ref-kicker with-line">OUR SERVICES</p><h2>Solutions for<br/>a smarter tomorrow.</h2></div>
            <div className="ref-heading-side"><Link className="ref-button ghost small" href="/services#choose" prefetch>Find Your Service <span>→</span></Link></div>
          </div>
          <div className="ref-service-grid">
            {services.map((service) => <article className="ref-service-card" key={service.title}><span className="ref-service-icon">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p><Link href={service.href} prefetch>Learn more <span>→</span></Link></article>)}
          </div>
        </div>
      </section>

      <HomeProjects/>
      <HomeAbout/>

      <section className="ref-cta ref-line-section home-start" id="contact"><div className="cta-blue-line left"/><div className="cta-blue-line right"/><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">LET&apos;S BUILD TOGETHER</p><h2>Every idea starts with a line.</h2><p>Describe your idea, choose a service and complete a clear project request.</p></div><div className="home-start-actions"><Link className="ref-button light" href="/contact#request" prefetch>Start your project request <span>→</span></Link></div></div></section>
    </main></Localized>
  );
}
