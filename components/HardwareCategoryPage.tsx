import Image from "next/image";
import Link from "next/link";

export type HardwareItem = {
  title: string;
  image: string;
  imagePosition?: string;
};

type HardwareCategoryPageProps = {
  title: string;
  subtitle: string;
  heroImage: string;
  items: HardwareItem[];
};

export default function HardwareCategoryPage({
  title,
  subtitle,
  heroImage,
  items,
}: HardwareCategoryPageProps) {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f1eb] text-[#1f1f1c]">
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div className="relative mx-auto min-h-[360px] max-w-[1600px] overflow-hidden rounded-[1.7rem] bg-stone-900 sm:min-h-[420px] sm:rounded-[2.2rem]">
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/52 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

          <div className="relative z-10 flex min-h-[360px] items-end px-7 py-10 text-white sm:min-h-[420px] sm:px-10 sm:py-12 md:px-14 lg:px-20">
            <div className="max-w-4xl">
              <Link
                href="/#hardware"
                className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
              >
                <span>→</span>
                חזרה לפרזול ואבזור משלים
              </Link>

              <p className="mt-8 text-xs font-medium tracking-[0.25em] text-white/55">
                פרזול ואבזור משלים
              </p>
              <div className="mt-4 h-px w-14 bg-[#c79a6a]" />

              <h1 className="mt-5 text-4xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div
          className={`grid gap-5 ${
            items.length === 2
              ? "md:grid-cols-2"
              : items.length === 3
                ? "md:grid-cols-3"
                : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((item, index) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-[1.6rem] border border-stone-200 bg-white shadow-[0_18px_45px_rgba(28,25,23,0.07)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover transition duration-700 group-hover:scale-[1.04] ${item.imagePosition ?? ""}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <span className="absolute right-5 top-5 flex h-9 min-w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 px-2 text-xs font-medium text-white backdrop-blur">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <h2 className="text-xl font-medium tracking-[-0.02em] sm:text-2xl">
                  {item.title}
                </h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
