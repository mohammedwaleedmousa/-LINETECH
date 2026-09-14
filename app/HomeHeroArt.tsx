/** Abstract technical artwork for the LINETECH homepage hero. */
export default function HomeHeroArt() {
  return (
    <div className="home-line-art home-neuron-art" aria-hidden="true">
      <svg viewBox="0 0 1440 700" fill="none" focusable="false" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lt-main" x1="420" y1="540" x2="1320" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3882F6" stopOpacity="0" />
            <stop offset=".28" stopColor="#4F94F5" stopOpacity=".26" />
            <stop offset=".64" stopColor="#8FC1FF" stopOpacity=".82" />
            <stop offset="1" stopColor="#D8EAFF" stopOpacity=".14" />
          </linearGradient>
          <linearGradient id="lt-soft" x1="740" y1="620" x2="1300" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2C6FC8" stopOpacity=".05" />
            <stop offset=".56" stopColor="#70ACF8" stopOpacity=".34" />
            <stop offset="1" stopColor="#A8D0FF" stopOpacity=".08" />
          </linearGradient>
          <radialGradient id="lt-glow" cx="0" cy="0" r="1" gradientTransform="translate(1060 330) rotate(90) scale(290 380)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3882F6" stopOpacity=".16" />
            <stop offset="1" stopColor="#3882F6" stopOpacity="0" />
          </radialGradient>
          <filter id="lt-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <ellipse cx="1060" cy="330" rx="390" ry="300" fill="url(#lt-glow)" />

        <g className="lt-architecture" strokeLinecap="round" strokeLinejoin="round">
          <path d="M560 566 760 448 916 492 1126 332 1352 374" stroke="url(#lt-main)" strokeWidth="1.7" />
          <path d="M690 622 868 520 1036 558 1250 388" stroke="url(#lt-soft)" strokeWidth="1" />
          <path d="M746 190 918 110 1164 154 1298 88" stroke="url(#lt-soft)" strokeWidth="1" />

          <path d="M822 466 822 214 1038 116 1228 208 1228 442 1038 552Z" stroke="#6AA7F5" strokeOpacity=".25" strokeWidth="1.15" />
          <path d="M876 438 876 248 1039 174 1172 238 1172 410 1039 494Z" stroke="#8ABEFF" strokeOpacity=".34" strokeWidth="1.15" />
          <path d="M930 405 930 285 1039 236 1116 273 1116 374 1039 430Z" stroke="#A9D0FF" strokeOpacity=".48" strokeWidth="1.35" />

          <path d="M822 214 1038 315 1228 208M822 466 1038 315 1228 442M1038 116V552" stroke="#5797EA" strokeOpacity=".16" strokeWidth="1" />
          <path d="M876 248 1039 325 1172 238M876 438 1039 325 1172 410" stroke="#75B1FA" strokeOpacity=".2" strokeWidth="1" />

          <path d="M718 360H885M1194 322H1372" stroke="#75B1FA" strokeOpacity=".22" strokeWidth="1" />
          <path d="M752 330H898M1180 353H1328" stroke="#5C9EF2" strokeOpacity=".1" strokeWidth="1" />
          <path d="M1039 236V430M930 285 1039 334 1116 273M930 405 1039 334 1116 374" stroke="#B5D7FF" strokeOpacity=".34" strokeWidth="1" />
        </g>

        <g className="lt-origin-points">
          <circle cx="560" cy="566" r="3.2" fill="#6EACF8" fillOpacity=".75" />
          <circle cx="760" cy="448" r="3" fill="#76B2FA" fillOpacity=".7" />
          <circle cx="916" cy="492" r="3" fill="#84BAFC" fillOpacity=".62" />
          <circle cx="1039" cy="334" r="5.5" fill="#DDEEFF" fillOpacity=".92" />
          <circle cx="1039" cy="334" r="18" stroke="#7DB7FD" strokeOpacity=".14" />
          <circle cx="1039" cy="334" r="36" stroke="#5C9DF0" strokeOpacity=".06" />
          <circle cx="1228" cy="208" r="3.2" fill="#8DC0FF" fillOpacity=".74" />
          <circle cx="1228" cy="442" r="3" fill="#6CAAF8" fillOpacity=".55" />
          <circle cx="1352" cy="374" r="2.7" fill="#8BBEFF" fillOpacity=".58" />
        </g>

        <g opacity=".42">
          <path d="M1004 334H1074" stroke="#D3E8FF" strokeWidth="1.2" />
          <path d="M1039 299V369" stroke="#D3E8FF" strokeWidth="1.2" />
        </g>

        <path d="M620 586C790 510 848 420 1028 336 1136 286 1264 258 1394 234" stroke="#6EA9F6" strokeOpacity=".13" strokeWidth="18" filter="url(#lt-blur)" />
      </svg>
    </div>
  );
}
