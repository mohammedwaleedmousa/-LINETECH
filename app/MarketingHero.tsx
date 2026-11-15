import type {ReactNode} from "react";
import styles from "./MarketingPage.module.css";

export default function MarketingHero({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children?:ReactNode}){
  return <section className={styles.hero} data-viewport-hero>
    <div className={styles.atmosphere} aria-hidden="true"><svg viewBox="0 0 900 620" fill="none" focusable="false"><path d="M80 520C260 500 280 190 470 230S680 430 860 100"/><path d="M170 580C330 490 360 330 510 350S740 380 900 210"/><circle cx="470" cy="230" r="4"/><circle cx="720" cy="285" r="3"/></svg></div>
    <div className={styles.heroShell} data-viewport-hero-body>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.heroLead}>{description}</p>
        {children&&<div className={styles.heroActions}>{children}</div>}
      </div>
    </div>
  </section>;
}
