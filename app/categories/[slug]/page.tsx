import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type CategoryConfig = {
  title: string;
  eyebrow: string;
  intro: string;
  imageFolder: string;
  services: string[];
  tips: string[];
};

const CATEGORY_CONTENT: Record<string, CategoryConfig> = {
  kitchens: {
    title: "מטבחים",
    eyebrow: "נגרות בהתאמה אישית למטבח",
    intro:
      "מטבח טוב מתחיל בתכנון שמתאים לאנשים שחיים בו. אנחנו מתכננים ומייצרים מטבחים בהתאמה אישית, עם חשיבה על זרימת העבודה, אחסון, חומרי הגמר, הפרזול והפרטים הקטנים שמורגשים בכל יום.",
    imageFolder: "kitchens",
    services: [
      "תכנון נגרות לפי מידות החלל והצרכים של המשפחה",
      "ארונות גבוהים, מזווה, אי ופתרונות אחסון חכמים",
      "בחירת חזיתות, גוונים, סוגי עץ וגימורים",
      "שילוב פרזול, מגירות ופתרונות פתיחה נוחים",
    ],
    tips: [
      "כדאי לסגור מראש את מידות המקרר, התנור, המדיח ושאר מוצרי החשמל.",
      "חשבו על הדברים שבהם אתם משתמשים בכל יום . הם צריכים להיות הכי נגישים.",
      "במטבח פעיל מומלץ לבחור גימור שקל לנקות ושומר על מראה טוב לאורך זמן.",
    ],
  },

  doors: {
    title: "דלתות",
    eyebrow: "דלתות ונגרות משלימה",
    intro:
      "דלת היא חלק משמעותי מהשפה העיצובית של הבית. אנחנו משלבים דלתות ונגרות בהתאמה אישית כך שהן יתחברו לקירות, לחיפויים ולשאר הריהוט בצורה נקייה ומדויקת.",
    imageFolder: "doors",
    services: [
      "דלתות פנים במידות ובהתאמה עיצובית לחלל",
      "התאמת גוון, פורניר וטקסטורה לשאר הנגרות בבית",
      "פתרונות לדלתות כחלק מקיר נגרות או חיפוי",
      "תכנון ידיות, פרזול ופרטי גמר בהתאם לסגנון",
    ],
    tips: [
      "בחרו את כיוון פתיחת הדלת כבר בשלב התכנון כדי לא לפגוע בתנועה בחדר.",
      "אם הדלת קרובה לארון או חיפוי, כדאי לתכנן את כולם יחד לקבלת קו אחיד.",
      "ידית נכונה יכולה לשנות מאוד את התחושה . מודרנית, קלאסית או מינימליסטית.",
    ],
  },

  "bedrooms-kids": {
    title: "חדרי שינה וילדים",
    eyebrow: "נגרות לחדרים שחיים בהם",
    intro:
      "בחדרי שינה וילדים חשוב לנצל כל סנטימטר בלי להעמיס. אנחנו מתכננים ארונות, שולחנות, מיטות ופתרונות אחסון שמשתלבים בחדר ושומרים על מראה רגוע ונעים.",
    imageFolder: "bedrooms-kids",
    services: [
      "ארונות קיר בהתאמה מלאה למידות החדר",
      "שולחנות לימוד, ספריות ויחידות אחסון",
      "פתרונות משולבים למיטה, ארון ונישות",
      "תכנון שמאפשר לחדר להשתנות עם השנים",
    ],
    tips: [
      "בחדר ילדים כדאי להשאיר מקום לצרכים שישתנו עם הגיל.",
      "אחסון סגור עוזר לשמור על מראה מסודר גם בחדר עמוס.",
      "לפני תכנון ארון, עברו על סוגי הבגדים והציוד שאתם באמת צריכים לאחסן.",
    ],
  },

  "wall-cladding": {
    title: "חיפוי קירות",
    eyebrow: "קירות שהופכים לחלק מהנגרות",
    intro:
      "חיפוי קיר יכול להפוך קיר רגיל לאלמנט המרכזי בחלל. אנחנו מתכננים חיפויים שמשלבים עץ, חריצים, נישות, תאורה ויחידות אחסון בהתאם לאופי הבית.",
    imageFolder: "wall-cladding",
    services: [
      "חיפויי עץ דקורטיביים לקירות ולכניסות",
      "קירות טלוויזיה עם נישות ואחסון משולב",
      "חיבור בין חיפוי, דלתות וארונות ליצירת קו רציף",
      "שילוב תאורה ופרטי גמר כחלק מהנגרות",
    ],
    tips: [
      "בקיר טלוויזיה כדאי לתכנן מראש מעבר לכבלים, חשמל וציוד תקשורת.",
      "בחיפוי גדול חשוב לבחור טקסטורה שלא מעמיסה על החלל.",
      "תאורה עקיפה יכולה להדגיש את העץ ולהוסיף עומק בלי להשתלט.",
    ],
  },

  custom: {
    title: "עבודות מיוחדות",
    eyebrow: "פתרונות שלא מגיעים מהמדף",
    intro:
      "יש פרויקטים שאין להם קטגוריה אחת . וזה בדיוק המקום שבו נגרות בהתאמה אישית נותנת את הערך הגדול ביותר. אנחנו מתכננים פתרון סביב החלל, השימוש והרעיון שלכם.",
    imageFolder: "custom",
    services: [
      "ספריות, קירות כוח ויחידות מדיה",
      "שולחנות עבודה, משרדים ונגרות לעסקים",
      "ספסלים, נישות ופתרונות אחסון מיוחדים",
      "פריטים בהתאמה אישית לפי סקיצה או רעיון",
    ],
    tips: [
      "הביאו תמונות השראה, אבל חשוב להתאים את הרעיון למידות ולשימוש האמיתי שלכם.",
      "בפריט מיוחד כדאי להחליט מראש מה חייב להיות פונקציונלי ומה בעיקר עיצובי.",
      "אל תחששו לשלב חומרים . עץ, זכוכית, מתכת ותאורה יכולים לעבוד מצוין יחד.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_CONTENT).map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = CATEGORY_CONTENT[slug];

  if (!category) {
    notFound();
  }

  const images = [1, 2, 3].map(
    (number) =>
      `/categories/details/${category.imageFolder}/${String(number).padStart(2, "0")}.jpg`
  );

  return (
    <main dir="rtl" className="bg-[#f4f1eb] text-[#1f1f1c]">
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div className="relative min-h-[68vh] overflow-hidden rounded-[1.8rem] bg-stone-900 sm:rounded-[2.4rem]">
          <Image
            src={images[0]}
            alt={category.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/38 to-black/10" />

          <div className="relative z-10 flex min-h-[68vh] flex-col justify-between p-6 text-white sm:p-9 md:p-12 lg:p-16">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-black/10 px-4 py-2 text-sm backdrop-blur-md transition hover:bg-white hover:text-stone-900"
            >
              חזרה לדף הבית
              <span>←</span>
            </Link>

            <div className="max-w-4xl">
              <p className="text-xs font-medium tracking-[0.24em] text-white/65 sm:text-sm">
                {category.eyebrow}
              </p>

              <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
                {category.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                {category.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-stone-500">
              מה אנחנו עושים
            </p>

            <h2 className="mt-5 text-4xl font-light leading-tight tracking-[-0.03em] md:text-5xl">
              תכנון שמתחיל
              <br />
              בצורך האמיתי.
            </h2>
          </div>

          <div className="divide-y divide-stone-300 border-y border-stone-300">
            {category.services.map((service, index) => (
              <div
                key={service}
                className="grid grid-cols-[52px_1fr] gap-4 py-5 sm:grid-cols-[70px_1fr] sm:py-6"
              >
                <span className="text-sm text-[#a8784f]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-lg leading-8">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-3 pb-20 sm:px-5 md:pb-28">
        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[230px] sm:gap-4 md:grid-cols-12 md:auto-rows-[90px]">
          <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[1.6rem] md:col-span-7 md:row-span-6">
            <Image
              src={images[0]}
              alt={`${category.title} - תמונה 1`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <div className="relative col-span-1 row-span-2 overflow-hidden rounded-[1.6rem] md:col-span-5 md:row-span-3">
            <Image
              src={images[1]}
              alt={`${category.title} - תמונה 2`}
              fill
              sizes="(max-width: 768px) 50vw, 40vw"
              className="object-cover"
            />
          </div>

          <div className="relative col-span-1 row-span-2 overflow-hidden rounded-[1.6rem] md:col-span-5 md:row-span-3">
            <Image
              src={images[2]}
              alt={`${category.title} - תמונה 3`}
              fill
              sizes="(max-width: 768px) 50vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-3 overflow-hidden rounded-[1.8rem] bg-[#1d1c19] text-white sm:mx-5 sm:rounded-[2.2rem] lg:mx-7">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-[0.85fr_1.15fr] md:py-24">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#d7b58c]">
              כמה טיפים לפני שמתחילים
            </p>

            <h2 className="mt-5 text-4xl font-light leading-tight tracking-[-0.03em] md:text-5xl">
              החלטות קטנות
              <br />
              שעושות הבדל גדול.
            </h2>
          </div>

          <div className="space-y-4">
            {category.tips.map((tip, index) => (
              <div
                key={tip}
                className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
              >
                <div className="flex gap-4">
                  <span className="text-sm text-[#d7b58c]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="leading-7 text-white/75">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 md:py-28">
        <div className="flex flex-col gap-8 rounded-[1.8rem] border border-stone-300 bg-white/45 p-7 sm:p-10 md:flex-row md:items-end md:justify-between md:p-14">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-stone-500">
              רוצים לראות איך זה נראה בבית אמיתי?
            </p>

            <h2 className="mt-4 text-4xl font-light tracking-[-0.03em] md:text-5xl">
              עברו לגלריית הלקוחות שלנו.
            </h2>
          </div>

          <Link
            href="/#customer-gallery"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#211f1c] px-7 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#b88655]"
          >
            לגלריית הלקוחות
            <span>←</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
