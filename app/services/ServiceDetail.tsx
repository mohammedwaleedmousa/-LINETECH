"use client";

import Localized from "../Localized";
import Link from "next/link";

type Item = [string, string];

type ServiceDetailProps = {
  className: string;
  eyebrow: string;
  title: string;
  lead: string;
  serviceParam: string;
  visualWords: string[];
  deliverables: Item[];
  fits: Item[];
  process: Item[];
};

export default function ServiceDetail({
  className,
  eyebrow,
  title,
  lead,
  serviceParam,
  visualWords,
  deliverables,
  fits,
  process,
}: ServiceDetailProps) {
  const startHref = `/start?service=${encodeURIComponent(serviceParam)}`;

  return (
    <Localized><main className={`ref-page service-detail-page ${className}`}>
      <section className="service-detail-hero">
        <div className="ref-shell service-detail-hero-grid">
          <div className="service-detail-hero-copy">
            <Link className="service-detail-back" href="/services" prefetch>Services <span>↗</span></Link>
            <p className="ref-kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="service-detail-lead">{lead}</p>
            <div className="ref-hero-actions">
              <Link className="ref-btn primary" href={startHref} prefetch>Start this service ↗</Link>
              <Link className="ref-btn ghost" href="/projects" prefetch>View our work</Link>
            </div>
          </div>
          <div className="service-detail-visual" aria-hidden="true">
            <span>LINETECH / SERVICE</span>
            <div>{visualWords.map((word) => <strong key={word}>{word}</strong>)}</div>
            <i/>
          </div>
        </div>
      </section>

      <section className="ref-section service-detail-section">
        <div className="ref-shell">
          <div className="ref-head">
            <div><p className="ref-kicker">WHAT YOU GET</p><h2>A clear, usable outcome.</h2></div>
            <p>Every engagement is scoped around the result you need, with the deliverables defined before execution starts.</p>
          </div>
          <div className="service-detail-grid">
            {deliverables.map(([title, text], index) => (
              <article className="service-detail-card" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ref-section service-detail-fit">
        <div className="ref-shell service-detail-fit-grid">
          <div>
            <p className="ref-kicker">WHO IT FITS</p>
            <h2>Built around the real need.</h2>
            <p className="service-detail-muted">We keep the solution focused instead of adding features that do not serve the project.</p>
          </div>
          <div className="service-detail-fit-list">
            {fits.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ref-section service-detail-process">
        <div className="ref-shell">
          <div className="ref-head">
            <div><p className="ref-kicker">HOW WE WORK</p><h2>One line from brief to delivery.</h2></div>
            <p>A simple process keeps decisions visible, scope controlled and the final outcome aligned with the original goal.</p>
          </div>
          <div className="service-detail-process-grid">
            {process.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <i/>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ref-cta service-detail-cta">
        <div className="ref-shell ref-cta-inner">
          <div><p className="ref-kicker">START YOUR LINE</p><h2>Ready to move from idea to execution?</h2><p>Prepare a clear project brief, then continue through the contact channel you choose.</p></div>
          <Link className="ref-btn primary" href={startHref} prefetch>Start this service ↗</Link>
        </div>
      </section>
    </main></Localized>
  );
}
