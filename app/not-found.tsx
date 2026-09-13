import Link from "next/link";

export default function NotFound(){return <main className="not-found-page">
  <div className="not-found-inner">
    <span className="not-found-code">404 / LINE NOT FOUND</span>
    <h1>This line goes nowhere.</h1>
    <p>The page may have moved, the address may be wrong, or the route does not exist yet. Start again from a clear line.</p>
    <div className="not-found-actions"><Link className="ref-btn primary" href="/" prefetch>Back to Home ↗</Link><Link className="ref-btn ghost" href="/start" prefetch>Start Your Line</Link></div>
  </div>
</main>}
