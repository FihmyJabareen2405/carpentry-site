"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  nextSortOrder: number;
};

type PreviewFile = {
  file: File;
  url: string;
};

export default function DirectProjectImageUploader({
  projectId,
  projectSlug,
  projectTitle,
  nextSortOrder,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUpload, setCurrentUpload] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    return () => {
      files.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, [files]);

  function updateFiles(newFiles: File[]) {
    setMessage(null);
    setErrorMessage(null);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const maxFileSize = 15 * 1024 * 1024;

    const validFiles = newFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(
          "ניתן להעלות רק תמונות JPG, PNG או WebP."
        );

        return false;
      }

      if (file.size > maxFileSize) {
        setErrorMessage(
          `התמונה ${file.name} גדולה מ-15MB.`
        );

        return false;
      }

      return true;
    });

    const existingFiles = files.map((item) => item.file);

    const combinedFiles = [...existingFiles, ...validFiles];

    // Prevent duplicate selections
    const uniqueFiles = combinedFiles.filter(
      (file, index, array) =>
        array.findIndex(
          (otherFile) =>
            otherFile.name === file.name &&
            otherFile.size === file.size &&
            otherFile.lastModified === file.lastModified
        ) === index
    );

    files.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });

    const previews = uniqueFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles(previews);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    updateFiles(Array.from(event.target.files || []));

    // Allows selecting the same file again later
    event.target.value = "";
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setIsDragging(false);

    updateFiles(
      Array.from(event.dataTransfer.files || [])
    );
  }

  function removeFile(indexToRemove: number) {
    const newFiles = files
      .filter((_, index) => index !== indexToRemove)
      .map((item) => item.file);

    files.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });

    const previews = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles(previews);
  }

  async function uploadImages() {
    if (files.length === 0) {
      setErrorMessage("יש לבחור לפחות תמונה אחת.");
      return;
    }

    setIsUploading(true);
    setCurrentUpload(0);
    setMessage(null);
    setErrorMessage(null);

    let sortOrder = nextSortOrder;

    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index].file;

        setCurrentUpload(index + 1);

        const extension =
          file.name.split(".").pop()?.toLowerCase() ||
          getExtensionFromMime(file.type);

        const uniqueFileName =
          `${String(sortOrder).padStart(2, "0")}-${crypto.randomUUID()}.${extension}`;

        const storagePath =
          `${projectSlug}/${uniqueFileName}`;

        /*
         * Upload file directly from browser
         * to Supabase Storage.
         */
        const { error: uploadError } =
          await supabase.storage
            .from("project-images")
            .upload(storagePath, file, {
              contentType: file.type,
              cacheControl: "3600",
              upsert: false,
            });

        if (uploadError) {
          throw new Error(
            `העלאת ${file.name} נכשלה: ${uploadError.message}`
          );
        }

        /*
         * Create DB record
         */
        const { error: databaseError } = await supabase
          .from("project_images")
          .insert({
            project_id: projectId,
            storage_path: storagePath,
            alt_text:
              sortOrder === 1
                ? projectTitle
                : `${projectTitle} - תמונה ${sortOrder}`,
            sort_order: sortOrder,
          });

        /*
         * If DB insert fails, remove the uploaded
         * Storage object so we don't leave orphan files.
         */
        if (databaseError) {
          await supabase.storage
            .from("project-images")
            .remove([storagePath]);

          throw new Error(
            `שמירת פרטי ${file.name} נכשלה: ${databaseError.message}`
          );
        }

        sortOrder++;
      }

      files.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });

      setFiles([]);

      setMessage(
        `${files.length} תמונות הועלו בהצלחה.`
      );

      /*
       * Refresh Server Component so the new
       * images appear immediately.
       */
      router.refresh();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "אירעה שגיאה בהעלאת התמונות."
      );
    } finally {
      setIsUploading(false);
      setCurrentUpload(0);
    }
  }

  return (
    <div>
      {/* Drop area */}
      <div
        onDragOver={(event) => {
          event.preventDefault();

          if (!isUploading) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={(event) => {
          if (!isUploading) {
            handleDrop(event);
          }
        }}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragging
            ? "border-amber-700 bg-amber-50"
            : "border-stone-300 bg-stone-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={isUploading}
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-4xl">
          📷
        </div>

        <p className="mt-4 font-medium">
          גרור תמונות לכאן
        </p>

        <p className="mt-1 text-sm text-stone-500">
          JPG, PNG או WebP . עד 15MB לתמונה
        </p>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-lg border border-stone-300 bg-white px-5 py-2.5 font-medium transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          בחר תמונות
        </button>
      </div>

      {/* Preview */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-stone-600">
              נבחרו {files.length} תמונות
            </p>

            {!isUploading && (
              <button
                type="button"
                onClick={() => {
                  files.forEach((item) => {
                    URL.revokeObjectURL(item.url);
                  });

                  setFiles([]);
                }}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                נקה הכל
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((item, index) => (
              <div
                key={`${item.file.name}-${item.file.lastModified}`}
                className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
              >
                <img
                  src={item.url}
                  alt={`תמונה ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />

                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-lg text-white transition hover:bg-black"
                    aria-label="הסר תמונה"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={uploadImages}
            className="mt-6 rounded-lg bg-stone-900 px-7 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading
              ? `מעלה תמונה ${currentUpload} מתוך ${files.length}...`
              : `העלה ${files.length} תמונות`}
          </button>
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
          ✓ {message}
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

function getExtensionFromMime(type: string) {
  if (type === "image/png") {
    return "png";
  }

  if (type === "image/webp") {
    return "webp";
  }

  return "jpg";
}