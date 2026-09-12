import Image from "next/image";
import Link from "next/link";
import { Heebo } from "next/font/google";

import { supabasePublic } from "@/lib/supabase/public";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const instant = false;

export default async function HomePage() {
  const [projectsResult, categoriesResult, categoryProjectsResult] =
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
        .order("created_at", { ascending: false })
        .limit(6),

      supabasePublic
        .from("categories")
        .select(`
          id,
          name,
          slug,
          sort_order
        `)
        .order("sort_order", { ascending: true }),

      supabasePublic
        .from("projects")
        .select(`
          category_id,
          created_at,
          project_images (
            id,
            storage_path,
            alt_text,
            sort_order
          )
        `)
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  const featuredProjects = projectsResult.data ?? [];
  const categories = categoriesResult.data ?? [];
  const categoryProjects = categoryProjectsResult.data ?? [];

  const categoryBackgrounds = new Map<
    string,
    { url: string; alt: string }
  >();

  for (const project of categoryProjects) {
    if (!project.category_id || categoryBackgrounds.has(project.category_id)) {
      continue;
    }

    const images = [...(project.project_images ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    if (images[0]?.storage_path) {
      categoryBackgrounds.set(project.category_id, {
        url: getProjectImageUrl(images[0].storage_path),
        alt: images[0].alt_text || "עבודת נגרות בהתאמה אישית",
      });
    }
  }

  const categoryFallbackImages: Record<string, { url: string; alt: string }> = {
    kitchens: {
      url: "/categories/kitchens-v2.jpg",
      alt: "מטבח נגרות בהתאמה אישית",
    },
    doors: {
      url: "/categories/doors-v2.jpg",
      alt: "דלת עץ בעיצוב נגרות בהתאמה אישית",
    },
    "bedrooms-kids": {
      url: "/categories/bedrooms-kids-v2.jpg",
      alt: "חדר שינה וחדר ילדים בנגרות בהתאמה אישית",
    },
    "wall-cladding": {
      url: "/categories/wall-cladding-v2.jpg",
      alt: "חיפוי קיר בעבודת נגרות בהתאמה אישית",
    },
    custom: {
      url: "/categories/custom-v2.jpg",
      alt: "עבודת נגרות מיוחדת בהתאמה אישית",
    },
  };

  const heroProject = featuredProjects[0] ?? null;
  const heroImages = heroProject
    ? [...(heroProject.project_images ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      )
    : [];

  const heroImage =
    heroImages.length > 0
      ? getProjectImageUrl(heroImages[0].storage_path)
      : null;

  return (
    <main dir="rtl" className="overflow-hidden bg-[#f4f1eb] text-[#1f1f1c]">
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div className="relative mx-auto min-h-[84vh] max-w-[1600px] overflow-hidden rounded-[1.7rem] bg-stone-900 sm:rounded-[2.2rem]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={heroImages[0]?.alt_text || heroProject?.title || SITE_NAME}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#6b6459_0%,#302d28_42%,#11100e_100%)]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />

          <div className="relative z-10 flex min-h-[84vh] items-end">
            <div className="w-full px-6 pb-8 pt-28 sm:px-10 sm:pb-12 md:px-14 lg:px-20 lg:pb-16">
              <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_.65fr]">
                <div className="max-w-5xl">
                  <div className="mb-8 flex flex-col items-start">
                    <div className="rounded-[1.6rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                      <Image
                        src="/brand/logo.png"
                        alt={SITE_NAME}
                        width={260}
                        height={160}
                        priority
                        className="h-auto w-[150px] object-contain drop-shadow-2xl sm:w-[190px] md:w-[230px]"
                      />
                    </div>

                    <h1
                      className={`${heebo.className} mt-6 text-3xl font-medium tracking-[-0.03em] text-[#f1e5d2] sm:text-4xl md:text-5xl`}
                    >
                      נגריית עימאד אקרם גבארין
                    </h1>

                    <div className="mt-5 h-px w-20 bg-white/45" />

                    <p className="mt-5 text-xl font-light leading-relaxed text-white/85 sm:text-2xl md:text-3xl">
                      נגרות שמתחילה ברעיון
                      <br className="hidden sm:block" />
                      ונבנית בדיוק בשבילכם.
                    </p>
                  </div>

                  <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <p className="max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                      תכנון, ייצור והתקנה של נגרות בהתאמה אישית,
                      מטבחים, חדרים, דלתות, חיפויים ועבודות מיוחדות.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/projects"
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-stone-950 transition hover:scale-[1.02]"
                      >
                        לפרויקטים
                        <span className="mr-2">←</span>
                      </Link>

                      <Link
                        href="/visualizer"
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
                      >
                        עצבו בעצמכם
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="hidden justify-self-end lg:block">
                  <div className="w-[240px] border-r border-white/25 pr-6 text-white">
                    <p className="text-xs tracking-[0.18em] text-white/50">
                      ATELIER / CUSTOM MADE
                    </p>
                    <p className="mt-4 text-2xl font-light leading-snug">
                      חומר. קו. פרופורציה.
                      <br />
                      עבודת יד מדויקת.
                    </p>
                  </div>
                </div>
              </div>

              {heroProject && (
                <Link
                  href={`/projects/${heroProject.slug}`}
                  className="mt-10 inline-flex items-center gap-3 text-sm text-white/65 transition hover:text-white"
                >
                  <span className="h-px w-12 bg-white/40" />
                  פרויקט נבחר: {heroProject.title}
                </Link>
              )}
            </div>
          </div>

          <div className="absolute left-6 top-6 z-20 hidden rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs text-white/70 backdrop-blur md:block">
            {SITE_TAGLINE}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="grid gap-10 lg:grid-cols-[.55fr_1.45fr]">
          <div>
            <p className="text-xs font-medium tracking-[0.25em] text-stone-500">
              01 / הגישה שלנו
            </p>
          </div>

          <div>
            <h2 className="max-w-5xl text-4xl font-light leading-[1.25] tracking-tight text-stone-800 md:text-6xl">
              אנחנו לא מתחילים ממוצר.
              <br />
              אנחנו מתחילים מהחלל,
              <span className="text-stone-400"> מהשימוש ומהאדם שחי בו.</span>
            </h2>

            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-5 border-t border-stone-300 pt-6 text-sm text-stone-500">
              <span>תכנון מותאם אישית</span>
              <span>חומרי גלם איכותיים</span>
              <span>פרזול וגימור מדויק</span>
              <span>ייצור והתקנה</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-5 pb-28 sm:px-7 md:pb-36">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-[0.25em] text-stone-500">
              02 / תיק עבודות
            </p>
            <h2 className="mt-4 text-4xl font-light tracking-tight md:text-6xl">
              פרויקטים נבחרים
            </h2>
          </div>

          <Link
            href="/projects"
            className="hidden border-b border-stone-900 pb-1 text-sm font-medium md:inline-flex"
          >
            לכל הפרויקטים ←
          </Link>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="rounded-3xl border border-stone-300 bg-white/50 p-12 text-center text-stone-500">
            בקרוב יופיעו כאן עבודות נבחרות.
          </div>
        ) : (
          <div className="space-y-20 md:space-y-28">
            {featuredProjects.slice(0, 4).map((project, index) => {
              const category = normalizeRelation(project.categories);
              const images = [...(project.project_images ?? [])].sort(
                (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
              );
              const imageUrl =
                images.length > 0
                  ? getProjectImageUrl(images[0].storage_path)
                  : null;
              const reverse = index % 2 === 1;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className={`group grid gap-7 md:grid-cols-12 md:items-end ${
                    reverse ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="md:col-span-8">
                    <div
                      className={`relative overflow-hidden rounded-[1.8rem] bg-stone-200 ${
                        index % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/3]"
                      }`}
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={images[0]?.alt_text || project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 70vw"
                          className="object-cover transition duration-1000 ease-out group-hover:scale-[1.035]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-stone-400">
                          אין תמונה
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

                      <span className="absolute left-5 top-5 text-[5rem] font-light leading-none tracking-[-0.08em] text-white/60 md:text-[7rem]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`md:col-span-4 ${
                      reverse ? "md:pr-8" : "md:pl-8"
                    }`}
                  >
                    {category && (
                      <p className="text-xs font-medium tracking-[0.2em] text-stone-500">
                        {category.name}
                      </p>
                    )}

                    <h3 className="mt-3 text-3xl font-light leading-tight tracking-tight md:text-4xl">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-4 line-clamp-3 leading-7 text-stone-500">
                        {project.description}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-stone-300 pt-4 text-sm">
                      <span className="text-stone-500">
                        {project.city || "פרויקט בהתאמה אישית"}
                      </span>
                      <span className="transition group-hover:-translate-x-1">
                        ←
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="bg-[#1d1c19] text-white">
          <div className="mx-auto max-w-[1450px] px-6 py-24 md:py-32">
            <div className="grid gap-10 lg:grid-cols-[.6fr_1.4fr]">
              <div>
                <p className="text-xs font-medium tracking-[0.25em] text-white/45">
                  03 / תחומי עבודה
                </p>

                <h2 className="mt-5 text-4xl font-light leading-tight md:text-5xl">
                  נגרות לכל
                  <br />
                  חלק בבית.
                </h2>
              </div>

              <div className="divide-y divide-white/15 border-y border-white/15">
                {categories.map((category, index) => {
                  const categoryImageOrder = [
                    categoryFallbackImages.kitchens,
                    categoryFallbackImages.doors,
                    categoryFallbackImages["bedrooms-kids"],
                    categoryFallbackImages["wall-cladding"],
                    categoryFallbackImages.custom,
                  ];

                  const background = categoryImageOrder[index];

                  return (
                    <Link
                      key={category.id}
                      href={`/projects?category=${category.slug}`}
                      className="group relative grid min-h-[150px] grid-cols-[55px_1fr_auto] items-center gap-4 overflow-hidden px-4 py-7 transition md:min-h-[175px] md:grid-cols-[90px_1fr_auto] md:px-6 md:py-8"
                    >
                      {background && (
                        <>
                          <Image
                            src={background.url}
                            alt={background.alt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 70vw"
                            className="object-cover opacity-35 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-50"
                          />
                          <div className="absolute inset-0 bg-gradient-to-l from-black/88 via-black/58 to-black/28" />
                        </>
                      )}

                      {!background && (
                        <div className="absolute inset-0 bg-gradient-to-l from-stone-900 via-stone-900/95 to-stone-800/85" />
                      )}

                      <span className="relative z-10 text-sm text-white/55">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="relative z-10">
                        <h3 className="text-2xl font-light text-white drop-shadow-sm md:text-4xl">
                          {category.name}
                        </h3>
                        <p className="mt-2 hidden max-w-xl text-sm leading-6 text-white/70 sm:block">
                          {getCategoryDescription(category.slug)}
                        </p>
                      </div>

                      <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/10 text-lg text-white backdrop-blur-sm transition duration-300 group-hover:bg-white group-hover:text-stone-900">
                        ←
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-3 py-3 sm:px-5 sm:py-5 lg:px-7">
        <div className="relative mx-auto min-h-[600px] max-w-[1600px] overflow-hidden rounded-[1.7rem] bg-stone-950 sm:rounded-[2.2rem]">
          <Image
            src="/visualizer-bg.png"
            alt="הדמיית שילובי עץ, צבעים ופרזול"
            fill
            sizes="100vw"
            className="object-cover opacity-80"
          />

          <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/62 to-black/20" />

          <div className="relative z-10 flex min-h-[600px] items-center px-7 py-16 sm:px-10 md:px-16 lg:px-20">
            <div className="max-w-3xl text-white">
              <p className="text-xs font-medium tracking-[0.25em] text-white/55">
                04 / DESIGN LAB
              </p>

              <h2 className="mt-6 text-5xl font-light leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
                לא רק לדמיין.
                <br />
                לראות לפני שבוחרים.
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
                בחרו סוג עץ, צבע, חזית וידיות וקבלו המחשה מיידית של
                הכיוון העיצובי שמתאים לכם.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/visualizer"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 font-medium text-stone-950 transition hover:scale-[1.02]"
                >
                  פתיחת ה-Visualizer
                  <span className="mr-2">←</span>
                </Link>

                <Link
                  href="/projects"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 font-medium text-white backdrop-blur transition hover:bg-white/10"
                >
                  קבלו השראה
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-xs font-medium tracking-[0.25em] text-stone-500">
              05 / תהליך העבודה
            </p>
            <h2 className="mt-5 text-4xl font-light leading-tight md:text-6xl">
              ארבעה שלבים.
              <br />
              תוצאה אחת מדויקת.
            </h2>
          </div>

          <div className="border-t border-stone-300">
            <ProcessRow
              number="01"
              title="היכרות ומדידה"
              text="מבינים את החלל, הצרכים, המידות והכיוון העיצובי."
            />
            <ProcessRow
              number="02"
              title="תכנון ובחירת חומרים"
              text="מגבשים מבנה, חומרים, צבעים, גימורים ופרזול."
            />
            <ProcessRow
              number="03"
              title="ייצור"
              text="הפרויקט עובר לייצור בהתאם לתכנון ולמידות שסוכמו."
            />
            <ProcessRow
              number="04"
              title="התקנה וגימור"
              text="הובלה, התקנה וגימור סופי בבית או בעסק."
              last
            />
          </div>
        </div>
      </section>

      <section className="px-3 pb-3 sm:px-5 sm:pb-5 lg:px-7">
        <div className="mx-auto flex min-h-[520px] max-w-[1600px] items-center justify-center overflow-hidden rounded-[1.7rem] bg-[#b88655] px-6 py-20 text-center text-white sm:rounded-[2.2rem]">
          <div className="max-w-4xl">
            <p className="text-xs font-medium tracking-[0.25em] text-white/65">
              יש לכם רעיון?
            </p>

            <h2 className="mt-6 text-5xl font-light leading-[1.03] tracking-tight sm:text-6xl md:text-7xl">
              בואו נהפוך אותו
              <br />
              לחלל שחיים בו.
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/80">
              ספרו לנו מה אתם רוצים לבנות ונחזור אליכם כדי להתחיל לתכנן.
            </p>

            <Link
              href="/contact"
              className="mt-10 inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 font-medium text-stone-950 transition hover:scale-[1.03]"
            >
              מתחילים פרויקט
              <span className="mr-2">←</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

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
      className={`grid gap-5 py-7 sm:grid-cols-[70px_1fr_1.25fr] sm:items-start ${
        !last ? "border-b border-stone-300" : ""
      }`}
    >
      <span className="text-sm text-stone-400">{number}</span>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="leading-7 text-stone-500">{text}</p>
    </div>
  );
}

function normalizeRelation(
  relation:
    | { name: string; slug: string }
    | { name: string; slug: string }[]
    | null
    | undefined
) {
  if (!relation) return null;
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation;
}

function getProjectImageUrl(storagePath: string) {
  const { data } = supabasePublic.storage
    .from("project-images")
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

function getCategoryDescription(slug: string) {
  const descriptions: Record<string, string> = {
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
    "bedrooms-kids":
      "חדרי שינה וילדים בהתאמה אישית, עם תכנון חכם וניצול נכון של החלל.",
  };

  return (
    descriptions[slug] ||
    "עבודת נגרות בהתאמה אישית, מתכנון ועד התקנה."
  );
}
