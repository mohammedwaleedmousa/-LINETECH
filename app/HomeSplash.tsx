"use client";

import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(isHome);
  const [leaving, setLeaving] = useState(false);
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!isHome) {
      setVisible(false);
      setLeaving(false);
      setTypedCount(0);
      document.documentElement.classList.remove("home-splash-active", "home-splash-pre");
      document.body.classList.remove("home-splash-active");
      return;
    }

    setVisible(true);
    setLeaving(false);
    setTypedCount(0);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("home-splash-active");
    document.body.classList.add("home-splash-active");

    let typingTimer: ReturnType<typeof setTimeout> | undefined;
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const finishSplash = () => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("home-splash-active", "home-splash-pre");
      document.body.classList.remove("home-splash-active");
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setTypedCount(SPLASH_TEXT.length);
      leaveTimer = setTimeout(() => setLeaving(true), 180);
      removeTimer = setTimeout(finishSplash, 480);
    } else {
      let index = 0;

      const typeNext = () => {
        index += 1;
        setTypedCount(index);

        if (index >= SPLASH_TEXT.length) {
          leaveTimer = setTimeout(() => setLeaving(true), 160);
          removeTimer = setTimeout(finishSplash, 460);
          return;
        }

        const nextCharacter = SPLASH_TEXT[index];
        const delay = nextCharacter === " " ? 12 : nextCharacter === "." ? 36 : 22;
        typingTimer = setTimeout(typeNext, delay);
      };

      typingTimer = setTimeout(typeNext, 70);
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
      if (removeTimer) clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("home-splash-active", "home-splash-pre");
      document.body.classList.remove("home-splash-active");
    };
  }, [isHome, pathname]);

  if (!isHome || !visible) return null;

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
