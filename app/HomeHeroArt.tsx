/** Abstract technical artwork for the LINETECH homepage hero. */
export default function HomeHeroArt() {
  return (
    <div className="home-line-art home-neuron-art home-hero-abstract-v6" aria-hidden="true">
      <svg viewBox="0 0 1440 700" fill="none" focusable="false" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lt-main" x1="420" y1="540" x2="1320" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3882F6" stopOpacity="0" />
            <stop offset=".28" stopColor="#4F94F5" stopOpacity=".34" />
            <stop offset=".64" stopColor="#8FC1FF" stopOpacity=".96" />
            <stop offset="1" stopColor="#D8EAFF" stopOpacity=".22" />
          </linearGradient>
          <linearGradient id="lt-soft" x1="740" y1="620" x2="1300" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2C6FC8" stopOpacity=".08" />
            <stop offset=".56" stopColor="#70ACF8" stopOpacity=".46" />
            <stop offset="1" stopColor="#A8D0FF" stopOpacity=".12" />
          </linearGradient>
          <radialGradient id="lt-glow" cx="0" cy="0" r="1" gradientTransform="translate(1060 330) rotate(90) scale(320 430)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3882F6" stopOpacity=".22" />
            <stop offset="1" stopColor="#3882F6" stopOpacity="0" />
          </radialGradient>
          <filter id="lt-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
        </defs>

        <ellipse cx="1060" cy="330" rx="430" ry="320" fill="url(#lt-glow)" />

        <g className="lt-architecture" strokeLinecap="round" strokeLinejoin="round">
          <path d="M500 586 736 448 900 496 1124 326 1390 378" stroke="url(#lt-main)" strokeWidth="2" />
          <path d="M622 650 852 520 1030 566 1284 382" stroke="url(#lt-soft)" strokeWidth="1.25" />
          <path d="M724 180 918 92 1184 146 1348 66" stroke="url(#lt-soft)" strokeWidth="1.25" />

          <path d="M790 478 790 192 1038 80 1260 190 1260 454 1038 580Z" stroke="#6AA7F5" strokeOpacity=".34" strokeWidth="1.4" />
          <path d="M848 446 848 236 1039 148 1198 226 1198 420 1039 516Z" stroke="#8ABEFF" strokeOpacity=".45" strokeWidth="1.35" />
          <path d="M912 408 912 282 1039 224 1130 268 1130 378 1039 438Z" stroke="#B9DAFF" strokeOpacity=".66" strokeWidth="1.55" />

          <path d="M790 192 1038 322 1260 190M790 478 1038 322 1260 454M1038 80V580" stroke="#5797EA" strokeOpacity=".24" strokeWidth="1.15" />
          <path d="M848 236 1039 330 1198 226M848 446 1039 330 1198 420" stroke="#75B1FA" strokeOpacity=".28" strokeWidth="1.15" />

          <path d="M666 358H866M1218 316H1410" stroke="#75B1FA" strokeOpacity=".3" strokeWidth="1.2" />
          <path d="M706 326H886M1202 354H1366" stroke="#5C9EF2" strokeOpacity=".16" strokeWidth="1" />
          <path d="M1039 224V438M912 282 1039 336 1130 268M912 408 1039 336 1130 378" stroke="#D0E6FF" strokeOpacity=".46" strokeWidth="1.1" />
        </g>

        <g className="lt-origin-points">
          <circle cx="500" cy="586" r="3.8" fill="#6EACF8" fillOpacity=".88" />
          <circle cx="736" cy="448" r="3.5" fill="#76B2FA" fillOpacity=".82" />
          <circle cx="900" cy="496" r="3.4" fill="#84BAFC" fillOpacity=".75" />
          <circle cx="1039" cy="336" r="6.2" fill="#EAF4FF" fillOpacity="1" />
          <circle cx="1039" cy="336" r="20" stroke="#7DB7FD" strokeOpacity=".2" />
          <circle cx="1039" cy="336" r="44" stroke="#5C9DF0" strokeOpacity=".09" />
          <circle cx="1260" cy="190" r="3.8" fill="#8DC0FF" fillOpacity=".88" />
          <circle cx="1260" cy="454" r="3.5" fill="#6CAAF8" fillOpacity=".72" />
          <circle cx="1390" cy="378" r="3.2" fill="#8BBEFF" fillOpacity=".72" />
        </g>

        <g opacity=".58">
          <path d="M998 336H1080" stroke="#E1F0FF" strokeWidth="1.4" />
          <path d="M1039 295V377" stroke="#E1F0FF" strokeWidth="1.4" />
        </g>

        <path d="M554 610C760 520 834 420 1024 334 1152 276 1298 244 1430 214" stroke="#6EA9F6" strokeOpacity=".18" strokeWidth="24" filter="url(#lt-blur)" />
      </svg>
    </div>
  );
}
