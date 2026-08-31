import Link from "next/link";

import { supabasePublic } from "@/lib/supabase/public";
import { SITE_NAME } from "@/lib/site";
export const instant = false;



export default async function HomePage() {
  const [featuredResult, categoriesResult] =
    await Promise.all([
      supabasePublic
        .from("projects")
        .select(`
          id,
          title,
          slug,
          description,
          city,
          featured,
          created_at,

          project_images (
            storage_path,
            alt_text,
            sort_order
          ),

          category:categories (
            name,
            slug
          ),

          style:styles (
            name,
            slug
          ),

          project_wood_types (
            wood_type:wood_types (
              name,
              slug
            )
          )
        `)
        .eq("published", true)
        .eq("featured", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(6),

      supabasePublic
        .from("categories")
        .select(`
          id,
          name,
          slug,
          sort_order
        `)
        .order("sort_order"),
    ]);

  const featuredProjects =
    featuredResult.data || [];

  const categories =
    categoriesResult.data || [];

  /*
   * התמונה של הפרויקט המומלץ הראשון
   * משמשת כתמונת Hero בדף הבית.
   */
  const heroProject = featuredProjects[0];

  const heroImages = [
    ...(heroProject?.project_images || []),
  ].sort(
    (a, b) =>
      a.sort_order - b.sort_order
  );

  const heroImage = heroImages[0];

  const heroImageUrl = heroImage
    ? supabasePublic.storage
        .from("project-images")
        .getPublicUrl(
          heroImage.storage_path
        ).data.publicUrl
    : null;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-50 text-stone-900"
    >
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      

      {/* ========================================= */}
      {/* HERO */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <p className="mb-5 font-medium text-amber-700">
              נגרות בהתאמה אישית
            </p>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.15] tracking-tight md:text-6xl lg:text-7xl">
              יוצרים בדיוק
              <br />
              את מה שדמיינתם.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-600">
              תכנון, ייצור והתקנה של עבודות
              נגרות בהתאמה אישית, תוך
              הקפדה על חומרי גלם איכותיים,
              גימור מדויק וירידה לפרטים.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="rounded-lg bg-stone-900 px-7 py-3.5 font-medium text-white transition hover:bg-stone-700"
              >
                לצפייה בעבודות
              </Link>

              <Link
                href="/contact"
                className="rounded-lg border border-stone-300 bg-white px-7 py-3.5 font-medium transition hover:bg-stone-100"
              >
                דברו איתנו
              </Link>
            </div>

            {/* Highlights */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-stone-200 pt-8">
              <div>
                <p className="text-2xl font-bold">
                  100%
                </p>

                <p className="mt-1 text-sm text-stone-500">
                  בהתאמה אישית
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  איכות
                </p>

                <p className="mt-1 text-sm text-stone-500">
                  חומרי גלם וגימור
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  ליווי
                </p>

                <p className="mt-1 text-sm text-stone-500">
                  מתכנון ועד התקנה
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            {heroImageUrl ? (
              <div className="overflow-hidden rounded-3xl bg-stone-200">
                <img
                  src={heroImageUrl}
                  alt={
                    heroImage?.alt_text ||
                    heroProject?.title ||
                    SITE_NAME
                  }
                  className="aspect-[4/5] w-full object-cover lg:aspect-[5/6]"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-3xl bg-stone-200 lg:aspect-[5/6]">
                <div className="text-center text-stone-500">
                  <div className="text-7xl">
                    🪵
                  </div>

                  <p className="mt-5">
                    סמן פרויקט כ״מומלץ״
                    <br />
                    כדי להציג כאן תמונה
                  </p>
                </div>
              </div>
            )}

            {heroProject && (
              <Link
                href={`/projects/${heroProject.slug}`}
                className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-5 backdrop-blur transition hover:bg-white"
              >
                <p className="text-xs font-medium text-amber-700">
                  פרויקט נבחר
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {heroProject.title}
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  לצפייה בפרויקט ←
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* CATEGORIES */}
      {/* ========================================= */}

      <section className="border-y border-stone-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-medium text-amber-700">
                תחומי עבודה
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                נגרות לכל חלל
              </h2>
            </div>

            <Link
              href="/projects"
              className="font-medium transition hover:text-amber-700"
            >
              לכל העבודות ←
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories
              .slice(0, 8)
              .map((category, index) => (
                <Link
                  href={`/projects?category=${category.slug}`}
                  key={category.id}
                  className="group flex min-h-44 flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50 p-6 transition hover:-translate-y-1 hover:border-stone-400 hover:bg-white"
                >
                  <span className="text-sm text-stone-400">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div>
                    <h3 className="text-2xl font-bold">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm text-stone-500">
                      לצפייה בפרויקטים ←
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FEATURED PROJECTS */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-medium text-amber-700">
              תיק עבודות
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              עבודות נבחרות
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-stone-600">
              מבחר פרויקטים שביצענו,
              מהתכנון הראשוני ועד לפרט האחרון.
            </p>
          </div>

          <Link
            href="/projects"
            className="font-medium transition hover:text-amber-700"
          >
            הצג את כל הפרויקטים ←
          </Link>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-12 text-center">
            <p className="text-stone-500">
              עדיין לא סומנו עבודות מומלצות.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map(
              (project) => {
                const category =
                  Array.isArray(
                    project.category
                  )
                    ? project.category[0]
                    : project.category;

                const style =
                  Array.isArray(project.style)
                    ? project.style[0]
                    : project.style;

                const woodNames =
                  project.project_wood_types
                    ?.map((item) => {
                      const woodType =
                        Array.isArray(
                          item.wood_type
                        )
                          ? item.wood_type[0]
                          : item.wood_type;

                      return woodType?.name;
                    })
                    .filter(Boolean) || [];

                const sortedImages = [
                  ...(project.project_images ||
                    []),
                ].sort(
                  (a, b) =>
                    a.sort_order -
                    b.sort_order
                );

                const firstImage =
                  sortedImages[0];

                const imageUrl = firstImage
                  ? supabasePublic.storage
                      .from("project-images")
                      .getPublicUrl(
                        firstImage.storage_path
                      ).data.publicUrl
                  : null;

                return (
                  <Link
                    href={`/projects/${project.slug}`}
                    key={project.id}
                    className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {imageUrl ? (
                      <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                        <img
                          src={imageUrl}
                          alt={
                            firstImage?.alt_text ||
                            project.title
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-stone-200 text-stone-500">
                        אין תמונה
                      </div>
                    )}

                    <div className="p-6">
                      {category?.name && (
                        <p className="text-sm font-medium text-amber-700">
                          {category.name}
                        </p>
                      )}

                      <h3 className="mt-2 text-2xl font-bold">
                        {project.title}
                      </h3>

                      {project.description && (
                        <p className="mt-3 line-clamp-2 leading-7 text-stone-600">
                          {project.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-stone-500">
                        {woodNames.length > 0 && (
                          <span>
                            {woodNames.join(" • ")}
                          </span>
                        )}

                        {style?.name && (
                          <>
                            {woodNames.length > 0 && (
                              <span>•</span>
                            )}

                            <span>
                              {style.name}
                            </span>
                          </>
                        )}

                        {project.city && (
                          <>
                            {(woodNames.length > 0 ||
                              style?.name) && (
                              <span>•</span>
                            )}

                            <span>
                              {project.city}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="mt-6 font-medium">
                        לצפייה בפרויקט ←
                      </p>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* ========================================= */}
      {/* PROCESS */}
      {/* ========================================= */}

      <section className="bg-stone-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl">
            <p className="font-medium text-stone-400">
              איך זה עובד?
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              מרעיון ועד התקנה
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <ProcessStep
              number="01"
              title="פגישה ומדידה"
              description="הבנת הצרכים, החלל והחזון שלכם."
            />

            <ProcessStep
              number="02"
              title="תכנון"
              description="בחירת חומרים, מידות, צבעים וגימורים."
            />

            <ProcessStep
              number="03"
              title="ייצור"
              description="ייצור מדויק תוך הקפדה על כל פרט."
            />

            <ProcessStep
              number="04"
              title="התקנה"
              description="התקנה מקצועית וגימור העבודה בבית הלקוח."
            />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* CTA */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-amber-50 px-8 py-16 text-center md:px-16">
          <p className="font-medium text-amber-800">
            יש לכם רעיון?
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            בואו נהפוך אותו
            <br />
            לפרויקט הבא שלכם.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-stone-600">
            ספרו לנו מה אתם מחפשים ונשמח
            לבנות פתרון שמתאים בדיוק לחלל,
            לסגנון ולתקציב שלכם.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-stone-900 px-8 py-3.5 font-medium text-white transition hover:bg-stone-700"
          >
            לקבלת הצעת מחיר
          </Link>
        </div>
      </section>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}

      
    </main>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-stone-700 pt-6">
      <p className="text-sm text-stone-500">
        {number}
      </p>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-stone-400">
        {description}
      </p>
    </div>
  );
}