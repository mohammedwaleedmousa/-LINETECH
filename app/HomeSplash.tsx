"use client";

import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SPLASH_TEXT = "Every idea starts with a line.";
const MOBILE_BREAK_INDEX = "Every idea starts".length;

function TypedCharacters({ count }: { count: number }) {
  return (
    <>
      {Array.from(SPLASH_TEXT.slice(0, count)).map((character, index) => (
        <Fragment key={index}>
          {index === MOBILE_BREAK_INDEX ? <br className="home-splash-mobile-break" /> : null}
          <span className={`home-splash-char${character === " " ? " is-space" : ""}`}>
            {character === " " ? "\u00A0" : character}
          </span>
        </Fragment>
      ))}
    </>
  );
}

export default function HomeSplash() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    setVisible(true);
    setLeaving(false);
    setTypedCount(0);

    let typingTimer: ReturnType<typeof setTimeout> | undefined;
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("home-splash-active");
    document.body.classList.add("home-splash-active");

    const finishSplash = () => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("home-splash-active", "home-splash-pre");
      document.body.classList.remove("home-splash-active");
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setTypedCount(SPLASH_TEXT.length);
      leaveTimer = setTimeout(() => setLeaving(true), 420);
      removeTimer = setTimeout(finishSplash, 900);
    } else {
      let index = 0;

      const typeNext = () => {
        index += 1;
        setTypedCount(index);

        if (index >= SPLASH_TEXT.length) {
          leaveTimer = setTimeout(() => setLeaving(true), 560);
          removeTimer = setTimeout(finishSplash, 1120);
          return;
        }

        const nextCharacter = SPLASH_TEXT[index];
        const delay = nextCharacter === " " ? 28 : nextCharacter === "." ? 88 : 44;
        typingTimer = setTimeout(typeNext, delay);
      };

      typingTimer = setTimeout(typeNext, 180);
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
      if (removeTimer) clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("home-splash-active", "home-splash-pre");
      document.body.classList.remove("home-splash-active");
    };
  }, []);

  if (!visible) return null;

  const splash = (
    <div className={`home-splash${leaving ? " is-leaving" : ""}`} aria-hidden="true">
      <div className="home-splash-inner" dir="ltr">
        <span className="home-splash-measure" aria-hidden="true">
          <span>Every idea starts</span>
          <br className="home-splash-mobile-break" />
          <span className="home-splash-desktop-space"> </span>
          <span>with a line.</span>
        </span>

        <span className="home-splash-live">
          <TypedCharacters count={typedCount} />
          <span className="home-splash-cursor" aria-hidden="true" />
        </span>
      </div>
    </div>
  );

  return mounted ? createPortal(splash, document.body) : splash;
}
