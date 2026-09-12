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


  const customerGallery = featuredProjects
    .flatMap((project) => {
      const category = normalizeRelation(project.categories);
      const images = [...(project.project_images ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );

      return images
        .filter((image) => Boolean(image.storage_path))
        .map((image) => ({
          id: `${project.id}-${image.id}`,
          projectTitle: project.title,
          projectSlug: project.slug,
          city: project.city,
          categoryName: category?.name ?? null,
          imageUrl: getProjectImageUrl(image.storage_path),
          alt: image.alt_text || project.title,
        }));
    })
    .slice(0, 10);

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
                </Link>
              )}
            </div>
          </div>

          <div className="absolute left-6 top-6 z-20 hidden rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs text-white/70 backdrop-blur md:block">
            {SITE_TAGLINE}
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-3 mt-5 overflow-hidden rounded-[1.7rem] bg-[#1d1c19] text-white sm:mx-5 sm:mt-6 sm:rounded-[2.2rem] lg:mx-7 lg:mt-7">
          <div className="mx-auto max-w-[1450px] px-6 py-24 md:py-32">
            <div className="grid gap-10 lg:grid-cols-[.6fr_1.4fr]">
              <div>
                <p className="text-xs font-medium tracking-[0.25em] text-white/45">
                  01 / תחומי עבודה
                </p>

                <div className="mt-5 h-px w-14 bg-[#c79a6a]" />
                <h2 className="mt-6 text-4xl font-light leading-tight tracking-[-0.03em] md:text-5xl">
                  נגרות לכל
                  <br />
                  חלק בבית.
                </h2>
                <p className="mt-6 max-w-xs text-sm leading-7 text-white/50">
                  עבודות נגרות בהתאמה אישית, עם דגש על חומר, פרופורציה וגימור מדויק.
                </p>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/15">
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
                      className="group relative grid min-h-[165px] grid-cols-[55px_1fr_auto] items-center gap-4 overflow-hidden px-4 py-7 transition md:min-h-[190px] md:grid-cols-[90px_1fr_auto] md:px-7 md:py-9"
                    >
                      {background && (
                        <>
                          <Image
                            src={background.url}
                            alt={background.alt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 70vw"
                            className="object-cover opacity-40 transition duration-1000 ease-out group-hover:scale-[1.055] group-hover:opacity-52"
                          />
                          <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/72 to-black/48 transition duration-700 group-hover:from-black/84 group-hover:via-black/64 group-hover:to-black/40" />
                          <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-transparent" />
                        </>
                      )}

                      {!background && (
                        <div className="absolute inset-0 bg-gradient-to-l from-stone-950 via-stone-900 to-stone-800" />
                      )}

                      <div className="absolute inset-y-0 right-0 w-[3px] scale-y-0 bg-[#c79a6a] transition-transform duration-500 ease-out group-hover:scale-y-100" />

                      <span className="relative z-10 text-sm font-medium tracking-[0.16em] text-[#d7b58c]/75 transition duration-300 group-hover:text-[#e2c29d]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="relative z-10">
                        <h3 className="text-3xl font-medium tracking-[-0.02em] text-white drop-shadow-md transition duration-300 group-hover:translate-x-[-3px] md:text-[2.7rem]">
                          {category.name}
                        </h3>
                        <p className="mt-3 hidden max-w-xl text-sm leading-7 text-white/78 drop-shadow-sm sm:block md:text-[15px]">
                          {getCategoryDescription(category.slug)}
                        </p>
                      </div>

                      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/20 text-lg text-white shadow-lg backdrop-blur-md transition duration-300 group-hover:-translate-x-1 group-hover:border-[#d7b58c] group-hover:bg-[#d7b58c] group-hover:text-[#1d1c19]">
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

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="grid gap-10 lg:grid-cols-[.55fr_1.45fr]">
          <div>
            <p className="text-xs font-medium tracking-[0.25em] text-stone-500">
              02 / הגישה שלנו
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

      <section className="mx-auto max-w-[1500px] px-3 pb-28 sm:px-5 md:pb-36">
        <div className="mb-10 px-3 sm:px-4 md:mb-14">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.25em] text-stone-500">
                03 / תמונות מלקוחות שלנו
              </p>

              <h2 className="mt-4 text-4xl font-light tracking-tight md:text-6xl">
                בתים אמיתיים.
                <br />
                <span className="text-stone-400">נגרות שחיה בתוך הבית.</span>
              </h2>
            </div>

            <div className="max-w-md">
              <p className="text-sm leading-7 text-stone-500 md:text-base">
                הצצה לעבודות שכבר הותקנו אצל לקוחות שלנו — תמונות מהשטח,
                בלי סטודיו ובלי להעמיד פנים.
              </p>

              <Link
                href="/projects"
                className="mt-5 inline-flex items-center gap-2 border-b border-stone-900 pb-1 text-sm font-medium"
              >
                לכל התמונות
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>

        {customerGallery.length === 0 ? (
          <div className="mx-3 rounded-[2rem] border border-stone-300 bg-white/55 p-12 text-center text-stone-500">
            בקרוב יופיעו כאן תמונות מבתים של לקוחות.
          </div>
        ) : (
          <div className="grid auto-rows-[105px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[135px] sm:gap-4 md:grid-cols-12 md:auto-rows-[72px]">
            {customerGallery.map((item, index) => {
              const layouts = [
                "col-span-2 row-span-3 md:col-span-7 md:row-span-6",
                "col-span-1 row-span-2 md:col-span-5 md:row-span-4",
                "col-span-1 row-span-2 md:col-span-5 md:row-span-5",
                "col-span-2 row-span-3 md:col-span-4 md:row-span-5",
                "col-span-1 row-span-2 md:col-span-4 md:row-span-4",
                "col-span-1 row-span-2 md:col-span-4 md:row-span-4",
                "col-span-2 row-span-3 md:col-span-8 md:row-span-6",
                "col-span-1 row-span-2 md:col-span-4 md:row-span-3",
                "col-span-1 row-span-2 md:col-span-4 md:row-span-3",
                "col-span-2 row-span-3 md:col-span-8 md:row-span-5",
              ];

              return (
                <Link
                  key={item.id}
                  href={`/projects/${item.projectSlug}`}
                  className={`group relative overflow-hidden rounded-[1.35rem] bg-stone-200 shadow-[0_18px_55px_rgba(53,45,36,0.08)] sm:rounded-[1.7rem] ${layouts[index % layouts.length]}`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition duration-1000 ease-out group-hover:scale-[1.045]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/5 to-transparent opacity-75 transition duration-500 group-hover:opacity-90" />

                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[11px] text-white/85 backdrop-blur-md sm:right-5 sm:top-5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d7b58c]" />
                    מהבית של הלקוח
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5 md:p-6">
                    {item.categoryName && (
                      <p className="mb-1 text-[11px] font-medium tracking-[0.16em] text-white/60">
                        {item.categoryName}
                      </p>
                    )}

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium leading-tight sm:text-xl">
                          {item.projectTitle}
                        </h3>

                        {item.city && (
                          <p className="mt-1 text-xs text-white/65">
                            {item.city}
                          </p>
                        )}
                      </div>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-sm backdrop-blur-sm transition duration-300 group-hover:-translate-x-1 group-hover:bg-white group-hover:text-stone-900">
                        ←
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex items-center justify-center gap-3 text-xs text-stone-400">
          <span className="h-px w-10 bg-stone-300" />
          תמונות מתוך עבודות שבוצעו והותקנו אצל לקוחות
          <span className="h-px w-10 bg-stone-300" />
        </div>
      </section>

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