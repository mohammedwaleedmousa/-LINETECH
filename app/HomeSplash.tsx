"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [ready, setReady] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!isHome) {
      setVisible(false);
      setLeaving(false);
      setTypedCount(0);
      setReady(false);
      document.documentElement.classList.remove("home-splash-active", "home-splash-pre");
      document.body.classList.remove("home-splash-active");
      return;
    }

    setVisible(true);
    setLeaving(false);
    setTypedCount(0);
    setReady(false);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("home-splash-active");
    document.body.classList.add("home-splash-active");

    let typingTimer: ReturnType<typeof setTimeout> | undefined;
    let readyTimer: ReturnType<typeof setTimeout> | undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setTypedCount(SPLASH_TEXT.length);
      readyTimer = setTimeout(() => setReady(true), 120);
    } else {
      let index = 0;

      const typeNext = () => {
        index += 1;
        setTypedCount(index);

        if (index >= SPLASH_TEXT.length) {
          readyTimer = setTimeout(() => setReady(true), 260);
          return;
        }

        const current = SPLASH_TEXT[index - 1];
        const delay = current === " " ? 18 : current === "." ? 52 : 34;
        typingTimer = setTimeout(typeNext, delay);
      };

      typingTimer = setTimeout(typeNext, 260);
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
      if (readyTimer) clearTimeout(readyTimer);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("home-splash-active", "home-splash-pre");
      document.body.classList.remove("home-splash-active");
    };
  }, [isHome, pathname]);

  const enterSite = () => {
    if (leaving) return;
    setLeaving(true);
    exitTimerRef.current = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      document.documentElement.classList.remove("home-splash-active", "home-splash-pre");
      document.body.classList.remove("home-splash-active");
    }, 720);
  };

  if (!isHome || !visible) return null;

  const splash = (
    <div className={`home-splash${leaving ? " is-leaving" : ""}${ready ? " is-ready" : ""}`} role="dialog" aria-label="LINETECH introduction">
      <div className="home-splash-ambient" aria-hidden="true" />
      <div className="home-splash-stage" dir="ltr">
        <div className="home-splash-brand" aria-hidden="true">
          <span className="home-splash-brand-dot" />
          <span>LINETECH</span>
        </div>

        <div className="home-splash-inner">
          <span className="home-splash-measure" aria-hidden="true">
            <span>Every idea starts</span>
            <br className="home-splash-mobile-break" />
            <span className="home-splash-desktop-space"> </span>
            <span>with a line.</span>
          </span>

          <span className="home-splash-live" aria-live="polite">
            <TypedCharacters count={typedCount} />
            {!ready ? <span className="home-splash-cursor" aria-hidden="true" /> : null}
          </span>
        </div>

        <div className="home-splash-enter-wrap" aria-hidden={!ready}>
          <button className="home-splash-enter" type="button" onClick={enterSite} tabIndex={ready ? 0 : -1}>
            <span>Let&apos;s go</span>
            <b aria-hidden="true">→</b>
          </button>
          <span className="home-splash-enter-note">Enter LINETECH</span>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(splash, document.body) : splash;
}
