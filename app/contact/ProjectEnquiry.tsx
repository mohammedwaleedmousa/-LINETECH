"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "../Localized";
import { emailLink, enquiryServices, findEnquiryService, whatsappLink } from "./enquiry";
import styles from "./contact.module.css";

export default function ProjectEnquiry({ initialService = "", details = "" }: { initialService?: string; details?: string }) {
  const language = useLanguage();
  const ar = language === "ar";
  const [form, setForm] = useState({ name: "", contact: "", brief: "" });
  const [serviceOverride, setServiceOverride] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const review = useRef<HTMLHeadingElement>(null);
  const service = findEnquiryService(serviceOverride ?? initialService);
  const subject = ar ? "استفسار عن مشروع لدى LINETECH" : "LINETECH project enquiry";

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (prepared) review.current?.focus();
  }, [prepared]);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setPrepared(false);
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrepared(true);
  }

  const draft = [
    subject,
    `${ar ? "الاسم" : "Name"}: ${form.name.trim()}`,
    `${ar ? "وسيلة التواصل" : "Contact"}: ${form.contact.trim()}`,
    service && `${ar ? "الخدمة" : "Service"}: ${service[language]}`,
    details && `${ar ? "تفاصيل الاستفسار" : "Enquiry details"}:\n${details}`,
    `${ar ? "الفكرة" : "Brief"}: ${form.brief.trim()}`,
  ].filter(Boolean).join("\n");

  return (
    <section className={styles.request} id="request" aria-labelledby="request-title">
      <h2 id="request-title">{ar ? "أخبرنا عن فكرتك" : "Tell us about your idea"}</h2>
      <p>{ar ? "ملخص بسيط يكفي لنبدأ. نتفق معك على نطاق العمل والتكلفة والمدة قبل التنفيذ." : "A short brief is enough to begin. We agree on scope, price and timeline before work starts."}</p>
      <form onSubmit={prepare} className={styles.form}>
        <label>
          {ar ? "اسمك *" : "Your name *"}
          <input name="name" autoComplete="name" required maxLength={100} value={form.name} onChange={(event) => update("name", event.target.value)} />
        </label>
        <label>
          {ar ? "رقم الهاتف أو البريد *" : "Phone or email *"}
          <input name="contact" dir="ltr" required maxLength={160} value={form.contact} onChange={(event) => update("contact", event.target.value)} />
        </label>
        <label className={styles.full}>
          {ar ? "الخدمة المطلوبة" : "Service"}
          <select name="service" value={service?.id ?? ""} onChange={(event) => {
            setServiceOverride(event.target.value);
            setPrepared(false);
          }}>
            <option value="">{ar ? "أحتاج مساعدتكم في الاختيار" : "Help me choose"}</option>
            {enquiryServices.map((option) => <option key={option.id} value={option.id}>{option[language]}</option>)}
          </select>
        </label>
        <label className={styles.full}>
          {ar ? "اشرح فكرتك باختصار *" : "A short project brief *"}
          <textarea name="brief" required rows={4} maxLength={3000} value={form.brief} onChange={(event) => update("brief", event.target.value)} />
        </label>
        <p className={styles.full} id="enquiry-instructions">
          {ar ? "جهّز رسالتك، ثم راجعها وأرسلها عبر واتساب أو البريد الإلكتروني." : "Prepare your message, then review and send it using WhatsApp or email."}
        </p>
        <div className={styles.full}>
          <button className="platform-button primary" type="submit" aria-describedby="enquiry-instructions"
            disabled={!ready || !form.name.trim() || !form.contact.trim() || !form.brief.trim()}>
            {ar ? "جهّز رسالة الطلب" : "Prepare enquiry"}
          </button>
        </div>
      </form>
      {prepared && (
        <div className={styles.prepared} role="status">
          <h3 ref={review} tabIndex={-1}>{ar ? "الرسالة جاهزة للمراجعة" : "Your message is ready to review"}</h3>
          <p style={{ whiteSpace: "pre-line" }}>{draft}</p>
          <div className="platform-hero-actions">
            <a className="platform-button primary" href={whatsappLink(draft)} target="_blank" rel="noopener noreferrer">
              {ar ? "افتح واتساب للمراجعة" : "Review in WhatsApp"}
            </a>
            <a className="platform-button secondary" href={emailLink(subject, draft)}>
              {ar ? "افتح البريد للمراجعة" : "Review in email"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
