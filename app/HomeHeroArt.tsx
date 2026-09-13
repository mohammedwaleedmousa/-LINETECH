/** Calm full-hero neural-network artwork for the LINETECH homepage. */
export default function HomeHeroArt() {
  return (
    <div className="home-line-art home-neuron-art" aria-hidden="true">
      <svg viewBox="0 0 1440 620" fill="none" focusable="false" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="neuron-field-a">
            <stop stopColor="#3882F6" stopOpacity=".12" />
            <stop offset="1" stopColor="#3882F6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neuron-field-b">
            <stop stopColor="#78B3FF" stopOpacity=".075" />
            <stop offset="1" stopColor="#78B3FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neuron-core">
            <stop stopColor="#E4F0FF" />
            <stop offset=".25" stopColor="#8FC1FF" />
            <stop offset="1" stopColor="#3882F6" stopOpacity=".18" />
          </radialGradient>
          <linearGradient id="neuron-line" x1="80" y1="470" x2="1350" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7BB3FF" stopOpacity=".08" />
            <stop offset=".35" stopColor="#5B9CFA" stopOpacity=".22" />
            <stop offset=".72" stopColor="#72ACF8" stopOpacity=".36" />
            <stop offset="1" stopColor="#9BC8FF" stopOpacity=".12" />
          </linearGradient>
        </defs>

        <ellipse cx="350" cy="310" rx="360" ry="270" fill="url(#neuron-field-a)" />
        <ellipse cx="1080" cy="290" rx="410" ry="300" fill="url(#neuron-field-b)" />

        <g className="neuron-network-base" stroke="url(#neuron-line)" strokeWidth="1" strokeLinecap="round">
          <path d="M54 392 170 330 278 374 391 285 515 336 625 254 754 310 876 230 1005 286 1118 202 1260 254 1388 176" />
          <path d="M170 330 214 214 340 168 391 285 470 190 625 254 690 152 876 230 954 128 1118 202 1196 112 1388 176" />
          <path d="M278 374 246 490 404 512 515 336 568 462 754 310 806 475 1005 286 1072 430 1260 254 1324 392" />
          <path d="M54 392 96 514 246 490" />
          <path d="M340 168 286 92 190 128 214 214" />
          <path d="M470 190 510 92 604 120 690 152" />
          <path d="M954 128 1010 66 1112 92 1196 112" />
          <path d="M806 475 914 536 1072 430 1190 500 1324 392" />
          <path d="M568 462 642 552 806 475" />
        </g>

        <g className="neuron-cluster neuron-cluster-a">
          <path d="M190 128 286 92 340 168 278 374 170 330 214 214Z" stroke="#70AAFA" strokeOpacity=".11" />
          <circle cx="54" cy="392" r="3" fill="#78B2FC" fillOpacity=".55" />
          <circle cx="170" cy="330" r="4" fill="#6CA7F8" fillOpacity=".68" />
          <circle cx="214" cy="214" r="3.2" fill="#85BBFF" fillOpacity=".62" />
          <circle cx="286" cy="92" r="2.6" fill="#75AEF9" fillOpacity=".52" />
          <circle cx="340" cy="168" r="4.6" fill="url(#neuron-core)" fillOpacity=".72" />
          <circle cx="278" cy="374" r="3.5" fill="#71ABFA" fillOpacity=".62" />
          <circle cx="246" cy="490" r="2.8" fill="#8AC0FF" fillOpacity=".48" />
        </g>

        <g className="neuron-cluster neuron-cluster-b">
          <path d="M470 190 510 92 604 120 690 152 625 254 515 336Z" stroke="#76B0FF" strokeOpacity=".14" />
          <circle cx="391" cy="285" r="4" fill="#5F9FF6" fillOpacity=".62" />
          <circle cx="470" cy="190" r="3" fill="#7DB5FC" fillOpacity=".58" />
          <circle cx="510" cy="92" r="2.6" fill="#6AA5F7" fillOpacity=".44" />
          <circle cx="604" cy="120" r="3.4" fill="#8FC2FF" fillOpacity=".58" />
          <circle cx="625" cy="254" r="5" fill="url(#neuron-core)" fillOpacity=".8" />
          <circle cx="515" cy="336" r="3.6" fill="#6EA9FA" fillOpacity=".62" />
          <circle cx="568" cy="462" r="3" fill="#80B8FF" fillOpacity=".5" />
          <circle cx="642" cy="552" r="2.6" fill="#71ABFA" fillOpacity=".38" />
        </g>

        <g className="neuron-cluster neuron-cluster-c">
          <path d="M876 230 954 128 1010 66 1112 92 1196 112 1118 202 1005 286Z" stroke="#79B4FF" strokeOpacity=".16" />
          <path d="M1005 286 1072 430 1190 500 1324 392 1260 254Z" stroke="#79B4FF" strokeOpacity=".13" />
          <circle cx="754" cy="310" r="3.2" fill="#70AAFA" fillOpacity=".55" />
          <circle cx="876" cy="230" r="4.2" fill="#7DB5FD" fillOpacity=".7" />
          <circle cx="954" cy="128" r="3" fill="#74ADFA" fillOpacity=".56" />
          <circle cx="1010" cy="66" r="2.5" fill="#8FC2FF" fillOpacity=".46" />
          <circle cx="1112" cy="92" r="3.2" fill="#78B1FC" fillOpacity=".6" />
          <circle cx="1118" cy="202" r="5.2" fill="url(#neuron-core)" fillOpacity=".84" />
          <circle cx="1005" cy="286" r="3.6" fill="#6DA8F9" fillOpacity=".62" />
          <circle cx="1072" cy="430" r="4.4" fill="#75AFFB" fillOpacity=".68" />
          <circle cx="1190" cy="500" r="2.8" fill="#8AC0FF" fillOpacity=".5" />
          <circle cx="1260" cy="254" r="4" fill="#6EA9F9" fillOpacity=".64" />
          <circle cx="1324" cy="392" r="3" fill="#79B2FD" fillOpacity=".48" />
          <circle cx="1388" cy="176" r="2.6" fill="#91C4FF" fillOpacity=".42" />
        </g>

        <g className="neuron-satellites" fill="#7FB7FF">
          <circle cx="96" cy="514" r="2.5" />
          <circle cx="404" cy="512" r="2.4" />
          <circle cx="690" cy="152" r="2.8" />
          <circle cx="806" cy="475" r="2.8" />
          <circle cx="914" cy="536" r="2.4" />
          <circle cx="1196" cy="112" r="2.6" />
        </g>

        <g className="neuron-pulses">
          <circle cx="340" cy="168" r="13" stroke="#72ACFA" strokeOpacity=".10" />
          <circle cx="625" cy="254" r="16" stroke="#72ACFA" strokeOpacity=".12" />
          <circle cx="1118" cy="202" r="18" stroke="#7AB4FF" strokeOpacity=".12" />
          <circle cx="1072" cy="430" r="14" stroke="#7AB4FF" strokeOpacity=".09" />
        </g>
      </svg>
    </div>
  );
}
