import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DirectProjectImageUploader from "@/components/DirectProjectImageUploader";
import DeleteProjectImageButton from "@/components/DeleteProjectImageButton";
import { updateProject } from "./actions";

export const instant = false;

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  const supabase = await createClient();

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

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      slug,
      description,
      city,
      finish,
      year,
      published,
      featured,
      category_id,
      room_id,
      style_id,

      project_images (
        id,
        storage_path,
        alt_text,
        sort_order
      ),

      project_wood_types (
        wood_type_id
      )
    `)
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

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

  const selectedWoodIds = new Set(
    project.project_wood_types?.map(
      (item) => item.wood_type_id
    ) || []
  );

  const sortedImages = [
    ...(project.project_images || []),
  ].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const updateAction = updateProject.bind(
    null,
    project.id
  );

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
              עריכת עבודה
            </h1>
          </div>

          <Link
            href="/admin/projects"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-100"
          >
            חזרה לעבודות
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <form
          action={updateAction}
          className="rounded-2xl border border-stone-200 bg-white p-8"
        >
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
                defaultValue={project.title}
                className="w-full rounded-lg border border-stone-300 px-4 py-3"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="mb-2 block font-medium"
              >
                Slug *
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                dir="ltr"
                required
                defaultValue={project.slug}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 text-left"
              />
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
                defaultValue={
                  project.category_id ?? ""
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">
                  ללא קטגוריה
                </option>

                {categories?.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room */}
            <div>
              <label
                htmlFor="room_id"
                className="mb-2 block font-medium"
              >
                חלל
              </label>

              <select
                id="room_id"
                name="room_id"
                defaultValue={project.room_id ?? ""}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">
                  ללא חלל
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
                defaultValue={
                  project.style_id ?? ""
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">
                  ללא סגנון
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
                defaultValue={project.city ?? ""}
                className="w-full rounded-lg border border-stone-300 px-4 py-3"
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
                defaultValue={project.finish ?? ""}
                className="w-full rounded-lg border border-stone-300 px-4 py-3"
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
                defaultValue={
                  project.year ?? undefined
                }
                className="w-full rounded-lg border border-stone-300 px-4 py-3"
              />
            </div>
          </div>

          {/* Woods */}
          <div className="mt-8 border-t border-stone-200 pt-8">
            <p className="mb-4 font-medium">
              סוגי עץ / חומר
            </p>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {woodTypes?.map((wood) => (
                <label
                  key={wood.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3"
                >
                  <input
                    type="checkbox"
                    name="wood_types"
                    value={wood.id}
                    defaultChecked={selectedWoodIds.has(
                      wood.id
                    )}
                    className="h-4 w-4"
                  />

                  <span>{wood.name}</span>
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
              defaultValue={
                project.description ?? ""
              }
              className="w-full rounded-lg border border-stone-300 px-4 py-3"
            />
          </div>

          {/* Existing Images */}
          <div className="mt-8 border-t border-stone-200 pt-8">
            <h2 className="text-xl font-bold">
              תמונות קיימות
            </h2>

            {sortedImages.length === 0 ? (
              <p className="mt-4 text-stone-500">
                אין תמונות בפרויקט.
              </p>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                {sortedImages.map((image, index) => {
                  const imageUrl =
                    supabase.storage
                      .from("project-images")
                      .getPublicUrl(
                        image.storage_path
                      ).data.publicUrl;

                  return (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-xl border border-stone-200"
                    >
                      <img
                        src={imageUrl}
                        alt={
                          image.alt_text ||
                          project.title
                        }
                        className="aspect-[4/3] w-full object-cover"
                      />

                      <div className="flex items-center justify-between gap-3 p-3">
                        <span className="text-sm text-stone-500">
                          {index === 0
                            ? "תמונה ראשית"
                            : `תמונה ${index + 1}`}
                        </span>

                        <DeleteProjectImageButton
                          imageId={image.id}
                          projectId={project.id}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* New Images */}
<div className="mt-8 border-t border-stone-200 pt-8">
  <h2 className="text-xl font-bold">
    הוסף תמונות
  </h2>

  <p className="mt-2 text-sm text-stone-500">
    התמונות מועלות ישירות לאחסון ואינן עוברות דרך שרת האתר.
  </p>

  <div className="mt-5">
    <DirectProjectImageUploader
      projectId={project.id}
      projectSlug={project.slug}
      projectTitle={project.title}
      nextSortOrder={
        sortedImages.length > 0
          ? Math.max(
              ...sortedImages.map(
                (image) => image.sort_order
              )
            ) + 1
          : 1
      }
    />
  </div>
</div>

          {/* Options */}
          <div className="mt-8 flex flex-wrap gap-8 border-t border-stone-200 pt-8">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="published"
                defaultChecked={project.published}
                className="h-5 w-5"
              />

              <span className="font-medium">
                פרסם באתר
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={project.featured}
                className="h-5 w-5"
              />

              <span className="font-medium">
                עבודה מומלצת
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-lg bg-stone-900 px-8 py-3 font-medium text-white transition hover:bg-stone-700"
            >
              שמור שינויים
            </button>

            <Link
              href="/admin/projects"
              className="rounded-lg border border-stone-300 px-8 py-3 font-medium hover:bg-stone-100"
            >
              ביטול
            </Link>

            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className="rounded-lg border border-stone-300 px-8 py-3 font-medium hover:bg-stone-100"
            >
              צפייה בפרויקט
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}