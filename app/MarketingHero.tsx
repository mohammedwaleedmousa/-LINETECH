import type {ReactNode} from "react";
import styles from "./MarketingPage.module.css";
import MarketingHeroArt from "./MarketingHeroArt";

export default function MarketingHero({variant,eyebrow,title,description,children}:{variant:"services"|"contact"|"aftercare";eyebrow:string;title:string;description:string;children?:ReactNode}){
  return <section className={styles.hero} data-viewport-hero>
    <MarketingHeroArt variant={variant}/>
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
