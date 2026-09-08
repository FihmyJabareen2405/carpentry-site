"use client";

import { useMemo, useState } from "react";

import {
  SITE_NAME,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site";

import {
  createWhatsAppUrl,
} from "@/lib/whatsapp";

type ColorOption = {
  id: string;
  name: string;
  value: string;
  dark?: boolean;
};

type WoodOption = {
  id: string;
  name: string;
  base: string;
  texture: string;
};

const colors: ColorOption[] = [
  {
    id: "white",
    name: "לבן",
    value: "#f3f1eb",
  },
  {
    id: "sahara",
    name: "סהרה",
    value: "#c9b79b",
  },
  {
    id: "greige",
    name: "גרייז׳",
    value: "#aaa59c",
  },
  {
    id: "olive",
    name: "זית",
    value: "#727767",
    dark: true,
  },
  {
    id: "graphite",
    name: "גרפיט",
    value: "#3c3c39",
    dark: true,
  },
  {
    id: "black",
    name: "שחור",
    value: "#181817",
    dark: true,
  },
];

const woods: WoodOption[] = [
  {
    id: "oak",
    name: "אלון טבעי",
    base: "#b98a58",
    texture:
      "repeating-linear-gradient(90deg, rgba(80,45,20,.15) 0px, rgba(80,45,20,.04) 2px, transparent 4px, transparent 11px), linear-gradient(90deg,#b98856,#d0a875,#b6814f)",
  },
  {
    id: "light-oak",
    name: "אלון בהיר",
    base: "#d5b58a",
    texture:
      "repeating-linear-gradient(90deg, rgba(90,60,30,.10) 0px, rgba(90,60,30,.02) 2px, transparent 4px, transparent 12px), linear-gradient(90deg,#d1af81,#e2c69e,#cba575)",
  },
  {
    id: "walnut",
    name: "אגוז",
    base: "#704a32",
    texture:
      "repeating-linear-gradient(90deg, rgba(20,10,5,.22) 0px, rgba(20,10,5,.05) 3px, transparent 5px, transparent 12px), linear-gradient(90deg,#5b3928,#81583d,#65412d)",
  },
  {
    id: "smoked-oak",
    name: "אלון מעושן",
    base: "#675849",
    texture:
      "repeating-linear-gradient(90deg, rgba(15,10,5,.18) 0px, rgba(15,10,5,.03) 2px, transparent 4px, transparent 10px), linear-gradient(90deg,#5e5044,#796958,#564a40)",
  },
];

export default function ProjectCustomizer({
  projectTitle = "מטבח בהתאמה אישית",
}: {
  projectTitle?: string;
}) {
  const [primaryColorId, setPrimaryColorId] =
    useState("sahara");

  const [secondaryColorId, setSecondaryColorId] =
    useState("white");

  const [woodId, setWoodId] =
    useState("oak");

  const [woodPlacement, setWoodPlacement] =
    useState<"upper" | "island">("island");

  const primaryColor =
    colors.find(
      (color) =>
        color.id === primaryColorId
    ) ?? colors[0];

  const secondaryColor =
    colors.find(
      (color) =>
        color.id === secondaryColorId
    ) ?? colors[0];

  const wood =
    woods.find(
      (item) => item.id === woodId
    ) ?? woods[0];

  const whatsappUrl = useMemo(() => {
    if (!SITE_WHATSAPP_NUMBER) {
      return null;
    }

    const message = [
      `שלום, הגעתי דרך האתר של ${SITE_NAME}.`,
      "",
      `אני מעוניין בעיצוב: ${projectTitle}`,
      "",
      `צבע ראשי: ${primaryColor.name}`,
      `צבע משני: ${secondaryColor.name}`,
      `סוג עץ: ${wood.name}`,
      `מיקום העץ: ${
        woodPlacement === "island"
          ? "אי / אזור מרכזי"
          : "ארונות עליונים"
      }`,
      "",
      "אשמח לקבל מידע והצעת מחיר.",
    ].join("\n");

    return createWhatsAppUrl(
      SITE_WHATSAPP_NUMBER,
      message
    );
  }, [
    projectTitle,
    primaryColor.name,
    secondaryColor.name,
    wood.name,
    woodPlacement,
  ]);

  return (
    <section
      dir="rtl"
      className="bg-[#f5f4f0] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* HEADING */}
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-medium text-amber-700">
            Visualizer
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">
            עצבו את השילוב שלכם
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            בחרו צבעים וסוג עץ וראו
            כיצד השילוב משתנה בזמן אמת.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
          {/* ================================= */}
          {/* PREVIEW */}
          {/* ================================= */}

          <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <div>
                <p className="text-xs text-stone-400">
                  תצוגה מקדימה
                </p>

                <p className="mt-1 font-medium text-stone-800">
                  {projectTitle}
                </p>
              </div>

              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-500">
                הדמיה
              </span>
            </div>

            <KitchenPreview
              primaryColor={
                primaryColor.value
              }
              secondaryColor={
                secondaryColor.value
              }
              woodTexture={
                wood.texture
              }
              woodPlacement={
                woodPlacement
              }
            />

            {/* CURRENT SELECTION */}
            <div className="grid border-t border-stone-100 sm:grid-cols-3">
              <SelectionSummary
                label="צבע ראשי"
                value={primaryColor.name}
              />

              <SelectionSummary
                label="צבע משני"
                value={
                  secondaryColor.name
                }
              />

              <SelectionSummary
                label="עץ"
                value={wood.name}
                last
              />
            </div>
          </div>

          {/* ================================= */}
          {/* CONTROLS */}
          {/* ================================= */}

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            {/* PRIMARY */}
            <OptionSection
              number="01"
              title="צבע ראשי"
              description="חזיתות הארונות התחתונים"
            >
              <div className="grid grid-cols-3 gap-3">
                {colors.map(
                  (color) => (
                    <ColorButton
                      key={color.id}
                      color={color}
                      selected={
                        primaryColorId ===
                        color.id
                      }
                      onClick={() =>
                        setPrimaryColorId(
                          color.id
                        )
                      }
                    />
                  )
                )}
              </div>
            </OptionSection>

            {/* SECONDARY */}
            <OptionSection
              number="02"
              title="צבע משני"
              description="חזיתות משלימות וארונות גבוהים"
            >
              <div className="grid grid-cols-3 gap-3">
                {colors.map(
                  (color) => (
                    <ColorButton
                      key={color.id}
                      color={color}
                      selected={
                        secondaryColorId ===
                        color.id
                      }
                      onClick={() =>
                        setSecondaryColorId(
                          color.id
                        )
                      }
                    />
                  )
                )}
              </div>
            </OptionSection>

            {/* WOOD */}
            <OptionSection
              number="03"
              title="סוג עץ"
              description="בחרו את טקסטורת העץ"
            >
              <div className="grid grid-cols-2 gap-3">
                {woods.map((item) => {
                  const selected =
                    woodId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setWoodId(item.id)
                      }
                      className={`overflow-hidden rounded-2xl border p-2 text-right transition ${
                        selected
                          ? "border-stone-900 ring-1 ring-stone-900"
                          : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <div
                        className="h-16 rounded-xl"
                        style={{
                          backgroundColor:
                            item.base,
                          backgroundImage:
                            item.texture,
                        }}
                      />

                      <p className="px-1 pb-1 pt-2 text-xs font-medium text-stone-700">
                        {item.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </OptionSection>

            {/* PLACEMENT */}
            <OptionSection
              number="04"
              title="מיקום העץ"
              description="איפה תרצו שהעץ יהיה דומיננטי?"
              last
            >
              <div className="grid grid-cols-2 gap-3">
                <ChoiceButton
                  active={
                    woodPlacement ===
                    "island"
                  }
                  onClick={() =>
                    setWoodPlacement(
                      "island"
                    )
                  }
                >
                  אי מרכזי
                </ChoiceButton>

                <ChoiceButton
                  active={
                    woodPlacement ===
                    "upper"
                  }
                  onClick={() =>
                    setWoodPlacement(
                      "upper"
                    )
                  }
                >
                  ארונות עליונים
                </ChoiceButton>
              </div>
            </OptionSection>

            {/* WHATSAPP */}
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 font-medium text-white transition hover:scale-[1.01] hover:bg-[#20bd5a]"
              >
                <WhatsAppIcon />

                שלח את העיצוב ב־WhatsApp
              </a>
            ) : (
              <div className="mt-8 rounded-2xl bg-stone-100 p-4 text-center text-sm text-stone-500">
                יש להגדיר מספר WhatsApp
                ב־lib/site.ts
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-stone-400">
          ההדמיה מיועדת להמחשת שילובי
          צבעים וחומרים. גוונים בפועל עשויים
          להשתנות בהתאם למסך, לחומר ולגימור.
        </p>
      </div>
    </section>
  );
}

/* ========================================= */
/* KITCHEN PREVIEW */
/* ========================================= */

function KitchenPreview({
  primaryColor,
  secondaryColor,
  woodTexture,
  woodPlacement,
}: {
  primaryColor: string;
  secondaryColor: string;
  woodTexture: string;
  woodPlacement: "upper" | "island";
}) {
  const upperStyle =
    woodPlacement === "upper"
      ? {
          backgroundImage:
            woodTexture,
        }
      : {
          backgroundColor:
            secondaryColor,
        };

  const islandStyle =
    woodPlacement === "island"
      ? {
          backgroundImage:
            woodTexture,
        }
      : {
          backgroundColor:
            secondaryColor,
        };

  return (
    <div className="relative min-h-[520px] overflow-hidden bg-[#e7e3dc] p-5 sm:p-8 md:min-h-[620px] md:p-12">
      {/* WALL */}
      <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-[#efede7] to-[#dedbd4]" />

      {/* CEILING LIGHT */}
      <div className="absolute left-1/2 top-8 h-3 w-28 -translate-x-1/2 rounded-full bg-white/80 blur-sm" />

      {/* FLOOR */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-[#c5bbae] to-[#a99d90]" />

      {/* BACK WALL */}
      <div className="relative mx-auto mt-14 max-w-4xl">
        {/* UPPER CABINETS */}
        <div className="grid grid-cols-4 gap-[3px]">
          {[0, 1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="relative h-28 overflow-hidden rounded-sm shadow-sm transition-all duration-500 sm:h-36 md:h-44"
                style={upperStyle}
              >
                <div className="absolute inset-y-0 left-2 w-px bg-black/10" />

                <div className="absolute left-3 top-1/2 h-7 w-[2px] -translate-y-1/2 rounded-full bg-black/30" />
              </div>
            )
          )}
        </div>

        {/* BACKSPLASH */}
        <div className="relative h-24 bg-[#c9c4bc] sm:h-28">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,transparent_49%,rgba(0,0,0,.08)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(0,0,0,.06)_50%,transparent_51%)] [background-size:70px_70px]" />

          {/* SINK */}
          <div className="absolute bottom-2 left-[20%] h-2 w-24 rounded-full bg-stone-500/50" />

          <div className="absolute bottom-3 left-[25%] h-8 w-[3px] rounded-full bg-stone-600/60" />

          <div className="absolute bottom-9 left-[25%] h-[3px] w-8 rounded-full bg-stone-600/60" />
        </div>

        {/* COUNTER */}
        <div className="h-4 bg-[#dad7d0] shadow-md" />

        {/* LOWER CABINETS */}
        <div className="grid grid-cols-5 gap-[3px]">
          {[0, 1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="relative h-32 shadow-sm transition-colors duration-500 sm:h-40 md:h-48"
                style={{
                  backgroundColor:
                    primaryColor,
                }}
              >
                <div className="absolute left-3 top-5 h-8 w-[2px] rounded-full bg-black/30" />

                <div className="absolute inset-y-0 left-0 w-px bg-black/10" />
              </div>
            )
          )}
        </div>
      </div>

      {/* ISLAND */}
      <div className="relative mx-auto mt-10 w-[72%] max-w-2xl">
        <div className="relative z-10 h-4 rounded-sm bg-[#e5e1d9] shadow-md" />

        <div
          className="relative mx-3 h-32 overflow-hidden shadow-xl transition-all duration-500 sm:h-40"
          style={islandStyle}
        >
          <div className="absolute inset-y-0 left-1/3 w-px bg-black/10" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-black/10" />

          <div className="absolute left-[31%] top-5 h-8 w-[2px] rounded-full bg-black/30" />

          <div className="absolute left-[65%] top-5 h-8 w-[2px] rounded-full bg-black/30" />
        </div>

        {/* ISLAND SHADOW */}
        <div className="mx-auto h-5 w-[90%] rounded-full bg-black/15 blur-xl" />
      </div>
    </div>
  );
}

/* ========================================= */
/* OPTION SECTION */
/* ========================================= */

function OptionSection({
  number,
  title,
  description,
  children,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`py-7 first:pt-0 ${
        !last
          ? "border-b border-stone-100"
          : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-stone-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-stone-400">
            {description}
          </p>
        </div>

        <span className="text-xs text-stone-300">
          {number}
        </span>
      </div>

      {children}
    </div>
  );
}

/* ========================================= */
/* COLOR BUTTON */
/* ========================================= */

function ColorButton({
  color,
  selected,
  onClick,
}: {
  color: ColorOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-2 text-center transition ${
        selected
          ? "border-stone-900 ring-1 ring-stone-900"
          : "border-stone-200 hover:border-stone-400"
      }`}
    >
      <span
        className="mx-auto block h-12 w-full rounded-xl border border-black/5 shadow-inner"
        style={{
          backgroundColor:
            color.value,
        }}
      />

      <span className="mt-2 block text-xs font-medium text-stone-600">
        {color.name}
      </span>
    </button>
  );
}

/* ========================================= */
/* CHOICE BUTTON */
/* ========================================= */

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-xl border px-4 text-sm font-medium transition ${
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
      }`}
    >
      {children}
    </button>
  );
}

/* ========================================= */
/* SELECTION SUMMARY */
/* ========================================= */

function SelectionSummary({
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
      className={`px-6 py-5 ${
        !last
          ? "border-b border-stone-100 sm:border-b-0 sm:border-l"
          : ""
      }`}
    >
      <p className="text-xs text-stone-400">
        {label}
      </p>

      <p className="mt-1 font-medium text-stone-800">
        {value}
      </p>
    </div>
  );
}

/* ========================================= */
/* WHATSAPP */
/* ========================================= */

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M16 3C8.82 3 3 8.61 3 15.54c0 2.44.74 4.72 2.02 6.65L3 29l7.05-1.94A13.3 13.3 0 0 0 16 28.46c7.18 0 13-5.61 13-12.92S23.18 3 16 3Zm0 23.28c-1.84 0-3.64-.48-5.21-1.39l-.37-.21-4.18 1.15 1.12-4.04-.24-.39a10.47 10.47 0 0 1-1.64-5.86C5.48 9.81 10.2 5.18 16 5.18s10.52 4.63 10.52 10.36S21.8 26.28 16 26.28Z" />
    </svg>
  );
}