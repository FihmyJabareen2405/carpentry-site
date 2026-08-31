import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createProject } from "./actions";

export const instant = false;

export default async function NewProjectPage() {
  const supabase = await createClient();

  // --------------------------------------------------
  // Logged-in user
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // --------------------------------------------------
  // Admin permission
  // --------------------------------------------------

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/");
  }

  // --------------------------------------------------
  // Load lookup tables
  // --------------------------------------------------

  const [
    { data: categories },
    { data: rooms },
    { data: styles },
    { data: woodTypes },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .order("sort_order"),

    supabase
      .from("rooms")
      .select("id, name")
      .order("sort_order"),

    supabase
      .from("styles")
      .select("id, name")
      .order("sort_order"),

    supabase
      .from("wood_types")
      .select("id, name")
      .order("sort_order"),
  ]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-100"
    >
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm text-stone-500">
              מערכת ניהול
            </p>

            <h1 className="text-2xl font-bold">
              הוספת עבודה חדשה
            </h1>
          </div>

          <Link
            href="/admin/projects"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
          >
            חזרה לעבודות
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <form
          action={createProject}
          className="rounded-2xl border border-stone-200 bg-white p-8"
        >
          {/* Explanation */}
          <div className="mb-8 rounded-xl border border-stone-200 bg-stone-50 p-5">
            <p className="font-medium">
              שלב 1 מתוך 2 — פרטי העבודה
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              לאחר שמירת הפרויקט תעבור
              אוטומטית לשלב העלאת התמונות.
            </p>
          </div>

          {/* Fields */}
          <div className="grid gap-7 md:grid-cols-2">

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block font-medium"
              >
                שם העבודה *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="לדוגמה: מטבח מודרני מאלון"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-700"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="mb-2 block font-medium"
              >
                כתובת הפרויקט / Slug *
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                required
                dir="ltr"
                placeholder="modern-oak-kitchen"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 text-left outline-none transition focus:border-stone-700"
              />

              <p className="mt-2 text-xs text-stone-500">
                אותיות באנגלית, מספרים
                ומקפים בלבד.
              </p>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category_id"
                className="mb-2 block font-medium"
              >
                קטגוריה
              </label>

              <select
                id="category_id"
                name="category_id"
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none focus:border-stone-700"
              >
                <option value="">
                  בחר קטגוריה
                </option>

                {categories?.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Room */}
            <div>
              <label
                htmlFor="room_id"
                className="mb-2 block font-medium"
              >
                חלל / מיקום בבית
              </label>

              <select
                id="room_id"
                name="room_id"
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none focus:border-stone-700"
              >
                <option value="">
                  בחר חלל
                </option>

                {rooms?.map((room) => (
                  <option
                    key={room.id}
                    value={room.id}
                  >
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label
                htmlFor="style_id"
                className="mb-2 block font-medium"
              >
                סגנון
              </label>

              <select
                id="style_id"
                name="style_id"
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none focus:border-stone-700"
              >
                <option value="">
                  בחר סגנון
                </option>

                {styles?.map((style) => (
                  <option
                    key={style.id}
                    value={style.id}
                  >
                    {style.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="mb-2 block font-medium"
              >
                עיר / אזור
              </label>

              <input
                id="city"
                name="city"
                type="text"
                placeholder="לדוגמה: חיפה"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-700"
              />
            </div>

            {/* Finish */}
            <div>
              <label
                htmlFor="finish"
                className="mb-2 block font-medium"
              >
                גימור
              </label>

              <input
                id="finish"
                name="finish"
                type="text"
                placeholder="לדוגמה: גימור מט"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-700"
              />
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="mb-2 block font-medium"
              >
                שנת ביצוע
              </label>

              <input
                id="year"
                name="year"
                type="number"
                min="1900"
                max="2100"
                placeholder="2026"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-700"
              />
            </div>
          </div>

          {/* Wood types */}
          <div className="mt-8 border-t border-stone-200 pt-8">
            <h2 className="font-medium">
              סוגי עץ / חומר
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              ניתן לבחור יותר מסוג אחד.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {woodTypes?.map((wood) => (
                <label
                  key={wood.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 transition hover:bg-stone-50"
                >
                  <input
                    type="checkbox"
                    name="wood_types"
                    value={wood.id}
                    className="h-4 w-4"
                  />

                  <span>
                    {wood.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <label
              htmlFor="description"
              className="mb-2 block font-medium"
            >
              תיאור העבודה
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="ספר מעט על העבודה, החומרים, הדרישות המיוחדות וכו׳..."
              className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-700"
            />
          </div>

          {/* Options */}
          <div className="mt-8 flex flex-wrap gap-8 border-t border-stone-200 pt-8">

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="published"
                className="h-5 w-5"
              />

              <div>
                <p className="font-medium">
                  פרסם באתר
                </p>

                <p className="text-sm text-stone-500">
                  ניתן גם לפרסם מאוחר יותר
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                className="h-5 w-5"
              />

              <div>
                <p className="font-medium">
                  עבודה מומלצת
                </p>

                <p className="text-sm text-stone-500">
                  מיועד להצגה בדף הבית
                </p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-lg bg-stone-900 px-8 py-3 font-medium text-white transition hover:bg-stone-700"
            >
              שמור והמשך לתמונות ←
            </button>

            <Link
              href="/admin/projects"
              className="rounded-lg border border-stone-300 px-8 py-3 font-medium transition hover:bg-stone-100"
            >
              ביטול
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}