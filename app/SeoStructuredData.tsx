import { SITE_URL, canonicalUrl } from "../lib/seo";

export default function SeoStructuredData({ path, name, type = "WebPage" }: { path: string; name: string; type?: string }) {
  const url = canonicalUrl(path);
  const graph: Record<string, unknown>[] = [
    { "@type": type, "@id": `${url}#webpage`, url, name, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": `${SITE_URL}/#organization` } },
  ];
  if (path === "/") {
    graph.push(
      { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "LINETECH", url: `${SITE_URL}/`, logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/icon-512.png`, width: 512, height: 512 }, email: "info@linetech.company", telephone: "+967773335065", address: { "@type": "PostalAddress", addressLocality: "Aden", addressCountry: "YE" }, founder: { "@type": "Person", name: "Mohammed Waleed", jobTitle: "Founder & CEO" } },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "LINETECH", url: `${SITE_URL}/`, publisher: { "@id": `${SITE_URL}/#organization` } },
    );
  } else {
    graph.push({ "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "LINETECH", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: url },
    ] });
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}
