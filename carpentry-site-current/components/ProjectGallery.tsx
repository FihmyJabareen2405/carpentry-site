"use client";

import Image from "next/image";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type ProjectImage = {
  id: string;
  url: string;
  alt: string;
};

type ProjectGalleryProps = {
  images: ProjectImage[];
  title: string;
};

export default function ProjectGallery({
  images,
  title,
}: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] =
    useState(0);
  const [isLightboxOpen, setIsLightboxOpen] =
    useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const hasMultipleImages = images.length > 1;

  function showPrevious() {
    if (!hasMultipleImages) return;

    setSelectedIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  function showNext() {
    if (!hasMultipleImages) return;

    setSelectedIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  }

  function openLightbox() {
    setIsLightboxOpen(true);
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
  }

  function handleTouchStart(
    event: React.TouchEvent<HTMLElement>
  ) {
    touchEndX.current = null;
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLElement>
  ) {
    touchEndX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current - touchEndX.current;
    const minimumSwipeDistance = 45;

    if (Math.abs(distance) < minimumSwipeDistance) {
      return;
    }

    // In an RTL gallery, a swipe to the left advances,
    // while a swipe to the right shows the previous image.
    if (distance > 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showNext();
      }

      if (event.key === "ArrowRight") {
        showPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] bg-stone-200">
        <div className="text-center text-stone-500">
          <div className="text-5xl">🪵</div>

          <p className="mt-3 text-sm">אין תמונות לפרויקט</p>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div
          className="group relative overflow-hidden rounded-[2rem] bg-stone-200"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={openLightbox}
            aria-label="פתח תמונה במסך מלא"
            className="relative block aspect-[4/3] w-full cursor-zoom-in"
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt || title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition duration-500 group-hover:scale-[1.01]"
            />
          </button>

          {/* Full screen hint */}
          <button
            type="button"
            onClick={openLightbox}
            aria-label="פתח גלריה במסך מלא"
            className="absolute right-5 top-5 flex h-11 items-center gap-2 rounded-full bg-black/45 px-4 text-xs font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-black/60"
          >
            <span aria-hidden="true">⛶</span>
            <span className="hidden sm:inline">מסך מלא</span>
          </button>

          {/* Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-5 left-5 rounded-full bg-black/45 px-4 py-2 text-xs text-white backdrop-blur-md">
              {selectedIndex + 1} / {images.length}
            </div>
          )}

          {/* Previous / Next */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="תמונה קודמת"
                className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-stone-900 opacity-100 shadow-lg backdrop-blur transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
              >
                →
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="תמונה הבאה"
                className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-stone-900 opacity-100 shadow-lg backdrop-blur transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
              >
                ←
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
            {images.map((image, index) => {
              const selected = selectedIndex === index;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`הצג תמונה ${index + 1}`}
                  aria-current={selected ? "true" : undefined}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                    selected
                      ? "border-amber-700"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={
                      image.alt ||
                      `${title} - תמונה ${index + 1}`
                    }
                    fill
                    sizes="(max-width: 640px) 25vw, 128px"
                    className="object-cover"
                  />

                  {selected && (
                    <div className="absolute inset-0 bg-black/5" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* LIGHTBOX */}
      {/* ========================================= */}

      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`גלריית ${title}`}
          className="fixed inset-0 z-[100] bg-black/95 text-white"
          onClick={closeLightbox}
        >
          <div className="flex h-full min-h-0 flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/90">
                  {title}
                </p>

                {hasMultipleImages && (
                  <p className="mt-1 text-xs text-white/55">
                    {selectedIndex + 1} / {images.length}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  closeLightbox();
                }}
                aria-label="סגור גלריה"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl transition hover:bg-white/20"
              >
                ×
              </button>
            </div>

            {/* Image stage */}
            <div
              className="group/lightbox relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3 sm:px-16 sm:pb-5"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt || title}
                fill
                sizes="100vw"
                draggable={false}
                className="select-none object-contain"
              />

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="תמונה קודמת"
                    className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl backdrop-blur transition hover:bg-white/20 sm:right-6 sm:h-14 sm:w-14"
                  >
                    →
                  </button>

                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="תמונה הבאה"
                    className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl backdrop-blur transition hover:bg-white/20 sm:left-6 sm:h-14 sm:w-14"
                  >
                    ←
                  </button>
                </>
              )}
            </div>

            {/* Lightbox thumbnails */}
            {hasMultipleImages && (
              <div
                className="border-t border-white/10 px-4 py-3 sm:px-6"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1">
                  {images.map((image, index) => {
                    const selected = selectedIndex === index;

                    return (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        aria-label={`הצג תמונה ${index + 1}`}
                        aria-current={selected ? "true" : undefined}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20 ${
                          selected
                            ? "border-amber-500 opacity-100"
                            : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={
                            image.alt ||
                            `${title} - תמונה ${index + 1}`
                          }
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
