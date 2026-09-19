import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  KitchenGallery,
  type KitchenGalleryItem,
} from "@/components/KitchenGallery";

type CategoryConfig = {
  title: string;
  eyebrow: string;
  intro: string;
  imageFolder: string;
  services: string[];
  tips: string[];
};

type StyleCard = {
  title: string;
  subtitle: string;
  image: string;
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
      "חשבו על הדברים שבהם אתם משתמשים בכל יום, הם צריכים להיות הכי נגישים.",
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
      "ידית נכונה יכולה לשנות מאוד את התחושה, מודרנית, קלאסית או מינימליסטית.",
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
      "יש פרויקטים שאין להם קטגוריה אחת. זה בדיוק המקום שבו נגרות בהתאמה אישית נותנת את הערך הגדול ביותר. אנחנו מתכננים פתרון סביב החלל, השימוש והרעיון שלכם.",
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
      "אל תחששו לשלב חומרים, עץ, זכוכית, מתכת ותאורה יכולים לעבוד מצוין יחד.",
    ],
  },
};

const KITCHEN_GALLERIES: KitchenGalleryItem[] = [
  {
    title: "קלאסי לבן",
    subtitle:
      "חזיתות מסגרת בגוון לבן, ידיות זהב, ויטרינות מוארות ואי מרכזי. מראה אלגנטי ועל־זמני עם תחושה בהירה ויוקרתית.",
    cover: "/categories/details/kitchens/galleries/01/cover.webp",
    images: [
      "/categories/details/kitchens/galleries/01/cover.webp",
      "/categories/details/kitchens/galleries/01/detail-01.webp",
      "/categories/details/kitchens/galleries/01/detail-02.webp",
      "/categories/details/kitchens/galleries/01/detail-03.webp",
      "/categories/details/kitchens/galleries/01/detail-04.webp",
      "/categories/details/kitchens/galleries/01/detail-05.webp",
      "/categories/details/kitchens/galleries/01/detail-06.webp",
      "/categories/details/kitchens/galleries/01/detail-07.webp",
    ],
  },
  {
    title: "מודרני חם",
    subtitle:
      "שילוב מאוזן בין חזיתות בהירות, עץ טבעי ותאורה חמה. מטבח משפחתי שמתחבר לפינת האוכל ויוצר חלל מזמין ונעים.",
    cover: "/categories/details/kitchens/galleries/02/cover.webp",
    images: [
      "/categories/details/kitchens/galleries/02/cover.webp",
      "/categories/details/kitchens/galleries/02/detail-01.webp",
      "/categories/details/kitchens/galleries/02/detail-02.webp",
      "/categories/details/kitchens/galleries/02/detail-03.webp",
      "/categories/details/kitchens/galleries/02/detail-04.webp",
      "/categories/details/kitchens/galleries/02/detail-05.webp",
    ],
  },
  {
    title: "מודרני אורבני",
    subtitle:
      "קווים ישרים, חזיתות חלקות ונגיעות שחורות שמוסיפות עומק. ויטרינות מוארות ומכשירי חשמל כהים משלימים מראה מדויק ועכשווי.",
    cover: "/categories/details/kitchens/galleries/03/cover.webp",
    images: [
      "/categories/details/kitchens/galleries/03/cover.webp",
      "/categories/details/kitchens/galleries/03/detail-01.webp",
      "/categories/details/kitchens/galleries/03/detail-02.webp",
      "/categories/details/kitchens/galleries/03/detail-03.webp",
      "/categories/details/kitchens/galleries/03/detail-04.webp",
    ],
  },
  {
    title: "מינימליסטי נקי",
    subtitle:
      "תכנון שקט ומדויק עם חזיתות לבנות ללא ידיות, משטחי אבן בגוון טבעי ואחסון שממשיך לכל גובה הקיר.",
    cover: "/categories/details/kitchens/galleries/04/cover.webp",
    images: [
      "/categories/details/kitchens/galleries/04/cover.webp",
      "/categories/details/kitchens/galleries/04/detail-01.webp",
      "/categories/details/kitchens/galleries/04/detail-02.webp",
      "/categories/details/kitchens/galleries/04/detail-03.webp",
    ],
  },
  {
    title: "לבן, עץ ותאורה",
    subtitle:
      "מטבח בהיר עם חזיתות חלקות, עץ טבעי, ויטרינה שחורה ותאורה דקורטיבית שהופכת את החלל לאלגנטי ומזמין.",
    cover: "/categories/details/kitchens/galleries/05/cover.webp",
    images: [
      "/categories/details/kitchens/galleries/05/cover.webp",
      "/categories/details/kitchens/galleries/05/detail-01.webp",
      "/categories/details/kitchens/galleries/05/detail-02.webp",
      "/categories/details/kitchens/galleries/05/detail-03.webp",
    ],
  },
  {
    title: "כפרי מודרני",
    subtitle:
      "מטבח לבן בגוון חם עם אי עץ מרכזי, קרניזים טבעיים וויטרינה מוארת. שילוב נקי בין אופי כפרי, אחסון חכם ותכנון עכשווי.",
    cover: "/categories/details/kitchens/galleries/06/cover.webp",
    images: [
      "/categories/details/kitchens/galleries/06/cover.webp",
      "/categories/details/kitchens/galleries/06/detail-01.webp",
      "/categories/details/kitchens/galleries/06/detail-02.webp",
      "/categories/details/kitchens/galleries/06/detail-03.webp",
    ],
  },
];

const DOOR_STYLES: StyleCard[] = [
  {
    title: "דלתות כניסה מעץ",
    subtitle:
      "דלת הכניסה משלבת נוכחות עיצובית, עמידות וביטחון. ניתן לעבוד עם עץ מלא כמו אלון, אגוז או מהגוני, או עם ליבת פלדה בחיפוי עץ. בדלתות חוץ חשוב לשלב טיפול נגד לחות, מזיקים וקרינת UV, יחד עם מנגנוני נעילה איכותיים.",
    image: "/categories/details/doors/01.png",
  },
  {
    title: "דלתות פנים לבית ולמשרד",
    subtitle:
      "בדלתות פנים הדגש הוא על אסתטיקה, בידוד רעשים ועמידות בשימוש יומיומי. אפשר לבחור בין למינטו, פורמייקה, פורניר או דלתות צבע בגימור אפוקסי או שלייפלק, בהתאם לסגנון, לתקציב ולרמת העמידות הרצויה.",
    image: "/categories/details/doors/02.png",
  },
  {
    title: "דלתות למוסדות ומבני ציבור",
    subtitle:
      "דלתות לשימוש אינטנסיבי מתוכננות לעמידות גבוהה במיוחד. הן יכולות לכלול ציפוי HPL, משקופים מאסיביים, הגנה על אצבעות, חלון הצצה, מילוי כבד וצירים מחוזקים. התכנון נעשה לפי אופי המבנה והדרישות התפעוליות שלו.",
    image: "/categories/details/doors/03.png",
  },
];

const MASTER_BEDROOM_STYLES: StyleCard[] = [
  {
    title: "מלון בוטיק",
    subtitle:
      "אווירה שקטה ומפנקת עם מיטה גדולה, גב מיטה מרופד, טקסטיל עשיר ותאורת אווירה חמה. הנגרות משלבת ארונות, שידות ויחידות אחסון כחלק משפה אחידה של יחידת ההורים.",
    image: "/categories/details/bedrooms-kids/master-01.png",
  },
  {
    title: "מודרני מינימליסטי",
    subtitle:
      "קווים ישרים וניקיון ויזואלי, ארונות קיר בקו נקי, גוונים מונוכרומטיים ונגיעות עץ שמחממות את החלל. מתאים למי שמחפש סדר, פונקציונליות ומראה רגוע.",
    image: "/categories/details/bedrooms-kids/master-02.png",
  },
  {
    title: "בוהו שיק טבעי",
    subtitle:
      "חומרים טבעיים כמו עץ אלון, ראטן ופשתן, גווני אדמה וירוק מרווה, וטקסטורות רכות שמייצרות חדר שינה נעים, חם ומחובר לטבע.",
    image: "/categories/details/bedrooms-kids/master-03.png",
  },
];

const KIDS_BEDROOM_STYLES: StyleCard[] = [
  {
    title: "נורדי על זמני",
    subtitle:
      "ריהוט לבן ועץ טבעי בהיר, צבעים ניטרליים ואחסון חכם ונגיש. בסיס נקי שיכול לגדול עם הילד ולהשתנות בקלות באמצעות טקסטיל ואביזרים.",
    image: "/categories/details/bedrooms-kids/kids-01.png",
  },
  {
    title: "הרפתקאות וטבע",
    subtitle:
      "חדר שמעודד דמיון ומשחק עם אלמנטים של יער, הרים או מפות עולם, מיטות עץ, פתרונות אחסון חזקים וגוונים כמו כחול מעושן, ירוק וחרדל.",
    image: "/categories/details/bedrooms-kids/kids-02.png",
  },
  {
    title: "רך וקסום",
    subtitle:
      "אווירה נעימה ומזמינה עם גווני פודרה, קורל ופסטל עדין, פינת יצירה, מדפים דקורטיביים ופתרונות נגרות שמאפשרים לחדר להישאר שימושי גם כשהילדה גדלה.",
    image: "/categories/details/bedrooms-kids/kids-03.png",
  },
];

const WALL_CLADDING_STYLES: StyleCard[] = [
  {
    title: "חיפוי סרגלי עץ לסלון",
    subtitle:
      "קיר כוח חם ומדויק שמחבר בין הטלוויזיה, המזנון והתאורה. סרגלי עץ אנכיים מוסיפים עומק, קצב ותחושת גובה לחלל.",
    image: "/categories/details/wall-cladding/01.png",
  },
  {
    title: "חיפוי דקורטיבי לכניסה",
    subtitle:
      "חיפוי קיר שמעניק לאזור הכניסה נוכחות יוקרתית כבר מהרגע הראשון. ניתן לשלב מראה, קונסולה, תאורה נסתרת ופרטי מתכת.",
    image: "/categories/details/wall-cladding/02.png",
  },
  {
    title: "חיפוי קיר לחדר שינה",
    subtitle:
      "קיר נגרות מאחורי המיטה יוצר תחושה רגועה ועשירה. שילוב של לוחות עץ, סרגלים ותאורה חמה הופך את הקיר לחלק מרכזי בעיצוב החדר.",
    image: "/categories/details/wall-cladding/03.png",
  },
];

const CUSTOM_WORK_STYLES: StyleCard[] = [
  {
    title: "ספריות ומשרדים בהתאמה אישית",
    subtitle:
      "ספריות קיר, שולחנות עבודה ויחידות אחסון שמתוכננים לפי המידות והצרכים של החלל, עם שילוב מדפים פתוחים, מגירות ותאורה.",
    image: "/categories/details/custom/01.png",
  },
  {
    title: "נגרות מתחת למדרגות",
    subtitle:
      "ניצול מדויק של חללים מאתגרים באמצעות ארונות, מגירות, מדפים ונישות שמותאמים לזווית המדרגות והופכים שטח לא מנוצל לאחסון שימושי.",
    image: "/categories/details/custom/02.png",
  },
  {
    title: "ויטרינות ויחידות אירוח",
    subtitle:
      "יחידות תצוגה ובר עם שילוב עץ, זכוכית, תאורה ומדפים. פתרון דקורטיבי ופונקציונלי לחללי אירוח, פינות אוכל וסלונים.",
    image: "/categories/details/custom/03.png",
  },
];

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

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 md:py-16">
        <div className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
          <div>
            <p className="text-[11px] font-medium tracking-[0.22em] text-stone-500">
              מה אנחנו עושים
            </p>

            <h2 className="mt-3 text-3xl font-light leading-tight tracking-[-0.03em] md:text-4xl">
              תכנון שמתחיל
              <br />
              בצורך האמיתי.
            </h2>
          </div>

          <div className="divide-y divide-stone-300 border-y border-stone-300">
            {category.services.map((service, index) => (
              <div
                key={service}
                className="grid grid-cols-[42px_1fr] gap-3 py-3 sm:grid-cols-[54px_1fr] sm:py-4"
              >
                <span className="text-xs text-[#a8784f]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-6">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {slug === "kitchens" || slug === "doors" ? (
        <section className="mx-auto max-w-[1450px] px-3 pb-20 sm:px-5 md:pb-28">
          <div className="mb-8 px-3 sm:px-4 md:mb-12">
            <p className="text-xs font-medium tracking-[0.22em] text-stone-500">
              {slug === "kitchens" ? "סגנונות מטבח" : "סוגי דלתות"}
            </p>

            <h2 className="mt-4 text-4xl font-light tracking-[-0.03em] md:text-5xl">
              {slug === "kitchens" ? (
                <>
                  חמישה מטבחים,
                  <br />
                  כל אחד עם אופי משלו.
                </>
              ) : (
                <>
                  התאמה נכונה
                  <br />
                  לכל שימוש ולכל חלל.
                </>
              )}
            </h2>
          </div>

          {slug === "kitchens" ? (
            <KitchenGallery kitchens={KITCHEN_GALLERIES} />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {DOOR_STYLES.map((style, index) => (
                <article
                  key={style.title}
                  className="group relative min-h-[420px] overflow-hidden rounded-[1.7rem] bg-stone-900 md:min-h-[520px]"
                >
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-black/5" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-7">
                    <span className="text-xs font-medium tracking-[0.18em] text-[#d7b58c]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em]">
                      {style.title}
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-7 text-white/76">
                      {style.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : slug === "bedrooms-kids" ? (
        <section className="mx-auto max-w-[1450px] px-3 pb-20 sm:px-5 md:pb-28">
          <div className="mb-10 px-3 sm:px-4 md:mb-14">
            <p className="text-xs font-medium tracking-[0.22em] text-stone-500">
              חדרי שינה וחדרי ילדים
            </p>

            <h2 className="mt-4 text-4xl font-light tracking-[-0.03em] md:text-5xl">
              שני עולמות,
              <br />
              תכנון אחד מדויק.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-500 md:text-base">
              יחידת ההורים מתוכננת כמקום רגוע, פרטי ומאוזן. חדרי הילדים
              מתוכננים להיות פרקטיים, גמישים ולגדול יחד איתם.
            </p>
          </div>

          <div className="mb-16">
            <div className="mb-6 flex items-end justify-between gap-5 px-3 sm:px-4">
              <div>
                <p className="text-xs font-medium tracking-[0.18em] text-[#9a6c3f]">
                  01 / יחידת הורים
                </p>
                <h3 className="mt-3 text-3xl font-light tracking-[-0.03em] md:text-4xl">
                  חדרי שינה להורים
                </h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {MASTER_BEDROOM_STYLES.map((style, index) => (
                <article
                  key={style.title}
                  className="group relative min-h-[420px] overflow-hidden rounded-[1.7rem] bg-stone-900 md:min-h-[520px]"
                >
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-7">
                    <span className="text-xs font-medium tracking-[0.18em] text-[#d7b58c]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-3 text-3xl font-medium tracking-[-0.03em]">
                      {style.title}
                    </h4>
                    <p className="mt-4 max-w-md text-sm leading-7 text-white/76">
                      {style.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-end justify-between gap-5 px-3 sm:px-4">
              <div>
                <p className="text-xs font-medium tracking-[0.18em] text-[#9a6c3f]">
                  02 / חדרי ילדים
                </p>
                <h3 className="mt-3 text-3xl font-light tracking-[-0.03em] md:text-4xl">
                  חדרים שגדלים יחד איתם
                </h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {KIDS_BEDROOM_STYLES.map((style, index) => (
                <article
                  key={style.title}
                  className="group relative min-h-[420px] overflow-hidden rounded-[1.7rem] bg-stone-900 md:min-h-[520px]"
                >
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-7">
                    <span className="text-xs font-medium tracking-[0.18em] text-[#d7b58c]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-3 text-3xl font-medium tracking-[-0.03em]">
                      {style.title}
                    </h4>
                    <p className="mt-4 max-w-md text-sm leading-7 text-white/76">
                      {style.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : slug === "wall-cladding" || slug === "custom" ? (
        <section className="mx-auto max-w-[1450px] px-3 pb-20 sm:px-5 md:pb-28">
          <div className="mb-8 px-3 sm:px-4 md:mb-12">
            <p className="text-xs font-medium tracking-[0.22em] text-stone-500">
              {slug === "wall-cladding" ? "סוגי חיפויי קיר" : "עבודות מיוחדות"}
            </p>

            <h2 className="mt-4 text-4xl font-light tracking-[-0.03em] md:text-5xl">
              {slug === "wall-cladding" ? (
                <>
                  חומר, קצב ותאורה
                  <br />
                  שמשנים את הקיר.
                </>
              ) : (
                <>
                  פתרונות שנבנים
                  <br />
                  בדיוק לפי החלל.
                </>
              )}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(slug === "wall-cladding"
              ? WALL_CLADDING_STYLES
              : CUSTOM_WORK_STYLES
            ).map((style, index) => (
              <article
                key={style.title}
                className="group relative min-h-[420px] overflow-hidden rounded-[1.7rem] bg-stone-900 md:min-h-[520px]"
              >
                <Image
                  src={style.image}
                  alt={style.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.035]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-black/5" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-7">
                  <span className="text-xs font-medium tracking-[0.18em] text-[#d7b58c]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em]">
                    {style.title}
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-7 text-white/76">
                    {style.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
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
      )}

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
