"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type FilterOption = {
  id: string;
  name: string;
  slug: string;
};

type ProjectFiltersProps = {
  categories: FilterOption[];
  woodTypes: FilterOption[];
  rooms: FilterOption[];
  styles: FilterOption[];
};

export default function ProjectFilters({
  categories,
  woodTypes,
  rooms,
  styles,
}: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category =
    searchParams.get("category") ?? "";

  const wood =
    searchParams.get("wood") ?? "";

  const room =
    searchParams.get("room") ?? "";

  const style =
    searchParams.get("style") ?? "";

  const hasFilters =
    Boolean(category) ||
    Boolean(wood) ||
    Boolean(room) ||
    Boolean(style);

  function updateFilter(
    key: string,
    value: string
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query =
      params.toString();

    router.replace(
      query
        ? `${pathname}?${query}`
        : pathname,
      {
        scroll: false,
      }
    );
  }

  function clearFilters() {
    router.replace(pathname, {
      scroll: false,
    });
  }

  return (
    <div
      dir="rtl"
      className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-900">
            סינון עבודות
          </p>

          <p className="mt-1 text-xs text-stone-500">
            מצאו פרויקטים לפי סוג העבודה,
            חומר, חלל וסגנון.
          </p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-stone-300 px-4 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-900 hover:text-white"
          >
            ניקוי סינון
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="סוג עבודה"
          value={category}
          options={categories}
          placeholder="כל הקטגוריות"
          onChange={(value) =>
            updateFilter(
              "category",
              value
            )
          }
        />

        <FilterSelect
          label="סוג עץ"
          value={wood}
          options={woodTypes}
          placeholder="כל סוגי העץ"
          onChange={(value) =>
            updateFilter(
              "wood",
              value
            )
          }
        />

        <FilterSelect
          label="חלל"
          value={room}
          options={rooms}
          placeholder="כל החללים"
          onChange={(value) =>
            updateFilter(
              "room",
              value
            )
          }
        />

        <FilterSelect
          label="סגנון"
          value={style}
          options={styles}
          placeholder="כל הסגנונות"
          onChange={(value) =>
            updateFilter(
              "style",
              value
            )
          }
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  placeholder: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-stone-500">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="h-12 w-full appearance-none rounded-xl border border-stone-200 bg-[#faf9f6] px-4 pl-10 text-sm text-stone-800 outline-none transition focus:border-amber-700"
        >
          <option value="">
            {placeholder}
          </option>

          {options.map(
            (option) => (
              <option
                key={option.id}
                value={option.slug}
              >
                {option.name}
              </option>
            )
          )}
        </select>

        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
        >
          <path d="m6 8 4 4 4-4" />
        </svg>
      </div>
    </label>
  );
}