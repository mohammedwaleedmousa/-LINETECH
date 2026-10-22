import {ReactNode} from "react";import AccountNav from "./AccountNav";
export const metadata={robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}){return <><AccountNav/>{children}</>;}
