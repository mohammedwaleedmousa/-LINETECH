import Link from "next/link";

export const metadata = {
  title: "Thank You",
  description: "Thank you for starting your line with LINETECH.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage(){
  return (
    <main className="info-page thank-you-page">
      <section className="thank-you-hero">
        <div className="thank-you-grid" aria-hidden="true"/>
        <div className="thank-you-beam" aria-hidden="true"/>
        <div className="ref-shell thank-you-inner">
          <span className="thank-you-index">01 / NEXT LINE</span>
          <p className="ref-kicker">THANK YOU</p>
          <h1>Your first line is ready.</h1>
          <p className="thank-you-lead">We have prepared the next step in the LINETECH project journey. Keep your brief ready and continue through the contact channel you choose.</p>
          <div className="thank-you-actions">
            <Link className="ref-btn primary" href="/" prefetch>Back to Home ↗</Link>
            <Link className="ref-btn ghost" href="/projects" prefetch>View our work</Link>
          </div>
          <div className="thank-you-steps">
            <article><span>01</span><h3>Brief</h3><p>Your idea is structured into a clear starting point.</p></article>
            <article><span>02</span><h3>Define</h3><p>Scope, priorities and the right solution are clarified.</p></article>
            <article><span>03</span><h3>Build</h3><p>Execution begins once the project direction is agreed.</p></article>
          </div>
        </div>
      </section>
    </main>
  );
}
