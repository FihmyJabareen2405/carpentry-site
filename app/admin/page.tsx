import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminPage() {
  const supabase = await createClient();

  // =========================================
  // Logged-in user
  // =========================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // =========================================
  // Admin permission
  // =========================================

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-stone-50 px-6"
      >
        <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold">
            אין הרשאה
          </h1>

          <p className="mt-3 text-stone-600">
            המשתמש המחובר אינו מורשה להיכנס למערכת הניהול.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-700"
          >
            חזרה לאתר
          </Link>
        </div>
      </main>
    );
  }

  // =========================================
  // Dashboard statistics
  // =========================================

  const [
    projectsResult,
    publishedResult,
    imagesResult,
    newContactsResult,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("projects")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("published", true),

    supabase
      .from("project_images")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("contact_requests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "new"),
  ]);

  const projectsCount =
    projectsResult.count ?? 0;

  const publishedCount =
    publishedResult.count ?? 0;

  const imagesCount =
    imagesResult.count ?? 0;

  const newContactsCount =
    newContactsResult.count ?? 0;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-100"
    >
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm text-stone-500">
              מערכת ניהול
            </p>

            <h1 className="text-2xl font-bold">
              נגריית עימאד אקרם
            </h1>
          </div>

          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
          >
            צפייה באתר
          </Link>
        </div>
      </header>

      {/* ========================================= */}
      {/* CONTENT */}
      {/* ========================================= */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            שלום 👋
          </h2>

          <p className="mt-2 text-stone-600">
            מכאן ניתן לנהל את העבודות, התמונות והפניות
            שמגיעות מהאתר.
          </p>
        </div>

        {/* ========================================= */}
        {/* STATISTICS */}
        {/* ========================================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="סה״כ עבודות"
            value={projectsCount}
          />

          <StatCard
            label="עבודות שפורסמו"
            value={publishedCount}
          />

          <StatCard
            label="תמונות"
            value={imagesCount}
          />

          <StatCard
            label="פניות חדשות"
            value={newContactsCount}
            highlight={newContactsCount > 0}
          />
        </div>

        {/* ========================================= */}
        {/* ACTIONS */}
        {/* ========================================= */}

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                פעולות
              </h2>

              <p className="mt-2 text-stone-600">
                ניהול התוכן והפניות של האתר.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Add Project */}
            <Link
              href="/admin/projects/new"
              className="group rounded-2xl bg-stone-900 p-7 text-white transition hover:bg-stone-700"
            >
              <div className="text-3xl">
                ＋
              </div>

              <h3 className="mt-5 text-xl font-bold">
                הוסף עבודה חדשה
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-300">
                יצירת פרויקט חדש והוספתו לקטלוג.
              </p>

              <p className="mt-6 text-sm font-medium">
                הוסף עבודה ←
              </p>
            </Link>

            {/* Manage Projects */}
            <Link
              href="/admin/projects"
              className="group rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <div className="text-3xl">
                🪵
              </div>

              <h3 className="mt-5 text-xl font-bold">
                ניהול עבודות
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                עריכה, פרסום, הסתרה ומחיקה של פרויקטים.
              </p>

              <p className="mt-6 text-sm font-medium">
                ניהול הקטלוג ←
              </p>
            </Link>

            {/* Contacts */}
            <Link
              href="/admin/contacts"
              className="group relative rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:border-stone-400"
            >
              {newContactsCount > 0 && (
                <span className="absolute left-5 top-5 flex min-h-7 min-w-7 items-center justify-center rounded-full bg-green-100 px-2 text-xs font-bold text-green-800">
                  {newContactsCount}
                </span>
              )}

              <div className="text-3xl">
                📩
              </div>

              <h3 className="mt-5 text-xl font-bold">
                פניות מלקוחות
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                צפייה וניהול של פניות שהתקבלו דרך האתר.
              </p>

              {newContactsCount > 0 ? (
                <div className="mt-5 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  {newContactsCount}{" "}
                  {newContactsCount === 1
                    ? "פנייה חדשה"
                    : "פניות חדשות"}
                </div>
              ) : (
                <p className="mt-6 text-sm font-medium">
                  צפייה בפניות ←
                </p>
              )}
            </Link>

            {/* Public Catalog */}
            <Link
              href="/projects"
              target="_blank"
              className="group rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:border-stone-400"
            >
              <div className="text-3xl">
                👁️
              </div>

              <h3 className="mt-5 text-xl font-bold">
                צפייה בקטלוג
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                לראות כיצד העבודות מוצגות ללקוחות באתר.
              </p>

              <p className="mt-6 text-sm font-medium">
                פתח את הקטלוג ←
              </p>
            </Link>
          </div>
        </section>

        {/* ========================================= */}
        {/* QUICK SUMMARY */}
        {/* ========================================= */}

        <section className="mt-12 rounded-2xl border border-stone-200 bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold">
                מצב האתר
              </h2>

              <p className="mt-2 text-sm text-stone-600">
                סיכום מהיר של התוכן שמופיע כרגע באתר.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/projects"
                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
              >
                ניהול עבודות
              </Link>

              <Link
                href="/admin/contacts"
                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
              >
                ניהול פניות
              </Link>
            </div>
          </div>

          <div className="mt-7 grid gap-5 border-t border-stone-200 pt-7 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryItem
              label="עבודות במערכת"
              value={projectsCount}
            />

            <SummaryItem
              label="מוצגות באתר"
              value={publishedCount}
            />

            <SummaryItem
              label="תמונות בגלריות"
              value={imagesCount}
            />

            <SummaryItem
              label="ממתינות לטיפול"
              value={newContactsCount}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* ========================================= */
/* COMPONENTS */
/* ========================================= */

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlight
          ? "border-green-200 bg-green-50"
          : "border-stone-200 bg-white"
      }`}
    >
      <p
        className={`text-sm ${
          highlight
            ? "text-green-700"
            : "text-stone-500"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-2 text-4xl font-bold ${
          highlight
            ? "text-green-900"
            : "text-stone-900"
        }`}
      >
        {value}
      </p>

      {highlight && (
        <p className="mt-2 text-xs font-medium text-green-700">
          דורש טיפול
        </p>
      )}
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-sm text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}