"use client";

import { deleteProject } from "@/app/admin/projects/actions";

type DeleteProjectButtonProps = {
  projectId: string;
  projectTitle: string;
};

export default function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    const confirmed = window.confirm(
      `האם אתה בטוח שברצונך למחוק את "${projectTitle}"?\n\nהפעולה תמחק גם את התמונות ולא ניתן יהיה לבטל אותה.`
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  const action = deleteProject.bind(null, projectId);

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
      >
        מחיקה
      </button>
    </form>
  );
}