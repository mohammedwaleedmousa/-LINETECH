"use client";

import Link from "next/link";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setLanguage, useLanguage } from "./Localized";

type Notification = {
  id: string;
  title: string;
  body?: string | null;
  destination?: string | null;
  read_at?: string | null;
  created_at: string;
};

const nav = [
  { href: "/workspace", en: "Workspace", ar: "مساحة العمل", index: "01" },
  { href: "/chat", en: "Project Chat", ar: "محادثة المشروع", index: "02" },
  { href: "/handover", en: "Handover", ar: "التسليم", index: "03" },
  { href: "/account", en: "Account", ar: "الحساب", index: "04" },
] as const;

function safeDestination(value?: string | null) {
  const raw = String(value || "/workspace").trim();
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/workspace";
  try {
    const parsed = new URL(raw, window.location.origin);
    if (parsed.origin !== window.location.origin) return "/workspace";
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return "/workspace";
  }
}

function formatTime(value: string, language: "ar" | "en") {
  try {
    return new Intl.DateTimeFormat(language === "ar" ? "ar-YE" : "en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default function ClientPortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const language = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unread = useMemo(() => notifications.filter(item => !item.read_at).length, [notifications]);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      if (!response.ok) return;
      const payload = await response.json().catch(() => null) as { ok?: boolean; notifications?: Notification[] } | null;
      if (payload?.ok && Array.isArray(payload.notifications)) setNotifications(payload.notifications);
    } catch {
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const timer = window.setInterval(() => void loadNotifications(), 15000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void loadNotifications();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (!notificationsOpen) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && notificationRef.current && !notificationRef.current.contains(target)) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [notificationsOpen]);

  async function openNotification(item: Notification) {
    setNotificationsOpen(false);
    if (!item.read_at) {
      const readAt = new Date().toISOString();
      setNotifications(current => current.map(notification => notification.id === item.id ? { ...notification, read_at: readAt } : notification));
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: item.id }),
      }).catch(() => null);
    }
    router.push(safeDestination(item.destination));
  }

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/login");
    }
  }

  function toggleLanguage() {
    setLanguage(language === "ar" ? "en" : "ar");
  }

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="client-portal-shell">
      <aside className="client-portal-sidebar">
        <Link className="client-portal-brand" href="/workspace">
          <span className="client-portal-mark"><i/><b/></span>
          <span><strong>LINETECH</strong><small>{language === "ar" ? "بوابة العميل" : "CLIENT PORTAL"}</small></span>
        </Link>

        <nav className="client-portal-nav" aria-label={language === "ar" ? "تنقل العميل" : "Client navigation"}>
          {nav.map(item => (
            <Link key={item.href} href={item.href} className={active(item.href) ? "is-active" : ""}>
              <span>{item.index}</span>
              <strong>{language === "ar" ? item.ar : item.en}</strong>
              <b>→</b>
            </Link>
          ))}
        </nav>

        <div className="client-portal-sidebar-foot">
          <button type="button" onClick={toggleLanguage}>{language === "ar" ? "English" : "العربية"} <span>↗</span></button>
          <Link href="/">{language === "ar" ? "فتح الموقع" : "Open website"} <span>↗</span></Link>
          <button type="button" onClick={() => void signOut()}>{language === "ar" ? "تسجيل الخروج" : "Sign out"} <span>↗</span></button>
        </div>
      </aside>

      <div className="client-portal-main">
        <header className="client-portal-topbar">
          <div>
            <span>{language === "ar" ? "بوابة العميل" : "CLIENT PORTAL"}</span>
            <strong>{nav.find(item => active(item.href)) ? (language === "ar" ? nav.find(item => active(item.href))!.ar : nav.find(item => active(item.href))!.en) : "LINETECH"}</strong>
          </div>

          <div className="client-portal-notifications" ref={notificationRef}>
            <button
              type="button"
              className="client-portal-bell"
              aria-label={language === "ar" ? "الإشعارات" : "Notifications"}
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen(value => !value)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>
              {unread > 0 && <span>{unread > 9 ? "9+" : unread}</span>}
            </button>

            {notificationsOpen && (
              <div className="client-portal-notification-panel">
                <div className="client-portal-notification-head">
                  <strong>{language === "ar" ? "الإشعارات" : "Notifications"}</strong>
                  <span>{unread ? `${unread} ${language === "ar" ? "غير مقروء" : "unread"}` : "—"}</span>
                </div>
                <div className="client-portal-notification-list">
                  {notifications.slice(0, 10).map(item => (
                    <button key={item.id} type="button" className={item.read_at ? "" : "is-unread"} onClick={() => void openNotification(item)}>
                      <i/>
                      <span>
                        <strong>{item.title}</strong>
                        {item.body && <p>{item.body}</p>}
                        <small>{formatTime(item.created_at, language)} · {language === "ar" ? "فتح" : "Open"} →</small>
                      </span>
                    </button>
                  ))}
                  {!notifications.length && <p className="client-portal-notification-empty">{language === "ar" ? "لا توجد إشعارات." : "No notifications yet."}</p>}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="client-portal-content">{children}</div>
      </div>
    </div>
  );
}
