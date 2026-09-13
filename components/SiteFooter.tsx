import Image from "next/image";
import Link from "next/link";

import {
  SITE_EMAIL,
  SITE_FACEBOOK_URL,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_TAGLINE,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site";

import { createWhatsAppUrl } from "@/lib/whatsapp";

export default function SiteFooter() {
  const whatsappUrl =
    SITE_WHATSAPP_NUMBER
      ? createWhatsAppUrl(
          SITE_WHATSAPP_NUMBER,
          `שלום, הגעתי דרך האתר של ${SITE_NAME} ואני מעוניין לקבל מידע על עבודת נגרות.`
        )
      : null;

  return (
    <footer
      dir="rtl"
      className="bg-[#faf9f6] px-3 pb-3 pt-3 sm:px-5 sm:pb-5 lg:px-7"
    >
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[1.6rem] bg-stone-950 text-white sm:rounded-[1.9rem]">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 sm:py-8">
          <div className="grid gap-7 lg:grid-cols-[1.05fr_1.1fr_.95fr] lg:items-center lg:gap-10">
            {/* Brand */}
            <div className="min-w-0">
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                  <Image
                    src="/brand/logo.png"
                    alt={SITE_NAME}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>

                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold sm:text-lg">
                    {SITE_NAME}
                  </span>

                  <span className="mt-0.5 block text-xs text-stone-500">
                    {SITE_TAGLINE}
                  </span>
                </span>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-6 text-stone-400">
                תכנון, ייצור והתקנה של נגרות בהתאמה אישית לבית ולעסק.
              </p>
            </div>

            {/* Navigation */}
            <nav
              aria-label="ניווט תחתון"
              className="flex flex-wrap gap-x-5 gap-y-2.5 border-y border-white/10 py-4 lg:justify-center lg:border-y-0 lg:py-0"
            >
              <FooterLink href="/">בית</FooterLink>
              <FooterLink href="/projects">עבודות</FooterLink>
              <FooterLink href="/visualizer">הדמיית חומרים</FooterLink>
              <FooterLink href="/about">אודות</FooterLink>
              <FooterLink href="/contact">צור קשר</FooterLink>
            </nav>

            {/* Contact */}
            <div className="lg:justify-self-end">
              <div className="flex flex-wrap items-center gap-2">
                {SITE_PHONE_DISPLAY && (
                  <a
                    href={SITE_PHONE_HREF || undefined}
                    dir="ltr"
                    className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/[0.05] px-3.5 text-xs font-medium text-stone-200 transition hover:bg-white/10 hover:text-white"
                  >
                    {SITE_PHONE_DISPLAY}
                  </a>
                )}

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-green-400 transition hover:bg-white/10 hover:text-green-300"
                  >
                    <WhatsAppIcon />
                  </a>
                )}

                {SITE_FACEBOOK_URL && (
                  <a
                    href={SITE_FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-blue-400 transition hover:bg-white/10 hover:text-blue-300"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>

              {SITE_EMAIL && (
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  dir="ltr"
                  className="mt-3 block w-fit max-w-full truncate text-xs text-stone-500 transition hover:text-stone-300"
                >
                  {SITE_EMAIL}
                </a>
              )}

              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-medium text-stone-950 transition hover:bg-[#d7b58c]"
              >
                קבלת הצעת מחיר
                <span className="mr-2" aria-hidden="true">
                  ←
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-5 py-3.5 text-[11px] text-stone-600 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p>© 2026 {SITE_NAME}. כל הזכויות שמורות.</p>
            <p>{SITE_TAGLINE}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-stone-400 transition hover:text-white"
    >
      {children}
    </Link>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4.5 w-4.5"
      fill="currentColor"
    >
      <path d="M13.5 22v-9h3l.45-3.5H13.5V7.27c0-1.01.28-1.7 1.73-1.7H17V2.44A23.8 23.8 0 0 0 14.41 2C11.84 2 10.08 3.57 10.08 6.45V9.5H7v3.5h3.08v9h3.42Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-4.5 w-4.5"
      fill="currentColor"
    >
      <path d="M16 3C8.82 3 3 8.61 3 15.54c0 2.44.74 4.72 2.02 6.65L3 29l7.05-1.94A13.3 13.3 0 0 0 16 28.46c7.18 0 13-5.61 13-12.92S23.18 3 16 3Zm0 23.28c-1.84 0-3.64-.48-5.21-1.39l-.37-.21-4.18 1.15 1.12-4.04-.24-.39a10.47 10.47 0 0 1-1.64-5.86C5.48 9.81 10.2 5.18 16 5.18s10.52 4.63 10.52 10.36S21.8 26.28 16 26.28Zm5.77-7.74c-.32-.16-1.87-.91-2.16-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.18.21-.37.24-.69.08-.31-.16-1.33-.48-2.54-1.54-.94-.83-1.57-1.85-1.75-2.16-.19-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.31.32-.52.1-.21.05-.4-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.06-1.1 2.59 0 1.54 1.13 3.02 1.29 3.23.16.21 2.22 3.36 5.39 4.71.75.32 1.34.51 1.8.66.76.24 1.45.2 2 .12.61-.09 1.87-.76 2.13-1.49.27-.73.27-1.36.19-1.49-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}
