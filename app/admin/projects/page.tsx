import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import {
  toggleFeatured,
  togglePublished,
} from "./actions";

export const instant = false;

export default async function AdminProjectsPage() {
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

  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      slug,
      description,
      city,
      year,
      published,
      featured,
      created_at,

      category:categories (
        name
      ),

      project_images (
        storage_path,
        sort_order
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);

    return (
      <main
        dir="rtl"
        className="min-h-screen bg-stone-100 p-10"
      >
        <p className="text-red-600">
          אירעה שגיאה בטעינת הפרויקטים.
        </p>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-100"
    >
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm text-stone-500">
              מערכת ניהול
            </p>

            <h1 className="text-2xl font-bold">
              ניהול עבודות
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
            >
              חזרה ל-Dashboard
            </Link>

            <Link
              href="/admin/projects/new"
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              + הוסף עבודה
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Top information */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            כל העבודות
          </h2>

          <p className="mt-2 text-stone-600">
            {projects?.length || 0} פרויקטים במערכת
          </p>
        </div>

        {!projects || projects.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
            <p className="text-lg font-medium">
              עדיין אין עבודות
            </p>

            <Link
              href="/admin/projects/new"
              className="mt-5 inline-block rounded-lg bg-stone-900 px-6 py-3 text-white"
            >
              הוסף עבודה ראשונה
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {projects.map((project) => {
              const category = Array.isArray(project.category)
                ? project.category[0]
                : project.category;

              const sortedImages = [
                ...(project.project_images || []),
              ].sort(
                (a, b) =>
                  a.sort_order - b.sort_order
              );

              const firstImage = sortedImages[0];

              const imageUrl = firstImage
                ? supabase.storage
                    .from("project-images")
                    .getPublicUrl(
                      firstImage.storage_path
                    ).data.publicUrl
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
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
                >
                  <div className="grid md:grid-cols-[220px_1fr]">
                    {/* Image */}
                    <div className="bg-stone-200">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="aspect-[4/3] h-full w-full object-cover md:aspect-auto"
                        />
                      ) : (
                        <div className="flex min-h-44 items-center justify-center text-stone-500">
                          🪵 אין תמונה
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            {project.published ? (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                פורסם
                              </span>
                            ) : (
                              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                                טיוטה
                              </span>
                            )}

                            {project.featured && (
                              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                                מומלץ
                              </span>
                            )}
                          </div>

                          <h3 className="text-2xl font-bold">
                            {project.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-2 text-sm text-stone-500">
                            {category?.name && (
                              <span>
                                {category.name}
                              </span>
                            )}

                            {project.city && (
                              <>
                                <span>•</span>
                                <span>
                                  {project.city}
                                </span>
                              </>
                            )}

                            {project.year && (
                              <>
                                <span>•</span>
                                <span>
                                  {project.year}
                                </span>
                              </>
                            )}
                          </div>

                          <p
                            dir="ltr"
                            className="mt-3 text-left text-xs text-stone-400"
                          >
                            /projects/{project.slug}
                          </p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="mt-6 flex flex-wrap gap-3 border-t border-stone-200 pt-5">
                        <Link
  href={`/admin/projects/${project.id}/edit`}
  className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
>
  עריכה
</Link>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
                        >
                          צפייה
                        </Link>

                        <form action={publishAction}>
                          <button
                            type="submit"
                            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
                          >
                            {project.published
                              ? "הסתר מהאתר"
                              : "פרסם באתר"}
                          </button>
                        </form>

                        <form action={featuredAction}>
                          <button
                            type="submit"
                            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
                          >
                            {project.featured
                              ? "הסר ממומלצים"
                              : "סמן כמומלץ"}
                          </button>
                        </form>

                        <DeleteProjectButton
                          projectId={project.id}
                          projectTitle={
                            project.title
                          }
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}