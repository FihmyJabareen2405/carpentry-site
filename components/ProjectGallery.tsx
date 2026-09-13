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
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLElement>
  ) {
    touchEndX.current =
      event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    const minimumSwipeDistance = 45;

    if (
      Math.abs(distance) <
      minimumSwipeDistance
    ) {
      return;
    }

    if (distance > 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent
    ) {
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

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isLightboxOpen,
    images.length,
  ]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.8rem] bg-stone-200 sm:rounded-[2.2rem]">
        <div className="text-center text-stone-500">
          <div className="text-4xl">
            🪵
          </div>

          <p className="mt-3 text-sm">
            אין תמונות לפרויקט
          </p>
        </div>
      </div>
    );
  }

  const selectedImage =
    images[selectedIndex];

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        <div
          className="group relative overflow-hidden rounded-[1.8rem] bg-stone-200 shadow-[0_20px_70px_rgba(53,45,36,0.08)] sm:rounded-[2.2rem]"
          onTouchStart={
            handleTouchStart
          }
          onTouchMove={
            handleTouchMove
          }
          onTouchEnd={
            handleTouchEnd
          }
        >
          <button
            type="button"
            onClick={openLightbox}
            aria-label="פתח תמונה במסך מלא"
            className="relative block aspect-[4/3] w-full cursor-zoom-in sm:aspect-[16/10] lg:aspect-[16/9]"
          >
            <Image
              src={selectedImage.url}
              alt={
                selectedImage.alt ||
                title
              }
              fill
              priority
              sizes="100vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
            />
          </button>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/[0.04]" />

          <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-5 sm:top-5">
            <button
              type="button"
              onClick={openLightbox}
              aria-label="פתח גלריה במסך מלא"
              className="flex h-10 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 text-xs font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-black/50 sm:h-11 sm:px-4"
            >
              <span aria-hidden="true">
                ⛶
              </span>

              <span className="hidden sm:inline">
                מסך מלא
              </span>
            </button>
          </div>

          {hasMultipleImages && (
            <div className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs text-white backdrop-blur-md sm:bottom-5 sm:right-5 sm:px-4 sm:py-2">
              {selectedIndex + 1}
              <span className="mx-1.5 text-white/45">
                /
              </span>
              {images.length}
            </div>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-4 left-4 flex gap-2 sm:bottom-5 sm:left-5">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="תמונה הבאה"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-stone-950 shadow-lg transition hover:scale-105 sm:h-11 sm:w-11"
              >
                ←
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="תמונה קודמת"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/25 text-lg text-white backdrop-blur-md transition hover:bg-black/45 sm:h-11 sm:w-11"
              >
                →
              </button>
            </div>
          )}
        </div>

        {hasMultipleImages && (
          <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:thin] sm:gap-3">
            {images.map(
              (image, index) => {
                const selected =
                  selectedIndex === index;

                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() =>
                      setSelectedIndex(
                        index
                      )
                    }
                    aria-label={`הצג תמונה ${index + 1}`}
                    aria-current={
                      selected
                        ? "true"
                        : undefined
                    }
                    className={`relative aspect-[4/3] w-[116px] shrink-0 overflow-hidden rounded-[1rem] border-2 transition sm:w-[145px] sm:rounded-[1.15rem] ${
                      selected
                        ? "border-stone-950 opacity-100"
                        : "border-transparent opacity-55 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={
                        image.alt ||
                        `${title} תמונה ${index + 1}`
                      }
                      fill
                      sizes="160px"
                      className="object-cover"
                    />

                    {selected && (
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/35" />
                    )}
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`גלריית ${title}`}
          className="fixed inset-0 z-[100] bg-black/96 text-white"
          onClick={
            closeLightbox
          }
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3.5 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/90">
                  {title}
                </p>

                {hasMultipleImages && (
                  <p className="mt-0.5 text-xs text-white/45">
                    {selectedIndex + 1}
                    {" / "}
                    {images.length}
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20 sm:h-11 sm:w-11"
              >
                ×
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-2 sm:px-16 sm:py-4"
              onClick={(event) =>
                event.stopPropagation()
              }
              onTouchStart={
                handleTouchStart
              }
              onTouchMove={
                handleTouchMove
              }
              onTouchEnd={
                handleTouchEnd
              }
            >
              <Image
                src={selectedImage.url}
                alt={
                  selectedImage.alt ||
                  title
                }
                fill
                sizes="100vw"
                draggable={false}
                className="select-none object-contain"
              />

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={
                      showPrevious
                    }
                    aria-label="תמונה קודמת"
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl backdrop-blur transition hover:bg-white/20 sm:right-6 sm:h-14 sm:w-14 sm:text-2xl"
                  >
                    →
                  </button>

                  <button
                    type="button"
                    onClick={
                      showNext
                    }
                    aria-label="תמונה הבאה"
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl backdrop-blur transition hover:bg-white/20 sm:left-6 sm:h-14 sm:w-14 sm:text-2xl"
                  >
                    ←
                  </button>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div
                className="border-t border-white/10 bg-black/35 px-3 py-3 sm:px-6"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                  {images.map(
                    (
                      image,
                      index
                    ) => {
                      const selected =
                        selectedIndex ===
                        index;

                      return (
                        <button
                          key={
                            image.id
                          }
                          type="button"
                          onClick={() =>
                            setSelectedIndex(
                              index
                            )
                          }
                          className={`relative aspect-[4/3] w-[82px] shrink-0 overflow-hidden rounded-lg border transition sm:w-[105px] ${
                            selected
                              ? "border-white opacity-100"
                              : "border-white/10 opacity-45 hover:opacity-90"
                          }`}
                          aria-label={`הצג תמונה ${index + 1}`}
                        >
                          <Image
                            src={
                              image.url
                            }
                            alt={
                              image.alt ||
                              title
                            }
                            fill
                            sizes="110px"
                            className="object-cover"
                          />
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
