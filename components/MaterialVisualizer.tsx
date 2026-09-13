"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import IntroVideo from "@/components/IntroVideo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showVisualizerMobileHeader, setShowVisualizerMobileHeader] =
    useState(true);

  const isPrivateArea =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/protected");

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

      {(!isVisualizer || showVisualizerMobileHeader) && <SiteHeader />}

      {children}

      <SiteFooter />

      <WhatsAppFloatingButton />
    </>
  );
}
