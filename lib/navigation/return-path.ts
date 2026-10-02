/** Map Next static-export transport URLs back to document routes. */
export function documentPath(pathname: string): string {
  return pathname.replace(/\/index\.(?:txt|html)$/, "").replace(/\/+$/, "") || "/";
}

export function safeReturnPath(value: unknown, fallback = "/workspace"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://linetech.local");
    if (url.origin !== "https://linetech.local") return fallback;
    const path = documentPath(url.pathname);
    if (/^\/(?:api|_next)(?:\/|$)/.test(path) || /\.[^/]+$/.test(path) || path === "/login" || path === "/admin/login") return fallback;
    url.searchParams.delete("_rsc");
    return path + url.search + url.hash;
  } catch {
    return fallback;
  }
}

export function isProtectedPath(pathname: string): boolean {
  return /^\/(?:admin|workspace|chat|handover|account)(?:\/|$)/.test(documentPath(pathname));
}
