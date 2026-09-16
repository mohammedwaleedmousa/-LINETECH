"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type ComponentProps, type FocusEvent, type PointerEvent } from "react";

type IntentLinkProps = ComponentProps<typeof NextLink>;

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function shouldPrefetch() {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  return connection.effectiveType !== "slow-2g" && connection.effectiveType !== "2g";
}

export default function IntentLink({
  prefetch: requestedPrefetch,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  href,
  ...props
}: IntentLinkProps) {
  const router = useRouter();
  const timerRef = useRef<number | null>(null);
  const hrefString = typeof href === "string" ? href : null;

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const schedulePrefetch = () => {
    if (!hrefString || !shouldPrefetch()) return;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      router.prefetch(hrefString);
      timerRef.current = null;
    }, 35);
  };

  const prefetchNow = () => {
    if (!hrefString || !shouldPrefetch()) return;
    clearTimer();
    router.prefetch(hrefString);
  };

  return (
    <NextLink
      {...props}
      href={href}
      prefetch={requestedPrefetch ?? false}
      onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
        onPointerEnter?.(event);
        schedulePrefetch();
      }}
      onPointerLeave={(event: PointerEvent<HTMLAnchorElement>) => {
        onPointerLeave?.(event);
        clearTimer();
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        onFocus?.(event);
        prefetchNow();
      }}
    />
  );
}
