import Link from "next/link";
import {ReactNode} from "react";
export const metadata={robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}){return <><nav className="platform-account-nav" aria-label="Company workspace navigation"><Link href="/company-space">الشركة / Company</Link><Link href="/company-space/projects">المشاريع / Projects</Link><Link href="/company-space/members">الأعضاء / Members</Link><Link href="/company-space/billing">الاشتراك والفواتير / Billing</Link><Link href="/company-space/settings">الإعدادات / Settings</Link><Link href="/account/companies">شركاتي / My companies</Link></nav>{children}</>}
