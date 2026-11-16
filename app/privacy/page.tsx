import { pageMetadata } from "../../lib/seo";
import SeoStructuredData from "../SeoStructuredData";
import PageContent from "./PageContent";

export const metadata = pageMetadata("/privacy", "Privacy Policy", "How LINETECH handles project-request data, browser storage, preference cookies, technical website data and direct communications.");

export default function Page() {
  return <><SeoStructuredData path="/privacy" name="Privacy Policy" type="WebPage" /><PageContent /></>;
}
