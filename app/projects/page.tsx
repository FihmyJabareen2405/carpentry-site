import Link from "next/link";
import type { Metadata } from "next";
import { supabasePublic } from "@/lib/supabase/public";
import ProjectFilters from "@/components/ProjectFilters";
export const metadata: Metadata = {
  title: "עבודות",
  description:
    "גלריית עבודות נגריית עימאד אקרם - מטבחים, ארונות, חדרי שינה, מזנונים ועבודות נגרות בהתאמה אישית.",
  alternates: {
    canonical: "/projects",
  },
};
export const instant = false;

type ProjectsPageProps = {
  searchParams: Promise<{
    category?: string;
    wood?: string;
    room?: string;
    style?: string;
  }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const filters = await searchParams;

  const selectedCategory = filters.category || "";
  const selectedWood = filters.wood || "";
  const selectedRoom = filters.room || "";
  const selectedStyle = filters.style || "";

  /*
   * Load projects + filter options
   */
  const [
    projectsResult,
    categoriesResult,
    woodsResult,
    roomsResult,
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

        room:rooms (
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
      .order("created_at", {
        ascending: false,
      }),

    supabasePublic
      .from("categories")
      .select("name, slug")
      .order("sort_order"),

    supabasePublic
      .from("wood_types")
      .select("name, slug")
      .order("sort_order"),

    supabasePublic
      .from("rooms")
      .select("name, slug")
      .order("sort_order"),

    supabasePublic
      .from("styles")
      .select("name, slug")
      .order("sort_order"),
  ]);

  if (projectsResult.error) {
    console.error(
      "Error loading projects:",
      projectsResult.error
    );

    return (
      <main
        dir="rtl"
        className="mx-auto min-h-screen max-w-7xl px-6 py-16"
      >
        <h1 className="text-4xl font-bold">
          העבודות שלנו
        </h1>

        <p className="mt-6 text-red-600">
          אירעה שגיאה בטעינת הפרויקטים.
        </p>
      </main>
    );
  }

  const projects = projectsResult.data || [];

  /*
   * Filter projects
   */
  const filteredProjects = projects.filter((project) => {
    const category = Array.isArray(project.category)
      ? project.category[0]
      : project.category;

    const room = Array.isArray(project.room)
      ? project.room[0]
      : project.room;

    const style = Array.isArray(project.style)
      ? project.style[0]
      : project.style;

    const woodSlugs =
      project.project_wood_types
        ?.map((item) => {
          const woodType = Array.isArray(item.wood_type)
            ? item.wood_type[0]
            : item.wood_type;

          return woodType?.slug;
        })
        .filter(Boolean) || [];

    if (
      selectedCategory &&
      category?.slug !== selectedCategory
    ) {
      return false;
    }

    if (
      selectedRoom &&
      room?.slug !== selectedRoom
    ) {
      return false;
    }

    if (
      selectedStyle &&
      style?.slug !== selectedStyle
    ) {
      return false;
    }

    if (
      selectedWood &&
      !woodSlugs.includes(selectedWood)
    ) {
      return false;
    }

    return true;
  });

  const categories = categoriesResult.data || [];
  const woods = woodsResult.data || [];
  const rooms = roomsResult.data || [];
  const styles = stylesResult.data || [];

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-50"
    >
      {/* Header */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-medium text-amber-700">
            תיק עבודות
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            העבודות שלנו
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
            צפו בעבודות נגרות בהתאמה אישית
            וסננו לפי סוג העבודה, העץ, החלל והסגנון.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Filters */}
        <ProjectFilters
          categories={categories}
          woods={woods}
          rooms={rooms}
          styles={styles}
        />

        {/* Results information */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-stone-600">
            נמצאו{" "}
            <span className="font-bold text-stone-900">
              {filteredProjects.length}
            </span>{" "}
            עבודות
          </p>

          {(selectedCategory ||
            selectedWood ||
            selectedRoom ||
            selectedStyle) && (
            <p className="text-sm text-stone-500">
              מוצגות תוצאות מסוננות
            </p>
          )}
        </div>

        {/* No results */}
        {filteredProjects.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
            <div className="text-5xl">
              🔎
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              לא נמצאו עבודות
            </h2>

            <p className="mt-2 text-stone-500">
              נסה לשנות או לנקות חלק מהסינונים.
            </p>

            <Link
              href="/projects"
              className="mt-6 inline-block rounded-lg bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-700"
            >
              הצג את כל העבודות
            </Link>
          </div>
        ) : (
          /* Projects */
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const category = Array.isArray(project.category)
                ? project.category[0]
                : project.category;

              const room = Array.isArray(project.room)
                ? project.room[0]
                : project.room;

              const style = Array.isArray(project.style)
                ? project.style[0]
                : project.style;

              const woodNames =
                project.project_wood_types
                  ?.map((item) => {
                    const woodType = Array.isArray(
                      item.wood_type
                    )
                      ? item.wood_type[0]
                      : item.wood_type;

                    return woodType?.name;
                  })
                  .filter(Boolean) || [];

              const woodsText =
                woodNames.join(" • ");

              const sortedImages = [
                ...(project.project_images || []),
              ].sort(
                (a, b) =>
                  a.sort_order - b.sort_order
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
                  {/* Image */}
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
                    <div className="flex aspect-[4/3] items-center justify-center bg-stone-200">
                      <div className="text-center text-stone-500">
                        <div className="text-4xl">
                          🪵
                        </div>

                        <p className="mt-3 text-sm">
                          אין תמונה
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-6">
                    {category?.name && (
                      <p className="text-sm font-medium text-amber-700">
                        {category.name}
                      </p>
                    )}

                    <h2 className="mt-2 text-2xl font-bold">
                      {project.title}
                    </h2>

                    {project.description && (
                      <p className="mt-3 line-clamp-2 leading-7 text-stone-600">
                        {project.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2 text-sm text-stone-500">
                      {woodsText && (
                        <span>
                          {woodsText}
                        </span>
                      )}

                      {style?.name && (
                        <>
                          {woodsText && (
                            <span>•</span>
                          )}

                          <span>
                            {style.name}
                          </span>
                        </>
                      )}

                      {room?.name && (
                        <>
                          {(woodsText ||
                            style?.name) && (
                            <span>•</span>
                          )}

                          <span>
                            {room.name}
                          </span>
                        </>
                      )}

                      {project.city && (
                        <>
                          {(woodsText ||
                            style?.name ||
                            room?.name) && (
                            <span>•</span>
                          )}

                          <span>
                            {project.city}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-6 font-medium text-stone-900">
                      לצפייה בפרויקט ←
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}