import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import DeleteContactButton from "@/components/DeleteContactButton";
import { updateContactStatus } from "./actions";

export const instant = false;

export default async function ContactsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/");
  }

  const { data: contacts, error } =
    await supabase
      .from("contact_requests")
      .select(`
        id,
        name,
        phone,
        email,
        message,
        status,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Error loading contacts:",
      error
    );

    return (
      <main
        dir="rtl"
        className="min-h-screen bg-stone-100 p-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            אירעה שגיאה בטעינת הפניות.
          </div>
        </div>
      </main>
    );
  }

  const newCount =
    contacts?.filter(
      (contact) =>
        contact.status === "new"
    ).length ?? 0;

  const contactedCount =
    contacts?.filter(
      (contact) =>
        contact.status === "contacted"
    ).length ?? 0;

  const closedCount =
    contacts?.filter(
      (contact) =>
        contact.status === "closed"
    ).length ?? 0;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-stone-100"
    >
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm text-stone-500">
              מערכת ניהול
            </p>

            <h1 className="text-2xl font-bold">
              פניות מלקוחות
            </h1>
          </div>

          <Link
            href="/admin"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
          >
            חזרה ל-Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="סה״כ פניות"
            value={contacts?.length ?? 0}
          />

          <StatCard
            label="פניות חדשות"
            value={newCount}
            highlight={newCount > 0}
          />

          <StatCard
            label="טופלו"
            value={contactedCount}
          />

          <StatCard
            label="נסגרו"
            value={closedCount}
          />
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold">
            כל הפניות
          </h2>

          <p className="mt-2 text-stone-600">
            כאן מופיעות כל הפניות שהתקבלו דרך
            טופס יצירת הקשר באתר.
          </p>
        </div>

        {!contacts ||
        contacts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-12 text-center">
            <div className="text-5xl">
              📭
            </div>

            <h3 className="mt-5 text-xl font-bold">
              עדיין אין פניות
            </h3>

            <p className="mt-2 text-stone-500">
              פניות חדשות מהאתר יופיעו כאן.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {contacts.map((contact) => {
              const statusAction =
                updateContactStatus.bind(
                  null,
                  contact.id
                );

              const whatsappUrl =
                createWhatsAppUrl(
                  contact.phone,
                  `שלום ${contact.name}, כאן נגריית עימאד אקרם. קיבלנו את הפנייה שלך דרך האתר.`
                );

              return (
                <article
                  key={contact.id}
                  className="rounded-2xl border border-stone-200 bg-white p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <StatusBadge
                        status={
                          contact.status
                        }
                      />

                      <h3 className="mt-3 text-2xl font-bold">
                        {contact.name}
                      </h3>

                      <p className="mt-2 text-sm text-stone-500">
                        התקבלה{" "}
                        {formatDate(
                          contact.created_at
                        )}
                      </p>
                    </div>

                    <form
                      action={statusAction}
                      className="flex flex-wrap items-end gap-2"
                    >
                      <div>
                        <label
                          htmlFor={`status-${contact.id}`}
                          className="mb-1 block text-xs text-stone-500"
                        >
                          סטטוס
                        </label>

                        <select
                          id={`status-${contact.id}`}
                          name="status"
                          defaultValue={
                            contact.status
                          }
                          className="rounded-lg border border-stone-300 bg-white px-4 py-2"
                        >
                          <option value="new">
                            חדש
                          </option>

                          <option value="contacted">
                            טופל
                          </option>

                          <option value="closed">
                            נסגר
                          </option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="rounded-lg bg-stone-900 px-4 py-2 font-medium text-white transition hover:bg-stone-700"
                      >
                        שמור
                      </button>
                    </form>
                  </div>

                  <div className="mt-6 grid gap-5 border-t border-stone-200 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm text-stone-500">
                        טלפון
                      </p>

                      <a
                        href={`tel:${contact.phone}`}
                        dir="ltr"
                        className="mt-1 inline-block font-medium hover:text-amber-700"
                      >
                        {contact.phone}
                      </a>
                    </div>

                    <div>
                      <p className="text-sm text-stone-500">
                        אימייל
                      </p>

                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          dir="ltr"
                          className="mt-1 inline-block break-all font-medium hover:text-amber-700"
                        >
                          {contact.email}
                        </a>
                      ) : (
                        <p className="mt-1 text-stone-400">
                          לא הוזן
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-stone-500">
                        התקבל בתאריך
                      </p>

                      <p className="mt-1 font-medium">
                        {formatDate(
                          contact.created_at
                        )}
                      </p>
                    </div>
                  </div>

                  {contact.message && (
                    <div className="mt-6 rounded-xl bg-stone-50 p-5">
                      <p className="text-sm font-medium text-stone-500">
                        הודעת הלקוח
                      </p>

                      <p className="mt-3 whitespace-pre-wrap break-words leading-7">
                        {contact.message}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-stone-200 pt-5">
                    <a
                      href={`tel:${contact.phone}`}
                      className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
                    >
                      📞 התקשר
                    </a>

                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-800 transition hover:bg-green-100"
                      >
                        WhatsApp
                      </a>
                    )}

                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-100"
                      >
                        ✉️ שלח אימייל
                      </a>
                    )}

                    <DeleteContactButton
                      contactId={contact.id}
                      customerName={contact.name}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlight
          ? "border-green-200 bg-green-50"
          : "border-stone-200 bg-white"
      }`}
    >
      <p
        className={`text-sm ${
          highlight
            ? "text-green-700"
            : "text-stone-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "contacted") {
    return (
      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
        טופל
      </span>
    );
  }

  if (status === "closed") {
    return (
      <span className="inline-flex rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
        נסגר
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
      חדש
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "he-IL",
    {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Asia/Jerusalem",
    }
  ).format(new Date(value));
}