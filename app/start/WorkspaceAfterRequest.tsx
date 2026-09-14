"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../Localized";
import "./workspace-after-request.css";

type LocalRequest = { requestId?: string; completedAt?: string };

const copy = {
  en: {
    kicker: "NEXT STEP",
    title: "Continue in your Client Workspace.",
    body: "Your completed request can now become the starting point for the project view, conversation, files and handover flow.",
    reference: "Request reference",
    button: "Open Client Workspace",
  },
  ar: {
    kicker: "الخطوة التالية",
    title: "تابع داخل مساحة العميل.",
    body: "يمكن الآن استخدام طلبك المكتمل كنقطة بداية لعرض المشروع والمحادثة والملفات ومسار التسليم.",
    reference: "رقم الطلب",
    button: "افتح مساحة العميل",
  },
} as const;

export default function WorkspaceAfterRequest(){
  const language = useLanguage();
  const t = copy[language];
  const [record,setRecord] = useState<LocalRequest | null>(null);

  useEffect(()=>{
    function read(){
      try{
        const raw = window.localStorage.getItem("linetech-project-request-v1");
        if(!raw){ setRecord(null); return; }
        const parsed = JSON.parse(raw) as LocalRequest;
        setRecord(parsed?.requestId ? parsed : null);
      }catch{ setRecord(null); }
    }
    read();
    const timer = window.setInterval(read,500);
    return ()=>window.clearInterval(timer);
  },[]);

  if(!record?.requestId) return null;

  return <aside className="workspace-after-request" aria-label={t.kicker}>
    <div>
      <p>{t.kicker}</p>
      <h3>{t.title}</h3>
      <span>{t.body}</span>
    </div>
    <div className="workspace-after-request-action">
      <small>{t.reference}</small>
      <strong>{record.requestId}</strong>
      <Link href="/workspace">{t.button} <b aria-hidden="true">→</b></Link>
    </div>
  </aside>;
}
