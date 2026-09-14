import Link from "next/link";

export const metadata = {
  title: "Start Your Line",
  description: "Continue to the LINETECH project request.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="info-page thank-you-page">
      <script
        dangerouslySetInnerHTML={{
          __html: "window.location.replace('/start#brief');",
        }}
      />
      <section className="thank-you-hero">
        <div className="ref-shell thank-you-inner">
          <p className="ref-kicker">PROJECT REQUEST</p>
          <h1>Continue your project request.</h1>
          <p className="thank-you-lead">This step now lives inside the complete LINETECH project request flow.</p>
          <div className="thank-you-actions">
            <Link className="ref-btn primary" href="/start#brief">Continue ↗</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
