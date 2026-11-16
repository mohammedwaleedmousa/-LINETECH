import { pageMetadata } from "../../lib/seo";
import SeoStructuredData from "../SeoStructuredData";
import ContactContent from './ContactContent';

export const metadata = pageMetadata("/contact", "Contact", "Discuss your website, app or business system with LINETECH in Aden, Yemen. Email info@linetech.company or call and WhatsApp +967 773 335 065.");

export default function Page() {
  return <><SeoStructuredData path="/contact" name="Contact" type="ContactPage" /><ContactContent /></>;
}
