import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createProject } from "./actions";

export const instant = false;

export default async function NewProjectPage() {
  const supabase = await createClient();

  /* ========================================= */
  /* AUTH */
  /* ========================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/");
  }

  /* ========================================= */
  /* LOOKUP DATA */
  /* ========================================= */

  const [
    categoriesResult,
    roomsResult,
    woodTypesResult,
    stylesResult,
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, sort_order")
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("rooms")
      .select("id, name, slug, sort_order")
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("wood_types")
      .select("id, name, slug, sort_order")
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("styles")
      .select("id, name, slug, sort_order")
      .order("sort_order", {
        ascending: true,
      }),
  ]);

  const categories =
    categoriesResult.data ?? [];

  const rooms =
    roomsResult.data ?? [];

  const woodTypes =
    woodTypesResult.data ?? [];

  const styles =
    stylesResult.data ?? [];

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-10">
        {/* ===================================== */}
        {/* TOP */}
        {/* ===================================== */}

        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-amber-700">
              קטלוג / עבודה חדשה
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              הוספת עבודה חדשה
            </h1>

            <p className="mt-2 max-w-2xl text-stone-500">
              שלב 1 מתוך 2 . הזינו את פרטי
              הפרויקט. לאחר השמירה נעבור
              להעלאת התמונות.
            </p>
          </div>

          <Link
            href="/admin/projects"
            className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-stone-100"
          >
            ביטול
          </Link>
        </div>

        {/* ===================================== */}
        {/* PROGRESS */}
        {/* ===================================== */}

        <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="border-l border-stone-200 bg-stone-900 px-5 py-4 text-white">
            <p className="text-xs text-stone-400">
              שלב 01
            </p>

            <p className="mt-1 text-sm font-medium">
              פרטי העבודה
            </p>
          </div>

          <div className="px-5 py-4 text-stone-400">
            <p className="text-xs">
              שלב 02
            </p>

            <p className="mt-1 text-sm font-medium">
              תמונות
            </p>
          </div>
        </div>

        {/* ===================================== */}
        {/* FORM */}
        {/* ===================================== */}

        <form
          action={createProject}
          className="mt-8 space-y-6"
        >
          {/* BASIC */}
          <FormSection
            number="01"
            title="פרטים בסיסיים"
            description="שם העבודה והכתובת שתופיע באתר."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="שם העבודה"
                required
              >
                <input
                  name="title"
                  type="text"
                  required
                  maxLength={200}
                  placeholder="לדוגמה: מטבח מודרני מאלון"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Slug"
                required
                hint="באנגלית, אותיות קטנות ומקפים בלבד"
              >
                <input
                  name="slug"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  placeholder="modern-oak-kitchen"
                  dir="ltr"
                  className={`${inputClass} text-left`}
                />
              </FormField>
            </div>

            <div className="mt-6">
              <FormField label="תיאור העבודה">
                <textarea
                  name="description"
                  rows={7}
                  maxLength={5000}
                  placeholder="ספרו בקצרה על הפרויקט, התכנון, החומרים והפתרונות..."
                  className={`${inputClass} h-auto resize-y py-4 leading-7`}
                />
              </FormField>
            </div>
          </FormSection>

          {/* CLASSIFICATION */}
          <FormSection
            number="02"
            title="סיווג"
            description="עוזר ללקוחות למצוא את הפרויקט באמצעות הפילטרים באתר."
          >
            <div className="grid gap-6 md:grid-cols-3">
              <FormField label="קטגוריה">
                <select
                  name="category_id"
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="">
                    ללא קטגוריה
                  </option>

                  {categories.map(
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
              </FormField>

              <FormField label="חלל">
                <select
                  name="room_id"
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="">
                    ללא חלל
                  </option>

                  {rooms.map((room) => (
                    <option
                      key={room.id}
                      value={room.id}
                    >
                      {room.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="סגנון">
                <select
                  name="style_id"
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="">
                    ללא סגנון
                  </option>

                  {styles.map((style) => (
                    <option
                      key={style.id}
                      value={style.id}
                    >
                      {style.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </FormSection>

          {/* WOOD */}
          <FormSection
            number="03"
            title="חומרים"
            description="ניתן לבחור יותר מסוג עץ אחד."
          >
            {woodTypes.length === 0 ? (
              <p className="text-sm text-stone-500">
                לא הוגדרו סוגי עץ.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {woodTypes.map(
                  (wood) => (
                    <label
                      key={wood.id}
                      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3 transition hover:border-amber-300"
                    >
                      <input
                        type="checkbox"
                        name="wood_types"
                        value={wood.id}
                        className="h-4 w-4 accent-amber-700"
                      />

                      <span className="text-sm font-medium">
                        {wood.name}
                      </span>
                    </label>
                  )
                )}
              </div>
            )}
          </FormSection>

          {/* EXTRA DETAILS */}
          <FormSection
            number="04"
            title="פרטי הפרויקט"
            description="מידע נוסף שיוצג ללקוח בעמוד העבודה."
          >
            <div className="grid gap-6 md:grid-cols-3">
              <FormField label="עיר / מיקום">
                <input
                  name="city"
                  type="text"
                  maxLength={100}
                  placeholder="לדוגמה: אום אל-פחם"
                  className={inputClass}
                />
              </FormField>

              <FormField label="גימור">
                <input
                  name="finish"
                  type="text"
                  maxLength={150}
                  placeholder="לדוגמה: גימור מט"
                  className={inputClass}
                />
              </FormField>

              <FormField label="שנה">
                <input
                  name="year"
                  type="number"
                  min={1900}
                  max={2100}
                  placeholder="2026"
                  dir="ltr"
                  className={`${inputClass} text-right`}
                />
              </FormField>
            </div>
          </FormSection>

          {/* PUBLISHING */}
          <FormSection
            number="05"
            title="פרסום"
            description="אפשר לשמור כטיוטה ולפרסם רק לאחר שהתמונות מוכנות."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <OptionCard
                name="published"
                title="פרסם באתר"
                description="הפרויקט יהיה גלוי ללקוחות."
              />

              <OptionCard
                name="featured"
                title="פרויקט נבחר"
                description="הפרויקט יוכל להופיע באזור העבודות הנבחרות בדף הבית."
              />
            </div>
          </FormSection>

          {/* ===================================== */}
          {/* SUBMIT */}
          {/* ===================================== */}

          <div className="flex flex-col-reverse gap-3 rounded-[1.75rem] border border-stone-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <Link
              href="/admin/projects"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-medium transition hover:bg-stone-100"
            >
              ביטול
            </Link>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-7 text-sm font-medium text-white transition hover:bg-amber-700"
            >
              שמור והמשך לתמונות
              <span className="mr-2">
                ←
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ========================================= */
/* STYLES */
/* ========================================= */

const inputClass =
  "h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:bg-white";

/* ========================================= */
/* FORM SECTION */
/* ========================================= */

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 md:p-8">
      <div className="mb-7 flex gap-4 border-b border-stone-100 pb-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-medium text-stone-500">
          {number}
        </span>

        <div>
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

/* ========================================= */
/* FIELD */
/* ========================================= */

function FormField({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium text-stone-700">
        {label}

        {required && (
          <span className="text-amber-700">
            *
          </span>
        )}
      </span>

      {children}

      {hint && (
        <span className="mt-2 block text-xs text-stone-400">
          {hint}
        </span>
      )}
    </label>
  );
}

/* ========================================= */
/* OPTION */
/* ========================================= */

function OptionCard({
  name,
  title,
  description,
}: {
  name: string;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 transition hover:border-amber-300">
      <input
        name={name}
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 accent-amber-700"
      />

      <span>
        <span className="block font-medium">
          {title}
        </span>

        <span className="mt-1 block text-sm leading-6 text-stone-500">
          {description}
        </span>
      </span>
    </label>
  );
}