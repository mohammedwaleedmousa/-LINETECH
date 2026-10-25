'use client';

import Link from '../IntentLink';
import {Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import {products,aftercarePlans,formatPrice} from '../../lib/catalog';
import { useLanguage } from '../Localized';
import styles from './contact.module.css';

const email = 'aiengineer77@icloud.com';
const phone = '+967773335065';

export default function ContactContent(){return <Suspense fallback={null}><ContactDetails/></Suspense>;}
function ContactDetails() {
  const language=useLanguage(),ar=language==='ar',params=useSearchParams();
  const product=products.find(p=>p.published&&p.slug===params.get('product'));
  const offer=product?.offers.find(o=>o.id===params.get('offer'));
  const care=aftercarePlans.find(p=>p.published&&p.id===params.get('care')&&(!product||product.aftercareIds.includes(p.id)));
  const interest=params.get('interest')==='aftercare';
  const context=product||care||interest?[
    ar?'أرغب في الاستفسار من LINETECH عن:':'I would like to ask LINETECH about:',
    product?.title[language],
    offer?offer.title[language]+' — '+formatPrice(offer.amount,offer.currency,language):'',
    offer?(offer.billing==='monthly'?(ar?'اشتراك شهري':'Monthly subscription'):(ar?'شراء لمرة واحدة':'One-time purchase')):'',
    care?care.title[language]:interest?(ar?'خدمات ما بعد البيع':'After-sales care'):'',
    ar?'يرجى تأكيد السعر والخدمات والترخيص وطريقة الدفع قبل الاتفاق.':'Please confirm price, services, licence and payment arrangements before agreement.',
  ].filter(Boolean).join('\n'):'';
  const channels = [
    { label: ar ? 'واتساب' : 'WhatsApp', detail: phone, href: 'https://wa.me/967773335065'+(context?'?text='+encodeURIComponent(context):''), action: ar ? 'افتح المحادثة' : 'Open WhatsApp', external: true },
    { label: ar ? 'البريد الإلكتروني' : 'Email', detail: email, href: `mailto:${email}`+(context?"?"+new URLSearchParams({subject:ar?"استفسار عن منتجات وخدمات LINETECH":"LINETECH product & care enquiry",body:context}):""), action: ar ? 'اكتب رسالة' : 'Write an email', external: false },
    { label: ar ? 'الاتصال' : 'Phone', detail: phone, href: `tel:${phone}`, action: ar ? 'اتصل بنا' : 'Call us', external: false },
  ];
  return <main className={styles.page} dir={ar ? 'rtl' : 'ltr'}>
    <div className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.kicker}>LINETECH / {ar ? 'تواصل معنا' : 'CONTACT'}</p>
        <h1>{ar ? 'لنبدأ بمحادثة.' : 'Start with a conversation.'}</h1>
        <p>{ar ? 'لديك سؤال أو فكرة مشروع؟ تواصل معنا بالطريقة المناسبة لك، دون إنشاء حساب.' : 'Have a question or a project in mind? Reach us in the way that works for you. No account required.'}</p>
      </header>
      {context&&<section className="storefront-context" aria-label={ar?'تفاصيل الاستفسار':'Enquiry details'}><h2>{ar?'استفسارك جاهز':'Your enquiry is ready'}</h2><p style={{whiteSpace:'pre-line'}}>{context}</p><p>{ar?'اختر واتساب أو البريد لمراجعة الرسالة وإرسالها. لم يُسجل شراء أو يُفعّل اشتراك بعد.':'Choose WhatsApp or email to review and send your message. No purchase or subscription has been activated.'}</p></section>}
      <section className={styles.channels} aria-label={ar ? 'وسائل التواصل' : 'Contact options'}>
        {channels.map((channel, index) => <a className={styles.channel} key={channel.label} href={channel.href} target={channel.external ? '_blank' : undefined} rel={channel.external ? 'noopener noreferrer' : undefined}>
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <h2>{channel.label}</h2>
          <span className={styles.detail} dir="ltr">{channel.detail}</span>
          <span className={styles.action}>{channel.action}<span aria-hidden="true">{channel.external ? '↗' : ar ? '←' : '→'}</span></span>
          {channel.external && <small>{ar ? 'يفتح في نافذة جديدة' : 'Opens in a new tab'}</small>}
        </a>)}
      </section>
      <section className={styles.next}>
        <div><h2>{ar ? 'هل لديك تفاصيل جاهزة؟' : 'Already have a brief?'}</h2><p>{ar ? 'رتّب فكرة مشروعك واختر الخدمة والباقة المناسبة عبر نموذج الطلب.' : 'Organize your idea and choose a service and plan using the project request form.'}</p></div>
        <Link href="/services/request">{ar ? 'ابدأ طلب مشروعك ←' : 'Start your project request →'}</Link>
      </section>
      <p className={styles.existing}>{ar ? 'تتابع مشروعًا قائمًا؟' : 'Following up on an existing project?'} <Link href="/account/projects/messages">{ar ? 'افتح محادثة المشروع بعد تسجيل الدخول' : 'Sign in to open Project Chat'}</Link></p>
    </div>
  </main>;
}
