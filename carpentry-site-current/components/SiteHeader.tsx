"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur-xl"
    >
      <div className="mx-auto grid min-h-[82px] max-w-7xl grid-cols-[1fr_auto] items-center gap-5 px-5 md:grid-cols-[1fr_auto_1fr] md:px-8">

        {/* ===================================== */}
        {/* LOGO - RIGHT */}
        {/* ===================================== */}

        <div className="justify-self-start">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="relative h-14 w-14 shrink-0">
  <Image
  src="/brand/logo.png"
  alt="נגריית עימאד אקרם"
  fill
  priority
  sizes="(max-width: 768px) 180px, 215px"
  className="object-contain"
/>
</div>

            <span className="text-right">
              <span className="block text-lg font-bold leading-tight tracking-tight text-stone-900 sm:text-xl">
                {SITE_NAME}
              </span>

              <span className="mt-1 block text-[11px] tracking-[0.08em] text-stone-500">
                {SITE_TAGLINE}
              </span>
            </span>
          </Link>
        </div>

        {/* ===================================== */}
        {/* DESKTOP NAVIGATION */}
        {/* ===================================== */}

        <nav className="hidden items-center gap-1 rounded-full border border-stone-200 bg-white/80 p-1.5 shadow-sm md:flex">
          <NavLink
            href="/"
            pathname={pathname}
          >
            בית
          </NavLink>

          <NavLink
            href="/projects"
            pathname={pathname}
          >
            עבודות
          </NavLink>

          <NavLink
            href="/visualizer"
            pathname={pathname}
          >
            הדמיית חומרים
          </NavLink>

          <NavLink
            href="/about"
            pathname={pathname}
          >
            אודות
          </NavLink>

          <NavLink
            href="/contact"
            pathname={pathname}
          >
            צור קשר
          </NavLink>
        </nav>

        {/* ===================================== */}
        {/* CTA - LEFT */}
        {/* ===================================== */}

        <div className="hidden justify-self-end md:block">
          <Link
            href="/contact"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-amber-700"
          >
            קבלת הצעת מחיר

            <span
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-1"
            >
              ←
            </span>
          </Link>
        </div>

        {/* ===================================== */}
        {/* MOBILE BUTTON */}
        {/* ===================================== */}

        <div className="justify-self-end md:hidden">
          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              menuOpen
                ? "סגור תפריט"
                : "פתח תפריט"
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 transition hover:bg-stone-100"
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ===================================== */}
      {/* MOBILE MENU */}
      {/* ===================================== */}

      <div
        className={`overflow-hidden border-stone-200 bg-[#faf9f6] transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-[430px] border-t opacity-100"
            : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <nav
          id="mobile-navigation"
          className="mx-auto max-w-7xl px-5 py-5"
        >
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <MobileLink
              href="/"
              pathname={pathname}
            >
              בית
            </MobileLink>

            <MobileLink
              href="/projects"
              pathname={pathname}
            >
              עבודות
            </MobileLink>

            <MobileLink
              href="/visualizer"
              pathname={pathname}
            >
              הדמיית חומרים
            </MobileLink>

            <MobileLink
              href="/about"
              pathname={pathname}
            >
              אודות
            </MobileLink>

            <MobileLink
              href="/contact"
              pathname={pathname}
              border={false}
            >
              צור קשר
            </MobileLink>
          </div>

          <Link
            href="/contact"
            className="mt-4 flex min-h-13 items-center justify-center rounded-full bg-stone-900 px-6 font-medium text-white"
          >
            קבלת הצעת מחיר
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ========================================= */
/* DESKTOP LINK */
/* ========================================= */

function NavLink({
  href,
  pathname,
  children,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const active =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-stone-900 text-white"
          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
      }`}
    >
      {children}
    </Link>
  );
}

/* ========================================= */
/* MOBILE LINK */
/* ========================================= */

function MobileLink({
  href,
  pathname,
  children,
  border = true,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  const active =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex min-h-14 items-center justify-between px-5 font-medium transition ${
        border
          ? "border-b border-stone-100"
          : ""
      } ${
        active
          ? "bg-stone-50 text-amber-700"
          : "text-stone-800"
      }`}
    >
      <span>{children}</span>

      <span
        aria-hidden="true"
        className="text-stone-400"
      >
        ←
      </span>
    </Link>
  );
}