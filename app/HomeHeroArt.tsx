/** Animated neural-network artwork for the LINETECH homepage hero. */
export default function HomeHeroArt() {
  return (
    <div className="home-line-art home-neuron-art" aria-hidden="true">
      <svg viewBox="0 0 820 660" fill="none" focusable="false">
        <defs>
          <radialGradient id="neuron-field" cx="0" cy="0" r="1" gradientTransform="translate(510 315) rotate(90) scale(290 360)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3882F6" stopOpacity=".16" />
            <stop offset=".5" stopColor="#3882F6" stopOpacity=".045" />
            <stop offset="1" stopColor="#3882F6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neuron-core">
            <stop stopColor="#DCEBFF" />
            <stop offset=".28" stopColor="#7BB3FF" />
            <stop offset="1" stopColor="#3882F6" stopOpacity=".12" />
          </radialGradient>
          <linearGradient id="neuron-line" x1="210" y1="510" x2="700" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7BB3FF" stopOpacity=".18" />
            <stop offset=".48" stopColor="#5B9CFA" stopOpacity=".62" />
            <stop offset="1" stopColor="#9BC8FF" stopOpacity=".16" />
          </linearGradient>
        </defs>

        <ellipse cx="505" cy="315" rx="345" ry="280" fill="url(#neuron-field)" />

        <g className="neuron-network-base" stroke="url(#neuron-line)" strokeWidth="1.05" strokeLinecap="round">
          <path d="M176 421 285 350 393 395 494 306 609 350 705 264" />
          <path d="M285 350 337 236 494 306 536 184 653 142" />
          <path d="M393 395 371 509 505 489 609 350 690 446" />
          <path d="M337 236 247 174 140 252 176 421" />
          <path d="M536 184 460 112 337 236" />
          <path d="M609 350 726 352 705 264" />
          <path d="M505 489 611 553 690 446" />
        </g>

        <g className="neuron-cluster neuron-cluster-a">
          <path d="M247 174 312 118 380 153 337 236 247 174Z" stroke="#70AAFA" strokeOpacity=".22" />
          <circle cx="247" cy="174" r="4.5" fill="#74AEFB" />
          <circle cx="312" cy="118" r="3" fill="#5A9AF4" />
          <circle cx="380" cy="153" r="4" fill="#8DC0FF" />
          <circle cx="337" cy="236" r="5.5" fill="url(#neuron-core)" />
        </g>

        <g className="neuron-cluster neuron-cluster-b">
          <path d="M494 306 536 184 628 221 609 350 494 306Z" stroke="#76B0FF" strokeOpacity=".28" />
          <path d="M536 184 653 142 705 264 628 221" stroke="#76B0FF" strokeOpacity=".18" />
          <circle cx="494" cy="306" r="6" fill="url(#neuron-core)" />
          <circle cx="536" cy="184" r="4" fill="#6EA9FA" />
          <circle cx="628" cy="221" r="3.2" fill="#8ABFFF" />
          <circle cx="609" cy="350" r="5" fill="#5B9CF7" />
          <circle cx="653" cy="142" r="3.2" fill="#8FC2FF" />
          <circle cx="705" cy="264" r="4" fill="#5F9FF6" />
        </g>

        <g className="neuron-cluster neuron-cluster-c">
          <path d="M393 395 505 489 611 553 690 446 609 350" stroke="#6FA9F8" strokeOpacity=".22" />
          <circle cx="393" cy="395" r="4" fill="#5C9DF7" />
          <circle cx="505" cy="489" r="5.5" fill="url(#neuron-core)" />
          <circle cx="611" cy="553" r="3.2" fill="#85BBFF" />
          <circle cx="690" cy="446" r="4.2" fill="#6FA9FA" />
        </g>

        <g className="neuron-satellites" fill="#79B2FF">
          <circle cx="176" cy="421" r="4" />
          <circle cx="285" cy="350" r="3.5" />
          <circle cx="371" cy="509" r="2.8" />
          <circle cx="140" cy="252" r="3" />
          <circle cx="460" cy="112" r="2.8" />
          <circle cx="726" cy="352" r="3" />
        </g>

        <g className="neuron-pulses">
          <circle cx="494" cy="306" r="18" stroke="#6AA7FA" strokeOpacity=".18" />
          <circle cx="337" cy="236" r="13" stroke="#7AB4FF" strokeOpacity=".13" />
          <circle cx="505" cy="489" r="16" stroke="#7AB4FF" strokeOpacity=".14" />
        </g>
      </svg>
    </div>
  );
}
