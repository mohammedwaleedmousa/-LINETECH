import { pageMetadata } from "../../lib/seo";
import SeoStructuredData from "../SeoStructuredData";
import PageContent from "./PageContent";

export const metadata = pageMetadata("/terms", "Terms of Service", "LINETECH terms for website use, project scope, payments, timelines, intellectual property and third-party services.");

export default function Page() {
  return <><SeoStructuredData path="/terms" name="Terms of Service" type="WebPage" /><PageContent /></>;
}
