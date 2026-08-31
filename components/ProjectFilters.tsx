"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterOption = {
  name: string;
  slug: string;
};

type ProjectFiltersProps = {
  categories: FilterOption[];
  woods: FilterOption[];
  rooms: FilterOption[];
  styles: FilterOption[];
};

export default function ProjectFilters({
  categories,
  woods,
  rooms,
  styles,
}: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentWood = searchParams.get("wood") || "";
  const currentRoom = searchParams.get("room") || "";
  const currentStyle = searchParams.get("style") || "";

  function updateFilter(
    key: "category" | "wood" | "room" | "style",
    value: string
  ) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasFilters =
    currentCategory ||
    currentWood ||
    currentRoom ||
    currentStyle;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category */}
        <div>
          <label
            htmlFor="category-filter"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            סוג עבודה
          </label>

          <select
            id="category-filter"
            value={currentCategory}
            onChange={(event) =>
              updateFilter("category", event.target.value)
            }
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-700"
          >
            <option value="">כל הקטגוריות</option>

            {categories.map((category) => (
              <option
                key={category.slug}
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Wood */}
        <div>
          <label
            htmlFor="wood-filter"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            סוג עץ / חומר
          </label>

          <select
            id="wood-filter"
            value={currentWood}
            onChange={(event) =>
              updateFilter("wood", event.target.value)
            }
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-700"
          >
            <option value="">כל סוגי העץ</option>

            {woods.map((wood) => (
              <option
                key={wood.slug}
                value={wood.slug}
              >
                {wood.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room */}
        <div>
          <label
            htmlFor="room-filter"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            חלל
          </label>

          <select
            id="room-filter"
            value={currentRoom}
            onChange={(event) =>
              updateFilter("room", event.target.value)
            }
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-700"
          >
            <option value="">כל החללים</option>

            {rooms.map((room) => (
              <option
                key={room.slug}
                value={room.slug}
              >
                {room.name}
              </option>
            ))}
          </select>
        </div>

        {/* Style */}
        <div>
          <label
            htmlFor="style-filter"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            סגנון
          </label>

          <select
            id="style-filter"
            value={currentStyle}
            onChange={(event) =>
              updateFilter("style", event.target.value)
            }
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-700"
          >
            <option value="">כל הסגנונות</option>

            {styles.map((style) => (
              <option
                key={style.slug}
                value={style.slug}
              >
                {style.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="mt-5 border-t border-stone-200 pt-4">
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-red-600 transition hover:text-red-800"
          >
            × נקה את כל הסינונים
          </button>
        </div>
      )}
    </div>
  );
}