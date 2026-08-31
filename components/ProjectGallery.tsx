"use client";

import { useState } from "react";

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

  // אין תמונות
  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-stone-200">
        <div className="text-center text-stone-500">
          <div className="text-5xl">
            🪵
          </div>

          <p className="mt-3">
            אין תמונות לפרויקט
          </p>
        </div>
      </div>
    );
  }

  const selectedImage =
    images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* תמונה ראשית */}
      <div className="overflow-hidden rounded-2xl bg-stone-200">
        <img
          src={selectedImage.url}
          alt={
            selectedImage.alt ||
            title
          }
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      {/* תמונות ממוזערות */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {images.map(
            (image, index) => {
              const isSelected =
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
                  aria-label={`הצג תמונה ${
                    index + 1
                  } של ${title}`}
                  className={`overflow-hidden rounded-lg border-2 transition ${
                    isSelected
                      ? "border-amber-700"
                      : "border-transparent hover:border-stone-400"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={
                      image.alt ||
                      `${title} - תמונה ${
                        index + 1
                      }`
                    }
                    className="aspect-square w-full object-cover"
                  />
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}