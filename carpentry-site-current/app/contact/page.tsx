import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";

import {
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_SERVICE_AREA,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site";

import { createWhatsAppUrl } from "@/lib/whatsapp";

export const instant = false;

export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "צרו קשר עם נגריית עימאד אקרם לקבלת מידע והצעת מחיר לעבודות נגרות בהתאמה אישית.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const whatsappUrl = SITE_WHATSAPP_NUMBER
    ? createWhatsAppUrl(
        SITE_WHATSAPP_NUMBER,
        `שלום, הגעתי דרך האתר של ${SITE_NAME} ואני מעוניין לקבל מידע על עבודת נגרות.`
      )
    : null;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf9f6] text-stone-900"
    >
      {/* HERO */}
      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[480px] max-w-[1500px] items-end overflow-hidden rounded-[2rem] bg-stone-900 px-7 py-12 text-white sm:px-10 md:px-16 md:py-16 lg:px-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-stone-300">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              בואו נדבר
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl">
              ספרו לנו
              <br />
              מה אתם רוצים לבנות.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300 md:text-xl">
              כמה פרטים על הפרויקט יעזרו לנו להבין
              את הצורך ולחזור אליכם בצורה מדויקת יותר.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:py-24 lg:grid-cols-[1.35fr_0.65fr]">
        {/* FORM */}
        <div className="rounded-[2rem] border border-stone-200 bg-white p-7 md:p-10">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-amber-700">
              בקשת הצעת מחיר
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              מתחילים מכאן.
            </h2>

            <p className="mt-4 leading-7 text-stone-500">
              מלאו את הפרטים וניצור איתכם קשר.
            </p>
          </div>

          <ContactForm />
        </div>

        {/* CONTACT CARD */}
        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-stone-950 p-8 text-white md:p-9">
            <p className="text-xs font-medium text-stone-500">
              יצירת קשר
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              {SITE_NAME}
            </h2>

            <div className="mt-9 space-y-7">
              <ContactDetail
                label="טלפון"
                value={
                  SITE_PHONE_DISPLAY ||
                  "יעודכן בהמשך"
                }
                href={
                  SITE_PHONE_HREF ||
                  undefined
                }
              />

              <ContactDetail
                label="אזור שירות"
                value={SITE_SERVICE_AREA}
              />

              <ContactDetail
                label="אימייל"
                value={
                  SITE_EMAIL ||
                  "יעודכן בהמשך"
                }
                href={
                  SITE_EMAIL
                    ? `mailto:${SITE_EMAIL}`
                    : undefined
                }
              />
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 flex min-h-13 items-center justify-center gap-2 rounded-full bg-green-500 px-6 font-medium text-white transition hover:bg-green-600"
              >
                <WhatsAppIcon />
                דברו איתנו ב־WhatsApp
              </a>
            )}
          </div>

          {/* TIP */}
          <div className="rounded-[2rem] border border-stone-200 bg-white p-7">
            <p className="text-xs font-medium text-amber-700">
              טיפ קטן לפני שפונים
            </p>

            <h3 className="mt-3 text-xl font-bold">
              תמונות ומידות עוזרות מאוד.
            </h3>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              אם יש לכם תמונה של החלל, תמונת השראה
              או מידות משוערות — כדאי להכין אותן.
              זה יעזור להבין מהר יותר את הפרויקט.
            </p>
          </div>

          {/* PROCESS */}
          <div className="rounded-[2rem] border border-stone-200 bg-[#f2efe8] p-7">
            <p className="text-xs font-medium text-stone-500">
              ומה קורה אחרי השליחה?
            </p>

            <div className="mt-6 space-y-5">
              <MiniStep
                number="01"
                text="הפנייה נכנסת למערכת."
              />

              <MiniStep
                number="02"
                text="אנחנו עוברים על הפרטים."
              />

              <MiniStep
                number="03"
                text="יוצרים קשר להמשך תכנון."
              />
            </div>
          </div>
        </aside>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[330px] max-w-[1500px] items-center justify-center rounded-[2rem] bg-amber-700 px-6 py-16 text-center text-white">
          <div>
            <p className="text-sm text-white/70">
              יש לכם כבר רעיון?
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              זה מקום טוב להתחיל.
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactDetail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="border-b border-white/10 pb-6">
      <p className="text-xs text-stone-500">
        {label}
      </p>

      {href ? (
        <a
          href={href}
          className="mt-2 block text-lg font-medium transition hover:text-amber-400"
        >
          {value}
        </a>
      ) : (
        <p className="mt-2 text-lg font-medium text-stone-400">
          {value}
        </p>
      )}
    </div>
  );
}

function MiniStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-medium text-stone-500">
        {number}
      </span>

      <p className="text-sm text-stone-700">
        {text}
      </p>
    </div>
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