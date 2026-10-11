"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";

type PageKind = "products" | "knowledge" | "product-category";
type Props = { page: PageKind; category?: string };

const categories = [
  { slug: "websites", en: "Websites", ar: "المواقع الإلكترونية", noteEn: "Business websites and focused digital experiences.", noteAr: "مواقع الأعمال والتجارب الرقمية المتخصصة." },
  { slug: "applications", en: "Applications", ar: "التطبيقات", noteEn: "Purpose-built applications for real workflows.", noteAr: "تطبيقات مصممة لتلبية احتياجات العمل." },
  { slug: "brand-assets", en: "Brand assets", ar: "أصول الهوية", noteEn: "Digital brand resources and visual assets.", noteAr: "موارد العلامة التجارية والأصول البصرية الرقمية." },
  { slug: "software-saas", en: "Software & SaaS", ar: "البرمجيات والخدمات السحابية", noteEn: "Software products and hosted tools, when available.", noteAr: "منتجات برمجية وأدوات مستضافة عند توفرها." },
  { slug: "templates", en: "Templates", ar: "القوالب", noteEn: "Reusable digital starting points, when published.", noteAr: "قوالب رقمية قابلة لإعادة الاستخدام عند نشرها." },
  { slug: "digital-tools", en: "Digital tools", ar: "الأدوات الرقمية", noteEn: "Practical tools for common digital tasks.", noteAr: "أدوات عملية للمهام الرقمية الشائعة." },
] as const;

export default function SitemapLanding({ page, category }: Props) {
  const language = useLanguage();
  const ar = language === "ar";
  const selectedCategory = categories.find((item) => item.slug === category);

  const copy = page === "products"
    ? {
        eyebrow: ar ? "منتجات لاين تك" : "LINETECH PRODUCTS",
        title: ar ? "منتجات رقمية، عندما تكون جاهزة." : "Digital products, when they’re ready.",
        description: ar ? "نعمل على تنظيم كتالوج منتجات لاين تك. لن نعرض منتجات أو أسعارًا أو مزايا قبل اعتمادها ونشرها رسميًا." : "We’re preparing the LINETECH product catalog. Products, prices, and features will only appear after they are confirmed and published.",
        section: ar ? "تصفّح حسب النوع" : "Explore by type",
        body: ar ? "هذه تصنيفات للتنظيم فقط، ولا تعني أن منتجات ضمنها متاحة للبيع حاليًا." : "These are organizational categories, not a claim that products are currently available for sale.",
        action: ar ? "اسألنا عن منتج" : "Ask about a product",
        back: ar ? "تواصل معنا" : "Contact us",
      }
    : page === "knowledge"
    ? {
        eyebrow: ar ? "المعرفة والبحث" : "KNOWLEDGE & RESEARCH",
        title: ar ? "أفكار عملية لبناء أفضل." : "Ideas for building better.",
        description: ar ? "سيضم هذا القسم مقالات وأدلة وأبحاثًا عملية حول التقنية والمنتجات الرقمية. لا توجد مقالات منشورة هنا حتى الآن." : "This section will bring together practical articles, guides, and research on technology and digital products. No articles have been published here yet.",
        section: ar ? "ما الذي سيجده الزائر هنا؟" : "What belongs here?",
        body: ar ? "محتوى واضح ومفيد مبني على الخبرة، دون ادعاء وجود مواد لم تُنشر بعد." : "Clear, useful content grounded in experience—without presenting unpublished material as if it already exists.",
        action: ar ? "اقترح موضوعًا" : "Suggest a topic",
        back: ar ? "تواصل معنا" : "Contact us",
      }
    : {
        eyebrow: ar ? "كتالوج المنتجات" : "PRODUCT CATALOG",
        title: selectedCategory ? (ar ? selectedCategory.ar : selectedCategory.en) : (ar ? "تصنيف المنتجات" : "Product category"),
        description: ar ? "لا توجد منتجات منشورة في هذا التصنيف حتى الآن. سنضيف العناصر هنا بعد اعتماد تفاصيلها." : "There are no published products in this category yet. Items will appear here once their details are approved.",
        section: ar ? "حالة التصنيف" : "Category status",
        body: ar ? "لا نعرض منتجات أو أسعارًا أو مزايا افتراضية. يمكنك التواصل معنا للاستفسار عن احتياجك." : "We don’t show invented products, prices, or features. Contact us to discuss what you need.",
        action: ar ? "تواصل مع لاين تك" : "Contact LINETECH",
        back: ar ? "العودة إلى المنتجات" : "Back to products",
      };

  return (
    <main className="info-page sitemap-landing">
      <section className="sitemap-landing-hero">
        <div className="ref-shell sitemap-landing-hero-grid">
          <div className="sitemap-landing-copy">
            <p className="ref-kicker">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="sitemap-landing-lead">{copy.description}</p>
            <div className="sitemap-landing-actions">
              <Link className="ref-button light" href="/contact">{copy.action} <span>↗</span></Link>
              <Link className="ref-button ghost" href={page === "product-category" ? "/products" : "/"}>{copy.back} <span>→</span></Link>
            </div>
          </div>
          <div className="sitemap-landing-visual" aria-hidden="true">
            <span className="sitemap-visual-index">LINETECH / {page === "knowledge" ? "KNOWLEDGE" : "PRODUCTS"}</span>
            <i className="sitemap-visual-frame sitemap-visual-frame-a" />
            <i className="sitemap-visual-frame sitemap-visual-frame-b" />
            <i className="sitemap-visual-beam" />
            <span className="sitemap-visual-caption">{ar ? "تقنية لهدف واضح" : "TECHNOLOGY WITH PURPOSE"}</span>
          </div>
        </div>
      </section>

      <section className="sitemap-landing-section">
        <div className="ref-shell">
          <div className="sitemap-landing-section-head">
            <div><p className="ref-kicker with-line">{ar ? "نظرة عامة" : "OVERVIEW"}</p><h2>{copy.section}</h2></div>
            <p>{copy.body}</p>
          </div>
          {page === "products" ? (
            <div className="sitemap-category-grid">
              {categories.map((item, index) => (
                <Link className="sitemap-category-card" href={`/products/category/${item.slug}`} key={item.slug}>
                  <span className="sitemap-category-number">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{ar ? item.ar : item.en}</h3><p>{ar ? item.noteAr : item.noteEn}</p></div>
                  <span className="sitemap-category-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="sitemap-empty-state">
              <span className="sitemap-empty-mark" aria-hidden="true">—</span>
              <div><h3>{ar ? "لا يوجد محتوى منشور حاليًا" : "Nothing published here yet"}</h3><p>{ar ? "نحدّث هذا القسم عندما يصبح المحتوى جاهزًا للمشاركة." : "This section will be updated when content is ready to share."}</p></div>
              <span className="sitemap-empty-status">{ar ? "قيد الإعداد" : "IN PREPARATION"}</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
