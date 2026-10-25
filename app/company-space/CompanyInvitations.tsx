"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {useLanguage} from "../Localized";
import {CompanyInvitation} from "../../lib/companies";
import {companyFetch,teamError} from "./company-client";

export default function CompanyInvitations(){
  const ar=useLanguage()==="ar";
  const [invitations,setInvitations]=useState<CompanyInvitation[]>([]),[state,setState]=useState("loading"),[attempt,setAttempt]=useState(0);
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[joined,setJoined]=useState<string|null>(null);
  const flight=useRef(false);
  useEffect(()=>{const controller=new AbortController();setState("loading");
    companyFetch("/api/company-invitations",{signal:controller.signal}).then(data=>{if(!controller.signal.aborted){setInvitations(data.invitations);setState("ready");}}).catch(()=>{if(!controller.signal.aborted)setState("error");});
    return()=>controller.abort();
  },[attempt]);
  async function respond(invitation:CompanyInvitation,action:"accept"|"decline"){
    if(flight.current)return;flight.current=true;setBusy(true);setError("");
    try{const data=await companyFetch("/api/company-invitations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({invitationId:invitation.id,action})});
      if(action==="accept")setJoined(data.result.company_id);
      setInvitations(old=>old.filter(i=>i.id!==invitation.id));
      // Refresh company cards through the parent without navigating or losing feedback.
      if(action==="accept")window.dispatchEvent(new Event("linetech-company-membership"));
    }catch(e){setError(teamError(e,ar));}
    finally{flight.current=false;setBusy(false);}
  }
  return <section className="company-invitation-inbox" aria-busy={busy||state==="loading"}>
    <div className="platform-section-heading"><h2>{ar?"دعوات الانضمام":"Your invitations"}</h2><button type="button" className="platform-button secondary" disabled={busy} onClick={()=>{setError("");setAttempt(n=>n+1);}}>{ar?"تحديث الدعوات":"Refresh invitations"}</button></div>
    <p className="company-form-note">{ar?"تظهر هنا الدعوات المرسلة إلى بريد حسابك الموثّق. يمكنك قبولها أو رفضها.":"Invitations for your account’s verified email appear here. You can accept or decline them."}</p>
    {error&&<p role="alert" className="company-feedback error">{error}</p>}
    {joined&&<p role="status" className="company-feedback">{ar?"انضممت إلى الشركة بنجاح. ":"You joined the company. "}<Link className="platform-text-link" href={"/company-space?company="+encodeURIComponent(joined)}>{ar?"فتح الشركة":"Open company"}</Link></p>}
    {state==="loading"?<p role="status">{ar?"جارٍ تحميل الدعوات…":"Loading invitations…"}</p>:state==="error"?<p role="alert" className="company-feedback error">{ar?"تعذّر تحميل الدعوات. أعد المحاولة.":"Could not load invitations. Please retry."}</p>:invitations.length?<div className="company-team-list">{invitations.map(invitation=><article className="platform-card company-team-row" key={invitation.id}><div><h3>{invitation.company_name}</h3><p>{ar?"تنتهي الدعوة":"Invitation expires"} {new Date(invitation.expires_at).toLocaleDateString(ar?"ar-YE":"en")}</p></div><div className="company-team-actions"><button type="button" className="platform-button primary" disabled={busy} onClick={()=>void respond(invitation,"accept")}>{ar?"قبول الدعوة":"Accept invitation"}</button><button type="button" className="platform-button secondary" disabled={busy} onClick={()=>void respond(invitation,"decline")}>{ar?"رفض":"Decline"}</button></div></article>)}</div>:<p className="company-form-note">{ar?"لا توجد دعوات نشطة لهذا الحساب.":"No active invitations for this account."}</p>}
    {invitations.length===100&&<p className="company-form-note">{ar?"تُعرض أحدث 100 دعوة. حدّث القائمة بعد الرد لعرض المزيد.":"The latest 100 invitations are shown. Refresh after responding to see more."}</p>}
  </section>;
}
