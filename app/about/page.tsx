import { pageMetadata } from "../../lib/seo";
import SeoStructuredData from "../SeoStructuredData";
import PageContent from "./PageContent";
import AboutMotion from "./AboutMotion";

export const metadata = pageMetadata("/about", "About Our Company", "Meet LINETECH, a founder-led technology company in Aden, Yemen. Learn about Mohammed Waleed and our approach to design, development and ongoing care.");

export default function Page() {
  return <><SeoStructuredData path="/about" name="About Our Company" type="AboutPage" /><AboutMotion /><PageContent /></>;
}
