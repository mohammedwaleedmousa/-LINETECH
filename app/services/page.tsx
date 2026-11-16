import { pageMetadata } from "../../lib/seo";
import SeoStructuredData from "../SeoStructuredData";
import PageContent from "./PageContent";
export const metadata = pageMetadata("/services", "Websites, Apps & Business Systems", "Explore LINETECH website development, mobile applications, e-commerce and custom business systems, with maintenance and support from Aden, Yemen.");
export default function Page(){return <><SeoStructuredData path="/services" name="Websites, Apps & Business Systems" type="CollectionPage" /><PageContent/></>;}
