import styles from "./MarketingPage.module.css";

const branches = [
  "M80 330H294Q320 330 320 304V186Q320 160 346 160H620",
  "M80 330H650",
  "M80 330H294Q320 330 320 356V474Q320 500 346 500H570",
];
const wave = "M70 310C180 310 190 150 310 150S450 470 570 470S730 250 850 250";

export default function MarketingHeroArt({variant}:{variant:"services"|"contact"}){
  return <div className={`${styles.atmosphere} ${variant==="services"?styles.servicesAtmosphere:styles.contactAtmosphere}`} aria-hidden="true" data-hero-art={variant}>
    <div className={styles.ambientGlow}/>
    {variant==="services"?<svg viewBox="0 0 900 620" fill="none" focusable="false">
      <g className={styles.blueprintGuides}><path d="M120 100H530M160 560H780M810 130V510"/></g>
      {branches.map(d=><path key={d} className={styles.route} d={d}/>)}
      <path className={styles.signal} pathLength="100" d={branches[0]}/>
      <path className={`${styles.signal} ${styles.secondSignal}`} pathLength="100" d={branches[2]}/>
      <rect className={styles.moduleFrame} x="48" y="298" width="64" height="64" rx="14"/>
      <rect className={styles.moduleFrame} x="620" y="120" width="160" height="80" rx="18"/>
      <rect className={styles.moduleFrame} x="650" y="290" width="130" height="80" rx="18"/>
      <rect className={styles.moduleFrame} x="570" y="460" width="160" height="80" rx="18"/>
      <circle className={styles.node} cx="320" cy="330" r="4"/>
      <circle className={`${styles.node} ${styles.secondNode}`} cx="700" cy="160" r="3"/>
    </svg>:<svg viewBox="0 0 900 620" fill="none" focusable="false">
      {[-72,-48,-24,0,24,48,72].map((offset,index)=><g key={offset} transform={`translate(0 ${offset})`}><path className={styles.communicationWave} d={wave} style={{animationDelay:`${-index*1.1}s`}}/></g>)}
      <path className={styles.signal} pathLength="100" d={wave}/>
      <g transform="translate(0 48)"><path className={`${styles.signal} ${styles.secondSignal}`} pathLength="100" d={wave}/></g>
    </svg>}
  </div>;
}
