import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProjectGallery from "@/components/ProjectGallery";

import { supabasePublic } from "@/lib/supabase/public";
import { SITE_NAME } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";

export const instant = false;

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* ========================================= */
/* LOAD PROJECT */
/* ========================================= */

async function getProject(slug: string) {
  const { data, error } = await supabasePublic
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
/* DYNAMIC SEO */
/* ========================================= */

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await getProject(slug);

  if (!project) {
    return {
      title: "הפרויקט לא נמצא",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = createSeoDescription(
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
    sortedImages.length > 0
      ? getImageUrl(
          sortedImages[0].storage_path
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

      images: firstImage
        ? [
            {
              url: firstImage,
              alt:
                sortedImages[0].alt_text ||
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

      images: firstImage
        ? [firstImage]
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

  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  /* ========================================= */
  /* RELATIONSHIPS */
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
        ): wood is {
          name: string;
          slug: string;
        } => Boolean(wood)
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

  const images = sortedImages.map(
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

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-50 text-stone-900"
    >
      {/* ========================================= */}
      {/* TOP */}
      {/* ========================================= */}

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/projects"
            className="text-sm font-medium text-stone-500 transition hover:text-amber-700"
          >
            ← חזרה לכל העבודות
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            {/* Gallery */}
            <ProjectGallery
              images={images}
              title={project.title}
            />

            {/* Project details */}
            <div>
              {category && (
                <p className="font-medium text-amber-700">
                  {category.name}
                </p>
              )}

              <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
                {project.title}
              </h1>

              {project.description && (
                <p className="mt-6 whitespace-pre-wrap text-lg leading-8 text-stone-600">
                  {project.description}
                </p>
              )}

              {/* Details */}
              <div className="mt-10 border-t border-stone-200">
                {woodTypes.length >
                  0 && (
                  <DetailRow
                    label="סוג עץ"
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
                    value={
                      project.city
                    }
                  />
                )}

                {project.year && (
                  <DetailRow
                    label="שנה"
                    value={String(
                      project.year
                    )}
                  />
                )}
              </div>

              {/* CTA */}
              <div className="mt-10 rounded-2xl bg-stone-900 p-7 text-white">
                <h2 className="text-2xl font-bold">
                  רוצים משהו דומה?
                </h2>

                <p className="mt-3 leading-7 text-stone-300">
                  ספרו לנו על הפרויקט
                  שאתם מתכננים ונשמח
                  לחשוב יחד על הפתרון
                  המתאים.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex rounded-lg bg-white px-6 py-3 font-medium text-stone-900 transition hover:bg-stone-100"
                >
                  קבלת הצעת מחיר
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* BOTTOM CTA */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-stone-200 bg-white p-8 md:flex-row md:items-center md:p-10">
          <div>
            <p className="text-sm font-medium text-amber-700">
              פרויקטים נוספים
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              רוצים לראות עוד עבודות?
            </h2>
          </div>

          <Link
            href="/projects"
            className="rounded-lg border border-stone-300 px-6 py-3 font-medium transition hover:bg-stone-100"
          >
            לכל העבודות
          </Link>
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-stone-200 py-4">
      <span className="text-stone-500">
        {label}
      </span>

      <span className="text-left font-medium">
        {value}
      </span>
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
      city ? ` ב${city}` : ""
    }.`;

  if (source.length <= 155) {
    return source;
  }

  return `${source.slice(
    0,
    152
  )}...`;
}