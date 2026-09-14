"use client";

import Localized, { useLanguage } from "../Localized";
import HomeHeroArt from "../HomeHeroArt";
import Link from "next/link";

type Item = [string, string];
type EngagementCopy = {
  need: string[];
  do: string[];
  receive: string[];
};

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
  engagement: {
    en: EngagementCopy;
    ar: EngagementCopy;
  };
};

const engagementLabels = {
  en: {
    kicker: "WORKING TOGETHER",
    title: "Clear inputs. Clear work. Clear handover.",
    lead: "Before execution starts, both sides know what is needed, what LINETECH is responsible for and what the final handover includes.",
    need: "What we need from you",
    do: "What LINETECH does",
    receive: "What you receive",
  },
  ar: {
    kicker: "العمل معًا",
    title: "مدخلات واضحة. تنفيذ واضح. وتسليم واضح.",
    lead: "قبل بدء التنفيذ يعرف الطرفان ما هو المطلوب، وما الذي تتولى لاين تك مسؤوليته، وما الذي يشمله التسليم النهائي.",
    need: "ما نحتاجه منك",
    do: "ما تنفذه لاين تك",
    receive: "ماذا تستلم",
  },
} as const;

export default function ServiceDetail({
  className,
  eyebrow,
  title,
  lead,
  serviceParam,
  visualWords: _visualWords,
  deliverables,
  fits,
  process,
  engagement,
}: ServiceDetailProps) {
  const language = useLanguage();
  const startHref = `/start?service=${encodeURIComponent(serviceParam)}`;
  const e = engagement[language];
  const labels = engagementLabels[language];
  const engagementColumns: Array<[string, string, string[]]> = [
    ["01", labels.need, e.need],
    ["02", labels.do, e.do],
    ["03", labels.receive, e.receive],
  ];

  return (
    <Localized>
      <main className={`ref-page service-detail-page ${className}`}>
        <section className="service-detail-hero">
          <div className="service-detail-neuron-field" aria-hidden="true">
            <HomeHeroArt />
          </div>

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
            <div className="service-detail-visual" aria-hidden="true"><i/></div>
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

        <section className="ref-section service-detail-engagement" aria-labelledby={`${className}-engagement`}>
          <div className="ref-shell">
            <div className="ref-head service-detail-engagement-head">
              <div><p className="ref-kicker">{labels.kicker}</p><h2 id={`${className}-engagement`}>{labels.title}</h2></div>
              <p>{labels.lead}</p>
            </div>
            <div className="service-detail-engagement-grid">
              {engagementColumns.map(([number, heading, items]) => (
                <article className="service-detail-engagement-card" key={number}>
                  <div className="service-detail-engagement-top"><span>{number}</span><i aria-hidden="true" /></div>
                  <h3>{heading}</h3>
                  <ul>
                    {items.map((item) => <li key={item}><i aria-hidden="true" />{item}</li>)}
                  </ul>
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
            <div><p className="ref-kicker">START YOUR LINE</p><h2>Ready to move from idea to execution?</h2><p>Complete your project request, receive a reference number, then share it with LINETECH through your chosen contact channel.</p></div>
            <Link className="ref-btn primary" href={startHref} prefetch>Start this service ↗</Link>
          </div>
        </section>
      </main>
    </Localized>
  );
}
