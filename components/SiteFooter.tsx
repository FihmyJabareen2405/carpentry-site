import Link from "next/link";

import {
  SITE_EMAIL,
  SITE_FACEBOOK_URL,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_TAGLINE,
  SITE_SERVICE_AREA,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site";

import { createWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
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
      className="bg-[#faf9f6] px-4 pb-4 pt-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] bg-stone-950 text-white">
        {/* ===================================== */}
        {/* MAIN */}
        {/* ===================================== */}

        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-4"
              >
                <div className="relative h-16 w-16 shrink-0">
  <Image
  src="/brand/logo.png"
  alt="נגריית עימאד אקרם"
  fill
  sizes="(max-width: 640px) 240px, 280px"
  className="object-contain"
/>
</div>

                <span>
                  <span className="block text-xl font-bold">
                    {SITE_NAME}
                  </span>

                  <span className="mt-1 block text-xs text-stone-500">
                    {SITE_TAGLINE}
                  </span>
                </span>
              </Link>

              <p className="mt-7 max-w-md text-lg leading-8 text-stone-400">
                תכנון, ייצור והתקנה של עבודות
                נגרות בהתאמה אישית לבית ולעסק.
              </p>

              <p className="mt-4 max-w-md text-sm leading-7 text-stone-500">
                אזור שירות: {SITE_SERVICE_AREA}.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-stone-900 transition hover:bg-amber-600 hover:text-white"
              >
                קבלת הצעת מחיר
                <span className="mr-2">
                  ←
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                ניווט
              </p>

              <nav className="mt-6 flex flex-col gap-4">
                <FooterLink href="/">
                  בית
                </FooterLink>

                <FooterLink href="/projects">
                  עבודות
                </FooterLink>

                <FooterLink href="/visualizer">
                  הדמיית חומרים
                </FooterLink>

                <FooterLink href="/about">
                  אודות
                </FooterLink>

                <FooterLink href="/contact">
                  צור קשר
                </FooterLink>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                יצירת קשר
              </p>

              <div className="mt-6 space-y-5">
                {SITE_PHONE_DISPLAY ? (
                  <a
                    href={
                      SITE_PHONE_HREF ||
                      undefined
                    }
                    className="block transition hover:text-amber-500"
                  >
                    <span className="block text-xs text-stone-500">
                      טלפון
                    </span>

                    <span
                      dir="ltr"
                      className="mt-1 block text-lg font-medium"
                    >
                      {SITE_PHONE_DISPLAY}
                    </span>
                  </a>
                ) : (
                  <ContactPlaceholder
                    title="טלפון"
                  />
                )}

                {SITE_EMAIL ? (
                  <a
                    href={`mailto:${SITE_EMAIL}`}
                    className="block transition hover:text-amber-500"
                  >
                    <span className="block text-xs text-stone-500">
                      אימייל
                    </span>

                    <span
                      dir="ltr"
                      className="mt-1 block break-all text-sm font-medium"
                    >
                      {SITE_EMAIL}
                    </span>
                  </a>
                ) : (
                  <ContactPlaceholder
                    title="אימייל"
                  />
                )}

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                )}

                {SITE_FACEBOOK_URL && (
                  <a
                    href={SITE_FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
                  >
                    <FacebookIcon />
                    Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================== */}
        {/* BOTTOM */}
        {/* ===================================== */}

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 {SITE_NAME}. כל הזכויות שמורות.
            </p>

            <p>
              נגרות בהתאמה אישית
            </p>
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
      className="w-fit text-stone-300 transition hover:-translate-x-1 hover:text-white"
    >
      {children}
    </Link>
  );
}

function ContactPlaceholder({
  title,
}: {
  title: string;
}) {
  return (
    <div>
      <span className="block text-xs text-stone-500">
        {title}
      </span>

      <span className="mt-1 block text-sm text-stone-600">
        יעודכן בהמשך
      </span>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
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
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M16 3C8.82 3 3 8.61 3 15.54c0 2.44.74 4.72 2.02 6.65L3 29l7.05-1.94A13.3 13.3 0 0 0 16 28.46c7.18 0 13-5.61 13-12.92S23.18 3 16 3Zm0 23.28c-1.84 0-3.64-.48-5.21-1.39l-.37-.21-4.18 1.15 1.12-4.04-.24-.39a10.47 10.47 0 0 1-1.64-5.86C5.48 9.81 10.2 5.18 16 5.18s10.52 4.63 10.52 10.36S21.8 26.28 16 26.28Zm5.77-7.74c-.32-.16-1.87-.91-2.16-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.18.21-.37.24-.69.08-.31-.16-1.33-.48-2.54-1.54-.94-.83-1.57-1.85-1.75-2.16-.19-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.31.32-.52.1-.21.05-.4-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.06-1.1 2.59 0 1.54 1.13 3.02 1.29 3.23.16.21 2.22 3.36 5.39 4.71.75.32 1.34.51 1.8.66.76.24 1.45.2 2 .12.61-.09 1.87-.76 2.13-1.49.27-.73.27-1.36.19-1.49-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}