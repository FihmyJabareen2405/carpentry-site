import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SITE_NAME } from "@/lib/site";

type HardwareProduct = {
  title: string;
  image: string;
};

type HardwareGroup = {
  title: string;
  products: HardwareProduct[];
};

type HardwarePageConfig = {
  title: string;
  eyebrow: string;
  intro: string;
  heroImage: string;
  groups: HardwareGroup[];
};

const HARDWARE_PAGES: Record<string, HardwarePageConfig> = {
  kitchens: {
    title: "פרזול למטבחים",
    eyebrow: "פרזול ואבזור משלים / מטבחים",
    intro:
      "פתרונות פרזול למטבח שמחברים בין נוחות, ניצול נכון של החלל ותנועה חלקה בשימוש היומיומי.",
    heroImage: "/hardware/kitchens.jpeg",
    groups: [
      {
        title: "מגירות",
        products: [
          { title: "מסילה סטנדרטית", image: "/hardware/catalog/kitchens/drawers/drawer-standard.jpeg" },
          { title: "מגירת זכוכית", image: "/hardware/catalog/kitchens/drawers/drawer-glass.jpeg" },
          { title: "מגירה נמוכה", image: "/hardware/catalog/kitchens/drawers/drawer-low.png" },
          { title: "מגירה נסתרת", image: "/hardware/catalog/kitchens/drawers/drawer-hidden.jpeg" },
          { title: "מגירה פנימית", image: "/hardware/catalog/kitchens/drawers/drawer-inner.png" },
          { title: "מגירת גלריה", image: "/hardware/catalog/kitchens/drawers/drawer-gallery.png" },
        ],
      },
      {
        title: "צירים",
        products: [
          { title: "ציר הרחקה", image: "/hardware/catalog/kitchens/hinges/hinge-offset.jpeg" },
          { title: "ציר הרמוניקה", image: "/hardware/catalog/kitchens/hinges/hinge-folding.jpeg" },
          { title: "ציר טריקה שקטה 90°", image: "/hardware/catalog/kitchens/hinges/hinge-soft-close-90.jpeg" },
          { title: "ציר לדלת זכוכית", image: "/hardware/catalog/kitchens/hinges/hinge-glass-door.jpeg" },
        ],
      },
      {
        title: "פתרון פינתי",
        products: [
          { title: "למנס – פתרון לפינה", image: "/hardware/catalog/kitchens/corner/le-mans.jpeg" },
          { title: "מג'יק קורנר", image: "/hardware/catalog/kitchens/corner/magic-corner.jpeg" },
        ],
      },
      {
        title: "מתקני הרמה",
        products: [
          { title: "מתקן הרמה מוט", image: "/hardware/catalog/kitchens/lifts/lift-rod.jpeg" },
          { title: "מתקן הרמה HK", image: "/hardware/catalog/kitchens/lifts/lift-hk.jpeg" },
          { title: "מתקן הרמה HF", image: "/hardware/catalog/kitchens/lifts/lift-hf.jpeg" },
        ],
      },
      {
        title: "אחסון",
        products: [
          { title: "מזווה נשלף", image: "/hardware/catalog/kitchens/storage/pull-out-pantry.jpeg" },
          { title: "עגלת בקבוקים", image: "/hardware/catalog/kitchens/storage/bottle-rack.jpeg" },
        ],
      },
    ],
  },
  doors: {
    title: "פרזול לדלתות",
    eyebrow: "פרזול ואבזור משלים / דלתות",
    intro: "צירים לדלתות עם דגש על פתיחה מדויקת, מראה נקי והתאמה לסגנון הדלת.",
    heroImage: "/hardware/doors.jpeg",
    groups: [
      {
        title: "צירים לדלתות",
        products: [
          { title: "ציר ספר לדלת", image: "/hardware/catalog/doors/book-hinge.jpeg" },
          { title: "ציר סמוי לדלת", image: "/hardware/catalog/doors/concealed-hinge.jpeg" },
        ],
      },
    ],
  },
  "walk-in-closet": {
    title: "אבזור לחדר ארונות",
    eyebrow: "פרזול ואבזור משלים / חדר ארונות",
    intro: "אבזור פנימי שמסדר את הארון, משפר את הנגישות ומאפשר לנצל את החלל בצורה חכמה.",
    heroImage: "/hardware/walk-in-closet.jpeg",
    groups: [
      {
        title: "אבזור לחדר ארונות",
        products: [
          { title: "מתלה נשלף לארון בגדים", image: "/hardware/catalog/walk-in-closet/pull-out-hanger.jpeg" },
          { title: "מתלה מוט קבוע", image: "/hardware/catalog/walk-in-closet/fixed-rail.jpeg" },
          { title: "עמדת גיהוץ", image: "/hardware/catalog/walk-in-closet/ironing-station.jpeg" },
        ],
      },
    ],
  },
};

const HARDWARE_NAV = [
  { slug: "kitchens", label: "מטבחים" },
  { slug: "doors", label: "דלתות" },
  { slug: "walk-in-closet", label: "חדר ארונות" },
];

export function generateStaticParams() {
  return Object.keys(HARDWARE_PAGES).map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = HARDWARE_PAGES[slug];

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | ${SITE_NAME}`,
    description: page.intro,
  };
}

export default async function HardwarePage({ params }: PageProps) {
  const { slug } = await params;
  const page = HARDWARE_PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f1eb] text-[#1f1f1c]">
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div className="relative min-h-[52vh] overflow-hidden rounded-[1.8rem] bg-stone-900 sm:rounded-[2.4rem]">
          <Image
            src={page.heroImage}
            alt={page.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

          <div className="relative z-10 flex min-h-[52vh] flex-col justify-between p-6 text-white sm:p-9 md:p-12 lg:p-16">
            <Link
              href="/#hardware"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-black/15 px-4 py-2 text-sm backdrop-blur-md transition hover:bg-white hover:text-stone-900"
            >
              חזרה לפרזול
              <span>←</span>
            </Link>

            <div className="max-w-4xl">
              <p className="text-xs font-medium tracking-[0.22em] text-white/60">{page.eyebrow}</p>
              <h1 className="mt-5 text-4xl font-light tracking-[-0.035em] sm:text-5xl md:text-6xl">
                {page.title}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                {page.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mb-10 flex flex-wrap gap-2 border-b border-stone-300 pb-6">
          {HARDWARE_NAV.map((item) => {
            const active = item.slug === slug;
            return (
              <Link
                key={item.slug}
                href={`/hardware/${item.slug}`}
                className={`rounded-full px-5 py-2.5 text-sm transition ${
                  active
                    ? "bg-stone-900 text-white"
                    : "border border-stone-300 bg-white/60 text-stone-700 hover:border-stone-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="space-y-14 md:space-y-18">
          {page.groups.map((group, groupIndex) => (
            <section key={group.title}>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-stone-300 pb-4">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] text-stone-400">
                    {String(groupIndex + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-3xl font-light tracking-[-0.03em] md:text-4xl">
                    {group.title}
                  </h2>
                </div>
                <span className="text-xs text-stone-400">{group.products.length} פריטים</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.products.map((product) => (
                  <article
                    key={product.image}
                    className="overflow-hidden rounded-[1.35rem] border border-stone-200 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-white">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-3 transition duration-500 hover:scale-[1.025]"
                      />
                    </div>
                    <div className="border-t border-stone-100 px-5 py-4">
                      <h3 className="text-lg font-medium">{product.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
