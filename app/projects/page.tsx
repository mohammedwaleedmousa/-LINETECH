import { pageMetadata } from "../../lib/seo";
import SeoStructuredData from "../SeoStructuredData";
import PageContent from "./PageContent";
import ProjectsMotion from "./ProjectsMotion";

export const metadata = pageMetadata("/projects", "Our Work & Digital Projects", "Explore selected LINETECH projects, from business websites and commerce experiences to practical digital products and custom systems.");

export default function Page() {
  return <><SeoStructuredData path="/projects" name="Our Work & Digital Projects" type="CollectionPage" /><ProjectsMotion /><PageContent /></>;
}
