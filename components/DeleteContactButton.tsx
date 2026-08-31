"use client";

import type { FormEvent } from "react";

import { deleteContactRequest } from "@/app/admin/contacts/actions";

type Props = {
  contactId: string;
  customerName: string;
};

export default function DeleteContactButton({
  contactId,
  customerName,
}: Props) {
  const action =
    deleteContactRequest.bind(
      null,
      contactId
    );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    const confirmed = window.confirm(
      `האם אתה בטוח שברצונך למחוק את הפנייה של "${customerName}"?`
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
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
      >
        מחיקה
      </button>
    </form>
  );
}