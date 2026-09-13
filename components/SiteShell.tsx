"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import IntroVideo from "@/components/IntroVideo";
import PageTransition from "@/components/PageTransition";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showVisualizerMobileHeader, setShowVisualizerMobileHeader] = useState(true);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);

  const isPrivateArea =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/protected");

  useEffect(() => {
    setIsTransitioning(false);

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    if (isPrivateArea) return;

    function handleDocumentClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (url.origin !== window.location.origin) return;

      const current =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      const next = url.pathname + url.search + url.hash;

      if (next === current) return;

      const samePageHashNavigation =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        Boolean(url.hash);

      if (samePageHashNavigation) return;

      event.preventDefault();

      if (isTransitioning) return;

      setIsTransitioning(true);

      transitionTimerRef.current = window.setTimeout(() => {
        router.push(next);
      }, 560);
    }

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, [isPrivateArea, isTransitioning, router]);

  const isVisualizer = pathname.startsWith("/visualizer");

  useEffect(() => {
    if (!isVisualizer) {
      setShowVisualizerMobileHeader(true);
      return;
    }

    const updateHeaderVisibility = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      if (!isMobile) {
        setShowVisualizerMobileHeader(true);
        return;
      }

      // On the Visualizer mobile page the site header is visible only
      // when the user is back at the very top of the page.
      setShowVisualizerMobileHeader(window.scrollY <= 4);
    };

    updateHeaderVisibility();

    window.addEventListener("scroll", updateHeaderVisibility, {
      passive: true,
    });
    window.addEventListener("resize", updateHeaderVisibility);

    return () => {
      window.removeEventListener("scroll", updateHeaderVisibility);
      window.removeEventListener("resize", updateHeaderVisibility);
    };
  }, [isVisualizer]);

  if (isPrivateArea) {
    return <>{children}</>;
  }

  return (
    <>
      <IntroVideo />
      <PageTransition active={isTransitioning} />

      {(!isVisualizer || showVisualizerMobileHeader) && <SiteHeader />}

      {children}

      <SiteFooter />

      <WhatsAppFloatingButton />
    </>
  );
}
