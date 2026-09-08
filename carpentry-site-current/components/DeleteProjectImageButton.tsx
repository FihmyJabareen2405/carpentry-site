"use client";

import type { FormEvent } from "react";
import { deleteProjectImage } from "@/app/admin/projects/[id]/edit/actions";

type Props = {
  imageId: string;
  projectId: string;
};

export default function DeleteProjectImageButton({
  imageId,
  projectId,
}: Props) {
  const action = deleteProjectImage.bind(
    null,
    imageId,
    projectId
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    const confirmed = window.confirm(
      "האם אתה בטוח שברצונך למחוק את התמונה?"
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
    >
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        מחק תמונה
      </button>
    </form>
  );
}