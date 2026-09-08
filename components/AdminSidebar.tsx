"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { SITE_NAME } from "@/lib/site";

const navigation = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "home",
    exact: true,
  },
  {
    href: "/admin/projects",
    label: "ניהול עבודות",
    icon: "projects",
  },
  {
    href: "/admin/projects/new",
    label: "עבודה חדשה",
    icon: "plus",
  },
  {
    href: "/admin/contacts",
    label: "פניות מלקוחות",
    icon: "contacts",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <>
      {/* ===================================== */}
      {/* MOBILE HEADER */}
      {/* ===================================== */}

      <div
        dir="rtl"
        className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 lg:hidden"
      >
        <Link
          href="/admin"
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
            עא
          </span>

          <div>
            <p className="text-sm font-bold">
              מערכת ניהול
            </p>

            <p className="text-[11px] text-stone-500">
              {SITE_NAME}
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (current) => !current
            )
          }
          aria-label="פתח תפריט ניהול"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300"
        >
          {mobileOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="סגור תפריט"
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <aside
        dir="rtl"
        className={`fixed right-0 top-0 z-50 flex h-screen w-[290px] flex-col border-l border-stone-800 bg-stone-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="border-b border-white/10 px-6 py-7">
          <Link
            href="/admin"
            onClick={() =>
              setMobileOpen(false)
            }
            className="flex items-center gap-4"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-700 text-sm font-bold">
              עא
            </span>

            <div>
              <p className="font-bold">
                {SITE_NAME}
              </p>

              <p className="mt-1 text-xs text-stone-500">
                מערכת ניהול
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-medium text-stone-600">
            ניווט
          </p>

          <div className="space-y-1.5">
            {navigation.map(
              (item) => {
                const active =
                  item.exact
                    ? pathname ===
                      item.href
                    : pathname.startsWith(
                        item.href
                      );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium transition ${
                      active
                        ? "bg-white text-stone-950"
                        : "text-stone-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <AdminIcon
                      name={
                        item.icon
                      }
                    />

                    {item.label}
                  </Link>
                );
              }
            )}
          </div>

          <div className="my-6 border-t border-white/10" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-stone-400 transition hover:bg-white/5 hover:text-white"
          >
            <AdminIcon name="external" />

            צפייה באתר
          </a>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-stone-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <AdminIcon name="logout" />

            {loggingOut
              ? "מתנתק..."
              : "התנתקות"}
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminIcon({
  name,
}: {
  name: string;
}) {
  const common =
    "h-5 w-5 shrink-0";

  if (name === "projects") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className={common}
      >
        <path d="M4 5h16v14H4z" />
        <path d="m4 15 5-5 4 4 2-2 5 5" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className={common}
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (name === "contacts") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className={common}
      >
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (name === "external") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className={common}
      >
        <path d="M14 5h5v5" />
        <path d="m19 5-8 8" />
        <path d="M19 13v6H5V5h6" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className={common}
      >
        <path d="M10 5H5v14h5" />
        <path d="M14 8l4 4-4 4" />
        <path d="M8 12h10" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={common}
    >
      <path d="m4 10 8-6 8 6v9H4z" />
      <path d="M9 19v-6h6v6" />
    </svg>
  );
}