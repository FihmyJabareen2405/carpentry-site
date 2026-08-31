import {
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site";

import { createWhatsAppUrl } from "@/lib/whatsapp";
import { sendContactRequest } from "./actions";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "צרו קשר עם נגריית עימאד אקרם לקבלת מידע והצעת מחיר לעבודות נגרות בהתאמה אישית.",
  alternates: {
    canonical: "/contact",
  },
};
export const instant = false;

type ContactPageProps = {
  searchParams: Promise<{
    sent?: string;
    error?: string;
  }>;
};

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const params = await searchParams;

  const sent = params.sent === "1";
  const error = params.error === "1";

  const whatsappUrl = SITE_WHATSAPP_NUMBER
    ? createWhatsAppUrl(
        SITE_WHATSAPP_NUMBER,
        `שלום, הגעתי דרך האתר של ${SITE_NAME} ואני מעוניין לקבל מידע על עבודת נגרות.`
      )
    : null;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-50"
    >
      {/* Hero */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-medium text-amber-700">
            צור קשר
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            ספרו לנו מה אתם
            <br />
            רוצים לבנות.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            השאירו פרטים ונחזור אליכם כדי להבין את
            הצורך, המידות והכיוון של הפרויקט.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Form */}
        <div className="rounded-2xl border border-stone-200 bg-white p-7 md:p-9">
          <h2 className="text-2xl font-bold">
            בקשת הצעת מחיר
          </h2>

          <p className="mt-2 text-stone-500">
            מלאו את הפרטים וניצור איתכם קשר.
          </p>

          {sent && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
              ✓ הפנייה נשלחה בהצלחה. תודה!
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              לא הצלחנו לשלוח את הפנייה. בדוק את
              הפרטים ונסה שוב.
            </div>
          )}

          <form
            action={sendContactRequest}
            className="mt-8 space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-medium"
              >
                שם מלא *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={100}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-700"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block font-medium"
              >
                טלפון *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={30}
                dir="ltr"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 text-right outline-none transition focus:border-stone-700"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-medium"
              >
                אימייל
              </label>

              <input
                id="email"
                name="email"
                type="email"
                maxLength={200}
                dir="ltr"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 text-right outline-none transition focus:border-stone-700"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block font-medium"
              >
                ספר לנו על העבודה
              </label>

              <textarea
                id="message"
                name="message"
                rows={6}
                maxLength={3000}
                placeholder="לדוגמה: מטבח חדש, ארון לחדר שינה, מזנון לסלון..."
                className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-700"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-stone-900 px-7 py-3.5 font-medium text-white transition hover:bg-stone-700 sm:w-auto"
            >
              שלח פנייה
            </button>
          </form>
        </div>

        {/* Contact details */}
        <aside>
          <div className="rounded-2xl bg-stone-900 p-8 text-white">
            <p className="text-sm text-stone-400">
              יצירת קשר
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {SITE_NAME}
            </h2>

            <div className="mt-8 space-y-6">
              <ContactItem
                title="טלפון"
                value={
                  SITE_PHONE_DISPLAY ||
                  "יעודכן בהמשך"
                }
                href={
                  SITE_PHONE_HREF ||
                  undefined
                }
              />

              <ContactItem
                title="אימייל"
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
                className="mt-9 flex min-h-12 items-center justify-center rounded-lg bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600"
              >
                WhatsApp
              </a>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-7">
            <h3 className="font-bold">
              לפני שפונים
            </h3>

            <p className="mt-3 text-sm leading-7 text-stone-600">
              אם יש לכם תמונה להשראה, מידות
              משוערות או תמונה של החלל — כדאי להכין
              אותן. זה יעזור להבין מהר יותר את
              הפרויקט.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function ContactItem({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="border-b border-stone-700 pb-5">
      <p className="text-sm text-stone-400">
        {title}
      </p>

      {href ? (
        <a
          href={href}
          className="mt-1 block text-lg font-medium"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-lg font-medium">
          {value}
        </p>
      )}
    </div>
  );
}