import { notFound } from "next/navigation";
import SitemapLanding from "../../../SitemapLanding";

const categories = ["websites", "applications", "brand-assets", "software-saas", "templates", "digital-tools"];

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!categories.includes(slug)) return { title: "Product category" };
  const names: Record<string, string> = {
    websites: "Websites",
    applications: "Applications",
    "brand-assets": "Brand assets",
    "software-saas": "Software & SaaS",
    templates: "Templates",
    "digital-tools": "Digital tools",
  };
  return {
    title: names[slug],
    description: `Browse the LINETECH ${names[slug].toLowerCase()} category. Product availability is shown only when confirmed.`,
    robots: { index: false, follow: true },
  };
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!categories.includes(slug)) notFound();
  return <SitemapLanding page="product-category" category={slug} />;
}
