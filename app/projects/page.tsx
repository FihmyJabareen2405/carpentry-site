import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ProjectFilters from "@/components/ProjectFilters";

import { supabasePublic } from "@/lib/supabase/public";

export const instant = false;

export const metadata: Metadata = {
  title: "עבודות",
  description:
    "גלריית עבודות נגריית עימאד אקרם, מטבחים, ארונות, חדרי שינה, מזנונים ועבודות נגרות בהתאמה אישית.",
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
  const filters = await searchParams;

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
      .select("id, name, slug, sort_order")
      .order("sort_order", {
        ascending: true,
      }),

    supabasePublic
      .from("rooms")
      .select("id, name, slug, sort_order")
      .order("sort_order", {
        ascending: true,
      }),

    supabasePublic
      .from("wood_types")
      .select("id, name, slug, sort_order")
      .order("sort_order", {
        ascending: true,
      }),

    supabasePublic
      .from("styles")
      .select("id, name, slug, sort_order")
      .order("sort_order", {
        ascending: true,
      }),
  ]);

  const projects = projectsResult.data ?? [];
  const categories = categoriesResult.data ?? [];
  const rooms = roomsResult.data ?? [];
  const woodTypes = woodTypesResult.data ?? [];
  const styles = stylesResult.data ?? [];

  const filteredProjects = projects.filter((project) => {
    const category = normalizeRelation(project.categories);
    const room = normalizeRelation(project.rooms);
    const style = normalizeRelation(project.styles);

    const projectWoodTypes = (project.project_wood_types ?? [])
      .map((item) => normalizeRelation(item.wood_types))
      .filter((item): item is Relation => Boolean(item));

    if (
      filters.category &&
      category?.slug !== filters.category
    ) {
      return false;
    }

    if (
      filters.room &&
      room?.slug !== filters.room
    ) {
      return false;
    }

    if (
      filters.style &&
      style?.slug !== filters.style
    ) {
      return false;
    }

    if (
      filters.wood &&
      !projectWoodTypes.some(
        (wood) => wood.slug === filters.wood
      )
    ) {
      return false;
    }

    return true;
  });

  const leadProject = filteredProjects[0] ?? null;
  const restProjects = filteredProjects.slice(1);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f5f1] text-stone-900"
    >
      {/* HERO */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[1.8rem] bg-stone-950 text-white sm:rounded-[2.2rem]">
          <div className="grid min-h-[360px] lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div className="px-7 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <p className="text-xs font-medium tracking-[0.22em] text-white/50">
                PORTFOLIO / עבודות
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                נגרות שמתוכננת
                <br />
                בדיוק לחלל שלה.
              </h1>
            </div>

            <div className="border-t border-white/10 px-7 py-8 sm:px-10 lg:border-r lg:border-t-0 lg:px-12 lg:py-16">
              <p className="max-w-md text-base leading-8 text-white/65 sm:text-lg">
                מטבחים, חדרים, דלתות, חיפויים ועבודות מיוחדות.
                כל פרויקט מתחיל בצרכים של החלל וממשיך לבחירת חומר,
                פרופורציות וגימור.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <ProjectFilters
          categories={categories}
          woodTypes={woodTypes}
          rooms={rooms}
          styles={styles}
        />
      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5 sm:mb-9">
          <div>
            <p className="text-xs tracking-[0.18em] text-stone-400">
              PROJECTS
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "עבודה" : "עבודות"}
            </h2>
          </div>

          {hasActiveFilters(filters) && (
            <Link
              href="/projects"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-medium text-stone-600 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
            >
              ניקוי כל המסננים
            </Link>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-[1.8rem] border border-stone-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-xl">
              ⌕
            </div>

            <h2 className="mt-5 text-2xl font-semibold">
              לא נמצאו עבודות
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-stone-500">
              לא נמצאו פרויקטים שמתאימים לשילוב הסינון שבחרתם.
            </p>

            <Link
              href="/projects"
              className="mt-7 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white"
            >
              הצגת כל העבודות
            </Link>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {leadProject && (
              <LeadProjectCard project={leadProject} />
            )}

            {restProjects.length > 0 && (
              <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:gap-x-7 lg:gap-y-14">
                {restProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    number={index + 2}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-3 pb-3 sm:px-5 sm:pb-5 lg:px-7">
        <div className="mx-auto max-w-[1600px] rounded-[1.8rem] bg-[#d9c3a3] px-6 py-16 text-center text-stone-950 sm:rounded-[2.2rem] md:py-20">
          <p className="text-xs font-medium tracking-[0.18em] text-stone-600">
            CUSTOM MADE
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-light leading-tight sm:text-4xl md:text-5xl">
            יש לכם חלל או רעיון משלכם?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-stone-700">
            ספרו לנו מה אתם רוצים לבנות, ונוכל לתכנן פתרון שמתאים
            למידות, לשימוש ולסגנון שלכם.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-stone-950 px-7 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            קבלת הצעת מחיר
            <span className="mr-2">←</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

function LeadProjectCard({
  project,
}: {
  project: any;
}) {
  const details = getProjectDetails(project);
  const firstImage = details.images[0] ?? null;
  const imageUrl = firstImage
    ? getImageUrl(firstImage.storage_path)
    : null;

  return (
    <article className="group">
      <Link
        href={`/projects/${project.slug}`}
        className="block overflow-hidden rounded-[1.8rem] bg-stone-950 text-white shadow-sm sm:rounded-[2.2rem]"
      >
        <div className="grid lg:grid-cols-[1.4fr_.6fr]">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-800 sm:aspect-[16/10] lg:min-h-[520px] lg:aspect-auto">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={firstImage?.alt_text || project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/40">
                אין תמונה
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5 lg:hidden" />

            {project.featured && (
              <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:right-5 sm:top-5">
                פרויקט נבחר
              </span>
            )}

            <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-950 shadow-lg transition group-hover:-translate-x-1 sm:bottom-5 sm:left-5">
              ←
            </span>
          </div>

          <div className="flex flex-col justify-between px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-12">
            <div>
              <p className="text-xs tracking-[0.18em] text-white/45">
                01 / PROJECT
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-white/55">
                {details.category && (
                  <span>{details.category.name}</span>
                )}

                {details.category && details.style && (
                  <span>•</span>
                )}

                {details.style && (
                  <span>{details.style.name}</span>
                )}
              </div>

              <h2 className="mt-3 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                {project.title}
              </h2>

              {project.description && (
                <p className="mt-5 line-clamp-4 leading-7 text-white/60">
                  {project.description}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {details.woodTypes.slice(0, 2).map((wood) => (
                <DarkTag key={wood.slug}>{wood.name}</DarkTag>
              ))}

              {details.room && (
                <DarkTag>{details.room.name}</DarkTag>
              )}

              {project.city && (
                <DarkTag>{project.city}</DarkTag>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ProjectCard({
  project,
  number,
}: {
  project: any;
  number: number;
}) {
  const details = getProjectDetails(project);
  const firstImage = details.images[0] ?? null;
  const imageUrl = firstImage
    ? getImageUrl(firstImage.storage_path)
    : null;

  return (
    <article className="group min-w-0">
      <Link
        href={`/projects/${project.slug}`}
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-stone-200 sm:rounded-[1.8rem]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={firstImage?.alt_text || project.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">
              אין תמונה
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 transition group-hover:opacity-80" />

          {project.featured && (
            <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
              נבחר
            </span>
          )}

          <span className="absolute bottom-4 right-4 text-xs text-white/75">
            {String(number).padStart(2, "0")}
          </span>

          <span className="absolute bottom-4 left-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-stone-950 opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:h-11 sm:w-11">
            ←
          </span>
        </div>

        <div className="mt-4 sm:mt-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            {details.category && (
              <span>{details.category.name}</span>
            )}

            {details.category && details.style && (
              <span>•</span>
            )}

            {details.style && (
              <span>{details.style.name}</span>
            )}
          </div>

          <h2 className="mt-1.5 text-xl font-semibold tracking-tight transition group-hover:text-amber-700 sm:text-2xl">
            {project.title}
          </h2>

          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
            {details.woodTypes.slice(0, 2).map((wood) => (
              <ProjectTag key={wood.slug}>{wood.name}</ProjectTag>
            ))}

            {details.room && (
              <ProjectTag>{details.room.name}</ProjectTag>
            )}

            {project.city && (
              <ProjectTag>{project.city}</ProjectTag>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

function getProjectDetails(project: any) {
  const category = normalizeRelation(project.categories);
  const room = normalizeRelation(project.rooms);
  const style = normalizeRelation(project.styles);

  const woodTypes = (project.project_wood_types ?? [])
    .map((item: any) => normalizeRelation(item.wood_types))
    .filter((item: Relation | null): item is Relation => Boolean(item));

  const images = [...(project.project_images ?? [])].sort(
    (a: any, b: any) =>
      (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return {
    category,
    room,
    style,
    woodTypes,
    images,
  };
}

function ProjectTag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-white px-3 py-1.5 text-[11px] text-stone-600 shadow-sm ring-1 ring-stone-200 sm:text-xs">
      {children}
    </span>
  );
}

function DarkTag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-white/65">
      {children}
    </span>
  );
}

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

function getImageUrl(storagePath: string) {
  const { data } = supabasePublic.storage
    .from("project-images")
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

function hasActiveFilters(filters: {
  category?: string;
  wood?: string;
  room?: string;
  style?: string;
}) {
  return Boolean(
    filters.category ||
      filters.wood ||
      filters.room ||
      filters.style
  );
}
