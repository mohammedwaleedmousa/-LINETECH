"use client";

import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {FormEvent,Suspense,useEffect,useRef,useState} from "react";
import {useLanguage} from "../Localized";
import {PlatformEmpty,PlatformHero} from "../PlatformUI";
import {CompanyTeam,invitationStatusLabels} from "../../lib/companies";
import {companyFetch,teamError} from "./company-client";

export default function CompanyMembers(){return <Suspense fallback={null}><Members/></Suspense>;}
function Members(){
  const ar=useLanguage()==="ar";
  const companyId=useSearchParams().get("company")||"";
  const [team,setTeam]=useState<CompanyTeam|null>(null),[state,setState]=useState("loading");
  const [attempt,setAttempt]=useState(0),[email,setEmail]=useState(""),[busy,setBusy]=useState(false);
  const [error,setError]=useState(""),[message,setMessage]=useState("");
  const flight=useRef(false),currentCompany=useRef(companyId);
  currentCompany.current=companyId;
  useEffect(()=>setEmail(""),[companyId]);
  useEffect(()=>{
    const controller=new AbortController();setTeam(null);setError("");setMessage("");
    if(!companyId){setState("choose");return;}
    setState("loading");
    companyFetch("/api/company-team?company="+encodeURIComponent(companyId),{signal:controller.signal})
      .then(data=>{if(!controller.signal.aborted){setTeam(data.team);setState("ready");}})
      .catch(()=>{if(!controller.signal.aborted)setState("error");});
    return()=>controller.abort();
  },[companyId,attempt]);
  async function action(kind:"invite"|"revoke"|"remove",id?:string){
    if(flight.current)return;
    if(kind==="remove"&&!window.confirm(ar?"هل تريد إزالة هذا العضو من الشركة؟":"Remove this member from the company?"))return;
    const targetCompany=companyId;
    flight.current=true;setBusy(true);setError("");setMessage("");
    try{
      await companyFetch("/api/company-team",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({companyId,action:kind,email,invitationId:kind==="revoke"?id:undefined,userId:kind==="remove"?id:undefined})});
      if(currentCompany.current!==targetCompany)return;
      if(kind==="invite")setEmail("");
      setMessage(kind==="invite"?(ar?"حُفظت الدعوة داخل حساب صاحب البريد. لم تُرسل رسالة بريد إلكتروني.":"Invitation saved in the recipient’s account. No email message was sent."):(ar?"تم حفظ التغيير.":"Change saved."));
      try{const data=await companyFetch("/api/company-team?company="+encodeURIComponent(targetCompany));if(currentCompany.current===targetCompany)setTeam(data.team);}
      catch{if(currentCompany.current===targetCompany)setState("error");}
    }catch(e){if(currentCompany.current===targetCompany)setError(teamError(e,ar));}
    finally{flight.current=false;setBusy(false);}
  }
  function invite(event:FormEvent){event.preventDefault();void action("invite");}
  return <main className="platform-page company-team-page">
    <PlatformHero eyebrow={ar?"مساحة الشركة / الفريق":"COMPANY / TEAM"} title={ar?"فريقك، في\nمساحة واحدة.":"Your team.\nOne shared space."} description={team?team.name:ar?"الأعضاء ودعوات الانضمام إلى شركتك.":"Members and invitations for your company."} icon="grid"/>
    <section className="platform-section" aria-busy={busy||state==="loading"}>
      {message&&<p role="status" className="company-feedback">{message}</p>}
      {error&&<p role="alert" className="company-feedback error">{error}</p>}
      {state!=="ready"?<PlatformEmpty icon="grid" title={state==="loading"?(ar?"جارٍ تحميل الفريق…":"Loading team…"):state==="choose"?(ar?"اختر شركة أولًا":"Choose a company first"):(ar?"الفريق غير متاح الآن":"Team unavailable")} body={ar?"افتح الشركة من قائمة شركاتك. تتاح إدارة الفريق لمالك الشركة.":"Open a company from My companies. Team management is available to its owner."}>
        {state==="error"&&<button className="platform-button secondary" type="button" disabled={busy} onClick={()=>setAttempt(n=>n+1)}>{ar?"إعادة المحاولة":"Try again"}</button>}
        <Link className="platform-button secondary" href="/account/companies">{ar?"شركاتي":"My companies"}</Link>
      </PlatformEmpty>:team&&<>
        <div className="platform-section-heading"><h2>{ar?"أعضاء الشركة":"Company members"}</h2><span className="platform-badge">{team.owner?(ar?"أنت مالك الشركة":"You are the owner"):(ar?"أنت عضو في الفريق":"You are a team member")}</span></div>
        <div className="company-team-list">{team.members.slice(0,100).map(member=><article className="platform-card company-team-row" key={member.user_id}>
          <div><h3 dir={member.email?"ltr":undefined}>{member.email||(ar?"حساب عضو":"Member account")}</h3><p>{member.role==="owner"?(ar?"مالك الشركة":"Company owner"):(ar?"عضو":"Member")} · <span dir="ltr">{member.user_id.slice(0,8)}</span></p></div>
          {team.owner&&member.role!=="owner"&&<button type="button" className="platform-button secondary" disabled={busy} onClick={()=>void action("remove",member.user_id)}>{ar?"إزالة العضو":"Remove member"}</button>}
        </article>)}</div>
        {team.members.length>100&&<p className="company-form-note">{ar?"تُعرض أول 100 عضوية. تواصل معنا لإدارة بقية الأعضاء.":"The first 100 memberships are shown. Contact us to manage additional members."}</p>}
        {team.owner?<>
          <form className="company-form company-invite-form" onSubmit={invite}>
            <h2>{ar?"دعوة عضو جديد":"Invite a member"}</h2>
            <p className="company-form-note">{ar?"تظهر الدعوة داخل حساب صاحب البريد بعد توثيقه، وتبقى صالحة لمدة 7 أيام. لن تُرسل رسالة بريد إلكتروني.":"The invitation appears in the recipient’s account once their email is verified, and stays valid for 7 days. No email message will be sent."}</p>
            <div className="company-invite-fields"><label>{ar?"البريد الإلكتروني":"Email address"}<input type="email" name="email" dir="ltr" required maxLength={254} value={email} disabled={busy} onChange={event=>setEmail(event.target.value)}/></label><button type="submit" className="platform-button primary" disabled={busy}>{busy?(ar?"جارٍ الحفظ…":"Saving…"):(ar?"إنشاء دعوة":"Create invitation")}</button></div>
          </form>
          <div className="platform-section-heading"><h2>{ar?"الدعوات":"Invitations"}</h2><button type="button" className="platform-button secondary" disabled={busy} onClick={()=>setAttempt(n=>n+1)}>{ar?"تحديث القائمة":"Refresh list"}</button></div>
          {team.invitations.length?<div className="company-team-list">{team.invitations.map(invitation=><article className="platform-card company-team-row" key={invitation.id}><div><h3 dir="ltr">{invitation.email}</h3><p>{invitationStatusLabels[invitation.status][ar?"ar":"en"]} · {ar?"تنتهي":"Expires"} {new Date(invitation.expires_at).toLocaleDateString(ar?"ar-YE":"en")}</p></div>{invitation.status==="pending"&&<button type="button" className="platform-button secondary" disabled={busy} onClick={()=>void action("revoke",invitation.id)}>{ar?"إلغاء الدعوة":"Cancel invitation"}</button>}</article>)}</div>:<p className="company-form-note">{ar?"لا توجد دعوات بعد.":"No invitations yet."}</p>}
          {team.invitations.length===100&&<p className="company-form-note">{ar?"تُعرض أحدث 100 دعوة.":"The latest 100 invitations are shown."}</p>}
        </>:<p className="company-form-note">{ar?"مالك الشركة مسؤول عن دعوة الأعضاء وإزالتهم.":"The company owner manages invitations and member removal."}</p>}
      </>}
    </section>
  </main>;
}
