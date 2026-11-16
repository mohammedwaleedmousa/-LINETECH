import HomeContent from "./HomeContent";
import SeoStructuredData from "./SeoStructuredData";
import { pageMetadata, siteDescription } from "../lib/seo";

export const metadata = pageMetadata("/", "Web & App Development in Aden, Yemen", siteDescription);
export default function Home() {
  return <><SeoStructuredData path="/" name="LINETECH — Web & App Development" /><HomeContent /></>;
}
