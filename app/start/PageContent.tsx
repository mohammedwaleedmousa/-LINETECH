"use client";

import Localized from "../Localized";
import Link from "next/link";
import ProjectIntake from "./ProjectIntake";
import "./start.css";
import "./intake.css";



export default function StartPage(){return <Localized><main className="ref-page page-contact">
<section className="ref-hero"><div className="ref-shell ref-hero-grid"><div className="ref-hero-copy"><p className="ref-kicker">START YOUR LINE</p><h1>Tell us what you want to build.</h1><p>Start with the idea — even if it is still rough. We will use the brief to turn it into a clear first line.</p><div className="ref-hero-actions"><a className="ref-btn primary" href="#brief">Start the brief ↘</a><Link className="ref-btn ghost" href="/services" prefetch>View services</Link></div></div><div className="ref-visual" aria-hidden="true"><div className="ref-block a"/><div className="ref-block b"/><div className="ref-block c"/><div className="ref-glow"/><div className="ref-visual-label">IDEA<br/>DEFINE<br/>NEXT STEP<br/>BUILD</div></div></div></section>
<section id="brief" className="ref-section"><div className="ref-shell ref-form-wrap"><div className="ref-form-side"><p className="ref-kicker">PROJECT BRIEF</p><h2>One clear line before we build.</h2><p>Fill in what you know. You do not need technical knowledge or every answer yet.</p><div className="ref-list" style={{marginTop:32}}>{[["01","Your idea stays in your browser until you choose to copy or share it."],["02","Three short steps help define the real size and direction of the project."],["03","You can start even if budget or timing are not defined yet."]].map(([n,t])=><div className="ref-row" style={{gridTemplateColumns:"50px 1fr",padding:"18px 0"}} key={n}><span className="ref-meta">{n}</span><p>{t}</p></div>)}</div></div><ProjectIntake/></div></section>
<section className="ref-section"><div className="ref-shell"><div className="ref-head"><div><p className="ref-kicker">WHAT HAPPENS NEXT</p><h2>A simple path forward.</h2></div><p>Once the brief is clear, the next step is defining the project and preparing the right execution plan.</p></div><div className="ref-grid">{[["01","Idea","You explain what you want to achieve."],["02","Define","We clarify scope, priorities and the right direction."],["03","Plan","The product structure and next actions become clear."],["04","Build","Execution begins once scope is agreed."]].map(([n,t,d])=><article className="ref-card" key={n}><span className="num">{n}</span><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></div></section>
<section className="ref-cta"><div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">LINETECH</p><h2>Every idea starts with a line.</h2><p>Make the first line clear, then build from there.</p></div><a className="ref-btn primary" href="#brief">Start now ↗</a></div></section>
</main></Localized>}
