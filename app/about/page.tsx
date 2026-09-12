import type { Metadata } from "next";
import Link from "next/link";

import {
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "אודות",
  description:
    "הכירו את נגריית עימאד אקרם - תכנון, ייצור והתקנה של עבודות נגרות בהתאמה אישית, עם דגש על איכות, דיוק וגימור.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf9f6] text-stone-900"
    >
      {/* ========================================= */}
      {/* HERO */}
      {/* ========================================= */}

      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[560px] max-w-[1500px] items-end overflow-hidden rounded-[2rem] bg-stone-900 px-7 py-12 text-white sm:px-10 md:min-h-[650px] md:px-16 md:py-16 lg:px-20">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-stone-300">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {SITE_TAGLINE}
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl lg:text-[5rem]">
              נגרות טובה מתחילה
              <br />
              בהקשבה.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300 md:text-xl">
              כל פרויקט מתחיל בהבנת החלל,
              הצרכים והסגנון . ורק אחר כך
              עוברים לחומר, לייצור ולהתקנה.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* STORY */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-medium text-amber-700">
              {SITE_NAME}
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              מתכנון ראשוני
              <br />
              ועד הפרט האחרון.
            </h2>
          </div>

          <div className="max-w-3xl space-y-7 text-xl leading-9 text-stone-600 md:text-2xl md:leading-10">
            <p>
              אנחנו מאמינים שנגרות בהתאמה אישית
              צריכה להשתלב בחלל כאילו תמיד הייתה
              שם.
            </p>

            <p>
              לכן העבודה אינה מתחילה רק בבחירת
              צבע או סוג עץ , אלא בהבנת הדרך שבה
              משתמשים בחלל, מה צריך לאחסן, מה
              חשוב להדגיש ואיך הכול מתחבר יחד.
            </p>

            <p>
              משלב המדידה והתכנון, דרך בחירת
              חומרי הגלם והגימורים ועד לייצור
              ולהתקנה , המטרה היא להגיע לתוצאה
              מדויקת, שימושית ונכונה לאורך זמן.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* VALUES */}
      {/* ========================================= */}

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-amber-700">
                הדרך שלנו
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                הדברים שלא מתפשרים עליהם.
              </h2>
            </div>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-200 md:grid-cols-2 lg:grid-cols-4">
            <ValueCard
              number="01"
              title="תכנון"
              text="כל פרויקט מתחיל בהבנה של המידות, השימוש והצרכים."
            />

            <ValueCard
              number="02"
              title="חומרים"
              text="בחירת חומרי גלם וגימורים שמתאימים לפרויקט ולשימוש."
            />

            <ValueCard
              number="03"
              title="דיוק"
              text="הקפדה על מידות, חיבורים ופרטים לאורך כל תהליך הייצור."
            />

            <ValueCard
              number="04"
              title="גימור"
              text="התקנה וגימור סופי שמעניקים לפרויקט את המראה השלם."
            />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* TYPES OF WORK */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium text-amber-700">
              תחומי עבודה
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              פתרונות נגרות
              <br />
              לכל חלל.
            </h2>

            <Link
              href="/projects"
              className="mt-8 inline-flex items-center gap-2 border-b border-stone-900 pb-1 text-sm font-medium"
            >
              לצפייה בפרויקטים
              <span>←</span>
            </Link>
          </div>

          <div>
            <WorkRow
              number="01"
              title="מטבחים"
            />

            <WorkRow
              number="02"
              title="ארונות וחדרי שינה"
            />

            <WorkRow
              number="03"
              title="ספריות ומזנונים"
            />

            <WorkRow
              number="04"
              title="חיפויי קיר"
            />

            <WorkRow
              number="05"
              title="דלתות"
            />

            <WorkRow
              number="06"
              title="עבודות מיוחדות"
              last
            />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* PROCESS */}
      {/* ========================================= */}

      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="text-sm font-medium text-amber-500">
                תהליך העבודה
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                ארבעה שלבים.
                <br />
                תוצאה אחת.
              </h2>
            </div>

            <div>
              <ProcessRow
                number="01"
                title="פגישה ומדידה"
                text="היכרות עם החלל, המידות, הצרכים והכיוון העיצובי."
              />

              <ProcessRow
                number="02"
                title="תכנון ובחירה"
                text="תכנון העבודה ובחירת חומרי גלם, צבעים וגימורים."
              />

              <ProcessRow
                number="03"
                title="ייצור"
                text="העבודה עוברת לייצור בהתאם למידות ולתכנון שסוכם."
              />

              <ProcessRow
                number="04"
                title="התקנה"
                text="הובלה, התקנה וגימור סופי במקום."
                last
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* CTA */}
      {/* ========================================= */}

      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[430px] max-w-[1500px] items-center justify-center rounded-[2rem] bg-amber-700 px-6 py-20 text-center text-white">
          <div className="max-w-3xl">
            <p className="text-sm text-white/70">
              יש לכם רעיון?
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              בואו נתחיל
              <br />
              לתכנן אותו.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
              ספרו לנו מה אתם רוצים לבנות
              ונחזור אליכם כדי להבין את
              הפרויקט.
            </p>

            <Link
              href="/contact"
              className="mt-9 inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 font-medium text-stone-900 transition hover:scale-[1.03]"
            >
              קבלת הצעת מחיר
              <span className="mr-2">
                ←
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ========================================= */
/* VALUE CARD */
/* ========================================= */

function ValueCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-[#faf9f6] p-7 md:p-8">
      <p className="text-xs text-stone-400">
        {number}
      </p>

      <h3 className="mt-14 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-stone-600">
        {text}
      </p>
    </div>
  );
}

/* ========================================= */
/* WORK ROW */
/* ========================================= */

function WorkRow({
  number,
  title,
  last = false,
}: {
  number: string;
  title: string;
  last?: boolean;
}) {
  return (
    <div
      className={`group flex items-center justify-between gap-6 py-6 ${
        !last
          ? "border-b border-stone-300"
          : ""
      }`}
    >
      <div className="flex items-center gap-6">
        <span className="text-xs text-stone-400">
          {number}
        </span>

        <h3 className="text-xl font-medium md:text-2xl">
          {title}
        </h3>
      </div>

      <span className="text-stone-400 transition group-hover:-translate-x-1 group-hover:text-amber-700">
        ←
      </span>
    </div>
  );
}

/* ========================================= */
/* PROCESS ROW */
/* ========================================= */

function ProcessRow({
  number,
  title,
  text,
  last = false,
}: {
  number: string;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid gap-5 py-7 sm:grid-cols-[70px_1fr_1.2fr] ${
        !last
          ? "border-b border-white/15"
          : ""
      }`}
    >
      <span className="text-sm text-stone-500">
        {number}
      </span>

      <h3 className="text-xl font-medium">
        {title}
      </h3>

      <p className="leading-7 text-stone-400">
        {text}
      </p>
    </div>
  );
}