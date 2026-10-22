import { ReactNode,Suspense } from "react";
import CompanyNav from "./CompanyNav";
export const metadata={robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}){return <><Suspense fallback={null}><CompanyNav/></Suspense>{children}</>}
