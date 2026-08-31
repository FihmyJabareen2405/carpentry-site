"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-6">
        {/* צד ימין - שם העסק */}
        <div className="justify-self-start">
          <Link
  href="/"
  className="group flex items-center gap-3"
>
  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-sm font-bold text-white">
    EA
  </span>

  <span className="text-right">
    <span className="block text-lg font-bold leading-tight sm:text-xl">
      {SITE_NAME}
    </span>

    <span className="mt-0.5 hidden text-xs font-normal text-stone-500 sm:block">
      נגרות בהתאמה אישית
    </span>
  </span>
</Link>
        </div>

        {/* מרכז - Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink href="/" pathname={pathname}>
            בית
          </NavLink>

          <NavLink href="/projects" pathname={pathname}>
            עבודות
          </NavLink>

          <NavLink href="/about" pathname={pathname}>
            אודות
          </NavLink>

          <NavLink href="/contact" pathname={pathname}>
            צור קשר
          </NavLink>
        </nav>

        {/* צד שמאל - Desktop CTA */}
        <div className="hidden justify-self-end md:block">
          <Link
            href="/contact"
            className="inline-flex rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            קבלת הצעת מחיר
          </Link>
        </div>

        {/* צד שמאל - Mobile Hamburger */}
        <div className="justify-self-end md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-stone-300 bg-white transition hover:bg-stone-100"
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-stone-200 bg-white md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4 text-right">
            <MobileLink href="/">
              בית
            </MobileLink>

            <MobileLink href="/projects">
              עבודות
            </MobileLink>

            <MobileLink href="/about">
              אודות
            </MobileLink>

            <MobileLink href="/contact">
              צור קשר
            </MobileLink>

            <Link
              href="/contact"
              className="mt-4 flex min-h-11 items-center justify-center rounded-lg bg-stone-900 px-5 py-3 font-medium text-white"
            >
              קבלת הצעת מחיר
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

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
      className={`font-medium transition ${
        active
          ? "text-amber-700"
          : "text-stone-700 hover:text-amber-700"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center justify-start border-b border-stone-100 py-3 text-right font-medium text-stone-800"
    >
      {children}
    </Link>
  );
}