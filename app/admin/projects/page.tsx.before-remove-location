import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DeleteProjectButton from "@/components/DeleteProjectButton";

import {
  toggleFeatured,
  togglePublished,
} from "./actions";

export const instant = false;

type Relation = {
  name: string;
  slug: string;
};

export default async function AdminProjectsPage() {
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
  /* LOAD PROJECTS */
  /* ========================================= */

  const { data: projects, error } =
    await supabase
      .from("projects")
      .select(`
        id,
        title,
        slug,
        city,
        year,
        published,
        featured,
        created_at,

        categories (
          name,
          slug
        ),

        project_images (
          id,
          storage_path,
          alt_text,
          sort_order
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Error loading projects:",
      error
    );
  }

  const allProjects =
    projects ?? [];

  const publishedCount =
    allProjects.filter(
      (project) => project.published
    ).length;

  const draftCount =
    allProjects.filter(
      (project) => !project.published
    ).length;

  const featuredCount =
    allProjects.filter(
      (project) => project.featured
    ).length;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1450px] px-5 py-8 md:px-8 md:py-10">
        {/* ===================================== */}
        {/* TOP */}
        {/* ===================================== */}

        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-amber-700">
              קטלוג
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              ניהול עבודות
            </h1>

            <p className="mt-2 text-stone-500">
              עריכה, פרסום, הסתרה וניהול של
              הפרויקטים באתר.
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-amber-700"
          >
            <span className="ml-2 text-lg">
              +
            </span>

            עבודה חדשה
          </Link>
        </div>

        {/* ===================================== */}
        {/* STATS */}
        {/* ===================================== */}

        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="סה״כ עבודות"
            value={allProjects.length}
          />

          <StatCard
            label="פורסמו"
            value={publishedCount}
          />

          <StatCard
            label="טיוטות"
            value={draftCount}
          />

          <StatCard
            label="פרויקטים נבחרים"
            value={featuredCount}
          />
        </div>

        {/* ===================================== */}
        {/* PROJECTS */}
        {/* ===================================== */}

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                כל העבודות
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                {allProjects.length} פרויקטים
                במערכת
              </p>
            </div>

            <Link
              href="/projects"
              target="_blank"
              className="text-sm font-medium text-stone-500 transition hover:text-amber-700"
            >
              צפייה בקטלוג באתר ↗
            </Link>
          </div>

          {allProjects.length === 0 ? (
            <div className="mt-6 rounded-[1.75rem] border border-stone-200 bg-white px-6 py-20 text-center">
              <div className="text-4xl">
                🪵
              </div>

              <h3 className="mt-5 text-xl font-bold">
                עדיין אין עבודות
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                צור את הפרויקט הראשון כדי
                להתחיל לבנות את הקטלוג.
              </p>

              <Link
                href="/admin/projects/new"
                className="mt-7 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white"
              >
                הוסף עבודה
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {allProjects.map(
                (project) => {
                  const category =
                    normalizeRelation(
                      project.categories
                    );

                  const images = [
                    ...(project.project_images ??
                      []),
                  ].sort(
                    (a, b) =>
                      (a.sort_order ?? 0) -
                      (b.sort_order ?? 0)
                  );

                  const firstImage =
                    images[0] ?? null;

                  const imageUrl =
                    firstImage
                      ? getImageUrl(
                          firstImage.storage_path
                        )
                      : null;

                  const publishAction =
                    togglePublished.bind(
                      null,
                      project.id,
                      project.published
                    );

                  const featuredAction =
                    toggleFeatured.bind(
                      null,
                      project.id,
                      project.featured
                    );

                  return (
                    <article
                      key={project.id}
                      className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white"
                    >
                      <div className="grid sm:grid-cols-[210px_1fr]">
                        {/* IMAGE */}
                        <div className="relative min-h-[210px] bg-stone-200 sm:min-h-full">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                firstImage?.alt_text ||
                                project.title
                              }
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full min-h-[210px] items-center justify-center text-sm text-stone-400">
                              אין תמונה
                            </div>
                          )}

                          <div className="absolute right-3 top-3 flex flex-wrap gap-2">
                            <StatusBadge
                              published={
                                project.published
                              }
                            />

                            {project.featured && (
                              <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold text-white shadow">
                                נבחר
                              </span>
                            )}
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col p-5">
                          <div className="flex-1">
                            {category && (
                              <p className="text-xs font-medium text-amber-700">
                                {category.name}
                              </p>
                            )}

                            <h3 className="mt-2 text-xl font-bold">
                              {project.title}
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-stone-500">
                              {project.city && (
                                <span>
                                  {project.city}
                                </span>
                              )}

                              {project.year && (
                                <span>
                                  {project.year}
                                </span>
                              )}

                              <span>
                                {images.length}{" "}
                                {images.length === 1
                                  ? "תמונה"
                                  : "תמונות"}
                              </span>
                            </div>
                          </div>

                          {/* ACTIONS */}
                          <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-5">
                            <Link
                              href={`/admin/projects/${project.id}/edit`}
                              className="rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-amber-700"
                            >
                              עריכה
                            </Link>

                            {project.published && (
                              <Link
                                href={`/projects/${project.slug}`}
                                target="_blank"
                                className="rounded-full border border-stone-300 px-4 py-2 text-xs font-medium transition hover:bg-stone-100"
                              >
                                צפייה באתר
                              </Link>
                            )}

                            <form
                              action={
                                publishAction
                              }
                            >
                              <button
                                type="submit"
                                className="rounded-full border border-stone-300 px-4 py-2 text-xs font-medium transition hover:bg-stone-100"
                              >
                                {project.published
                                  ? "הפוך לטיוטה"
                                  : "פרסם"}
                              </button>
                            </form>

                            <form
                              action={
                                featuredAction
                              }
                            >
                              <button
                                type="submit"
                                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                                  project.featured
                                    ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                    : "border-stone-300 hover:bg-stone-100"
                                }`}
                              >
                                {project.featured
                                  ? "הסר מנבחרים"
                                  : "סמן כנבחר"}
                              </button>
                            </form>

                            <DeleteProjectButton
                              projectId={
                                project.id
                              }
                              projectTitle={
                                project.title
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ========================================= */
/* STAT */
/* ========================================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

/* ========================================= */
/* STATUS */
/* ========================================= */

function StatusBadge({
  published,
}: {
  published: boolean;
}) {
  return published ? (
    <span className="rounded-full bg-green-500 px-3 py-1 text-[10px] font-bold text-white shadow">
      פורסם
    </span>
  ) : (
    <span className="rounded-full bg-stone-800 px-3 py-1 text-[10px] font-bold text-white shadow">
      טיוטה
    </span>
  );
}

/* ========================================= */
/* RELATION */
/* ========================================= */

function normalizeRelation(
  relation:
    | Relation
    | Relation[]
    | null
    | undefined
): Relation | null {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

/* ========================================= */
/* IMAGE */
/* ========================================= */

function getImageUrl(
  storagePath: string
) {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  return `${supabaseUrl}/storage/v1/object/public/project-images/${storagePath}`;
}