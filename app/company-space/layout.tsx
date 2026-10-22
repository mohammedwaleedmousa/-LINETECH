import { ReactNode } from "react";
import CompanyNav from "./CompanyNav";
export const metadata={robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}){return <><CompanyNav/>{children}</>}
