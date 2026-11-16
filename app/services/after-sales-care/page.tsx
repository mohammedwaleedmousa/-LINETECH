import { pageMetadata } from "../../../lib/seo";
import SeoStructuredData from "../../SeoStructuredData";
import AftercareContent from "./AftercareContent";

export const metadata = pageMetadata("/services/after-sales-care", "After-sales Care & Website Maintenance", "Explore LINETECH maintenance, updates and technical support for websites, applications and business systems. Agree the scope and care plan before work begins.");
export default function Page() {
  return <><SeoStructuredData path="/services/after-sales-care" name="After-sales Care" /><AftercareContent /></>;
}
