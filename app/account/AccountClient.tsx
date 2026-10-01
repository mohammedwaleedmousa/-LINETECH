"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLanguage } from "../Localized";

type AccountData = {
  id: string;
  email: string;
  emailConfirmedAt?: string | null;
  createdAt?: string | null;
  lastSignInAt?: string | null;
  role?: string;
  subscription?: {
    planCode: string;
    status: string;
    billingCycle: string;
    setupFeeUsd?: string | number | null;
    recurringPriceUsd?: string | number | null;
    startsAt?: string | null;
    nextBillingAt?: string | null;
    plan?: Record<string, any> | null;
  } | null;
  profile: {
    fullName: string;
    company: string;
    phone: string;
    updatedAt?: string | null;
  };
};

const copy = {
  en: {
    kicker: "CLIENT ACCOUNT",
    title: "Your LINETECH account.",
    lead: "Keep your contact details current and control the credentials and sessions that protect your project workspace.",
    workspace: "Open Workspace",
    chat: "Open Project Chat",
    subscriptionLabel: "SUBSCRIPTION",
    subscriptionTitle: "Your current LINETECH plan.",
    noSubscription: "No active commercial subscription yet.",
    noSubscriptionBody: "Your requested package remains part of the project brief until LINETECH activates the commercial subscription.",
    plan: "Plan",
    subscriptionStatus: "Status",
    monthlyPrice: "Monthly",
    nextBilling: "Next billing",
    planLimits: "Plan limits",
    pages: "Pages",
    storage: "Storage",
    updates: "Updates / month",
    products: "Products",
    team: "Team members",
    languages: "Languages",
    unlimited: "Custom",
    profileLabel: "PROFILE",
    profileTitle: "Your client details.",
    fullName: "Full name",
    company: "Company / Brand",
    phone: "Phone",
    optional: "Optional",
    saveProfile: "Save profile",
    saving: "Saving…",
    profileSaved: "Profile updated.",
    emailLabel: "EMAIL",
    emailTitle: "Your sign-in address.",
    currentEmail: "Current email",
    confirmed: "Confirmed",
    unconfirmed: "Confirmation pending",
    newEmail: "New email address",
    updateEmail: "Update email",
    updating: "Updating…",
    emailSame: "This is already your current email.",
    emailSent: "Email change requested. Check your inbox if confirmation is required.",
    passwordLabel: "SECURITY",
    passwordTitle: "Change your password.",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    passwordHint: "Use at least 8 characters.",
    updatePassword: "Update password",
    passwordUpdated: "Password updated. Other sessions were signed out.",
    passwordMismatch: "The passwords do not match.",
    sessionsLabel: "SESSIONS",
    sessionsTitle: "Control signed-in devices.",
    currentSession: "Current browser",
    active: "Active now",
    lastSignIn: "Last sign-in",
    accountCreated: "Account created",
    otherSessions: "Other sessions",
    otherSessionsBody: "Sign out other browsers and devices while keeping this browser signed in.",
    signOutOthers: "Sign out other sessions",
    sessionsCleared: "Other sessions were signed out.",
    signOutCurrent: "Sign out this device",
    accountLabel: "ACCOUNT",
    accountTitle: "Account reference.",
    accountId: "Account ID",
    role: "Access",
    clientRole: "Client",
    adminRole: "Administrator",
    retry: "Try again",
    loadError: "We couldn’t load your account settings.",
    invalid: "Review the information and try again.",
    rateLimited: "Too many attempts. Wait one minute and try again.",
    requestFailed: "The change could not be completed. Try again.",
  },
  ar: {
    kicker: "حساب العميل",
    title: "حسابك في لاين تك.",
    lead: "حدّث بيانات التواصل وتحكم بكلمة المرور والجلسات التي تحمي مساحة مشروعك.",
    workspace: "افتح مساحة العميل",
    chat: "افتح محادثة المشروع",
    subscriptionLabel: "الاشتراك",
    subscriptionTitle: "باقتك الحالية في لاين تك.",
    noSubscription: "لا يوجد اشتراك تجاري مفعّل حتى الآن.",
    noSubscriptionBody: "تبقى الباقة التي طلبتها ضمن تفاصيل المشروع إلى أن تعتمد لاين تك الاشتراك التجاري.",
    plan: "الباقة",
    subscriptionStatus: "الحالة",
    monthlyPrice: "شهريًا",
    nextBilling: "التجديد القادم",
    planLimits: "حدود الباقة",
    pages: "الصفحات",
    storage: "التخزين",
    updates: "التعديلات / شهر",
    products: "المنتجات",
    team: "أعضاء الفريق",
    languages: "اللغات",
    unlimited: "مخصص",
    profileLabel: "الملف الشخصي",
    profileTitle: "بيانات العميل.",
    fullName: "الاسم الكامل",
    company: "الشركة / العلامة",
    phone: "رقم الهاتف",
    optional: "اختياري",
    saveProfile: "حفظ البيانات",
    saving: "جارٍ الحفظ…",
    profileSaved: "تم تحديث بياناتك.",
    emailLabel: "البريد الإلكتروني",
    emailTitle: "عنوان تسجيل الدخول.",
    currentEmail: "البريد الحالي",
    confirmed: "مؤكد",
    unconfirmed: "بانتظار التأكيد",
    newEmail: "البريد الإلكتروني الجديد",
    updateEmail: "تحديث البريد",
    updating: "جارٍ التحديث…",
    emailSame: "هذا هو بريدك الحالي بالفعل.",
    emailSent: "تم طلب تغيير البريد. تحقق من بريدك إذا كان التأكيد مطلوبًا.",
    passwordLabel: "الأمان",
    passwordTitle: "تغيير كلمة المرور.",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    passwordHint: "استخدم 8 أحرف على الأقل.",
    updatePassword: "تحديث كلمة المرور",
    passwordUpdated: "تم تحديث كلمة المرور وتسجيل خروج الجلسات الأخرى.",
    passwordMismatch: "كلمتا المرور غير متطابقتين.",
    sessionsLabel: "الجلسات",
    sessionsTitle: "تحكم بالأجهزة المسجل دخولها.",
    currentSession: "هذا المتصفح",
    active: "نشط الآن",
    lastSignIn: "آخر تسجيل دخول",
    accountCreated: "إنشاء الحساب",
    otherSessions: "الجلسات الأخرى",
    otherSessionsBody: "سجّل خروج المتصفحات والأجهزة الأخرى مع إبقاء هذا المتصفح مسجلًا.",
    signOutOthers: "تسجيل خروج الجلسات الأخرى",
    sessionsCleared: "تم تسجيل خروج الجلسات الأخرى.",
    signOutCurrent: "تسجيل خروج هذا الجهاز",
    accountLabel: "الحساب",
    accountTitle: "مرجع الحساب.",
    accountId: "معرّف الحساب",
    role: "الصلاحية",
    clientRole: "عميل",
    adminRole: "مدير",
    retry: "إعادة المحاولة",
    loadError: "تعذر تحميل إعدادات الحساب.",
    invalid: "راجع البيانات ثم حاول مرة أخرى.",
    rateLimited: "محاولات كثيرة جدًا. انتظر دقيقة ثم حاول مرة أخرى.",
    requestFailed: "تعذر إكمال التغيير. حاول مرة أخرى.",
  },
} as const;

function formatDate(value: string | null | undefined, language: "ar" | "en") {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(language === "ar" ? "ar-YE" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export default function AccountClient() {
  const language = useLanguage();
  const t = copy[language];
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [sessionsBusy, setSessionsBusy] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");
  const [emailNotice, setEmailNotice] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");
  const [sessionNotice, setSessionNotice] = useState("");

  async function loadAccount() {
    setLoadError(false);
    try {
      const response = await fetch("/api/account", { cache: "no-store" });
      if (response.status === 401) {
        window.location.assign("/login?next=/account");
        return;
      }
      const payload = await response.json().catch(() => null) as { ok?: boolean; account?: AccountData } | null;
      if (!response.ok || !payload?.ok || !payload.account) throw new Error();
      setAccount(payload.account);
    } catch {
      setLoadError(true);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    void loadAccount();
  }, []);

  const roleLabel = useMemo(
    () => account?.role === "admin" ? t.adminRole : t.clientRole,
    [account?.role, t.adminRole, t.clientRole],
  );

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") || "").trim();
    const company = String(form.get("company") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    if (!fullName) {
      setProfileNotice(t.invalid);
      return;
    }

    setProfileBusy(true);
    setProfileNotice("");
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, company, phone }),
      });
      const payload = await response.json().catch(() => null) as {
        ok?: boolean;
        profile?: AccountData["profile"];
      } | null;
      if (response.status === 429) throw new Error("rate");
      if (!response.ok || !payload?.ok || !payload.profile) throw new Error("request");
      setAccount(current => current ? { ...current, profile: payload.profile! } : current);
      setProfileNotice(t.profileSaved);
    } catch (error) {
      setProfileNotice(error instanceof Error && error.message === "rate" ? t.rateLimited : t.requestFailed);
    } finally {
      setProfileBusy(false);
    }
  }

  async function updateEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    if (!email) {
      setEmailNotice(t.invalid);
      return;
    }

    setEmailBusy(true);
    setEmailNotice("");
    try {
      const response = await fetch("/api/account/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => null) as {
        ok?: boolean;
        unchanged?: boolean;
        email?: string;
        pendingEmail?: string;
        needsConfirmation?: boolean;
      } | null;
      if (response.status === 429) throw new Error("rate");
      if (!response.ok || !payload?.ok) throw new Error("request");
      if (payload.unchanged) {
        setEmailNotice(t.emailSame);
      } else {
        setEmailNotice(t.emailSent);
      }
    } catch (error) {
      setEmailNotice(error instanceof Error && error.message === "rate" ? t.rateLimited : t.requestFailed);
    } finally {
      setEmailBusy(false);
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    if (password.length < 8) {
      setPasswordNotice(t.passwordHint);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordNotice(t.passwordMismatch);
      return;
    }

    setPasswordBusy(true);
    setPasswordNotice("");
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.status === 429) throw new Error("rate");
      if (!response.ok) throw new Error("request");
      event.currentTarget.reset();
      setPasswordNotice(t.passwordUpdated);
    } catch (error) {
      setPasswordNotice(error instanceof Error && error.message === "rate" ? t.rateLimited : t.requestFailed);
    } finally {
      setPasswordBusy(false);
    }
  }

  async function signOutOthers() {
    setSessionsBusy(true);
    setSessionNotice("");
    try {
      const response = await fetch("/api/auth/logout-others", { method: "POST" });
      if (response.status === 429) throw new Error("rate");
      if (!response.ok) throw new Error("request");
      setSessionNotice(t.sessionsCleared);
    } catch (error) {
      setSessionNotice(error instanceof Error && error.message === "rate" ? t.rateLimited : t.requestFailed);
    } finally {
      setSessionsBusy(false);
    }
  }

  async function signOutCurrent() {
    setSessionsBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/");
    }
  }

  if (!loaded) {
    return <main className="account-page"><div className="account-loading" /></main>;
  }

  if (loadError || !account) {
    return (
      <main className="account-page">
        <section className="account-shell account-error">
          <span>!</span>
          <h1>{t.loadError}</h1>
          <button type="button" onClick={() => void loadAccount()}>{t.retry}</button>
        </section>
      </main>
    );
  }

  return (
    <main className="account-page">
      <section className="account-hero">
        <div className="account-shell account-hero-grid">
          <div>
            <span className="account-kicker">{t.kicker}</span>
            <h1>{t.title}</h1>
          </div>
          <div className="account-hero-side">
            <p>{t.lead}</p>
            <div>
              <Link href="/workspace">{t.workspace} →</Link>
              <Link href="/chat">{t.chat} →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="account-content">
        <div className="account-shell account-grid">

          <section className="account-card account-subscription">
            <div className="account-card-head">
              <span>{t.subscriptionLabel}</span>
              <h2>{t.subscriptionTitle}</h2>
            </div>
            {account.subscription ? (
              <>
                <div className="account-subscription-summary">
                  <div><span>{t.plan}</span><strong>{account.subscription.plan?.name || account.subscription.planCode.replaceAll("_", " ").toUpperCase()}</strong></div>
                  <div><span>{t.subscriptionStatus}</span><strong className={`subscription-status is-${account.subscription.status}`}>{account.subscription.status.replaceAll("_", " ")}</strong></div>
                  <div><span>{t.monthlyPrice}</span><strong>${account.subscription.recurringPriceUsd ?? "—"}</strong></div>
                  <div><span>{t.nextBilling}</span><strong>{formatDate(account.subscription.nextBillingAt, language)}</strong></div>
                </div>
                <div className="account-plan-limits">
                  <span>{t.planLimits}</span>
                  <div>
                    <p><b>{account.subscription.plan?.max_pages ?? t.unlimited}</b><small>{t.pages}</small></p>
                    <p><b>{account.subscription.plan?.max_storage_gb != null ? `${account.subscription.plan.max_storage_gb} GB` : t.unlimited}</b><small>{t.storage}</small></p>
                    <p><b>{account.subscription.plan?.max_monthly_updates ?? t.unlimited}</b><small>{t.updates}</small></p>
                    <p><b>{account.subscription.plan?.max_products ?? t.unlimited}</b><small>{t.products}</small></p>
                    <p><b>{account.subscription.plan?.max_team_members ?? t.unlimited}</b><small>{t.team}</small></p>
                    <p><b>{Array.isArray(account.subscription.plan?.languages) ? account.subscription.plan.languages.join(" · ") : t.unlimited}</b><small>{t.languages}</small></p>
                  </div>
                </div>
              </>
            ) : (
              <div className="account-no-subscription">
                <strong>{t.noSubscription}</strong>
                <p>{t.noSubscriptionBody}</p>
              </div>
            )}
          </section>

          <section className="account-card">
            <div className="account-card-head">
              <span>{t.profileLabel}</span>
              <h2>{t.profileTitle}</h2>
            </div>
            <form onSubmit={saveProfile}>
              <label>
                <span>{t.fullName}</span>
                <input name="fullName" type="text" maxLength={120} defaultValue={account.profile.fullName} autoComplete="name" required />
              </label>
              <label>
                <span>{t.company}</span>
                <input name="company" type="text" maxLength={160} defaultValue={account.profile.company} autoComplete="organization" placeholder={t.optional} />
              </label>
              <label>
                <span>{t.phone}</span>
                <input name="phone" type="tel" maxLength={50} defaultValue={account.profile.phone} autoComplete="tel" placeholder={t.optional} />
              </label>
              {profileNotice && <p className="account-notice" role="status">{profileNotice}</p>}
              <button className="account-primary" type="submit" disabled={profileBusy}>{profileBusy ? t.saving : t.saveProfile}</button>
            </form>
          </section>

          <section className="account-card">
            <div className="account-card-head">
              <span>{t.emailLabel}</span>
              <h2>{t.emailTitle}</h2>
            </div>
            <div className="account-current-email">
              <span>{t.currentEmail}</span>
              <strong data-no-translate>{account.email}</strong>
              <b className={account.emailConfirmedAt ? "is-confirmed" : ""}>{account.emailConfirmedAt ? t.confirmed : t.unconfirmed}</b>
            </div>
            <form onSubmit={updateEmail}>
              <label>
                <span>{t.newEmail}</span>
                <input name="email" type="email" maxLength={320} autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder={account.email} required />
              </label>
              {emailNotice && <p className="account-notice" role="status">{emailNotice}</p>}
              <button className="account-secondary" type="submit" disabled={emailBusy}>{emailBusy ? t.updating : t.updateEmail}</button>
            </form>
          </section>

          <section className="account-card">
            <div className="account-card-head">
              <span>{t.passwordLabel}</span>
              <h2>{t.passwordTitle}</h2>
            </div>
            <form onSubmit={updatePassword}>
              <label>
                <span>{t.newPassword}</span>
                <input name="password" type="password" minLength={8} maxLength={1024} autoComplete="new-password" required />
              </label>
              <label>
                <span>{t.confirmPassword}</span>
                <input name="confirmPassword" type="password" minLength={8} maxLength={1024} autoComplete="new-password" required />
              </label>
              <small className="account-hint">{t.passwordHint}</small>
              {passwordNotice && <p className="account-notice" role="status">{passwordNotice}</p>}
              <button className="account-secondary" type="submit" disabled={passwordBusy}>{passwordBusy ? t.updating : t.updatePassword}</button>
            </form>
          </section>

          <section className="account-card">
            <div className="account-card-head">
              <span>{t.sessionsLabel}</span>
              <h2>{t.sessionsTitle}</h2>
            </div>
            <div className="account-session-row">
              <div>
                <span>{t.currentSession}</span>
                <strong>{t.active}</strong>
              </div>
              <div>
                <span>{t.lastSignIn}</span>
                <strong>{formatDate(account.lastSignInAt, language)}</strong>
              </div>
            </div>
            <div className="account-session-other">
              <strong>{t.otherSessions}</strong>
              <p>{t.otherSessionsBody}</p>
              {sessionNotice && <p className="account-notice" role="status">{sessionNotice}</p>}
              <div className="account-session-actions">
                <button type="button" onClick={() => void signOutOthers()} disabled={sessionsBusy}>{t.signOutOthers}</button>
                <button type="button" className="is-danger" onClick={() => void signOutCurrent()} disabled={sessionsBusy}>{t.signOutCurrent}</button>
              </div>
            </div>
          </section>

          <section className="account-card account-reference">
            <div className="account-card-head">
              <span>{t.accountLabel}</span>
              <h2>{t.accountTitle}</h2>
            </div>
            <dl>
              <div><dt>{t.accountId}</dt><dd data-no-translate>{account.id}</dd></div>
              <div><dt>{t.role}</dt><dd>{roleLabel}</dd></div>
              <div><dt>{t.accountCreated}</dt><dd>{formatDate(account.createdAt, language)}</dd></div>
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
}
