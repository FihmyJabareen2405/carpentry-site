import Image from "next/image";
import Link from "next/link";

import { supabasePublic } from "@/lib/supabase/public";

import {
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";

export const instant = false;

/* ========================================= */
/* HOME PAGE */
/* ========================================= */

export default async function HomePage() {
  const [
    projectsResult,
    categoriesResult,
  ] = await Promise.all([
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
      .order("sort_order", {
        ascending: true,
      }),
  ]);

  const featuredProjects =
    projectsResult.data ?? [];

  const categories =
    categoriesResult.data ?? [];

  /* ========================================= */
  /* HERO IMAGE */
  /* ========================================= */

  const heroProject =
    featuredProjects[0] ?? null;

  const heroImages = heroProject
    ? [
        ...(heroProject.project_images ??
          []),
      ].sort(
        (a, b) =>
          (a.sort_order ?? 0) -
          (b.sort_order ?? 0)
      )
    : [];

  const heroImage =
    heroImages.length > 0
      ? getProjectImageUrl(
          heroImages[0].storage_path
        )
      : null;

  return (
    <main
      dir="rtl"
      className="bg-[#faf9f6] text-stone-900"
    >
      {/* ========================================= */}
      {/* HERO */}
      {/* ========================================= */}

      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[620px] max-w-[1500px] overflow-hidden rounded-[2rem] bg-stone-900 md:min-h-[720px]">
          {/* Background */}
          {heroImage ? (
            <Image
              src={heroImage}
              alt={
                heroImages[0]?.alt_text ||
                heroProject?.title ||
                SITE_NAME
              }
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-bl from-stone-700 via-stone-800 to-stone-950" />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/45 to-black/15" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

          {/* Content */}
          <div className="relative z-10 flex min-h-[620px] items-end md:min-h-[720px]">
            <div className="w-full px-7 pb-10 pt-28 sm:px-10 sm:pb-14 md:px-14 lg:px-20 lg:pb-20">
              <div className="max-w-4xl">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />

                  {SITE_TAGLINE}
                </div>

                <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                  יוצרים בדיוק
                  <br />
                  את מה שדמיינתם.
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg md:text-xl">
                  תכנון, ייצור והתקנה של
                  עבודות נגרות בהתאמה אישית,
                  תוך הקפדה על חומרי גלם,
                  פונקציונליות וגימור מדויק.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/projects"
                    className="inline-flex min-h-13 items-center justify-center rounded-full bg-white px-7 font-medium text-stone-900 transition hover:bg-stone-100"
                  >
                    צפייה בעבודות

                    <span className="mr-2">
                      ←
                    </span>
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 font-medium text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    קבלת הצעת מחיר
                  </Link>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-14 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 backdrop-blur-md sm:grid-cols-3">
                <HeroFeature
                  title="100%"
                  text="התאמה אישית"
                />

                <HeroFeature
                  title="דיוק"
                  text="בתכנון ובביצוע"
                />

                <HeroFeature
                  title="ליווי"
                  text="משלב הרעיון ועד ההתקנה"
                />
              </div>
            </div>
          </div>

          {/* Project label */}
          {heroProject && (
            <Link
              href={`/projects/${heroProject.slug}`}
              className="absolute bottom-6 left-6 z-20 hidden max-w-xs rounded-2xl border border-white/20 bg-black/30 p-4 text-white backdrop-blur-xl transition hover:bg-black/45 lg:block"
            >
              <p className="text-xs text-white/60">
                פרויקט נבחר
              </p>

              <p className="mt-1 font-medium">
                {heroProject.title}
              </p>

              <p className="mt-2 text-xs text-white/60">
                לצפייה בפרויקט ←
              </p>
            </Link>
          )}
        </div>
      </section>

      {/* ========================================= */}
      {/* INTRO */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-sm font-medium tracking-wide text-amber-700">
              {SITE_NAME}
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              נגרות שמתוכננת
              <br />
              סביבכם.
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-2xl font-medium leading-[1.6] text-stone-700 md:text-3xl">
              כל חלל שונה, ולכן גם כל
              פרויקט מתחיל מחדש — מהמידות
              והצרכים שלכם ועד בחירת החומר,
              הצבע והגימור.
            </p>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 border-b border-stone-900 pb-1 text-sm font-medium"
            >
              עוד על הנגרייה
              <span>←</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* CATEGORIES */}
      {/* ========================================= */}

      {categories.length > 0 && (
        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24">
            {/* Heading */}
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-amber-700">
                  תחומי עבודה
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                  מה אפשר לבנות?
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-stone-500">
                  בחרו תחום כדי לראות עבודות,
                  רעיונות ופתרונות נגרות
                  המתאימים לכם.
                </p>
              </div>

              <Link
                href="/projects"
                className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium transition hover:bg-stone-900 hover:text-white"
              >
                לכל העבודות
              </Link>
            </div>

            {/* Category Cards */}
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(
                (
                  category,
                  index
                ) => (
                  <Link
                    key={category.id}
                    href={`/projects?category=${category.slug}`}
                    className="group relative min-h-[340px] overflow-hidden rounded-[2rem] bg-stone-900 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <Image
                      src={getCategoryImage(
                        category.slug
                      )}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    {/* Subtle darkening on hover */}
                    <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

                    {/* Top */}
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
                      {/* Number */}
                      <span className="text-xs font-medium text-white/65">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {/* Arrow */}
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/10 text-lg text-white backdrop-blur-md transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-stone-900">
                        ←
                      </span>
                    </div>

                    {/* Bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                      <h3 className="text-2xl font-bold text-white md:text-3xl">
                        {category.name}
                      </h3>

                      <p className="mt-3 max-w-sm text-sm leading-7 text-white/75">
                        {getCategoryDescription(
                          category.slug
                        )}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white/70 opacity-0 transition duration-300 group-hover:opacity-100">
                        צפייה בעבודות
                        <span>←</span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================= */}
      {/* FEATURED PROJECTS */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-amber-700">
              פרויקטים נבחרים
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              עבודות אחרונות
            </h2>
          </div>

          <Link
            href="/projects"
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium transition hover:bg-stone-900 hover:text-white"
          >
            לכל הפרויקטים
          </Link>
        </div>

        {featuredProjects.length ===
        0 ? (
          <div className="mt-12 rounded-3xl border border-stone-200 bg-white p-12 text-center text-stone-500">
            בקרוב יופיעו כאן עבודות
            נבחרות.
          </div>
        ) : (
          <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2">
            {featuredProjects
              .slice(0, 4)
              .map(
                (
                  project,
                  index
                ) => {
                  const category =
                    normalizeRelation(
                      project.categories
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

                  const imageUrl =
                    images.length > 0
                      ? getProjectImageUrl(
                          images[0]
                            .storage_path
                        )
                      : null;

                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.slug}`}
                      className={`group block ${
                        index % 2 === 1
                          ? "md:mt-16"
                          : ""
                      }`}
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-stone-200">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={
                              images[0]
                                ?.alt_text ||
                              project.title
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-stone-400">
                            אין תמונה
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                        <span className="absolute bottom-5 left-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-white text-stone-900 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          ←
                        </span>
                      </div>

                      {/* Info */}
                      <div className="mt-5 flex items-start justify-between gap-6">
                        <div>
                          {category && (
                            <p className="text-sm text-stone-500">
                              {
                                category.name
                              }
                            </p>
                          )}

                          <h3 className="mt-1 text-2xl font-bold tracking-tight transition group-hover:text-amber-700">
                            {project.title}
                          </h3>

                          {project.city && (
                            <p className="mt-2 text-sm text-stone-500">
                              {
                                project.city
                              }
                            </p>
                          )}
                        </div>

                        <span className="pt-1 text-sm text-stone-400">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>
                    </Link>
                  );
                }
              )}
          </div>
        )}
      </section>

      {/* ========================================= */}
      {/* MATERIAL VISUALIZER */}
      {/* ========================================= */}

      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] bg-stone-950 shadow-sm md:min-h-[520px]">
          <div className="relative aspect-[16/9] w-full bg-stone-100 md:absolute md:inset-0 md:aspect-auto">
            <Image
              src="/visualizer-bg.png"
              alt="הדמיית שילובי עץ, צבעים וחומרים"
              fill
              sizes="100vw"
              className="object-contain md:object-cover"
            />
          </div>

          <div className="hidden md:absolute md:inset-0 md:block md:bg-gradient-to-l md:from-black/90 md:via-black/60 md:to-black/25" />
          <div className="hidden md:absolute md:inset-0 md:block md:bg-gradient-to-t md:from-black/55 md:via-transparent md:to-black/10" />

          <div className="relative z-10 flex items-center px-7 py-10 sm:px-10 md:min-h-[520px] md:px-16 md:py-16 lg:px-20">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                הדמיית חומרים אינטראקטיבית
              </div>

              <h2 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                לפני שבוחרים,
                <br />
                רואים איך זה משתלב.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
                שלבו סוגי עץ, צבעים, חזיתות וידיות וקבלו המחשה מיידית של הכיוון העיצובי שמתאים לפרויקט שלכם.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/visualizer"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 font-medium text-stone-950 transition hover:bg-amber-500 hover:text-white"
                >
                  פתחו את הדמיית החומרים
                  <span className="mr-2" aria-hidden="true">
                    ←
                  </span>
                </Link>

                <Link
                  href="/projects"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/30 bg-black/20 px-7 font-medium text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  השראה מהפרויקטים
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* PROCESS */}
      {/* ========================================= */}

      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-medium text-amber-500">
                תהליך העבודה
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                מרעיון
                <br />
                ועד התקנה.
              </h2>

              <p className="mt-6 max-w-sm leading-7 text-stone-400">
                תהליך מסודר שמאפשר להגיע
                לתוצאה שמתאימה לחלל,
                לצרכים ולסגנון שלכם.
              </p>
            </div>

            <div>
              <ProcessRow
                number="01"
                title="היכרות ומדידה"
                text="מבינים את הצורך, החלל, המידות והכיוון העיצובי."
              />

              <ProcessRow
                number="02"
                title="תכנון ובחירת חומרים"
                text="בוחרים מבנה, חומרי גלם, צבעים, גימורים ופרטים."
              />

              <ProcessRow
                number="03"
                title="ייצור"
                text="הפרויקט עובר לייצור בהתאם לתכנון ולמידות."
              />

              <ProcessRow
                number="04"
                title="הובלה והתקנה"
                text="התקנה מדויקת וגימור סופי בבית או בעסק."
                last
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FINAL CTA */}
      {/* ========================================= */}

      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[430px] max-w-[1500px] items-center justify-center overflow-hidden rounded-[2rem] bg-amber-700 px-6 py-20 text-center text-white">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-white/70">
              מתחילים פרויקט חדש?
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              בואו נהפוך את הרעיון
              <br />
              שלכם למציאות.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
              ספרו לנו מה אתם רוצים לבנות
              ונחזור אליכם כדי להתחיל
              לתכנן.
            </p>

            <Link
              href="/contact"
              className="mt-9 inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 font-medium text-stone-900 transition hover:scale-[1.03]"
            >
              קבלת הצעת מחיר

              <span className="mr-2">
                ←
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ========================================= */
/* HERO FEATURE */
/* ========================================= */

function HeroFeature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="bg-black/20 px-5 py-5 text-white">
      <p className="text-xl font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs text-white/65">
        {text}
      </p>
    </div>
  );
}

/* ========================================= */
/* PROCESS ROW */
/* ========================================= */

function ProcessRow({
  number,
  title,
  text,
  last = false,
}: {
  number: string;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid gap-5 py-7 sm:grid-cols-[70px_1fr_1.2fr] sm:items-start ${
        !last
          ? "border-b border-white/15"
          : ""
      }`}
    >
      <span className="text-sm text-stone-500">
        {number}
      </span>

      <h3 className="text-xl font-medium">
        {title}
      </h3>

      <p className="leading-7 text-stone-400">
        {text}
      </p>
    </div>
  );
}

/* ========================================= */
/* RELATION NORMALIZER */
/* ========================================= */

function normalizeRelation(
  relation:
    | {
        name: string;
        slug: string;
      }
    | {
        name: string;
        slug: string;
      }[]
    | null
    | undefined
) {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

/* ========================================= */
/* PROJECT IMAGE FROM SUPABASE */
/* ========================================= */

function getProjectImageUrl(
  storagePath: string
) {
  const { data } =
    supabasePublic.storage
      .from("project-images")
      .getPublicUrl(storagePath);

  return data.publicUrl;
}

/* ========================================= */
/* CATEGORY IMAGE */
/* ========================================= */

function getCategoryImage(
  slug: string
) {
  const images: Record<
    string,
    string
  > = {
    kitchens:
      "/categories/kitchens.jpg",

    cabinets:
      "/categories/cabinets.jpg",

    tables:
      "/categories/tables.png",

    "wall-units":
      "/categories/wall-units.png",

    doors:
      "/categories/doors.jpg",

    "wall-cladding":
      "/categories/wall-cladding.png",

    custom:
      "/categories/custom.png",
  };

  return (
    images[slug] ||
    "/categories/custom.jpg"
  );
}

/* ========================================= */
/* CATEGORY DESCRIPTION */
/* ========================================= */

function getCategoryDescription(
  slug: string
) {
  const descriptions: Record<
    string,
    string
  > = {
    kitchens:
      "מטבחים בהתאמה אישית, מתכנון החלל ועד הפרטים הקטנים.",

    cabinets:
      "פתרונות אחסון וארונות המותאמים בדיוק למידות ולצרכים.",

    tables:
      "שולחנות ופריטי נגרות שמשלבים פונקציונליות ועיצוב.",

    "wall-units":
      "ספריות, מזנונים ופתרונות מעוצבים לסלון ולחללי אירוח.",

    doors:
      "דלתות בהתאמה אישית במגוון חומרים, גוונים וגימורים.",

    "wall-cladding":
      "חיפויי קיר ואלמנטים דקורטיביים שמעניקים לחלל אופי.",

    custom:
      "עבודות מיוחדות ופתרונות נגרות שנבנים לפי הרעיון שלכם.",
  };

  return (
    descriptions[slug] ||
    "עבודת נגרות בהתאמה אישית, מתכנון ועד התקנה."
  );
}