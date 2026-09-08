import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DirectProjectImageUploader from "@/components/DirectProjectImageUploader";
import DeleteProjectImageButton from "@/components/DeleteProjectImageButton";

import { updateProject } from "./actions";

export const instant = false;

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    created?: string;
  }>;
};

export default async function EditProjectPage({
  params,
  searchParams,
}: EditProjectPageProps) {
  const { id } = await params;
  const query = await searchParams;

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
  /* LOAD DATA */
  /* ========================================= */

  const [
    projectResult,
    categoriesResult,
    roomsResult,
    woodTypesResult,
    stylesResult,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select(`
        id,
        title,
        slug,
        description,
        category_id,
        room_id,
        style_id,
        city,
        finish,
        year,
        featured,
        published,

        project_wood_types (
          wood_type_id
        ),

        project_images (
          id,
          storage_path,
          alt_text,
          sort_order,
          created_at
        )
      `)
      .eq("id", id)
      .maybeSingle(),

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

  const project =
    projectResult.data;

  if (!project) {
    notFound();
  }

  const categories =
    categoriesResult.data ?? [];

  const rooms =
    roomsResult.data ?? [];

  const woodTypes =
    woodTypesResult.data ?? [];

  const styles =
    stylesResult.data ?? [];

  const selectedWoodIds =
    new Set(
      (
        project.project_wood_types ??
        []
      ).map(
        (item) =>
          item.wood_type_id
      )
    );

  const sortedImages = [
    ...(project.project_images ?? []),
  ].sort(
    (a, b) =>
      (a.sort_order ?? 0) -
      (b.sort_order ?? 0)
  );

  const nextSortOrder =
    sortedImages.length > 0
      ? Math.max(
          ...sortedImages.map(
            (image) =>
              image.sort_order ?? 0
          )
        ) + 1
      : 1;

  const updateAction =
    updateProject.bind(
      null,
      project.id
    );

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-10">
        {/* ===================================== */}
        {/* TOP */}
        {/* ===================================== */}

        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-amber-700">
              קטלוג / עריכה
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              {project.title}
            </h1>

            <p className="mt-2 text-stone-500">
              עדכון פרטי העבודה וניהול
              התמונות שלה.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.published && (
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-stone-100"
              >
                צפייה באתר ↗
              </Link>
            )}

            <Link
              href="/admin/projects"
              className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-stone-100"
            >
              חזרה לעבודות
            </Link>
          </div>
        </div>

        {/* CREATED MESSAGE */}
        {query.created === "1" && (
          <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
            ✓ העבודה נשמרה בהצלחה. עכשיו
            אפשר להוסיף לה תמונות.
          </div>
        )}

        {/* ===================================== */}
        {/* IMAGES */}
        {/* ===================================== */}

        <section className="mt-8 rounded-[1.75rem] border border-stone-200 bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <p className="text-sm font-medium text-amber-700">
                תמונות
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                גלריית הפרויקט
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                התמונה בעלת סדר התצוגה
                הנמוך ביותר תשמש כתמונה
                הראשית של הפרויקט.
              </p>
            </div>

            <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-medium text-stone-500">
              {sortedImages.length}{" "}
              {sortedImages.length === 1
                ? "תמונה"
                : "תמונות"}
            </span>
          </div>

          {/* EXISTING IMAGES */}
          {sortedImages.length > 0 && (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedImages.map(
                (image, index) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6]"
                  >
                    <div className="relative aspect-[4/3] bg-stone-200">
                      <img
                        src={getImageUrl(
                          image.storage_path
                        )}
                        alt={
                          image.alt_text ||
                          project.title
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute right-3 top-3 rounded-full bg-stone-900 px-3 py-1 text-[10px] font-medium text-white">
                          תמונה ראשית
                        </span>
                      )}

                      <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[10px] text-white backdrop-blur">
                        סדר{" "}
                        {image.sort_order}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-4">
                      <p className="line-clamp-1 text-xs text-stone-500">
                        {image.alt_text ||
                          "ללא תיאור"}
                      </p>

                      <DeleteProjectImageButton
                        imageId={image.id}
                        projectId={
                          project.id
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {sortedImages.length === 0 && (
            <div className="mt-7 rounded-2xl border border-dashed border-stone-300 bg-[#faf9f6] px-5 py-12 text-center">
              <p className="text-sm font-medium">
                עדיין אין תמונות
              </p>

              <p className="mt-2 text-xs text-stone-500">
                העלה את התמונות הראשונות
                של הפרויקט.
              </p>
            </div>
          )}

          {/* DIRECT UPLOADER */}
          <div className="mt-7 border-t border-stone-100 pt-7">
            <DirectProjectImageUploader
              projectId={project.id}
              projectSlug={project.slug}
              projectTitle={
                project.title
              }
              nextSortOrder={
                nextSortOrder
              }
            />
          </div>
        </section>

        {/* ===================================== */}
        {/* DETAILS FORM */}
        {/* ===================================== */}

        <form
          action={updateAction}
          className="mt-6 space-y-6"
        >
          <FormSection
            number="01"
            title="פרטים בסיסיים"
            description="שם הפרויקט, כתובת הדף והתיאור שיוצג ללקוחות."
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
                  defaultValue={
                    project.title
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Slug"
                required
                hint="שינוי ה-Slug ישנה את כתובת הפרויקט באתר."
              >
                <input
                  name="slug"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  dir="ltr"
                  defaultValue={
                    project.slug
                  }
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
                  defaultValue={
                    project.description ??
                    ""
                  }
                  className={`${inputClass} h-auto resize-y py-4 leading-7`}
                />
              </FormField>
            </div>
          </FormSection>

          {/* CLASSIFICATION */}
          <FormSection
            number="02"
            title="סיווג"
            description="הקטגוריות שמשמשות לסינון באתר."
          >
            <div className="grid gap-6 md:grid-cols-3">
              <FormField label="קטגוריה">
                <select
                  name="category_id"
                  className={inputClass}
                  defaultValue={
                    project.category_id ??
                    ""
                  }
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
                  defaultValue={
                    project.room_id ?? ""
                  }
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
                  defaultValue={
                    project.style_id ?? ""
                  }
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
            description="ניתן לשייך מספר סוגי עץ לאותו פרויקט."
          >
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {woodTypes.map(
                (wood) => (
                  <label
                    key={wood.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3 transition hover:border-amber-300"
                  >
                    <input
                      type="checkbox"
                      name="wood_types"
                      value={wood.id}
                      defaultChecked={selectedWoodIds.has(
                        wood.id
                      )}
                      className="h-4 w-4 accent-amber-700"
                    />

                    <span className="text-sm font-medium">
                      {wood.name}
                    </span>
                  </label>
                )
              )}
            </div>
          </FormSection>

          {/* DETAILS */}
          <FormSection
            number="04"
            title="פרטי הפרויקט"
            description="מידע נוסף המופיע בעמוד הפרויקט."
          >
            <div className="grid gap-6 md:grid-cols-3">
              <FormField label="עיר / מיקום">
                <input
                  name="city"
                  type="text"
                  maxLength={100}
                  defaultValue={
                    project.city ?? ""
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField label="גימור">
                <input
                  name="finish"
                  type="text"
                  maxLength={150}
                  defaultValue={
                    project.finish ?? ""
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField label="שנה">
                <input
                  name="year"
                  type="number"
                  min={1900}
                  max={2100}
                  dir="ltr"
                  defaultValue={
                    project.year ?? ""
                  }
                  className={`${inputClass} text-right`}
                />
              </FormField>
            </div>
          </FormSection>

          {/* PUBLICATION */}
          <FormSection
            number="05"
            title="פרסום"
            description="שליטה באופן שבו הפרויקט מופיע באתר."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <OptionCard
                name="published"
                title="פרסם באתר"
                description="הפרויקט יהיה נגיש ללקוחות."
                defaultChecked={
                  project.published
                }
              />

              <OptionCard
                name="featured"
                title="פרויקט נבחר"
                description="הפרויקט יוצג באזור העבודות הנבחרות."
                defaultChecked={
                  project.featured
                }
              />
            </div>
          </FormSection>

          {/* SAVE */}
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
              שמור שינויים
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
/* SECTION */
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
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
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
  defaultChecked,
}: {
  name: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 transition hover:border-amber-300">
      <input
        name={name}
        type="checkbox"
        defaultChecked={
          defaultChecked
        }
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

/* ========================================= */
/* IMAGE URL */
/* ========================================= */

function getImageUrl(
  storagePath: string
) {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  return `${supabaseUrl}/storage/v1/object/public/project-images/${storagePath}`;
}