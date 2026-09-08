import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProjectGallery from "@/components/ProjectGallery";

import { supabasePublic } from "@/lib/supabase/public";

import {
  SITE_NAME,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site";

import { SITE_URL } from "@/lib/seo";

import {
  createWhatsAppUrl,
} from "@/lib/whatsapp";

export const instant = false;

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Relation = {
  name: string;
  slug: string;
};

/* ========================================= */
/* LOAD PROJECT */
/* ========================================= */

async function getProject(
  slug: string
) {
  const { data, error } =
    await supabasePublic
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

        project_wood_types (
          wood_types (
            name,
            slug
          )
        ),

        project_images (
          id,
          storage_path,
          alt_text,
          sort_order
        )
      `)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

  if (error) {
    console.error(
      "Error loading project:",
      error
    );

    return null;
  }

  return data;
}

/* ========================================= */
/* SEO */
/* ========================================= */

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project =
    await getProject(slug);

  if (!project) {
    return {
      title: "הפרויקט לא נמצא",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    createSeoDescription(
      project.title,
      project.description,
      project.city
    );

  const sortedImages = [
    ...(project.project_images ?? []),
  ].sort(
    (a, b) =>
      (a.sort_order ?? 0) -
      (b.sort_order ?? 0)
  );

  const firstImage =
    sortedImages[0] ?? null;

  const firstImageUrl =
    firstImage
      ? getImageUrl(
          firstImage.storage_path
        )
      : null;

  const canonicalUrl =
    `${SITE_URL}/projects/${project.slug}`;

  return {
    title: project.title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "he_IL",
      siteName: SITE_NAME,
      title:
        `${project.title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,

      images: firstImageUrl
        ? [
            {
              url: firstImageUrl,
              alt:
                firstImage?.alt_text ||
                project.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title:
        `${project.title} | ${SITE_NAME}`,
      description,
      images: firstImageUrl
        ? [firstImageUrl]
        : undefined,
    },
  };
}

/* ========================================= */
/* PAGE */
/* ========================================= */

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project =
    await getProject(slug);

  if (!project) {
    notFound();
  }

  /* ========================================= */
  /* RELATIONS */
  /* ========================================= */

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
      .map((row) =>
        normalizeRelation(
          row.wood_types
        )
      )
      .filter(
        (
          wood
        ): wood is Relation =>
          Boolean(wood)
      );

  /* ========================================= */
  /* IMAGES */
  /* ========================================= */

  const sortedImages = [
    ...(project.project_images ?? []),
  ].sort(
    (a, b) =>
      (a.sort_order ?? 0) -
      (b.sort_order ?? 0)
  );

  const images =
    sortedImages.map(
      (image) => ({
        id: image.id,

        url: getImageUrl(
          image.storage_path
        ),

        alt:
          image.alt_text ||
          project.title,
      })
    );

  /* ========================================= */
  /* WHATSAPP */
  /* ========================================= */

  const whatsappUrl =
    SITE_WHATSAPP_NUMBER
      ? createWhatsAppUrl(
          SITE_WHATSAPP_NUMBER,
          `שלום, הגעתי דרך האתר של ${SITE_NAME}. ראיתי את הפרויקט "${project.title}" ואני מעוניין לקבל מידע על עבודה דומה.`
        )
      : null;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf9f6] text-stone-900"
    >
      {/* ========================================= */}
      {/* BREADCRUMB */}
      {/* ========================================= */}

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
            <Link
              href="/"
              className="transition hover:text-stone-900"
            >
              בית
            </Link>

            <span>/</span>

            <Link
              href="/projects"
              className="transition hover:text-stone-900"
            >
              עבודות
            </Link>

            {category && (
              <>
                <span>/</span>

                <Link
                  href={`/projects?category=${category.slug}`}
                  className="transition hover:text-stone-900"
                >
                  {category.name}
                </Link>
              </>
            )}

            <span>/</span>

            <span className="text-stone-800">
              {project.title}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* PROJECT */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          {/* ===================================== */}
          {/* GALLERY */}
          {/* ===================================== */}

          <ProjectGallery
            images={images}
            title={project.title}
          />

          {/* ===================================== */}
          {/* INFO */}
          {/* ===================================== */}

          <aside className="lg:sticky lg:top-28">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {category && (
                  <Link
                    href={`/projects?category=${category.slug}`}
                    className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800"
                  >
                    {category.name}
                  </Link>
                )}

                {project.featured && (
                  <span className="rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-white">
                    פרויקט נבחר
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                {project.title}
              </h1>

              {project.description && (
                <p className="mt-6 whitespace-pre-wrap text-lg leading-8 text-stone-600">
                  {project.description}
                </p>
              )}
            </div>

            {/* ===================================== */}
            {/* DETAILS */}
            {/* ===================================== */}

            <div className="mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white">
              {woodTypes.length >
                0 && (
                <DetailRow
                  label="חומר"
                  value={woodTypes
                    .map(
                      (wood) =>
                        wood.name
                    )
                    .join(", ")}
                />
              )}

              {style && (
                <DetailRow
                  label="סגנון"
                  value={style.name}
                />
              )}

              {room && (
                <DetailRow
                  label="חלל"
                  value={room.name}
                />
              )}

              {project.finish && (
                <DetailRow
                  label="גימור"
                  value={
                    project.finish
                  }
                />
              )}

              {project.city && (
                <DetailRow
                  label="מיקום"
                  value={project.city}
                />
              )}

              {project.year && (
                <DetailRow
                  label="שנה"
                  value={String(
                    project.year
                  )}
                  last
                />
              )}
            </div>

            {/* ===================================== */}
            {/* CONTACT CTA */}
            {/* ===================================== */}

            <div className="mt-6 rounded-[1.75rem] bg-stone-900 p-7 text-white">
              <p className="text-xs font-medium text-amber-500">
                אהבתם את הפרויקט?
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                רוצים משהו דומה?
              </h2>

              <p className="mt-3 leading-7 text-stone-400">
                ספרו לנו מה אתם רוצים
                לבנות ונוכל להתחיל לתכנן
                פתרון שמתאים לחלל שלכם.
              </p>

              <div className="mt-7 space-y-3">
                <Link
                  href="/contact"
                  className="flex min-h-13 items-center justify-center rounded-full bg-white px-6 font-medium text-stone-900 transition hover:bg-amber-600 hover:text-white"
                >
                  קבלת הצעת מחיר
                </Link>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-13 items-center justify-center gap-2 rounded-full border border-green-500/50 bg-green-500/10 px-6 font-medium text-green-400 transition hover:bg-green-500 hover:text-white"
                  >
                    <WhatsAppIcon />

                    דברו איתנו ב־WhatsApp
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ========================================= */}
      {/* PROJECT SUMMARY */}
      {/* ========================================= */}

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="text-sm font-medium text-amber-700">
                על הפרויקט
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                כל פרט
                <br />
                מתוכנן למקום שלו.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <ProjectFeature
                number="01"
                title="התאמה לחלל"
                text="המידות והתכנון מותאמים לחלל ולשימוש היומיומי."
              />

              <ProjectFeature
                number="02"
                title="בחירת חומרים"
                text="התאמת חומרים, צבעים וגימורים לסגנון של הפרויקט."
              />

              <ProjectFeature
                number="03"
                title="ייצור מדויק"
                text="העבודה עוברת לייצור בהתאם לתכנון ולמידות."
              />

              <ProjectFeature
                number="04"
                title="גימור והתקנה"
                text="התקנה מקצועית והקפדה על הפרטים עד לסיום."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* BOTTOM CTA */}
      {/* ========================================= */}

      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[390px] max-w-[1500px] items-center justify-center rounded-[2rem] bg-amber-700 px-6 py-20 text-center text-white">
          <div className="max-w-3xl">
            <p className="text-sm text-white/70">
              עוד השראה
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              רוצים לראות
              <br />
              פרויקטים נוספים?
            </h2>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-white px-7 font-medium text-stone-900"
              >
                לכל העבודות
                <span className="mr-2">
                  ←
                </span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 font-medium text-white"
              >
                דברו איתנו
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ========================================= */
/* DETAIL ROW */
/* ========================================= */

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-6 px-5 py-4 ${
        !last
          ? "border-b border-stone-200"
          : ""
      }`}
    >
      <span className="text-sm text-stone-500">
        {label}
      </span>

      <span className="text-left font-medium text-stone-900">
        {value}
      </span>
    </div>
  );
}

/* ========================================= */
/* PROJECT FEATURE */
/* ========================================= */

function ProjectFeature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-stone-300 pt-5">
      <p className="text-xs text-stone-400">
        {number}
      </p>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-stone-600">
        {text}
      </p>
    </div>
  );
}

/* ========================================= */
/* WHATSAPP ICON */
/* ========================================= */

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M16 3C8.82 3 3 8.61 3 15.54c0 2.44.74 4.72 2.02 6.65L3 29l7.05-1.94A13.3 13.3 0 0 0 16 28.46c7.18 0 13-5.61 13-12.92S23.18 3 16 3Zm0 23.28c-1.84 0-3.64-.48-5.21-1.39l-.37-.21-4.18 1.15 1.12-4.04-.24-.39a10.47 10.47 0 0 1-1.64-5.86C5.48 9.81 10.2 5.18 16 5.18s10.52 4.63 10.52 10.36S21.8 26.28 16 26.28Zm5.77-7.74c-.32-.16-1.87-.91-2.16-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.18.21-.37.24-.69.08-.31-.16-1.33-.48-2.54-1.54-.94-.83-1.57-1.85-1.75-2.16-.19-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.31.32-.52.1-.21.05-.4-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.06-1.1 2.59 0 1.54 1.13 3.02 1.29 3.23.16.21 2.22 3.36 5.39 4.71.75.32 1.34.51 1.8.66.76.24 1.45.2 2 .12.61-.09 1.87-.76 2.13-1.49.27-.73.27-1.36.19-1.49-.08-.13-.29-.21-.61-.37Z" />
    </svg>
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
/* SEO DESCRIPTION */
/* ========================================= */

function createSeoDescription(
  title: string,
  description: string | null,
  city: string | null
) {
  const source =
    description?.trim() ||
    `${title} - עבודת נגרות בהתאמה אישית מבית ${SITE_NAME}${
      city
        ? ` ב${city}`
        : ""
    }.`;

  if (source.length <= 155) {
    return source;
  }

  return `${source.slice(
    0,
    152
  )}...`;
}