"use client";

import Link from "next/link";
import {usePathname,useSearchParams} from "next/navigation";
import {useLanguage} from "../Localized";
const links=[["/company-space","الشركة","Company"],["/company-space/projects","المشاريع","Projects"],["/company-space/members","الأعضاء والدعوات","Members & invitations"],["/company-space/billing","الاشتراك والفواتير","Subscription & billing"],["/company-space/settings","الإعدادات","Settings"],["/account/companies","شركاتي","My companies"]];
export default function CompanyNav(){const ar=useLanguage()==="ar";const path=usePathname();const company=useSearchParams().get("company")||"";const query=/^[0-9a-f-]{36}$/i.test(company)?`?company=${encodeURIComponent(company)}`:"";return <nav className="platform-account-nav" aria-label={ar?"مساحة الشركة":"Company workspace"}>{links.map(([href,a,e])=><Link key={href} href={href+(href.startsWith("/company-space")?query:"")} aria-current={path===href?"page":undefined}>{ar?a:e}</Link>)}</nav>}
