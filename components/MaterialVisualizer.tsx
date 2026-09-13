"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  SITE_NAME,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site";

import {
  createWhatsAppUrl,
} from "@/lib/whatsapp";

/* ======================================== */
/* TYPES */
/* ======================================== */

type MaterialType =
  | "wood"
  | "color";

type GrainDirection =
  | "vertical"
  | "horizontal";

type HandlePosition =
  | "right"
  | "center"
  | "left";

type HandleOrientation =
  | "horizontal"
  | "vertical";

type HandleSize =
  | "small"
  | "medium"
  | "large";

type PreviewMode = "boards" | "cabinet";

type CabinetType = "tall" | "drawers" | "kitchen";

type FrontStyle = "smooth" | "frame" | "grooved";

type CountertopType = "white-marble" | "concrete" | "black" | "oak";

type WallColor = "white" | "cream" | "greige" | "sage" | "charcoal";
type FloorType = "light-wood" | "dark-wood" | "concrete" | "stone";

type ShareableVisualizerConfig = {
  version: 1;
  previewMode: PreviewMode;
  cabinetType: CabinetType;
  frontStyle: FrontStyle;
  countertopType: CountertopType;
  wallColor: WallColor;
  floorType: FloorType;
  left: SideConfig;
  right: SideConfig;
};

type WoodOption = {
  id: string;
  name: string;
  image: string;
  fallback: string;
};

type ColorOption = {
  id: string;
  name: string;
  color: string;
};

type HandleKind =
  | "bar"
  | "tbar"
  | "arch"
  | "knob"
  | "recessed"
  | "edge"
  | "profile"
  | "cup"
  | "slim"
  | "integrated";

type HandleFinish =
  | "black"
  | "nickel"
  | "gold";

type HandleOption = {
  id: string;
  name: string;
  kind: HandleKind | "none";
};

type SideConfig = {
  type: MaterialType;
  woodId: string;
  colorId: string;
  grain: GrainDirection;
  handleId: string;
  handleFinish: HandleFinish;
  handlePosition: HandlePosition;
  handleOrientation: HandleOrientation;
  handleSize: HandleSize;
};

type VisualizerPreset = {
  id: string;
  name: string;
  description: string;
  left: SideConfig;
  right: SideConfig;
};

/* ======================================== */
/* REAL WOOD TEXTURES */
/* ======================================== */

const woods: WoodOption[] = [
  {
    id: "natural-oak",
    name: "אלון טבעי",
    image: "/textures/wood/oak.jpg",
    fallback: "#b88958",
  },
  {
    id: "light-oak",
    name: "אלון בהיר",
    image: "/textures/wood/light-oak.jpg",
    fallback: "#d2b184",
  },
  {
    id: "walnut",
    name: "אגוז",
    image: "/textures/wood/walnut.jpg",
    fallback: "#70492f",
  },
  {
    id: "smoked-oak",
    name: "אלון מעושן",
    image: "/textures/wood/smoked-oak.jpg",
    fallback: "#625447",
  },

  // חדשים

  {
    id: "beech",
    name: "בוק",
    image: "/textures/wood/beech.jpg",
    fallback: "#c99c6d",
  },
  {
    id: "maple",
    name: "מייפל",
    image: "/textures/wood/maple.jpg",
    fallback: "#d8bd91",
  },
  {
    id: "ash",
    name: "מילה",
    image: "/textures/wood/ash.jpg",
    fallback: "#cdb18a",
  },
  {
    id: "cherry",
    name: "דובדבן",
    image: "/textures/wood/cherry.jpg",
    fallback: "#9a5c3d",
  },
  {
    id: "mahogany",
    name: "מהגוני",
    image: "/textures/wood/mahogany.jpg",
    fallback: "#6f3829",
  },
  {
    id: "wenge",
    name: "וונגה",
    image: "/textures/wood/wenge.jpg",
    fallback: "#382c25",
  },
  {
    id: "teak",
    name: "טיק",
    image: "/textures/wood/teak.jpg",
    fallback: "#a26f42",
  },
];

/* ======================================== */
/* COLORS */
/* ======================================== */

const colors: ColorOption[] = [
  {
    id: "white",
    name: "לבן",
    color: "#f0eee8",
  },
  {
    id: "cream",
    name: "שמנת",
    color: "#e4d7bf",
  },
  {
    id: "sahara",
    name: "סהרה",
    color: "#c4b094",
  },
  {
    id: "greige",
    name: "גרייז׳",
    color: "#aaa59c",
  },
  {
    id: "sand",
    name: "חול",
    color: "#c9b99f",
  },
  {
    id: "taupe",
    name: "טאופ",
    color: "#8f8174",
  },
  {
    id: "olive",
    name: "זית",
    color: "#747766",
  },
  {
    id: "sage",
    name: "מרווה",
    color: "#9da28f",
  },
  {
    id: "forest",
    name: "ירוק יער",
    color: "#3f5144",
  },
  {
    id: "clay",
    name: "חמרה",
    color: "#a36f55",
  },
  {
    id: "terracotta",
    name: "טרקוטה",
    color: "#a75f46",
  },
  {
    id: "navy",
    name: "כחול עמוק",
    color: "#34414a",
  },
  {
    id: "blue-grey",
    name: "כחול אפור",
    color: "#66757c",
  },
  {
    id: "light-grey",
    name: "אפור בהיר",
    color: "#c8c8c3",
  },
  {
    id: "graphite",
    name: "גרפיט",
    color: "#41413f",
  },
  {
    id: "anthracite",
    name: "אנטרציט",
    color: "#303234",
  },
  {
    id: "black",
    name: "שחור",
    color: "#191919",
  },
];


/* ======================================== */
/* HANDLES */
/* ======================================== */

const handles: HandleOption[] = [
  {
    id: "none",
    name: "ללא ידית",
    kind: "none",
  },
  {
    id: "bar",
    name: "ידית ישרה",
    kind: "bar",
  },
  {
    id: "tbar",
    name: "ידית T",
    kind: "tbar",
  },
  {
    id: "arch",
    name: "ידית קשת",
    kind: "arch",
  },
  {
    id: "knob",
    name: "כפתור",
    kind: "knob",
  },
  {
    id: "recessed",
    name: "ידית שקועה",
    kind: "recessed",
  },
  {
    id: "edge",
    name: "ידית קצה",
    kind: "edge",
  },
  {
    id: "profile",
    name: "פרופיל G",
    kind: "profile",
  },
  {
    id: "cup",
    name: "ידית כוס",
    kind: "cup",
  },
  {
    id: "slim",
    name: "ידית דקה",
    kind: "slim",
  },
  {
    id: "integrated",
    name: "ידית אינטגרלית",
    kind: "integrated",
  },
];

/* ======================================== */
/* DEFAULTS */
/* ======================================== */

const defaultLeft: SideConfig = {
  type: "wood",
  woodId: "natural-oak",
  colorId: "sahara",
  grain: "vertical",
  handleId: "none",
  handleFinish: "black",
  handlePosition: "right",
  handleOrientation: "horizontal",
  handleSize: "medium",
};

const defaultRight: SideConfig = {
  type: "wood",
  woodId: "smoked-oak",
  colorId: "graphite",
  grain: "vertical",
  handleId: "none",
  handleFinish: "nickel",
  handlePosition: "left",
  handleOrientation: "horizontal",
  handleSize: "medium",
};

const presets: VisualizerPreset[] = [
  {
    id: "oak-black",
    name: "אלון + שחור",
    description: "אלון טבעי עם שחור מט",
    right: {
      ...defaultRight,
      type: "wood",
      woodId: "natural-oak",
      handleId: "bar",
      handleFinish: "black",
      handlePosition: "right",
    },
    left: {
      ...defaultLeft,
      type: "color",
      colorId: "black",
      handleId: "bar",
      handleFinish: "black",
      handlePosition: "left",
    },
  },
  {
    id: "walnut-gold",
    name: "אגוז + זהב",
    description: "אגוז עמוק עם נגיעת זהב",
    right: {
      ...defaultRight,
      type: "wood",
      woodId: "walnut",
      handleId: "bar",
      handleFinish: "gold",
      handlePosition: "right",
    },
    left: {
      ...defaultLeft,
      type: "color",
      colorId: "cream",
      handleId: "knob",
      handleFinish: "gold",
      handlePosition: "left",
    },
  },
  {
    id: "graphite-nickel",
    name: "גרפיט + ניקל",
    description: "מראה מודרני וקר",
    right: {
      ...defaultRight,
      type: "color",
      colorId: "graphite",
      handleId: "bar",
      handleFinish: "nickel",
      handlePosition: "right",
    },
    left: {
      ...defaultLeft,
      type: "color",
      colorId: "light-grey",
      handleId: "bar",
      handleFinish: "nickel",
      handlePosition: "left",
    },
  },
  {
    id: "light-oak-white",
    name: "אלון בהיר + לבן",
    description: "שילוב נקי ובהיר",
    right: {
      ...defaultRight,
      type: "wood",
      woodId: "light-oak",
      handleId: "bar",
      handleFinish: "nickel",
      handlePosition: "right",
    },
    left: {
      ...defaultLeft,
      type: "color",
      colorId: "white",
      handleId: "bar",
      handleFinish: "nickel",
      handlePosition: "left",
    },
  },
  {
    id: "sage-oak",
    name: "מרווה + אלון",
    description: "טבעי, רך וחמים",
    right: {
      ...defaultRight,
      type: "color",
      colorId: "sage",
      handleId: "bar",
      handleFinish: "gold",
      handlePosition: "right",
    },
    left: {
      ...defaultLeft,
      type: "wood",
      woodId: "natural-oak",
      handleId: "knob",
      handleFinish: "gold",
      handlePosition: "left",
    },
  },
  {
    id: "navy-walnut",
    name: "כחול עמוק + אגוז",
    description: "שילוב עשיר ואלגנטי",
    right: {
      ...defaultRight,
      type: "color",
      colorId: "navy",
      handleId: "bar",
      handleFinish: "gold",
      handlePosition: "right",
    },
    left: {
      ...defaultLeft,
      type: "wood",
      woodId: "walnut",
      handleId: "bar",
      handleFinish: "gold",
      handlePosition: "left",
    },
  },
  {
    id: "anthracite-oak",
    name: "אנטרציט + אלון",
    description: "מודרני עם ניגוד חזק",
    right: {
      ...defaultRight,
      type: "color",
      colorId: "anthracite",
      handleId: "tbar",
      handleFinish: "black",
      handlePosition: "right",
    },
    left: {
      ...defaultLeft,
      type: "wood",
      woodId: "natural-oak",
      handleId: "tbar",
      handleFinish: "black",
      handlePosition: "left",
    },
  },
  {
    id: "terracotta-beech",
    name: "טרקוטה + בוק",
    description: "חם, נעים וביתי",
    right: {
      ...defaultRight,
      type: "color",
      colorId: "terracotta",
      handleId: "arch",
      handleFinish: "black",
      handlePosition: "right",
    },
    left: {
      ...defaultLeft,
      type: "wood",
      woodId: "beech",
      handleId: "arch",
      handleFinish: "black",
      handlePosition: "left",
    },
  },
];

/* ======================================== */
/* SHAREABLE LINK */
/* ======================================== */

function encodeVisualizerConfig(
  config: ShareableVisualizerConfig
) {
  const json = JSON.stringify(config);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeVisualizerConfig(
  value: string
): ShareableVisualizerConfig | null {
  try {
    const normalized = value
      .replaceAll("-", "+")
      .replaceAll("_", "/");

    const padded =
      normalized +
      "=".repeat((4 - (normalized.length % 4)) % 4);

    const binary = atob(padded);
    const bytes = Uint8Array.from(
      binary,
      (character) => character.charCodeAt(0)
    );

    const parsed = JSON.parse(
      new TextDecoder().decode(bytes)
    ) as Partial<ShareableVisualizerConfig>;

    if (parsed.version !== 1) return null;

    if (
      !isPreviewMode(parsed.previewMode) ||
      !isCabinetType(parsed.cabinetType) ||
      !isFrontStyle(parsed.frontStyle) ||
      !isCountertopType(parsed.countertopType) ||
      !isWallColor(parsed.wallColor) ||
      !isFloorType(parsed.floorType) ||
      !isValidSideConfig(parsed.left) ||
      !isValidSideConfig(parsed.right)
    ) {
      return null;
    }

    return {
      version: 1,
      previewMode: parsed.previewMode,
      cabinetType: parsed.cabinetType,
      frontStyle: parsed.frontStyle,
      countertopType: parsed.countertopType,
      wallColor: parsed.wallColor,
      floorType: parsed.floorType,
      left: parsed.left,
      right: parsed.right,
    };
  } catch {
    return null;
  }
}

function isPreviewMode(
  value: unknown
): value is PreviewMode {
  return value === "boards" || value === "cabinet";
}

function isCabinetType(
  value: unknown
): value is CabinetType {
  return (
    value === "tall" ||
    value === "drawers" ||
    value === "kitchen"
  );
}

function isFrontStyle(
  value: unknown
): value is FrontStyle {
  return (
    value === "smooth" ||
    value === "frame" ||
    value === "grooved"
  );
}

function isCountertopType(
  value: unknown
): value is CountertopType {
  return (
    value === "white-marble" ||
    value === "concrete" ||
    value === "black" ||
    value === "oak"
  );
}

function isWallColor(
  value: unknown
): value is WallColor {
  return (
    value === "white" ||
    value === "cream" ||
    value === "greige" ||
    value === "sage" ||
    value === "charcoal"
  );
}

function isFloorType(
  value: unknown
): value is FloorType {
  return (
    value === "light-wood" ||
    value === "dark-wood" ||
    value === "concrete" ||
    value === "stone"
  );
}

function isValidSideConfig(
  value: unknown
): value is SideConfig {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const config = value as Partial<SideConfig>;

  const validMaterialType =
    config.type === "wood" ||
    config.type === "color";

  const validWood =
    typeof config.woodId === "string" &&
    woods.some((wood) => wood.id === config.woodId);

  const validColor =
    typeof config.colorId === "string" &&
    colors.some((color) => color.id === config.colorId);

  const validGrain =
    config.grain === "vertical" ||
    config.grain === "horizontal";

  const validHandle =
    typeof config.handleId === "string" &&
    handles.some((handle) => handle.id === config.handleId);

  const validFinish =
    config.handleFinish === "black" ||
    config.handleFinish === "nickel" ||
    config.handleFinish === "gold";

  const validPosition =
    config.handlePosition === "right" ||
    config.handlePosition === "center" ||
    config.handlePosition === "left";

  const validOrientation =
    config.handleOrientation === "horizontal" ||
    config.handleOrientation === "vertical";

  const validSize =
    config.handleSize === "small" ||
    config.handleSize === "medium" ||
    config.handleSize === "large";

  return (
    validMaterialType &&
    validWood &&
    validColor &&
    validGrain &&
    validHandle &&
    validFinish &&
    validPosition &&
    validOrientation &&
    validSize
  );
}

/* ======================================== */
/* MAIN */
/* ======================================== */

export default function MaterialVisualizer() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [isSharingImage, setIsSharingImage] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [wallColor, setWallColor] = useState<WallColor>("greige");
  const [floorType, setFloorType] = useState<FloorType>("light-wood");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("boards");
  const [cabinetType, setCabinetType] = useState<CabinetType>("tall");
  const [frontStyle, setFrontStyle] = useState<FrontStyle>("smooth");
  const [countertopType, setCountertopType] = useState<CountertopType>("white-marble");
  const [activeSide, setActiveSide] = useState<"right" | "left">("right");

  const [
    left,
    setLeft,
  ] =
    useState<SideConfig>(
      defaultLeft
    );

  const [
    right,
    setRight,
  ] =
    useState<SideConfig>(
      defaultRight
    );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedConfig = params.get("cfg");

    if (!encodedConfig) return;

    try {
      const parsed = decodeVisualizerConfig(encodedConfig);

      if (!parsed) return;

      setPreviewMode(parsed.previewMode);
      setCabinetType(parsed.cabinetType);
      setFrontStyle(parsed.frontStyle);
      setCountertopType(parsed.countertopType);
      setWallColor(parsed.wallColor);
      setFloorType(parsed.floorType);
      setLeft(parsed.left);
      setRight(parsed.right);
    } catch (error) {
      console.warn("Could not load shared visualizer configuration:", error);
    }
  }, []);

  const leftName =
    getMaterialName(left);

  const rightName =
    getMaterialName(right);

  async function createCombinationPng() {
    const preview = previewRef.current;
    if (!preview) return null;

    const { toPng } = await import("html-to-image");

    return toPng(preview, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#f5f5f4",
    });
  }

  async function saveCombinationImage() {
    if (isSavingImage) return;

    setIsSavingImage(true);

    try {
      const dataUrl = await createCombinationPng();
      if (!dataUrl) return;

      const link = document.createElement("a");
      link.download = `carpentry-combination-${Date.now()}.png`;
      link.href = dataUrl;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to save visualizer image:", error);
      window.alert("לא הצלחנו לשמור את התמונה. נסו שוב.");
    } finally {
      setIsSavingImage(false);
    }
  }

  async function shareCombinationImage() {
    if (isSharingImage) return;

    setIsSharingImage(true);

    try {
      const dataUrl = await createCombinationPng();
      if (!dataUrl) return;

      const blob = await fetch(dataUrl).then((response) =>
        response.blob()
      );

      const file = new File(
        [blob],
        `carpentry-combination-${Date.now()}.png`,
        { type: "image/png" }
      );

      const shareText = [
        `שילוב חומרים מ-${SITE_NAME}`,
        "",
        `צד ימין: ${getWhatsAppDescription(right)}`,
        `צד שמאל: ${getWhatsAppDescription(left)}`,
      ].join("\n");

      if (
        typeof navigator.share === "function" &&
        (!navigator.canShare ||
          navigator.canShare({ files: [file] }))
      ) {
        await navigator.share({
          title: `שילוב חומרים - ${SITE_NAME}`,
          text: shareText,
          files: [file],
        });
        return;
      }

      const link = document.createElement("a");
      link.download = file.name;
      link.href = dataUrl;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.alert(
        "השיתוף הישיר של תמונה אינו נתמך בדפדפן הזה. התמונה הורדה למכשיר וניתן לצרף אותה ל-WhatsApp."
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Failed to share visualizer image:", error);
      window.alert("לא הצלחנו לשתף את התמונה. נסו שוב.");
    } finally {
      setIsSharingImage(false);
    }
  }

  function applyPreset(preset: VisualizerPreset) {
    setLeft({ ...preset.left });
    setRight({ ...preset.right });
  }

  async function copyCombinationLink() {
    const config: ShareableVisualizerConfig = {
      version: 1,
      previewMode,
      cabinetType,
      frontStyle,
      countertopType,
      wallColor,
      floorType,
      left,
      right,
    };

    const encodedConfig = encodeVisualizerConfig(config);
    const url = new URL(window.location.href);

    url.searchParams.set("cfg", encodedConfig);

    try {
      await navigator.clipboard.writeText(url.toString());
      setLinkCopied(true);

      window.setTimeout(() => {
        setLinkCopied(false);
      }, 2200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url.toString();
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const copied = document.execCommand("copy");
      textarea.remove();

      if (copied) {
        setLinkCopied(true);

        window.setTimeout(() => {
          setLinkCopied(false);
        }, 2200);
      } else {
        window.prompt("העתיקו את הקישור:", url.toString());
      }
    }
  }

  /* ======================================== */
  /* SWAP */
  /* ======================================== */

  function swapSides() {
    const oldLeft = {
      ...left,
    };

    const oldRight = {
      ...right,
    };

    setLeft(oldRight);
    setRight(oldLeft);
  }

  /* ======================================== */
  /* RESET */
  /* ======================================== */

  function reset() {
    setLeft({
      ...defaultLeft,
    });

    setRight({
      ...defaultRight,
    });

    setPreviewMode("boards");
    setCabinetType("tall");
    setFrontStyle("smooth");
    setCountertopType("white-marble");
    setWallColor("greige");
    setFloorType("light-wood");
  }

  /* ======================================== */
  /* WHATSAPP */
  /* ======================================== */

  const whatsappUrl =
    useMemo(() => {
      if (
        !SITE_WHATSAPP_NUMBER
      ) {
        return null;
      }

      const leftText =
        getWhatsAppDescription(
          left
        );

      const rightText =
        getWhatsAppDescription(
          right
        );

      const message = [
        `שלום, הגעתי דרך האתר של ${SITE_NAME}.`,
        "",
        "בחרתי את השילוב הבא ב-Visualizer:",
        "",
        `◾ צד ימין`,
        rightText,
        "",
        `◾ צד שמאל`,
        leftText,
        "",
        "אשמח לקבל מידע והצעת מחיר לגבי השילוב הזה.",
      ].join("\n");

      return createWhatsAppUrl(
        SITE_WHATSAPP_NUMBER,
        message
      );
    }, [
      left,
      right,
    ]);

  return (
    <section
      dir="rtl"
      className="overflow-x-clip bg-[#f5f4f0] px-2 py-3 sm:px-5 sm:py-5 lg:px-7 lg:py-7"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-3 flex flex-col gap-3 rounded-[1.35rem] border border-stone-200 bg-white px-4 py-4 shadow-sm sm:mb-5 sm:rounded-[1.7rem] sm:px-7 sm:py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-amber-700">
              MATERIAL VISUALIZER
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-[-0.03em] text-stone-900 sm:text-3xl md:text-4xl">
              מעצבים ורואים את השינוי מיד
            </h1>
            <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-stone-500 sm:block">
              התצוגה נשארת מול העיניים. כל הבחירות נמצאות בלוח הבקרה שלצידה.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <button
              type="button"
              onClick={reset}
              className="min-h-10 w-full rounded-full border border-stone-300 bg-white px-3 text-xs font-medium text-stone-700 transition hover:bg-stone-100 sm:w-auto sm:px-4 sm:text-sm"
            >
              איפוס
            </button>

            <button
              type="button"
              onClick={swapSides}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-3 text-xs font-medium text-white transition hover:bg-amber-700 sm:w-auto sm:px-4 sm:text-sm"
            >
              <SwapIcon />
              החלף צדדים
            </button>
          </div>
        </div>

        <div className="grid min-w-0 gap-3 sm:gap-5 lg:grid-cols-[minmax(0,1.35fr)_420px] lg:items-start">
          {/* PREVIEW */}
          <div className="sticky top-0 z-40 min-w-0 self-start md:top-20 lg:top-24">
            <div className="overflow-hidden rounded-[1.35rem] border border-stone-200 bg-white shadow-md sm:rounded-[1.8rem] sm:shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 px-3 py-2.5 sm:px-5 sm:py-4">
                <div>
                  <p className="text-[11px] text-stone-400">התצוגה שלכם</p>
                  <p className="mt-0.5 max-w-[170px] truncate text-xs font-medium text-stone-900 sm:mt-1 sm:max-w-none sm:text-base">
                    {rightName} + {leftName}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-stone-100 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("cabinet")}
                    className={`rounded-full px-3 py-1.5 transition ${
                      previewMode === "cabinet"
                        ? "bg-stone-900 text-white shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    ארון
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode("boards")}
                    className={`rounded-full px-3 py-1.5 transition ${
                      previewMode === "boards"
                        ? "bg-stone-900 text-white shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    לוחות
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden bg-[#dedbd4] p-1.5 sm:p-5">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/[0.05]" />

                <div ref={previewRef} className="relative mx-auto max-w-5xl">
                  {previewMode === "cabinet" ? (
                    <CabinetPreview
                      right={right}
                      left={left}
                      cabinetType={cabinetType}
                      frontStyle={frontStyle}
                      countertopType={countertopType}
                      wallColor={wallColor}
                      floorType={floorType}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-0">
                      <MaterialBoard config={right} side="right" />
                      <MaterialBoard config={left} side="left" />
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden grid-cols-2 border-t border-stone-100 sm:grid">
                <SelectionLabel title="צד ימין" value={rightName} />
                <SelectionLabel title="צד שמאל" value={leftName} last />
              </div>

              <div className="grid grid-cols-3 gap-1.5 border-t border-stone-100 px-2 py-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2 sm:px-4 sm:py-4">
                <button
                  type="button"
                  onClick={saveCombinationImage}
                  disabled={isSavingImage || isSharingImage}
                  className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full bg-stone-900 px-2 text-[10px] font-semibold text-white transition hover:bg-stone-700 disabled:cursor-wait disabled:opacity-60 sm:min-h-10 sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <span aria-hidden="true">↓</span>
                  {isSavingImage ? "שומר..." : "הורד תמונה"}
                </button>

                <button
                  type="button"
                  onClick={shareCombinationImage}
                  disabled={isSavingImage || isSharingImage}
                  className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-stone-300 bg-white px-2 text-[10px] font-semibold text-stone-900 transition hover:bg-stone-50 disabled:cursor-wait disabled:opacity-60 sm:min-h-10 sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <span aria-hidden="true">↗</span>
                  {isSharingImage ? "מכין..." : "שתף"}
                </button>

                <button
                  type="button"
                  onClick={copyCombinationLink}
                  className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-stone-300 bg-white px-2 text-[10px] font-semibold text-stone-900 transition hover:bg-stone-50 sm:min-h-10 sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <span aria-hidden="true">🔗</span>
                  {linkCopied ? "הועתק ✓" : "העתק קישור"}
                </button>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <aside className="min-w-0 space-y-3 sm:space-y-4 lg:pl-1">
            <div className="rounded-[1.3rem] border border-stone-200 bg-white p-3 shadow-sm sm:rounded-[1.6rem] sm:p-4">
              <p className="text-[11px] font-medium tracking-[0.18em] text-stone-400">
                עריכת חזית
              </p>

              <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl bg-stone-100 p-1 sm:mt-3 sm:gap-2 sm:rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveSide("right")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    activeSide === "right"
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-600 hover:bg-white"
                  }`}
                >
                  צד ימין
                  <span className="mr-1 block truncate text-[10px] opacity-70 sm:mr-2 sm:inline sm:text-xs">{rightName}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSide("left")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    activeSide === "left"
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-600 hover:bg-white"
                  }`}
                >
                  צד שמאל
                  <span className="mr-1 block truncate text-[10px] opacity-70 sm:mr-2 sm:inline sm:text-xs">{leftName}</span>
                </button>
              </div>
            </div>

            {previewMode === "cabinet" && (
              <div className="rounded-[1.3rem] border border-stone-200 bg-white p-4 shadow-sm sm:rounded-[1.6rem] sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.18em] text-amber-700">
                      תצוגה
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-stone-900">
                      מבנה וסביבה
                    </h2>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium text-stone-500">סוג ארון</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["tall", "גבוה"],
                      ["drawers", "מגירות"],
                      ["kitchen", "מטבח"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCabinetType(id as CabinetType)}
                        className={`rounded-xl border px-2 py-2 text-xs transition ${
                          cabinetType === id
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium text-stone-500">סגנון חזית</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["smooth", "חלקה"],
                      ["frame", "מסגרת"],
                      ["grooved", "חריצים"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFrontStyle(id as FrontStyle)}
                        className={`rounded-xl border px-2 py-2 text-xs transition ${
                          frontStyle === id
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {cabinetType === "kitchen" && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-stone-500">משטח עבודה</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        ["white-marble", "שיש לבן"],
                        ["concrete", "בטון"],
                        ["black", "שחור"],
                        ["oak", "עץ"],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setCountertopType(id as CountertopType)}
                          className={`rounded-xl border px-2 py-2 text-xs transition ${
                            countertopType === id
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-medium text-stone-500">צבע קיר</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ["white", "לבן"],
                        ["cream", "שמנת"],
                        ["greige", "גרייז׳"],
                        ["sage", "מרווה"],
                        ["charcoal", "פחם"],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setWallColor(id as WallColor)}
                          className={`rounded-full border px-2.5 py-1.5 text-[11px] transition ${
                            wallColor === id
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 bg-white text-stone-600"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium text-stone-500">רצפה</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ["light-wood", "עץ בהיר"],
                        ["dark-wood", "עץ כהה"],
                        ["concrete", "בטון"],
                        ["stone", "אבן"],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setFloorType(id as FloorType)}
                          className={`rounded-full border px-2.5 py-1.5 text-[11px] transition ${
                            floorType === id
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 bg-white text-stone-600"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <MaterialSelector
              title={activeSide === "right" ? "צד ימין" : "צד שמאל"}
              number={activeSide === "right" ? "01" : "02"}
              value={activeSide === "right" ? right : left}
              onChange={activeSide === "right" ? setRight : setLeft}
            />

            <div className="rounded-[1.3rem] border border-stone-200 bg-white p-4 shadow-sm sm:rounded-[1.6rem] sm:p-5">
              <p className="text-[11px] font-medium tracking-[0.18em] text-amber-700">
                שילובים מוכנים
              </p>

              <div className="mt-3 grid auto-cols-[150px] grid-flow-col gap-2 overflow-x-auto pb-2 sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-right transition hover:border-stone-400 hover:bg-white"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <span
                          className="h-7 w-7 rounded-full border-2 border-white shadow-sm"
                          style={getPresetSwatchStyle(preset.right)}
                        />
                        <span
                          className="h-7 w-7 rounded-full border-2 border-white shadow-sm"
                          style={getPresetSwatchStyle(preset.left)}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-stone-900">
                          {preset.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.3rem] bg-stone-950 p-4 text-white shadow-sm sm:rounded-[1.6rem] sm:p-5">
              <p className="text-xs text-stone-500">השילוב שנבחר</p>
              <p className="mt-2 text-lg font-medium">
                {rightName} + {leftName}
              </p>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white transition hover:bg-[#20bd5a]"
                >
                  <WhatsAppIcon />
                  שלח לעימאד ב-WhatsApp
                </a>
              ) : (
                <div className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm text-stone-400">
                  מספר WhatsApp לא הוגדר
                </div>
              )}
            </div>

            <p className="px-3 pb-2 text-center text-[11px] leading-5 text-stone-400">
              הדוגמאות מיועדות להמחשה בלבד. גוונים וטקסטורות עשויים להיראות מעט שונה במציאות.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ======================================== */
/* MATERIAL SELECTOR */
/* ======================================== */

function MaterialSelector({
  title,
  number,
  value,
  onChange,
}: {
  title: string;
  number: string;
  value: SideConfig;
  onChange:
    (
      value: SideConfig
    ) => void;
}) {
  return (
    <div className="rounded-[1.35rem] border border-stone-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6 md:p-8">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs text-amber-700">
            חומר {number}
          </p>

          <h2 className="mt-1 text-xl font-bold text-stone-900 sm:mt-2 sm:text-2xl">
            {title}
          </h2>
        </div>

        <span className="text-sm text-stone-300">
          {number}
        </span>

      </div>

      {/* ======================================== */}
      {/* TYPE */}
      {/* ======================================== */}

      <ControlBlock
        title="סוג חומר"
      >

        <div className="grid grid-cols-2 gap-2 sm:gap-3">

          <ChoiceButton
            active={
              value.type ===
              "wood"
            }
            onClick={() =>
              onChange({
                ...value,
                type: "wood",
              })
            }
          >
            עץ
          </ChoiceButton>

          <ChoiceButton
            active={
              value.type ===
              "color"
            }
            onClick={() =>
              onChange({
                ...value,
                type: "color",
              })
            }
          >
            צבע
          </ChoiceButton>

        </div>

      </ControlBlock>

      {/* ======================================== */}
      {/* WOOD */}
      {/* ======================================== */}

      {value.type ===
        "wood" && (
        <>

          <ControlBlock
            title="בחר סוג עץ"
          >

            <div className="grid grid-cols-2 gap-2 sm:gap-3">

              {woods.map(
                (wood) => (
                  <WoodButton
                    key={
                      wood.id
                    }
                    wood={
                      wood
                    }
                    active={
                      value.woodId ===
                      wood.id
                    }
                    grain={
                      value.grain
                    }
                    onClick={() =>
                      onChange({
                        ...value,
                        woodId:
                          wood.id,
                      })
                    }
                  />
                )
              )}

            </div>

          </ControlBlock>

          <ControlBlock
            title="כיוון סיבי העץ"
            last
          >

            <div className="grid grid-cols-2 gap-2 sm:gap-3">

              <ChoiceButton
                active={
                  value.grain ===
                  "vertical"
                }
                onClick={() =>
                  onChange({
                    ...value,
                    grain:
                      "vertical",
                  })
                }
              >
                ↕ אנכי
              </ChoiceButton>

              <ChoiceButton
                active={
                  value.grain ===
                  "horizontal"
                }
                onClick={() =>
                  onChange({
                    ...value,
                    grain:
                      "horizontal",
                  })
                }
              >
                ↔ אופקי
              </ChoiceButton>

            </div>

          </ControlBlock>

        </>
      )}

      {/* ======================================== */}
      {/* COLOR */}
      {/* ======================================== */}

      {value.type ===
        "color" && (
        <ControlBlock
          title="בחר צבע"
        >

          <div className="grid auto-cols-[82px] grid-flow-col gap-2 overflow-x-auto pb-2 sm:grid sm:grid-flow-row sm:grid-cols-4 sm:overflow-visible sm:pb-0">

            {colors.map(
              (color) => (
                <ColorButton
                  key={
                    color.id
                  }
                  item={
                    color
                  }
                  active={
                    value.colorId ===
                    color.id
                  }
                  onClick={() =>
                    onChange({
                      ...value,
                      colorId:
                        color.id,
                    })
                  }
                />
              )
            )}

          </div>

        </ControlBlock>
      )}

      <ControlBlock title="פרזול וידיות">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs text-stone-500">
            החליקו לצדדים ובחרו ידית. השינוי מופיע מיד בתצוגה.
          </p>
          <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-medium text-stone-500">
            {handles.length} אפשרויות
          </span>
        </div>

        <div className="grid auto-cols-[112px] grid-flow-col gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] sm:auto-cols-[132px] sm:gap-3 sm:pb-3">
          {handles.map((handle) => (
            <HandleButton
              key={handle.id}
              item={handle}
              active={value.handleId === handle.id}
              finish={value.handleFinish}
              onClick={() =>
                onChange({
                  ...value,
                  handleId: handle.id,
                })
              }
            />
          ))}
        </div>

        {value.handleId !== "none" && (
          <div className="mt-4 border-t border-stone-100 pt-4">
            <p className="mb-3 text-xs font-medium text-stone-500">
              גימור הפרזול
            </p>

            <div className="grid grid-cols-3 gap-2">
              <FinishButton
                label="שחור מט"
                finish="black"
                active={value.handleFinish === "black"}
                onClick={() =>
                  onChange({
                    ...value,
                    handleFinish: "black",
                  })
                }
              />

              <FinishButton
                label="ניקל"
                finish="nickel"
                active={value.handleFinish === "nickel"}
                onClick={() =>
                  onChange({
                    ...value,
                    handleFinish: "nickel",
                  })
                }
              />

              <FinishButton
                label="זהב"
                finish="gold"
                active={value.handleFinish === "gold"}
                onClick={() =>
                  onChange({
                    ...value,
                    handleFinish: "gold",
                  })
                }
              />
            </div>

            <details className="group mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-stone-700">
                <span>התאמות מתקדמות לידית</span>
                <span className="text-stone-400 transition group-open:rotate-180">⌄</span>
              </summary>

              <div className="space-y-4 border-t border-stone-200 bg-white p-4">
                <div>
                  <p className="mb-2 text-xs font-medium text-stone-500">כיוון</p>
                  <div className="grid grid-cols-2 gap-2">
                    <ChoiceButton
                      active={value.handleOrientation === "horizontal"}
                      onClick={() =>
                        onChange({
                          ...value,
                          handleOrientation: "horizontal",
                        })
                      }
                    >
                      ↔ אופקי
                    </ChoiceButton>

                    <ChoiceButton
                      active={value.handleOrientation === "vertical"}
                      onClick={() =>
                        onChange({
                          ...value,
                          handleOrientation: "vertical",
                        })
                      }
                    >
                      ↕ אנכי
                    </ChoiceButton>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-stone-500">גודל</p>
                  <div className="grid grid-cols-3 gap-2">
                    <ChoiceButton
                      active={value.handleSize === "small"}
                      onClick={() =>
                        onChange({
                          ...value,
                          handleSize: "small",
                        })
                      }
                    >
                      קטן
                    </ChoiceButton>

                    <ChoiceButton
                      active={value.handleSize === "medium"}
                      onClick={() =>
                        onChange({
                          ...value,
                          handleSize: "medium",
                        })
                      }
                    >
                      בינוני
                    </ChoiceButton>

                    <ChoiceButton
                      active={value.handleSize === "large"}
                      onClick={() =>
                        onChange({
                          ...value,
                          handleSize: "large",
                        })
                      }
                    >
                      גדול
                    </ChoiceButton>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-stone-500">מיקום</p>
                  <div className="grid grid-cols-3 gap-2">
                    <ChoiceButton
                      active={value.handlePosition === "right"}
                      onClick={() =>
                        onChange({
                          ...value,
                          handlePosition: "right",
                        })
                      }
                    >
                      ימין
                    </ChoiceButton>

                    <ChoiceButton
                      active={value.handlePosition === "center"}
                      onClick={() =>
                        onChange({
                          ...value,
                          handlePosition: "center",
                        })
                      }
                    >
                      מרכז
                    </ChoiceButton>

                    <ChoiceButton
                      active={value.handlePosition === "left"}
                      onClick={() =>
                        onChange({
                          ...value,
                          handlePosition: "left",
                        })
                      }
                    >
                      שמאל
                    </ChoiceButton>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </ControlBlock>

    </div>
  );
}

/* ======================================== */
/* REAL CABINET PREVIEW */
/* ======================================== */

function RoomWall({
  color,
}: {
  color: WallColor;
}) {
  const background =
    color === "white"
      ? "#f3f1ec"
      : color === "cream"
        ? "#e9dfcf"
        : color === "sage"
          ? "#c9cebf"
          : color === "charcoal"
            ? "#595957"
            : "#d7d0c7";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[79%]"
      style={{ backgroundColor: background }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/22 via-transparent to-black/[0.06]" />
      <div className="absolute inset-y-0 left-[16%] w-px bg-black/[0.035]" />
      <div className="absolute inset-y-0 right-[19%] w-px bg-white/[0.06]" />
    </div>
  );
}

function RoomFloor({
  type,
}: {
  type: FloorType;
}) {
  const style: CSSProperties =
    type === "light-wood"
      ? {
          backgroundColor: "#c9aa7b",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(83,52,27,.16) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 2px, transparent 2px 18px)",
        }
      : type === "dark-wood"
        ? {
            backgroundColor: "#5c4736",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(20,12,8,.24) 0 1px, transparent 1px 68px), repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 2px, transparent 2px 16px)",
          }
        : type === "concrete"
          ? {
              backgroundColor: "#8e8b86",
              backgroundImage:
                "radial-gradient(circle at 25% 35%, rgba(255,255,255,.10) 0 1px, transparent 2px), radial-gradient(circle at 70% 65%, rgba(0,0,0,.10) 0 1px, transparent 2px)",
              backgroundSize: "22px 22px, 29px 29px",
            }
          : {
              backgroundColor: "#b9b4aa",
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,.09) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,.09) 1px, transparent 1px)",
              backgroundSize: "110px 70px",
            };

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[23%]"
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.05] to-black/[0.12]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
    </div>
  );
}

function CabinetPreview({
  right,
  left,
  cabinetType,
  frontStyle,
  countertopType,
  wallColor,
  floorType,
}: {
  right: SideConfig;
  left: SideConfig;
  cabinetType: CabinetType;
  frontStyle: FrontStyle;
  countertopType: CountertopType;
  wallColor: WallColor;
  floorType: FloorType;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/10 shadow-2xl">
      <div
        className={`relative overflow-hidden px-3 pb-6 pt-5 sm:min-h-[500px] sm:px-8 sm:pb-12 sm:pt-10 md:min-h-[560px] md:px-10 ${
          cabinetType === "drawers"
            ? "min-h-[300px]"
            : cabinetType === "kitchen"
              ? "min-h-[330px]"
              : "min-h-[430px]"
        }`}
      >
        <RoomWall color={wallColor} />
        <RoomFloor type={floorType} />

        <div className="pointer-events-none absolute left-[6%] top-0 z-[1] h-full w-[38%] bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute right-[7%] top-[9%] z-[1] h-[46%] w-[18%] rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[21%] z-[1] h-[11%] bg-gradient-to-t from-black/[0.10] to-transparent" />
        <div className="pointer-events-none absolute inset-x-[10%] bottom-[20.5%] z-[2] h-px bg-black/10" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_38%,transparent_20%,rgba(0,0,0,0.10)_100%)]" />
        <div className="pointer-events-none absolute bottom-[10%] left-1/2 z-[2] h-[10%] w-[62%] -translate-x-1/2 rounded-[50%] bg-black/[0.10] blur-2xl" />

        <div className="relative z-10 mx-auto max-w-3xl">
          {cabinetType === "tall" && (
            <TallCabinet right={right} left={left} frontStyle={frontStyle} />
          )}

          {cabinetType === "drawers" && (
            <DrawerCabinet right={right} left={left} frontStyle={frontStyle} />
          )}

          {cabinetType === "kitchen" && (
            <KitchenCabinet right={right} left={left} frontStyle={frontStyle} countertopType={countertopType} />
          )}

          <div className="pointer-events-none mx-auto mt-1 h-7 w-[88%] rounded-[100%] bg-black/20 blur-xl" />
        </div>

        <div className="relative z-10 mx-auto mt-5 grid max-w-3xl grid-cols-2 gap-3 text-center text-xs sm:text-sm">
          <div className="rounded-full bg-white/70 px-3 py-2 text-stone-700 shadow-sm backdrop-blur">
            {getMaterialName(right)}
          </div>
          <div className="rounded-full bg-white/70 px-3 py-2 text-stone-700 shadow-sm backdrop-blur">
            {getMaterialName(left)}
          </div>
        </div>
      </div>
    </div>
  );
}

function TallCabinet({
  right,
  left,
  frontStyle,
}: {
  right: SideConfig;
  left: SideConfig;
  frontStyle: FrontStyle;
}) {
  return (
    <>
      <div className="pointer-events-none absolute -inset-x-5 -top-3 h-8 rounded-full bg-black/15 blur-xl" />

      <div className="relative mx-auto max-w-[300px] rounded-[1.4rem] border border-black/15 bg-gradient-to-r from-[#232220] via-[#34312d] to-[#242321] p-2 shadow-[0_24px_55px_rgba(0,0,0,0.30)] sm:max-w-3xl sm:p-3 sm:shadow-[0_32px_75px_rgba(0,0,0,0.34)]">
        <div className="absolute -left-1 -right-1 -top-4 h-5 rounded-t-md border border-black/10 bg-gradient-to-b from-[#5b5751] to-[#403d39] shadow-[0_5px_10px_rgba(0,0,0,0.25)]" />
        <div className="pointer-events-none absolute inset-y-3 -right-2 w-3 rounded-r-md bg-black/20 blur-[1px]" />

        <div className="grid grid-cols-2 gap-[3px] overflow-hidden rounded-[1rem] bg-black/25 p-[3px] sm:gap-1 sm:p-1">
          <CabinetDoor config={right} side="right" frontStyle={frontStyle} />
          <CabinetDoor config={left} side="left" frontStyle={frontStyle} />
        </div>

        <CabinetPlinth />
      </div>
    </>
  );
}

function DrawerCabinet({
  right,
  left,
  frontStyle,
}: {
  right: SideConfig;
  left: SideConfig;
  frontStyle: FrontStyle;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] rounded-[1.2rem] border border-black/15 bg-gradient-to-r from-[#232220] via-[#34312d] to-[#242321] p-2 shadow-[0_24px_55px_rgba(0,0,0,0.30)] sm:max-w-3xl sm:rounded-[1.4rem] sm:p-3 sm:shadow-[0_32px_75px_rgba(0,0,0,0.34)]">
      {/*
        Keep the base cabinet compact on phones. Previously the drawer fronts
        used h-full inside auto-sized grid rows, which could make the mobile
        preview stretch vertically and visually merge the drawers.
      */}
      <div className="grid grid-cols-2 gap-1">
        {[right, left].map((config, columnIndex) => (
          <div
            key={columnIndex}
            className="grid grid-rows-3 gap-1"
          >
            {[0, 1, 2].map((rowIndex) => (
              <DrawerFront2D
                key={rowIndex}
                config={config}
                frontStyle={frontStyle}
                side={columnIndex === 0 ? "right" : "left"}
              />
            ))}
          </div>
        ))}
      </div>

      <CabinetPlinth />
    </div>
  );
}

function DrawerFront2D({
  config,
  frontStyle,
  side = "right",
}: {
  config: SideConfig;
  frontStyle: FrontStyle;
  side?: "right" | "left";
}) {
  return (
    <div className="relative h-[62px] overflow-hidden bg-stone-300 sm:h-[112px] md:h-[132px]">
      <MaterialSurface config={config} />
      <FrontStyleOverlay style={frontStyle} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.13] via-transparent to-black/[0.09]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/35" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/20" />

      {/* Subtle furniture-like light response */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.16] via-transparent to-black/[0.10]" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-white/25" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-black/20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/35" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/12" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/25" />
      <div className="pointer-events-none absolute inset-[3%] border border-white/15 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />

      <HandleOverlay
        config={{
          ...config,
          handlePosition: "center",
          handleOrientation: "horizontal",
        }}
        side={side}
      />
    </div>
  );
}

function CabinetPlinth() {
  return (
    <div className="relative mx-auto h-7 w-[88%] bg-gradient-to-b from-[#292826] to-[#151514] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_5px_10px_rgba(0,0,0,0.18)] sm:h-9">
      <div className="pointer-events-none absolute inset-x-[7%] bottom-0 h-[35%] bg-black/30" />
    </div>
  );
}

function CountertopSurface({
  type,
}: {
  type: CountertopType;
}) {
  const style: CSSProperties =
    type === "white-marble"
      ? {
          backgroundColor: "#e9e5de",
          backgroundImage:
            "linear-gradient(115deg, transparent 0 32%, rgba(95,95,95,.18) 33%, transparent 34% 52%, rgba(140,140,140,.14) 53%, transparent 54%)",
        }
      : type === "concrete"
        ? {
            backgroundColor: "#8c8983",
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,.14) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(0,0,0,.10) 0 1px, transparent 2px)",
            backgroundSize: "18px 18px, 24px 24px",
          }
        : type === "black"
          ? {
              backgroundColor: "#242424",
              backgroundImage:
                "linear-gradient(120deg, rgba(255,255,255,.04), transparent 35%, rgba(255,255,255,.03))",
            }
          : {
              backgroundColor: "#b88a5a",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(90,55,25,.16) 0px, rgba(90,55,25,.16) 2px, rgba(255,255,255,.05) 2px, rgba(255,255,255,.05) 7px)",
            };

  return (
    <div
      className="relative z-20 -mb-1 h-8 overflow-hidden rounded-t-md border border-black/10 shadow-md sm:h-10"
      style={style}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-white/25" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-black/[0.08]" />
    </div>
  );
}

function KitchenCabinet({
  right,
  left,
  frontStyle,
  countertopType,
}: {
  right: SideConfig;
  left: SideConfig;
  frontStyle: FrontStyle;
  countertopType: CountertopType;
}) {
  return (
    <div className="relative mx-auto max-w-[340px] sm:max-w-3xl">
      <div className="relative">
        <CountertopSurface type={countertopType} />
        <div className="pointer-events-none absolute -bottom-1 left-[2%] right-[2%] z-30 h-2 bg-black/15 blur-md" />
      </div>

      <div className="relative rounded-b-[1.4rem] border border-black/15 bg-gradient-to-r from-[#232220] via-[#34312d] to-[#242321] p-2 shadow-[0_32px_75px_rgba(0,0,0,0.34)] sm:p-3">
        <div className="grid grid-cols-2 items-stretch gap-1">
          <div className="grid h-[216px] grid-rows-3 gap-1 sm:h-auto sm:min-h-[390px] md:min-h-[430px]">
            {[0, 1, 2].map((rowIndex) => (
              <DrawerFront2D
                key={rowIndex}
                config={right}
                frontStyle={frontStyle}
                side="right"
              />
            ))}
          </div>

          <CabinetDoor
            config={left}
            side="left"
            frontStyle={frontStyle}
            short
          />
        </div>

        <CabinetPlinth />
      </div>
    </div>
  );
}

function FrontStyleOverlay({
  style,
}: {
  style: FrontStyle;
}) {
  if (style === "smooth") {
    return null;
  }

  if (style === "frame") {
    return (
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-[6%] border-[6px] border-black/10 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.16),0_0_0_1px_rgba(0,0,0,0.08)] sm:border-[8px]" />
        <div className="absolute inset-[10%] border border-white/15" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 opacity-55">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, rgba(255,255,255,0.10) 1px, rgba(255,255,255,0.10) 3px, transparent 3px, transparent 18px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/[0.03] via-transparent to-white/[0.04]" />
    </div>
  );
}

function CabinetDoor({
  config,
  side,
  frontStyle = "smooth",
  short = false,
}: {
  config: SideConfig;
  side: "right" | "left";
  frontStyle?: FrontStyle;
  short?: boolean;
}) {
  const sizeClass = short
    ? "h-[216px] min-h-0 sm:h-auto sm:min-h-[390px] md:min-h-[430px]"
    : "h-[330px] min-h-0 sm:h-auto sm:aspect-[0.64] sm:min-h-[455px] md:min-h-[505px]";

  return (
    <div className={`relative overflow-hidden bg-stone-300 ${sizeClass}`}>
      <MaterialSurface config={config} />
      <FrontStyleOverlay style={frontStyle} />

      {/* soft room lighting */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/22 via-transparent to-black/12" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[5%] bg-gradient-to-l from-black/10 to-transparent" />

      {/* subtle framed-door bevel */}
      <div className="pointer-events-none absolute inset-[2.4%] border border-white/15 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />

      <HandleOverlay
        config={config}
        side={side}
      />
    </div>
  );
}

/* ======================================== */
/* MAIN MATERIAL BOARD */
/* ======================================== */

function MaterialBoard({
  config,
  side,
}: {
  config: SideConfig;
  side:
    | "right"
    | "left";
}) {
  const name =
    getMaterialName(
      config
    );

  return (
    <div
      className="relative min-w-0"
      style={{
        perspective:
          "1400px",
      }}
    >

      <div
        className={`relative aspect-[0.72] min-h-[205px] overflow-hidden border border-black/10 bg-stone-300 shadow-lg sm:min-h-[450px] sm:shadow-2xl md:min-h-[550px] ${
          side ===
          "right"
            ? "rounded-r-[1.75rem] rounded-l-md"
            : "rounded-l-[1.75rem] rounded-r-md"
        }`}
        style={{
          transform: "none",
          transformOrigin: "center",
        }}
      >

        {/* Real material */}

        <MaterialSurface
          config={
            config
          }
        />

        {/* realistic lighting */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-white/10 to-transparent" />

        <HandleOverlay config={config} side={side} />

        {/* board side edge */}

        <div
          className={`pointer-events-none absolute bottom-0 top-0 w-[6px] bg-gradient-to-r from-black/25 to-black/5 ${
            side ===
            "right"
              ? "left-0"
              : "right-0"
          }`}
        />

        {/* material label */}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-2.5 pb-3 pt-12 text-white sm:px-6 sm:pb-5 sm:pt-20">

          <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">
            {config.type ===
            "wood"
              ? "WOOD"
              : "COLOR"}
          </p>

          <p className="mt-0.5 text-sm font-bold sm:mt-1 sm:text-2xl">
            {name}
          </p>

          {config.type ===
            "wood" && (
            <p className="mt-1 text-xs text-white/65">
              סיבים{" "}
              {config.grain ===
              "vertical"
                ? "אנכיים"
                : "אופקיים"}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

/* ======================================== */
/* MATERIAL SURFACE */
/* ======================================== */

function MaterialSurface({
  config,
}: {
  config: SideConfig;
}) {
  /* COLOR */

  if (
    config.type ===
    "color"
  ) {
    const item =
      colors.find(
        (color) =>
          color.id ===
          config.colorId
      ) ?? colors[0];

    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundColor:
            item.color,

          backgroundImage: `
            radial-gradient(
              circle at 25% 15%,
              rgba(255,255,255,.16),
              transparent 30%
            ),
            linear-gradient(
              120deg,
              rgba(255,255,255,.08),
              transparent 50%
            )
          `,
        }}
      />
    );
  }

  /* WOOD */

  const wood =
    woods.find(
      (item) =>
        item.id ===
        config.woodId
    ) ?? woods[0];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundColor:
          wood.fallback,
      }}
    >
      <div
        key={`${wood.id}-${config.grain}`}
        className="absolute bg-center bg-cover bg-no-repeat transition-transform duration-300"
        style={{
          inset:
            config.grain === "horizontal"
              ? "-25%"
              : "0",

          backgroundImage:
            `url("${wood.image}")`,

          transform:
            config.grain === "horizontal"
              ? "rotate(90deg) scale(1.25)"
              : "rotate(0deg) scale(1)",

          transformOrigin:
            "center",
        }}
      />

      {/* subtle wood finish */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/[0.03] via-white/[0.03] to-black/[0.04]" />
    </div>
  );
}

/* ======================================== */
/* HANDLE OVERLAY */
/* ======================================== */

function HandleOverlay({
  config,
}: {
  config: SideConfig;
  side: "right" | "left";
}) {
  const handle = handles.find(
    (item) => item.id === config.handleId
  );

  if (!handle || handle.kind === "none") {
    return null;
  }

  const horizontalPosition =
    config.handlePosition === "center"
      ? "left-1/2 -translate-x-1/2"
      : config.handlePosition === "right"
        ? "right-[9%]"
        : "left-[9%]";

  const sizeClass =
    config.handleSize === "small"
      ? handle.kind === "knob"
        ? "w-5 sm:w-9 md:w-10"
        : "w-10 sm:w-20 md:w-24"
      : config.handleSize === "large"
        ? handle.kind === "knob"
          ? "w-8 sm:w-14 md:w-16"
          : "w-20 sm:w-40 md:w-48"
        : handle.kind === "knob"
          ? "w-6 sm:w-12 md:w-14"
          : "w-14 sm:w-28 md:w-36";

  const rotation =
    config.handleOrientation === "vertical" &&
    handle.kind !== "knob"
      ? "rotate(90deg)"
      : "none";

  const topPosition =
    handle.kind === "edge" ||
    handle.kind === "profile" ||
    handle.kind === "integrated"
      ? "top-[18%]"
      : "top-[43%]";

  return (
    <div
      className={`pointer-events-none absolute ${topPosition} z-20 -translate-y-1/2 ${horizontalPosition}`}
    >
      <div
        className={`${sizeClass} max-w-none`}
        style={{
          transform: rotation,
          transformOrigin: "center",
        }}
      >
        <HandleGraphic
          kind={handle.kind}
          finish={config.handleFinish}
          decorativeShadow
        />
      </div>
    </div>
  );
}

/* ======================================== */
/* VECTOR HANDLE */
/* ======================================== */

function HandleGraphic({
  kind,
  finish,
  decorativeShadow = false,
}: {
  kind: HandleKind;
  finish: HandleFinish;
  decorativeShadow?: boolean;
}) {
  const metal =
    finish === "black"
      ? {
          main: "#232323",
          light: "#555555",
          dark: "#080808",
        }
      : finish === "gold"
        ? {
            main: "#b58a3d",
            light: "#ead18b",
            dark: "#6d4b16",
          }
        : {
            main: "#9b9d9f",
            light: "#ececec",
            dark: "#55585a",
          };

  const shadow = decorativeShadow
    ? "drop-shadow(0 5px 4px rgba(0,0,0,.25))"
    : "none";

  if (kind === "knob") {
    return (
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        style={{ filter: shadow }}
      >
        <defs>
          <radialGradient id={`knob-${finish}`} cx="36%" cy="28%" r="70%">
            <stop offset="0%" stopColor={metal.light} />
            <stop offset="55%" stopColor={metal.main} />
            <stop offset="100%" stopColor={metal.dark} />
          </radialGradient>
        </defs>
        <ellipse
          cx="50"
          cy="57"
          rx="23"
          ry="8"
          fill="rgba(0,0,0,.16)"
        />
        <circle
          cx="50"
          cy="47"
          r="25"
          fill={`url(#knob-${finish})`}
        />
        <circle
          cx="43"
          cy="39"
          r="7"
          fill="rgba(255,255,255,.15)"
        />
      </svg>
    );
  }

  if (kind === "recessed") {
    return (
      <svg
        viewBox="0 0 260 90"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        style={{ filter: shadow }}
      >
        <defs>
          <linearGradient id={`recess-${finish}`} x1="0" x2="1">
            <stop offset="0%" stopColor={metal.dark} />
            <stop offset="45%" stopColor={metal.main} />
            <stop offset="100%" stopColor={metal.light} />
          </linearGradient>
        </defs>
        <rect
          x="22"
          y="24"
          width="216"
          height="42"
          rx="20"
          fill={`url(#recess-${finish})`}
        />
        <rect
          x="37"
          y="34"
          width="186"
          height="20"
          rx="10"
          fill="rgba(0,0,0,.55)"
        />
        <path
          d="M48 37H212"
          stroke="rgba(255,255,255,.18)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "edge") {
    return (
      <svg
        viewBox="0 0 320 90"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        style={{ filter: shadow }}
      >
        <defs>
          <linearGradient id={`edge-${finish}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metal.light} />
            <stop offset="48%" stopColor={metal.main} />
            <stop offset="100%" stopColor={metal.dark} />
          </linearGradient>
        </defs>
        <rect x="42" y="31" width="236" height="13" rx="5" fill={`url(#edge-${finish})`} />
        <path
          d="M58 44 H262 V57 C262 62 258 66 253 66 H67 C62 66 58 62 58 57 Z"
          fill={metal.dark}
          opacity="0.92"
        />
        <path d="M70 47 H250" stroke="rgba(255,255,255,.20)" strokeWidth="2" />
      </svg>
    );
  }

  if (kind === "profile") {
    return (
      <svg
        viewBox="0 0 320 90"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        style={{ filter: shadow }}
      >
        <defs>
          <linearGradient id={`profile-${finish}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metal.light} />
            <stop offset="50%" stopColor={metal.main} />
            <stop offset="100%" stopColor={metal.dark} />
          </linearGradient>
        </defs>
        <path
          d="M46 28 H274 V42 H74 V53 H258 V66 H60 C52 66 46 60 46 52 Z"
          fill={`url(#profile-${finish})`}
        />
        <path d="M75 45 H255" stroke="rgba(0,0,0,.35)" strokeWidth="3" />
      </svg>
    );
  }

  if (kind === "cup") {
    return (
      <svg
        viewBox="0 0 260 100"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        style={{ filter: shadow }}
      >
        <defs>
          <linearGradient id={`cup-${finish}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metal.light} />
            <stop offset="48%" stopColor={metal.main} />
            <stop offset="100%" stopColor={metal.dark} />
          </linearGradient>
        </defs>
        <path
          d="M50 36 H210 C203 69 181 78 130 78 C79 78 57 69 50 36 Z"
          fill={`url(#cup-${finish})`}
        />
        <path
          d="M64 43 H196 C187 59 169 65 130 65 C91 65 73 59 64 43 Z"
          fill="rgba(0,0,0,.40)"
        />
        <circle cx="67" cy="35" r="5" fill={metal.dark} />
        <circle cx="193" cy="35" r="5" fill={metal.dark} />
      </svg>
    );
  }

  if (kind === "slim") {
    return (
      <svg
        viewBox="0 0 360 90"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        style={{ filter: shadow }}
      >
        <defs>
          <linearGradient id={`slim-${finish}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metal.light} />
            <stop offset="55%" stopColor={metal.main} />
            <stop offset="100%" stopColor={metal.dark} />
          </linearGradient>
        </defs>
        <rect x="48" y="31" width="264" height="9" rx="5" fill={`url(#slim-${finish})`} />
        <rect x="78" y="39" width="8" height="20" rx="3" fill={metal.dark} />
        <rect x="274" y="39" width="8" height="20" rx="3" fill={metal.dark} />
      </svg>
    );
  }

  if (kind === "integrated") {
    return (
      <svg
        viewBox="0 0 320 90"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        style={{ filter: shadow }}
      >
        <defs>
          <linearGradient id={`integrated-${finish}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metal.light} />
            <stop offset="55%" stopColor={metal.main} />
            <stop offset="100%" stopColor={metal.dark} />
          </linearGradient>
        </defs>
        <rect x="42" y="34" width="236" height="25" rx="12" fill="rgba(0,0,0,.36)" />
        <path
          d="M55 35 H265 V46 C265 51 261 55 256 55 H64 C59 55 55 51 55 46 Z"
          fill={`url(#integrated-${finish})`}
        />
        <path d="M72 48 H248" stroke="rgba(255,255,255,.17)" strokeWidth="2" />
      </svg>
    );
  }

  if (kind === "arch") {
    return (
      <svg
        viewBox="0 0 320 100"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        style={{ filter: shadow }}
      >
        <defs>
          <linearGradient id={`arch-${finish}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metal.light} />
            <stop offset="45%" stopColor={metal.main} />
            <stop offset="100%" stopColor={metal.dark} />
          </linearGradient>
        </defs>
        <ellipse cx="160" cy="80" rx="127" ry="7" fill="rgba(0,0,0,.12)" />
        <path
          d="M48 66 C78 23, 242 23, 272 66"
          fill="none"
          stroke={`url(#arch-${finish})`}
          strokeWidth="17"
          strokeLinecap="round"
        />
        <rect x="40" y="58" width="22" height="25" rx="6" fill={metal.dark} />
        <rect x="258" y="58" width="22" height="25" rx="6" fill={metal.dark} />
      </svg>
    );
  }

  const isTBar = kind === "tbar";

  return (
    <svg
      viewBox="0 0 360 90"
      aria-hidden="true"
      className="block h-auto w-full overflow-visible"
      style={{ filter: shadow }}
    >
      <defs>
        <linearGradient id={`bar-${finish}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={metal.light} />
          <stop offset="35%" stopColor={metal.main} />
          <stop offset="100%" stopColor={metal.dark} />
        </linearGradient>
      </defs>

      <ellipse
        cx="180"
        cy="71"
        rx={isTBar ? "140" : "125"}
        ry="6"
        fill="rgba(0,0,0,.12)"
      />

      <rect
        x={isTBar ? "30" : "55"}
        y="25"
        width={isTBar ? "300" : "250"}
        height="18"
        rx="9"
        fill={`url(#bar-${finish})`}
      />

      <rect
        x="77"
        y="41"
        width="15"
        height="27"
        rx="5"
        fill={metal.dark}
      />
      <rect
        x="268"
        y="41"
        width="15"
        height="27"
        rx="5"
        fill={metal.dark}
      />

      {isTBar && (
        <>
          <circle cx="84.5" cy="67" r="8" fill={metal.main} />
          <circle cx="275.5" cy="67" r="8" fill={metal.main} />
        </>
      )}
    </svg>
  );
}

/* ======================================== */
/* HANDLE BUTTON */
/* ======================================== */

function HandleButton({
  item,
  active,
  finish,
  onClick,
}: {
  item: HandleOption;
  active: boolean;
  finish: HandleFinish;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative w-[132px] overflow-hidden rounded-2xl border p-2 text-center transition-all duration-200 ${
        active
          ? "border-stone-900 bg-stone-900 shadow-md ring-2 ring-stone-900/10"
          : "border-stone-200 bg-white hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-sm"
      }`}
    >
      {active && (
        <span className="absolute right-2 top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#d7b58c] text-[10px] font-bold text-stone-950">
          ✓
        </span>
      )}

      <div className="relative h-[92px] overflow-hidden rounded-xl border border-black/5 bg-[#d8c4a9] shadow-inner">
        <div className="absolute inset-[8px] rounded-lg border border-black/10 bg-gradient-to-br from-[#e3d2ba] to-[#c9ad89] shadow-[inset_0_1px_0_rgba(255,255,255,.45)]" />
        <div className="absolute inset-y-[8px] left-1/2 w-px bg-black/[0.06]" />

        {item.kind === "none" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-medium text-stone-500">
              ללא ידית
            </span>
          </div>
        ) : (
          <div
            className={`absolute left-1/2 z-10 -translate-x-1/2 ${
              item.kind === "edge" ||
              item.kind === "profile" ||
              item.kind === "integrated"
                ? "top-[16px]"
                : "top-1/2 -translate-y-1/2"
            } w-[86px]`}
          >
            <HandleGraphic
              kind={item.kind}
              finish={finish}
              decorativeShadow
            />
          </div>
        )}
      </div>

      <p
        className={`mt-2 truncate text-xs font-semibold ${
          active ? "text-white" : "text-stone-700"
        }`}
      >
        {item.name}
      </p>
    </button>
  );
}

function FinishButton({
  label,
  finish,
  active,
  onClick,
}: {
  label: string;
  finish: HandleFinish;
  active: boolean;
  onClick: () => void;
}) {
  const swatch =
    finish === "black"
      ? "linear-gradient(145deg,#555,#111)"
      : finish === "gold"
        ? "linear-gradient(145deg,#f0d99a,#a97826)"
        : "linear-gradient(145deg,#f4f4f4,#777)";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 text-xs font-medium transition ${
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
      }`}
    >
      <span
        className="h-5 w-5 rounded-full border border-black/10 shadow-inner"
        style={{ background: swatch }}
      />
      {label}
    </button>
  );
}

/* ======================================== */
/* WOOD BUTTON */
/* ======================================== */

function WoodButton({
  wood,
  active,
  grain,
  onClick,
}: {
  wood: WoodOption;
  active: boolean;
  grain: GrainDirection;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      aria-pressed={
        active
      }
      className={`overflow-hidden rounded-2xl border p-2 text-right transition ${
        active
          ? "border-stone-900 ring-1 ring-stone-900"
          : "border-stone-200 hover:border-stone-400"
      }`}
    >

      <div
        className="relative h-16 overflow-hidden rounded-lg border border-black/5 sm:h-24 sm:rounded-xl"
        style={{
          backgroundColor:
            wood.fallback,
        }}
      >

        <div
          key={`${wood.id}-${grain}`}
          className="absolute bg-cover bg-center transition-transform duration-300"
          style={{
            inset:
              grain === "horizontal"
                ? "-30%"
                : "0",

            backgroundImage:
              `url("${wood.image}")`,

            transform:
              grain === "horizontal"
                ? "rotate(90deg) scale(1.3)"
                : "rotate(0deg) scale(1)",

            transformOrigin: "center",
          }}
        />

      </div>

      <p className="px-1 pb-1 pt-2 text-xs font-medium text-stone-700">
        {wood.name}
      </p>

    </button>
  );
}

/* ======================================== */
/* COLOR BUTTON */
/* ======================================== */

function ColorButton({
  item,
  active,
  onClick,
}: {
  item: ColorOption;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      aria-pressed={
        active
      }
      className={`rounded-2xl border p-2 text-center transition ${
        active
          ? "border-stone-900 ring-1 ring-stone-900"
          : "border-stone-200 hover:border-stone-400"
      }`}
    >

      <span
        className="block h-14 rounded-xl border border-black/5 shadow-inner"
        style={{
          backgroundColor:
            item.color,
        }}
      />

      <span className="mt-2 block truncate text-[11px] font-medium text-stone-600">
        {item.name}
      </span>

    </button>
  );
}

/* ======================================== */
/* CHOICE BUTTON */
/* ======================================== */

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      aria-pressed={
        active
      }
      className={`min-h-10 rounded-xl border px-3 text-xs font-medium transition sm:min-h-12 sm:px-4 sm:text-sm ${
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
      }`}
    >
      {children}
    </button>
  );
}

/* ======================================== */
/* CONTROL BLOCK */
/* ======================================== */

function ControlBlock({
  title,
  children,
  last = false,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`py-4 sm:py-6 ${
        !last
          ? "border-b border-stone-100"
          : "pb-0"
      }`}
    >

      <p className="mb-3 text-xs font-medium text-stone-700 sm:mb-4 sm:text-sm">
        {title}
      </p>

      {children}

    </div>
  );
}

/* ======================================== */
/* SELECTION LABEL */
/* ======================================== */

function SelectionLabel({
  title,
  value,
  last = false,
}: {
  title: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`px-6 py-5 ${
        !last
          ? "border-l border-stone-100"
          : ""
      }`}
    >

      <p className="text-xs text-stone-400">
        {title}
      </p>

      <p className="mt-1 font-medium text-stone-800">
        {value}
      </p>

    </div>
  );
}

function getPresetSwatchStyle(
  config: SideConfig
): CSSProperties {
  if (config.type === "color") {
    const item =
      colors.find(
        (color) => color.id === config.colorId
      ) ?? colors[0];

    return {
      backgroundColor: item.color,
    };
  }

  const wood =
    woods.find(
      (item) => item.id === config.woodId
    ) ?? woods[0];

  return {
    backgroundColor: wood.fallback,
    backgroundImage: `url("${wood.image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/* ======================================== */
/* NAMES */
/* ======================================== */

function getMaterialName(
  config: SideConfig
) {
  if (
    config.type ===
    "wood"
  ) {
    return (
      woods.find(
        (item) =>
          item.id ===
          config.woodId
      )?.name ??
      "עץ"
    );
  }

  return (
    colors.find(
      (item) =>
        item.id ===
        config.colorId
    )?.name ??
    "צבע"
  );
}

/* ======================================== */
/* WHATSAPP DESCRIPTION */
/* ======================================== */

function getWhatsAppDescription(
  config: SideConfig
) {
  const name = getMaterialName(config);

  const handle =
    handles.find(
      (item) => item.id === config.handleId
    );

  const handleText =
    !handle || handle.kind === "none"
      ? "ללא ידית"
      : `${handle.name}, ${
          config.handleFinish === "black"
            ? "שחור מט"
            : config.handleFinish === "gold"
              ? "זהב"
              : "ניקל"
        }, ${
          config.handleOrientation === "vertical"
            ? "אנכית"
            : "אופקית"
        }, גודל ${
          config.handleSize === "small"
            ? "קטן"
            : config.handleSize === "large"
              ? "גדול"
              : "בינוני"
        }, מיקום ${
          config.handlePosition === "right"
            ? "ימין"
            : config.handlePosition === "left"
              ? "שמאל"
              : "מרכז"
        }`;

  if (config.type === "color") {
    return `${name} (צבע), ${handleText}`;
  }

  return `${name} - סיבים ${
    config.grain === "vertical"
      ? "אנכיים"
      : "אופקיים"
  }, ${handleText}`;
}

/* ======================================== */
/* ICONS */
/* ======================================== */

function SwapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 7h11l-3-3" />
      <path d="M17 17H6l3 3" />
    </svg>
  );
}

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