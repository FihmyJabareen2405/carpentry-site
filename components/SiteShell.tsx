"use client";

import { usePathname } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isPrivateArea =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/protected");

  if (isPrivateArea) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />

      {children}

      <SiteFooter />

      <WhatsAppFloatingButton />
    </>
  );
}