"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SPLASH_TEXT = "Every idea starts with a line.";

export default function HomeSplash() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setMounted(true);
    setVisible(true);
    setLeaving(false);
    setTyped("");

    let typingTimer: ReturnType<typeof setInterval> | undefined;
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("home-splash-active");
    document.body.classList.add("home-splash-active");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setTyped(SPLASH_TEXT);
      leaveTimer = setTimeout(() => setLeaving(true), 500);
      removeTimer = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = previousOverflow;
        document.documentElement.classList.remove("home-splash-active");
        document.body.classList.remove("home-splash-active");
      }, 950);
    } else {
      let index = 0;
      typingTimer = setInterval(() => {
        index += 1;
        setTyped(SPLASH_TEXT.slice(0, index));

        if (index >= SPLASH_TEXT.length) {
          if (typingTimer) clearInterval(typingTimer);
          leaveTimer = setTimeout(() => setLeaving(true), 520);
          removeTimer = setTimeout(() => {
            setVisible(false);
            document.body.style.overflow = previousOverflow;
            document.documentElement.classList.remove("home-splash-active");
            document.body.classList.remove("home-splash-active");
          }, 1180);
        }
      }, 48);
    }

    return () => {
      if (typingTimer) clearInterval(typingTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
      if (removeTimer) clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("home-splash-active");
      document.body.classList.remove("home-splash-active");
    };
  }, []);

  if (!visible) return null;

  const splash = (
    <div className={`home-splash${leaving ? " is-leaving" : ""}`} aria-hidden="true">
      <div className="home-splash-inner" dir="ltr">
        <span className="home-splash-text">{typed}</span>
        <span className="home-splash-cursor" aria-hidden="true" />
      </div>
    </div>
  );

  return mounted ? createPortal(splash, document.body) : splash;
}
