/** A single starting line becomes a product blueprint. Decorative and static. */
export default function HomeHeroArt() {
  return (
    <div className="home-line-art" aria-hidden="true">
      <svg viewBox="0 0 800 680" fill="none" focusable="false">
        <defs>
          <pattern id="home-line-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" stroke="#8eb8e9" strokeOpacity=".075" strokeWidth=".6"/>
          </pattern>
          <radialGradient id="home-line-field">
            <stop stopColor="#3882f6" stopOpacity=".1"/>
            <stop offset="1" stopColor="#3882f6" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="home-line-origin">
            <stop stopColor="#a9ceff" stopOpacity=".45"/>
            <stop offset=".2" stopColor="#3882f6" stopOpacity=".15"/>
            <stop offset="1" stopColor="#3882f6" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="home-line-stroke" x1="90" y1="430" x2="690" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9ac7ff"/>
            <stop offset=".32" stopColor="#3882f6"/>
            <stop offset="1" stopColor="#3882f6" stopOpacity=".24"/>
          </linearGradient>
          <linearGradient id="home-line-face" x1="450" y1="260" x2="620" y2="420" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3882f6" stopOpacity=".06"/>
            <stop offset="1" stopColor="#3882f6" stopOpacity=".015"/>
          </linearGradient>
        </defs>

        <ellipse cx="490" cy="330" rx="290" ry="265" fill="url(#home-line-field)"/>
        <rect className="home-line-grid" x="150" y="85" width="600" height="500" fill="url(#home-line-grid)"/>

        <g className="home-line-detail" stroke="#527ba9" strokeWidth=".8" opacity=".27">
          <path d="M255 525 540 360 735 472M360 168 695 362M426 112V559" strokeDasharray="3 9"/>
          <path d="M211 196h12m-6-6v12M681 119h12m-6-6v12M697 545h12m-6-6v12M304 583h12m-6-6v12"/>
          <path d="M536 102h29m6 0h7M732 312v29m0 6v7M240 540h29"/>
        </g>

        <g strokeLinecap="round" strokeLinejoin="round">
          {/* One continuous, legible starting line. */}
          <path d="M90 430H268L360 377V256L493 179 626 256V410L493 487 360 410V377" stroke="url(#home-line-stroke)" strokeWidth="1.6"/>
          <path d="m360 256 133 77 133-77M493 333v154" stroke="#4c95f5" strokeOpacity=".62" strokeWidth="1.2"/>
          <path d="m360 256 133 77v154l-133-77Z" fill="url(#home-line-face)"/>

          {/* Small branches share the same geometric language. */}
          <g className="home-line-branches" stroke="#3882f6" strokeWidth="1" strokeOpacity=".36">
            <path d="M626 300 708 252v-80l-70-40-70 40v51M568 172l70 40 70-40M638 212v80"/>
            <path d="m413 441-85 49v67l79 46 79-46v-67M328 490l79 46 79-46M407 536v67"/>
            <path d="M268 430v-95l-65-37V207"/>
          </g>
          <g className="home-line-detail" stroke="#81b5f6" strokeWidth="1" strokeOpacity=".25">
            <path d="m385 301 82 47v87M385 327l58 34M385 349l40 23"/>
            <path d="m520 349 80-46v25l-80 46Zm0 52 80-46M520 423l51-29"/>
          </g>
        </g>

        <circle cx="90" cy="430" r="32" fill="url(#home-line-origin)"/>
        <circle cx="90" cy="430" r="3" fill="#d2e7ff"/>
        <circle cx="90" cy="430" r="7" stroke="#72adfa" strokeOpacity=".28"/>
        <circle cx="360" cy="377" r="2.5" fill="#5c9ff8"/>
        <circle cx="493" cy="333" r="2.5" fill="#83b9ff"/>
        <circle className="home-line-detail" cx="638" cy="212" r="2" fill="#3882f6" fillOpacity=".7"/>
      </svg>
    </div>
  );
}
