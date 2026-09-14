"use client";

import Link from "next/link";
import Localized from "../Localized";
import ProjectIntake from "./ProjectIntake";
import "./start.css";
import "./intake.css";
import "./brief-premium.css";
import "./custom-select.css";

const briefNotes = [
  ["01", "Your idea stays in your browser until you choose to copy or share it."],
  ["02", "Three short steps help define the real size and direction of the project."],
  ["03", "You can start even if budget or timing are not defined yet."],
] as const;

const nextSteps = [
  ["01", "Idea", "You explain what you want to achieve."],
  ["02", "Define", "We clarify scope, priorities and the right direction."],
  ["03", "Plan", "The product structure and next actions become clear."],
  ["04", "Build", "Execution begins once scope is agreed."],
] as const;

export default function StartPage() {
  return (
    <Localized>
      <main className="ref-page page-contact">
        <section className="contact-hero">
          <div className="contact-signal" aria-hidden="true">
            <span className="contact-signal-line contact-signal-line-main" />
            <span className="contact-signal-line contact-signal-line-top" />
            <span className="contact-signal-line contact-signal-line-bottom" />
            <i className="contact-signal-node node-one" />
            <i className="contact-signal-node node-two" />
            <i className="contact-signal-node node-three" />
            <i className="contact-signal-pulse" />
          </div>

          <div className="ref-shell contact-hero-shell">
            <div className="contact-hero-copy">
              <p className="ref-kicker">START YOUR LINE</p>
              <h1>Tell us what you want to build.</h1>
              <p className="contact-hero-lead">Start with the idea — even if it is still rough. We will use the brief to turn it into a clear first line.</p>
              <div className="contact-hero-actions">
                <a className="ref-btn primary" href="#brief">Start the brief ↘</a>
                <Link className="ref-btn ghost" href="/services" prefetch>View services</Link>
              </div>
            </div>

            <div className="contact-hero-index" aria-hidden="true">
              <span>01</span><i />
              <span>02</span><i />
              <span>03</span>
            </div>
          </div>
        </section>

        <section id="brief" className="contact-brief-section">
          <div className="ref-shell contact-brief-grid">
            <aside className="contact-brief-intro">
              <p className="ref-kicker">PROJECT BRIEF</p>
              <h2>One clear line before we build.</h2>
              <p>Fill in what you know. You do not need technical knowledge or every answer yet.</p>

              <div className="contact-brief-notes">
                {briefNotes.map(([number, text]) => (
                  <div key={number}>
                    <span>{number}</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </aside>

            <div className="contact-intake-panel">
              <ProjectIntake />
            </div>
          </div>
        </section>

        <section className="contact-next-section">
          <div className="ref-shell">
            <div className="contact-section-head">
              <div>
                <p className="ref-kicker">WHAT HAPPENS NEXT</p>
                <h2>A simple path forward.</h2>
              </div>
              <p>Once the brief is clear, the next step is defining the project and preparing the right execution plan.</p>
            </div>

            <div className="contact-next-rail">
              {nextSteps.map(([number, title, description]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-final-cta">
          <div className="ref-shell contact-final-cta-inner">
            <div>
              <p className="ref-kicker">LINETECH</p>
              <h2>Every idea starts with a line.</h2>
              <p>Make the first line clear, then build from there.</p>
            </div>
            <a className="ref-btn primary" href="#brief">Start now ↗</a>
          </div>
        </section>
      </main>
    </Localized>
  );
}
