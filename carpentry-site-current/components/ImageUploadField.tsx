"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

type PreviewFile = {
  file: File;
  url: string;
};

export default function ImageUploadField() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  function updateFiles(newFiles: File[]) {
    const validFiles = newFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    files.forEach((item) => URL.revokeObjectURL(item.url));

    const previews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles(previews);

    if (inputRef.current) {
      const transfer = new DataTransfer();

      validFiles.forEach((file) => {
        transfer.items.add(file);
      });

      inputRef.current.files = transfer.files;
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateFiles(Array.from(event.target.files || []));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    updateFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(indexToRemove: number) {
    const remainingFiles = files
      .filter((_, index) => index !== indexToRemove)
      .map((item) => item.file);

    updateFiles(remainingFiles);
  }

  return (
    <div>
      <label className="mb-3 block font-medium">
        תמונות הפרויקט
      </label>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragging
            ? "border-amber-700 bg-amber-50"
            : "border-stone-300 bg-stone-50"
        }`}
      >
        <input
          ref={inputRef}
          id="images"
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-4xl">📷</div>

        <p className="mt-4 font-medium">
          גרור תמונות לכאן
        </p>

        <p className="mt-1 text-sm text-stone-500">
          JPG, PNG או WebP
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-lg border border-stone-300 bg-white px-5 py-2.5 font-medium transition hover:bg-stone-100"
        >
          בחר תמונות
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-sm text-stone-500">
            נבחרו {files.length} תמונות
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((item, index) => (
              <div
                key={`${item.file.name}-${index}`}
                className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
              >
                <img
                  src={item.url}
                  alt={`תמונה ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
                  aria-label="הסר תמונה"
                >
                  ×
                </button>

                {index === 0 && (
                  <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    תמונה ראשית
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}