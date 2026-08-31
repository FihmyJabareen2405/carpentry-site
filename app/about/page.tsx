import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
export const metadata: Metadata = {
  title: "אודות",
  description:
    "הכירו את נגריית עימאד אקרם - תכנון וייצור עבודות נגרות בהתאמה אישית, תוך הקפדה על איכות, דיוק וגימור.",
  alternates: {
    canonical: "/about",
  },
};
export default function AboutPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-50 text-stone-900"
    >
      {/* Hero */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-medium text-amber-700">
            אודותינו
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            נגרות שמתחילה ברעיון
            <br />
            ונגמרת בפרטים הקטנים.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600">
            {SITE_NAME} מתמחה בתכנון וייצור עבודות
            נגרות בהתאמה אישית לבית ולעסק.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="font-medium text-amber-700">
              כל פרויקט הוא שונה
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              מתכננים לפי החלל,
              הצורך והסגנון שלכם.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-stone-600">
            <p>
              אנחנו מאמינים שעבודת נגרות טובה צריכה
              להיות גם יפה וגם שימושית. לכן כל עבודה
              מתחילה בהבנת הצרכים של הלקוח ובתכנון
              שמתאים לחלל הקיים.
            </p>

            <p>
              החל מבחירת החומרים והגימורים, דרך
              הייצור ועד להתקנה — אנחנו מקפידים על
              דיוק, איכות וירידה לפרטים.
            </p>

            <p>
              בין העבודות שלנו ניתן למצוא מטבחים,
              ארונות, חדרי שינה, ספריות, מזנונים,
              חיפויי קיר ופתרונות נגרות מיוחדים
              בהתאמה אישית.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-stone-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold">
            מה חשוב לנו
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ValueCard
              number="01"
              title="תכנון נכון"
              text="התאמה למידות, לשימוש ולסגנון של כל חלל."
            />

            <ValueCard
              number="02"
              title="חומרים איכותיים"
              text="בחירת חומרי גלם וגימורים שמתאימים לכל פרויקט."
            />

            <ValueCard
              number="03"
              title="גימור מדויק"
              text="הקפדה על הפרטים הקטנים משלב הייצור ועד ההתקנה."
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="font-medium text-amber-700">
          תהליך העבודה
        </p>

        <h2 className="mt-3 text-4xl font-bold">
          איך פרויקט הופך למציאות?
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Step
            number="01"
            title="פגישה ומדידה"
            text="מבינים את הצורך, החלל והכיוון העיצובי."
          />

          <Step
            number="02"
            title="תכנון"
            text="בוחרים מידות, חומרים, צבעים וגימורים."
          />

          <Step
            number="03"
            title="ייצור"
            text="הפרויקט עובר לייצור בהתאם לתכנון."
          />

          <Step
            number="04"
            title="התקנה"
            text="הובלה, התקנה וגימור בבית הלקוח."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl bg-stone-900 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold md:text-4xl">
            יש לכם פרויקט בראש?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-stone-300">
            נשמח לשמוע מה אתם מתכננים ולחשוב יחד על
            הפתרון שמתאים לכם.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3.5 font-medium text-stone-900"
          >
            דברו איתנו
          </Link>
        </div>
      </section>
    </main>
  );
}

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
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-7">
      <p className="text-sm text-stone-400">
        {number}
      </p>

      <h3 className="mt-8 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-stone-600">
        {text}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-stone-300 pt-5">
      <p className="text-sm text-stone-400">
        {number}
      </p>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-stone-600">
        {text}
      </p>
    </div>
  );
}