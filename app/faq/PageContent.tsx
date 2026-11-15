"use client";

import ContentHeroArt from "../ContentHeroArt";
import Link from "next/link";
import { useLanguage } from "../Localized";
import "./faq.css";

import {faqCopy} from "../contact/faq-copy";

export default function FaqPage(){
  const language = useLanguage();
  const t = faqCopy[language];

  return (
    <main className="info-page page-faq">
      <section className="faq-hero info-page-hero" data-content-hero="faq">
        <ContentHeroArt motif="faq" />
        <div className="faq-hero-shell">
          <div className="faq-hero-copy">
            <p className="ref-kicker">FAQ</p>
            <h1>{t.heroTitle}</h1>
            <p className="faq-hero-lead">{t.heroLead}</p>
          </div>

          <div className="faq-hero-rail" aria-label="FAQ categories">
            {t.heroRail.map((item,index)=>(
              <div key={item}>
                <span>{String(index + 1).padStart(2,"0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-content">
        <div className="faq-shell faq-content-grid">
          <aside className="faq-aside">
            <p className="ref-kicker">{t.sideKicker}</p>
            <h2>{t.sideTitle}</h2>
            <p>{t.sideLead}</p>
            <Link className="ref-btn ghost faq-aside-button" href="/contact#request" prefetch>
              {t.cta} <span aria-hidden="true">→</span>
            </Link>
          </aside>

          <div className="faq-list">
            {t.faqs.map(([question,answer],index)=>(
              <details className="faq-item" key={question}>
                <summary>
                  <span className="faq-question-index">{String(index + 1).padStart(2,"0")}</span>
                  <strong>{question}</strong>
                  <i aria-hidden="true"/>
                </summary>
                <div className="faq-answer">
                  <span aria-hidden="true"/>
                  <p>{answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
