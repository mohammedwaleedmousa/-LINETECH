"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const SPLASH_TEXT = "Every idea starts with a line.";
const MOBILE_BREAK_INDEX = "Every idea starts".length;

function TypedCharacters({ count }: { count: number }) {
  return <>{Array.from(SPLASH_TEXT.slice(0,count)).map((character,index)=><Fragment key={index}>{index===MOBILE_BREAK_INDEX?<br className="home-splash-mobile-break"/>:null}<span className={`home-splash-char${character===" "?" is-space":""}`}>{character===" "?"\u00A0":character}</span></Fragment>)}</>;
}

export default function HomeSplash(){
  const pathname=usePathname();
  const isHome=pathname==="/";
  const [mounted,setMounted]=useState(false);
  const [visible,setVisible]=useState(isHome);
  const [leaving,setLeaving]=useState(false);
  const [typedCount,setTypedCount]=useState(0);
  const [ready,setReady]=useState(false);
  const [heroReady,setHeroReady]=useState(false);
  const exitTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  const readyRequestedRef=useRef(false);

  useEffect(()=>setMounted(true),[]);

  useEffect(()=>{
    if(!isHome)return;
    let cancelled=false;
    const markReady=()=>{if(!cancelled)setHeroReady(true)};
    // The home page is rendered underneath the splash. Waiting two paint frames
    // ensures its hero DOM, CSS and inline SVG artwork have been laid out/painted.
    requestAnimationFrame(()=>requestAnimationFrame(markReady));
    if(document.fonts?.ready) document.fonts.ready.then(markReady).catch(()=>markReady());
    return()=>{cancelled=true};
  },[isHome]);

  useLayoutEffect(()=>{
    if(!isHome){setVisible(false);setLeaving(false);setTypedCount(0);setReady(false);setHeroReady(false);readyRequestedRef.current=false;document.documentElement.classList.remove("home-splash-active","home-splash-pre");document.body.classList.remove("home-splash-active");return}
    setVisible(true);setLeaving(false);setTypedCount(0);setReady(false);readyRequestedRef.current=false;
    const previousOverflow=document.body.style.overflow;document.body.style.overflow="hidden";document.documentElement.classList.add("home-splash-active");document.body.classList.add("home-splash-active");
    let typingTimer:ReturnType<typeof setTimeout>|undefined;let readyTimer:ReturnType<typeof setTimeout>|undefined;
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const requestReady=()=>{readyRequestedRef.current=true;if(heroReady)setReady(true)};
    if(reducedMotion){setTypedCount(SPLASH_TEXT.length);readyTimer=setTimeout(requestReady,120)}else{let index=0;const typeNext=()=>{index+=1;setTypedCount(index);if(index>=SPLASH_TEXT.length){readyTimer=setTimeout(requestReady,280);return}const current=SPLASH_TEXT[index-1];typingTimer=setTimeout(typeNext,current===" "?7:current==="."?30:20)};typingTimer=setTimeout(typeNext,220)}
    return()=>{if(typingTimer)clearTimeout(typingTimer);if(readyTimer)clearTimeout(readyTimer);if(exitTimerRef.current)clearTimeout(exitTimerRef.current);document.body.style.overflow=previousOverflow;document.documentElement.classList.remove("home-splash-active","home-splash-pre");document.body.classList.remove("home-splash-active")};
  },[isHome,pathname,heroReady]);

  useEffect(()=>{if(heroReady&&readyRequestedRef.current)setReady(true)},[heroReady]);

  const enterSite=()=>{if(leaving||!heroReady)return;setLeaving(true);exitTimerRef.current=setTimeout(()=>{setVisible(false);document.body.style.overflow="";document.documentElement.classList.remove("home-splash-active","home-splash-pre");document.body.classList.remove("home-splash-active")},520)};
  if(!isHome||!visible)return null;
  const splash=<div className={`home-splash${leaving?" is-leaving":""}${ready?" is-ready":""}`} role="dialog" aria-label="LINETECH introduction"><div className="home-splash-stage" dir="ltr"><div className="home-splash-brand">LINETECH</div><div className="home-splash-inner"><span className="home-splash-measure" aria-hidden="true"><span>Every idea starts</span><br className="home-splash-mobile-break"/><span className="home-splash-desktop-space"> </span><span>with a line.</span></span><span className="home-splash-live" aria-live="polite"><TypedCharacters count={typedCount}/>{!ready?<span className="home-splash-cursor" aria-hidden="true"/>:null}</span></div><button className="home-splash-enter" type="button" onClick={enterSite} tabIndex={ready?0:-1} aria-hidden={!ready}><span>Let&apos;s go</span><span aria-hidden="true">→</span></button></div></div>;
  return mounted?createPortal(splash,document.body):splash;
}
