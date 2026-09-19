"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type KitchenGalleryItem = {
  title: string;
  subtitle: string;
  cover: string;
  images: string[];
};

type KitchenGalleryProps = {
  kitchens: KitchenGalleryItem[];
};

export function KitchenGallery({ kitchens }: KitchenGalleryProps) {
  const [activeKitchenIndex, setActiveKitchenIndex] = useState<number | null>(
    null
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeKitchen =
    activeKitchenIndex === null ? null : kitchens[activeKitchenIndex];

  function openGallery(kitchenIndex: number) {
    setActiveKitchenIndex(kitchenIndex);
    setActiveImageIndex(0);
  }

  function closeGallery() {
    setActiveKitchenIndex(null);
    setActiveImageIndex(0);
  }

  function showPrevious() {
    if (!activeKitchen) return;

    setActiveImageIndex(
      (current) =>
        (current - 1 + activeKitchen.images.length) %
        activeKitchen.images.length
    );
  }

  function showNext() {
    if (!activeKitchen) return;

    setActiveImageIndex(
      (current) => (current + 1) % activeKitchen.images.length
    );
  }

  useEffect(() => {
    if (!activeKitchen) return;

    const imageCount = activeKitchen.images.length;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveKitchenIndex(null);
        setActiveImageIndex(0);
      }

      if (event.key === "ArrowRight" && imageCount > 1) {
        setActiveImageIndex(
          (current) =>
            (current - 1 + imageCount) % imageCount
        );
      }

      if (event.key === "ArrowLeft" && imageCount > 1) {
        setActiveImageIndex(
          (current) => (current + 1) % imageCount
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeKitchen]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {kitchens.map((kitchen, index) => {
          const imageCountLabel =
            kitchen.images.length === 1
              ? "תמונה אחת"
              : `${kitchen.images.length} תמונות`;

          return (
            <button
              key={kitchen.title}
              type="button"
              onClick={() => openGallery(index)}
              className={`group relative overflow-hidden rounded-[1.7rem] bg-stone-900 text-right focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a8784f]/45 ${
                index === kitchens.length - 1 && kitchens.length % 2 === 1
                  ? "aspect-[4/3] md:col-span-2 md:aspect-[16/8]"
                  : "aspect-[4/3] sm:aspect-[16/10]"
              }`}
              aria-label={`פתיחת הגלריה של ${kitchen.title}`}
            >
              <Image
                src={kitchen.cover}
                alt={kitchen.title}
                fill
                sizes={
                  index === kitchens.length - 1 && kitchens.length % 2 === 1
                    ? "(max-width: 768px) 100vw, 100vw"
                    : "(max-width: 768px) 100vw, 50vw"
                }
                className="object-cover transition duration-700 group-hover:scale-[1.035]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5 transition duration-500 group-hover:from-black/95" />

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-7">
                <div className="flex items-center justify-between gap-4 text-xs font-medium tracking-[0.16em] text-[#d7b58c]">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{imageCountLabel}</span>
                </div>

                <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em]">
                  {kitchen.title}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/76">
                  {kitchen.subtitle}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm text-white/90">
                  לצפייה בגלריה
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {activeKitchen ? (
        <div
          className="fixed inset-0 z-[100] bg-black/95 text-white backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`גלריית ${activeKitchen.title}`}
          onClick={closeGallery}
        >
          <div
            className="mx-auto flex h-full max-w-[1800px] flex-col px-3 py-3 sm:px-5 sm:py-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-1 pb-3 sm:px-2">
              <div>
                <p className="text-xs tracking-[0.18em] text-[#d7b58c]">
                  גלריית מטבח
                </p>
                <h2 className="mt-1 text-xl font-medium sm:text-2xl">
                  {activeKitchen.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-white/65">
                  {activeImageIndex + 1} / {activeKitchen.images.length}
                </span>
                <button
                  type="button"
                  onClick={closeGallery}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-2xl transition hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="סגירת הגלריה"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.25rem] bg-black">
              <Image
                key={activeKitchen.images[activeImageIndex]}
                src={activeKitchen.images[activeImageIndex]}
                alt={`${activeKitchen.title}, תמונה ${activeImageIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />

              {activeKitchen.images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-xl backdrop-blur-md transition hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:h-14 sm:w-14"
                    aria-label="התמונה הקודמת"
                  >
                    →
                  </button>

                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-xl backdrop-blur-md transition hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5 sm:h-14 sm:w-14"
                    aria-label="התמונה הבאה"
                  >
                    ←
                  </button>
                </>
              ) : null}
            </div>

            {activeKitchen.images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:mt-4">
                {activeKitchen.images.map((image, imageIndex) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImageIndex(imageIndex)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-28 ${
                      imageIndex === activeImageIndex
                        ? "border-[#d7b58c] opacity-100"
                        : "border-transparent opacity-55 hover:opacity-90"
                    }`}
                    aria-label={`הצגת תמונה ${imageIndex + 1}`}
                    aria-current={
                      imageIndex === activeImageIndex ? "true" : undefined
                    }
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
