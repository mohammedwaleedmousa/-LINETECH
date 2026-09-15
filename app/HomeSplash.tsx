"use client";

import { useEffect, useState } from "react";

const SPLASH_TEXT = "Every idea starts with a line.";

export default function HomeSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    let typingTimer: ReturnType<typeof setInterval> | undefined;
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    setVisible(true);
    setLeaving(false);
    setTyped("");

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setTyped(SPLASH_TEXT);
      leaveTimer = setTimeout(() => setLeaving(true), 550);
      removeTimer = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = previousOverflow;
      }, 1050);
    } else {
      startTimer = setTimeout(() => {
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
            }, 1180);
          }
        }, 48);
      }, 180);
    }

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (typingTimer) clearInterval(typingTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
      if (removeTimer) clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`home-splash${leaving ? " is-leaving" : ""}`} aria-hidden="true">
      <div className="home-splash-inner" dir="ltr">
        <span className="home-splash-text">{typed}</span>
        <span className="home-splash-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
