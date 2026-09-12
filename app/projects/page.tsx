import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ProjectFilters from "@/components/ProjectFilters";

import { supabasePublic } from "@/lib/supabase/public";

export const instant = false;

export const metadata: Metadata = {
  title: "עבודות",
  description:
    "גלריית עבודות נגריית עימאד אקרם - מטבחים, ארונות, חדרי שינה, מזנונים ועבודות נגרות בהתאמה אישית.",
  alternates: {
    canonical: "/projects",
  },
};

type ProjectsPageProps = {
  searchParams: Promise<{
    category?: string;
    wood?: string;
    room?: string;
    style?: string;
  }>;
};

type Relation = {
  name: string;
  slug: string;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const filters =
    await searchParams;

  const [
    projectsResult,
    categoriesResult,
    roomsResult,
    woodTypesResult,
    stylesResult,
  ] = await Promise.all([
    supabasePublic
      .from("projects")
      .select(`
        id,
        title,
        slug,
        description,
        city,
        finish,
        year,
        featured,
        published,
        created_at,

        categories (
          name,
          slug
        ),

        rooms (
          name,
          slug
        ),

        styles (
          name,
          slug
        ),

        project_images (
          id,
          storage_path,
          alt_text,
          sort_order
        ),

        project_wood_types (
          wood_types (
            name,
            slug
          )
        )
      `)
      .eq("published", true)
      .order("featured", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      }),

    supabasePublic
      .from("categories")
      .select(
        "id, name, slug, sort_order"
      )
      .order("sort_order", {
        ascending: true,
      }),

    supabasePublic
      .from("rooms")
      .select(
        "id, name, slug, sort_order"
      )
      .order("sort_order", {
        ascending: true,
      }),

    supabasePublic
      .from("wood_types")
      .select(
        "id, name, slug, sort_order"
      )
      .order("sort_order", {
        ascending: true,
      }),

    supabasePublic
      .from("styles")
      .select(
        "id, name, slug, sort_order"
      )
      .order("sort_order", {
        ascending: true,
      }),
  ]);

  const projects =
    projectsResult.data ?? [];

  const categories =
    categoriesResult.data ?? [];

  const rooms =
    roomsResult.data ?? [];

  const woodTypes =
    woodTypesResult.data ?? [];

  const styles =
    stylesResult.data ?? [];

  /* ========================================= */
  /* FILTER PROJECTS */
  /* ========================================= */

  const filteredProjects =
    projects.filter(
      (project) => {
        const category =
          normalizeRelation(
            project.categories
          );

        const room =
          normalizeRelation(
            project.rooms
          );

        const style =
          normalizeRelation(
            project.styles
          );

        const projectWoodTypes =
          (
            project.project_wood_types ??
            []
          )
            .map((item) =>
              normalizeRelation(
                item.wood_types
              )
            )
            .filter(
              (
                item
              ): item is Relation =>
                Boolean(item)
            );

        if (
          filters.category &&
          category?.slug !==
            filters.category
        ) {
          return false;
        }

        if (
          filters.room &&
          room?.slug !==
            filters.room
        ) {
          return false;
        }

        if (
          filters.style &&
          style?.slug !==
            filters.style
        ) {
          return false;
        }

        if (
          filters.wood &&
          !projectWoodTypes.some(
            (wood) =>
              wood.slug ===
              filters.wood
          )
        ) {
          return false;
        }

        return true;
      }
    );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf9f6] text-stone-900"
    >
      {/* ========================================= */}
      {/* HERO */}
      {/* ========================================= */}

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-sm font-medium text-amber-700">
                תיק עבודות
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight md:text-7xl">
                עבודות שנבנו
                <br />
                בדיוק למקום שלהן.
              </h1>
            </div>

            <div className="lg:pb-2">
              <p className="max-w-lg text-lg leading-8 text-stone-600">
                מטבחים, ארונות,
                ספריות, מזנונים
                ופתרונות נגרות
                בהתאמה אישית .
                לכל פרויקט תכנון,
                חומר וגימור משלו.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FILTERS */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 pt-10">
        <ProjectFilters
          categories={categories}
          woodTypes={woodTypes}
          rooms={rooms}
          styles={styles}
        />
      </section>

      {/* ========================================= */}
      {/* RESULTS */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">
              מציג
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {filteredProjects.length}{" "}
              {filteredProjects.length ===
              1
                ? "עבודה"
                : "עבודות"}
            </h2>
          </div>

          {hasActiveFilters(
            filters
          ) && (
            <Link
              href="/projects"
              className="text-sm font-medium text-stone-500 transition hover:text-amber-700"
            >
              הצג את כל העבודות ←
            </Link>
          )}
        </div>

        {/* No results */}
        {filteredProjects.length ===
        0 ? (
          <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-2xl">
              ⌕
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              לא נמצאו עבודות
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-stone-500">
              לא נמצאו פרויקטים
              שמתאימים לשילוב
              הסינון שבחרתם.
            </p>

            <Link
              href="/projects"
              className="mt-7 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white"
            >
              ניקוי כל המסננים
            </Link>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map(
              (
                project,
                index
              ) => {
                const category =
                  normalizeRelation(
                    project.categories
                  );

                const room =
                  normalizeRelation(
                    project.rooms
                  );

                const style =
                  normalizeRelation(
                    project.styles
                  );

                const woodTypes =
                  (
                    project.project_wood_types ??
                    []
                  )
                    .map((item) =>
                      normalizeRelation(
                        item.wood_types
                      )
                    )
                    .filter(
                      (
                        item
                      ): item is Relation =>
                        Boolean(item)
                    );

                const images = [
                  ...(project.project_images ??
                    []),
                ].sort(
                  (a, b) =>
                    (a.sort_order ??
                      0) -
                    (b.sort_order ??
                      0)
                );

                const firstImage =
                  images[0] ?? null;

                const imageUrl =
                  firstImage
                    ? getImageUrl(
                        firstImage.storage_path
                      )
                    : null;

                return (
                  <article
                    key={project.id}
                    className="group"
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="block"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-stone-200">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={
                              firstImage?.alt_text ||
                              project.title
                            }
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-stone-400">
                            אין תמונה
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                        {/* Featured */}
                        {project.featured && (
                          <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                            פרויקט נבחר
                          </span>
                        )}

                        {/* Arrow */}
                        <span className="absolute bottom-4 left-4 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-white text-lg text-stone-900 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          ←
                        </span>

                        {/* Number */}
                        <span className="absolute bottom-5 right-5 text-xs text-white/80">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="mt-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                          {category && (
                            <span>
                              {
                                category.name
                              }
                            </span>
                          )}

                          {category &&
                            style && (
                              <span>
                                •
                              </span>
                            )}

                          {style && (
                            <span>
                              {
                                style.name
                              }
                            </span>
                          )}
                        </div>

                        <h2 className="mt-2 text-2xl font-bold tracking-tight transition group-hover:text-amber-700">
                          {
                            project.title
                          }
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {woodTypes
                            .slice(0, 2)
                            .map(
                              (
                                wood
                              ) => (
                                <ProjectTag
                                  key={
                                    wood.slug
                                  }
                                >
                                  {
                                    wood.name
                                  }
                                </ProjectTag>
                              )
                            )}

                          {room && (
                            <ProjectTag>
                              {room.name}
                            </ProjectTag>
                          )}

                          {project.city && (
                            <ProjectTag>
                              {
                                project.city
                              }
                            </ProjectTag>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* ========================================= */}
      {/* CTA */}
      {/* ========================================= */}

      <section className="px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px] rounded-[2rem] bg-stone-900 px-6 py-20 text-center text-white md:py-24">
          <p className="text-sm font-medium text-amber-500">
            לא מצאתם בדיוק את מה
            שחיפשתם?
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            כל עבודה מתחילה
            מתכנון חדש.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-stone-400">
            ספרו לנו מה אתם רוצים
            לבנות, ונוכל לתכנן פתרון
            שמתאים לחלל ולצרכים שלכם.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-13 items-center justify-center rounded-full bg-white px-7 font-medium text-stone-900 transition hover:bg-amber-600 hover:text-white"
          >
            קבלת הצעת מחיר
            <span className="mr-2">
              ←
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ========================================= */
/* TAG */
/* ========================================= */

function ProjectTag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-600">
      {children}
    </span>
  );
}

/* ========================================= */
/* RELATION NORMALIZER */
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
/* IMAGE URL */
/* ========================================= */

function getImageUrl(
  storagePath: string
) {
  const { data } =
    supabasePublic.storage
      .from("project-images")
      .getPublicUrl(storagePath);

  return data.publicUrl;
}

/* ========================================= */
/* ACTIVE FILTERS */
/* ========================================= */

function hasActiveFilters(
  filters: {
    category?: string;
    wood?: string;
    room?: string;
    style?: string;
  }
) {
  return Boolean(
    filters.category ||
      filters.wood ||
      filters.room ||
      filters.style
  );
}