"use client";

import {
  useActionState,
  useEffect,
  useRef,
} from "react";

import { useFormStatus } from "react-dom";

import {
  sendContactRequest,
  type ContactFormState,
} from "@/app/contact/actions";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

export default function ContactForm() {
  const formRef =
    useRef<HTMLFormElement>(null);

  const [state, formAction] =
    useActionState(
      sendContactRequest,
      initialState
    );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <>
      {state.message && (
        <div
          className={`mt-7 rounded-2xl border px-5 py-4 text-sm ${
            state.success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.success ? "✓ " : ""}
          {state.message}
        </div>
      )}

      <form
        ref={formRef}
        action={formAction}
        className="mt-9"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="שם מלא"
            required
          >
            <input
              name="name"
              type="text"
              required
              maxLength={100}
              placeholder="השם שלכם"
              className="h-13 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 outline-none transition placeholder:text-stone-400 focus:border-amber-700"
            />
          </FormField>

          <FormField
            label="טלפון"
            required
          >
            <input
              name="phone"
              type="tel"
              required
              maxLength={30}
              dir="ltr"
              placeholder="050-0000000"
              className="h-13 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-right outline-none transition placeholder:text-stone-400 focus:border-amber-700"
            />
          </FormField>
        </div>

        <div className="mt-6">
          <FormField label="אימייל">
            <input
              name="email"
              type="email"
              maxLength={200}
              dir="ltr"
              placeholder="name@example.com"
              className="h-13 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-right outline-none transition placeholder:text-stone-400 focus:border-amber-700"
            />
          </FormField>
        </div>

        <div className="mt-6">
          <FormField label="ספרו לנו על העבודה">
            <textarea
              name="message"
              rows={7}
              maxLength={3000}
              placeholder="לדוגמה: מטבח חדש, ארון לחדר שינה, מזנון לסלון..."
              className="w-full resize-y rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-4 leading-7 outline-none transition placeholder:text-stone-400 focus:border-amber-700"
            />
          </FormField>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <SubmitButton />

          <p className="text-xs leading-6 text-stone-400">
            הפרטים נשלחים ישירות למערכת
            ניהול הפניות.
          </p>
        </div>
      </form>
    </>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-700">
        {label}
        {required && (
          <span className="mr-1 text-amber-700">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-13 min-w-40 items-center justify-center rounded-full bg-stone-900 px-7 font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? "שולח פנייה..."
        : "שלח פנייה"}
    </button>
  );
}