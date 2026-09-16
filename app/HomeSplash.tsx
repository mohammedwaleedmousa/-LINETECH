"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const SPLASH_TEXT = "Every idea starts with a line.";
const MOBILE_BREAK_INDEX = "Every idea starts".length;
const HOME_HERO_IMAGE = "/hero/home-aden.png";

function TypedCharacters({ count }: { count: number }) {
  return <>{Array.from(SPLASH_TEXT.slice(0,count)).map((character,index)=><Fragment key={index}>{index===MOBILE_BREAK_INDEX?<br className="home-splash-mobile-break"/>:null}<span className={`home-splash-char${character===" "?" is-space":""}`}>{character===" "?"\u00A0":character}</span></Fragment>)}</>;
}

export default function HomeSplash(){
  const pathname=usePathname();
  const shouldShowOnEntryRef=useRef(false);
  const [mounted,setMounted]=useState(false);
  const [visible,setVisible]=useState(false);
  const [leaving,setLeaving]=useState(false);
  const [typedCount,setTypedCount]=useState(0);
  const [ready,setReady]=useState(false);
  const exitTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  const heroReadyRef=useRef(false);
  const readyRequestedRef=useRef(false);

  useEffect(()=>setMounted(true),[]);

  useLayoutEffect(()=>{
    let sameSiteReferrer=false;
    try{
      sameSiteReferrer=Boolean(document.referrer)&&new URL(document.referrer).origin===window.location.origin;
    }catch{}

    const shouldShow=pathname==="/"&&!sameSiteReferrer;
    shouldShowOnEntryRef.current=shouldShow;

    if(!shouldShow){
      setVisible(false);
      document.documentElement.classList.remove("home-splash-active","home-splash-pre");
      document.body.classList.remove("home-splash-active");
      return;
    }

    setVisible(true);
    setLeaving(false);
    setTypedCount(0);
    setReady(false);
    heroReadyRef.current=false;
    readyRequestedRef.current=false;

    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    document.documentElement.classList.add("home-splash-active");
    document.body.classList.add("home-splash-active");

    let typingTimer:ReturnType<typeof setTimeout>|undefined;
    let readyTimer:ReturnType<typeof setTimeout>|undefined;
    let heroSafetyTimer:ReturnType<typeof setTimeout>|undefined;
    let cancelled=false;

    const markHeroReady=()=>{
      if(cancelled)return;
      heroReadyRef.current=true;
      if(readyRequestedRef.current)setReady(true);
    };

    const heroImage=new Image();
    heroImage.decoding="async";
    heroImage.src=HOME_HERO_IMAGE;
    if(heroImage.complete) markHeroReady();
    else {
      heroImage.onload=markHeroReady;
      heroImage.onerror=markHeroReady;
      heroImage.decode?.().then(markHeroReady).catch(()=>{});
    }
    heroSafetyTimer=setTimeout(markHeroReady,2600);

    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const requestReady=()=>{
      readyRequestedRef.current=true;
      if(heroReadyRef.current)setReady(true);
    };

    if(reducedMotion){
      setTypedCount(SPLASH_TEXT.length);
      readyTimer=setTimeout(requestReady,120);
    }else{
      let index=0;
      const typeNext=()=>{
        index+=1;
        setTypedCount(index);
        if(index>=SPLASH_TEXT.length){
          readyTimer=setTimeout(requestReady,280);
          return;
        }
        const current=SPLASH_TEXT[index-1];
        typingTimer=setTimeout(typeNext,current===" "?7:current==="."?30:20);
      };
      typingTimer=setTimeout(typeNext,220);
    }

    return()=>{
      cancelled=true;
      if(typingTimer)clearTimeout(typingTimer);
      if(readyTimer)clearTimeout(readyTimer);
      if(heroSafetyTimer)clearTimeout(heroSafetyTimer);
      if(exitTimerRef.current)clearTimeout(exitTimerRef.current);
      document.body.style.overflow=previousOverflow;
      document.documentElement.classList.remove("home-splash-active","home-splash-pre");
      document.body.classList.remove("home-splash-active");
    };
  },[]);

  const enterSite=()=>{
    if(leaving||!ready)return;
    setLeaving(true);
    exitTimerRef.current=setTimeout(()=>{
      setVisible(false);
      document.body.style.overflow="";
      document.documentElement.classList.remove("home-splash-active","home-splash-pre");
      document.body.classList.remove("home-splash-active");
    },520);
  };

  if(!visible)return null;

  const splash=<div className={`home-splash${leaving?" is-leaving":""}${ready?" is-ready":""}`} role="dialog" aria-label="LINETECH introduction"><div className="home-splash-stage" dir="ltr"><div className="home-splash-brand">LINETECH</div><div className="home-splash-inner"><span className="home-splash-measure" aria-hidden="true"><span>Every idea starts</span><br className="home-splash-mobile-break"/><span className="home-splash-desktop-space"> </span><span>with a line.</span></span><span className="home-splash-live" aria-live="polite"><TypedCharacters count={typedCount}/>{!ready?<span className="home-splash-cursor" aria-hidden="true"/>:null}</span></div><button className="home-splash-enter" type="button" onClick={enterSite} tabIndex={ready?0:-1} aria-hidden={!ready}><span>Let&apos;s go</span><span aria-hidden="true">→</span></button></div></div>;
  return mounted?createPortal(splash,document.body):splash;
}
