"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../Localized";
import { PlatformEmpty, PlatformHero, PlatformIcon } from "../PlatformUI";

export default function KnowledgeHub() {
  const ar = useLanguage() === "ar";
  const [kind, setKind] = useState("");
  const [access, setAccess] = useState("");
  const [query, setQuery] = useState("");
  const filtering = Boolean(kind || access || query.trim());
  return <main className="platform-page">
    <PlatformHero eyebrow={ar ? "المعرفة والأبحاث" : "KNOWLEDGE & RESEARCH"} title={ar ? "فهم أعمق.\nأفكار أبعد." : "Deeper understanding.\nFurther possibilities."} description={ar ? "مساحة تجمع المقالات والأبحاث والأدلة العملية، لتتحول المعرفة إلى قرارات أفضل ومنتجات أقوى." : "Articles, research and practical guides that turn knowledge into better decisions and stronger products."} icon="book">
      <a className="platform-button primary" href="#knowledge-content">{ar ? "استكشف المحتوى" : "Explore the library"}<PlatformIcon kind="arrow"/></a>
    </PlatformHero>
    <section className="platform-section" id="knowledge-content" aria-labelledby="knowledge-title">
      <div className="platform-section-heading"><div><p className="platform-eyebrow">{ar ? "تعلّم. اكتشف. ابنِ." : "LEARN. EXPLORE. BUILD."}</p><h2 id="knowledge-title">{ar ? "المكتبة المعرفية" : "The knowledge library"}</h2></div><span className="platform-count">{ar ? "مقالات · أبحاث · أدلة" : "Articles · Research · Guides"}</span></div>
      <form className="platform-filters" onSubmit={e => e.preventDefault()}>
        <label className="platform-search-label"><span>{ar ? "ابحث في المكتبة" : "Search the library"}</span><div className="platform-input-wrap"><PlatformIcon kind="search"/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ar ? "ما الذي تريد أن تتعلّمه؟" : "What would you like to learn?"}/></div></label>
        <label><span>{ar ? "نوع المحتوى" : "Content type"}</span><select value={kind} onChange={e => setKind(e.target.value)}><option value="">{ar ? "جميع الأنواع" : "All types"}</option><option value="article">{ar ? "مقالات" : "Articles"}</option><option value="research">{ar ? "أبحاث" : "Research"}</option></select></label>
        <label><span>{ar ? "الوصول" : "Access"}</span><select value={access} onChange={e => setAccess(e.target.value)}><option value="">{ar ? "جميع المحتويات" : "All content"}</option><option value="free">{ar ? "مجاني" : "Free"}</option><option value="subscription">{ar ? "ضمن الاشتراك" : "Subscription"}</option></select></label>
      </form>
      <PlatformEmpty icon={filtering ? "search" : "book"} title={filtering ? ar ? "لا يوجد محتوى مطابق." : "No matching content." : ar ? "كل معرفة تبدأ بسؤال." : "Knowledge starts with a question."} body={filtering ? ar ? "جرّب تغيير البحث أو الفلاتر." : "Try adjusting your search or filters." : ar ? "نحضّر أولى المقالات والأبحاث. لديك موضوع ترغب في قراءته؟ يسعدنا سماع اقتراحك." : "Our first articles and research are in preparation. Have a topic you would like to explore? We would love to hear it."}>
        {filtering ? <button type="button" className="platform-button secondary" onClick={() => {setKind("");setAccess("");setQuery("");}}>{ar ? "مسح الفلاتر" : "Clear filters"}</button> : <Link className="platform-button secondary" href="/contact">{ar ? "اقترح موضوعًا" : "Suggest a topic"}<PlatformIcon kind="arrow"/></Link>}
      </PlatformEmpty>
    </section>
  </main>;
}
