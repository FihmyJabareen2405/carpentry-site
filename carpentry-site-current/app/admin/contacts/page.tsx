import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createWhatsAppUrl } from "@/lib/whatsapp";

import DeleteContactButton from "@/components/DeleteContactButton";

import {
  updateContactStatus,
} from "./actions";

export const instant = false;

export default async function ContactsPage() {
  const supabase = await createClient();

  /* ========================================= */
  /* AUTH */
  /* ========================================= */

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

  /* ========================================= */
  /* CONTACTS */
  /* ========================================= */

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
  }

  const allContacts =
    contacts ?? [];

  const newCount =
    allContacts.filter(
      (contact) =>
        contact.status === "new"
    ).length;

  const contactedCount =
    allContacts.filter(
      (contact) =>
        contact.status ===
        "contacted"
    ).length;

  const closedCount =
    allContacts.filter(
      (contact) =>
        contact.status ===
        "closed"
    ).length;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1450px] px-5 py-8 md:px-8 md:py-10">
        {/* ===================================== */}
        {/* TOP */}
        {/* ===================================== */}

        <div>
          <p className="text-sm font-medium text-amber-700">
            לקוחות
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            פניות מלקוחות
          </h1>

          <p className="mt-2 text-stone-500">
            כל הפניות שנשלחו דרך טופס
            יצירת הקשר באתר.
          </p>
        </div>

        {/* ===================================== */}
        {/* STATS */}
        {/* ===================================== */}

        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="סה״כ פניות"
            value={allContacts.length}
          />

          <StatCard
            label="חדשות"
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

        {/* ===================================== */}
        {/* CONTACT LIST */}
        {/* ===================================== */}

        <section className="mt-10">
          <div>
            <h2 className="text-xl font-bold">
              כל הפניות
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              הפניות מוצגות מהחדשה
              ביותר לישנה ביותר.
            </p>
          </div>

          {allContacts.length === 0 ? (
            <div className="mt-6 rounded-[1.75rem] border border-stone-200 bg-white px-6 py-20 text-center">
              <div className="text-4xl">
                ✉
              </div>

              <h3 className="mt-5 text-xl font-bold">
                אין עדיין פניות
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                פניות חדשות מהאתר
                יופיעו כאן.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {allContacts.map(
                (contact) => {
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
                      className="rounded-[1.75rem] border border-stone-200 bg-white p-5 md:p-6"
                    >
                      {/* TOP ROW */}
                      <div className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold">
                              {
                                contact.name
                              }
                            </h3>

                            <StatusBadge
                              status={
                                contact.status
                              }
                            />
                          </div>

                          <p className="mt-2 text-xs text-stone-400">
                            {formatDate(
                              contact.created_at
                            )}
                          </p>
                        </div>

                        {/* STATUS */}
                        <form
                          action={
                            statusAction
                          }
                          className="flex items-end gap-2"
                        >
                          <label>
                            <span className="mb-1 block text-[10px] text-stone-400">
                              סטטוס
                            </span>

                            <select
                              name="status"
                              defaultValue={
                                contact.status
                              }
                              className="h-10 rounded-xl border border-stone-200 bg-[#faf9f6] px-3 text-xs outline-none"
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
                          </label>

                          <button
                            type="submit"
                            className="h-10 rounded-full bg-stone-900 px-4 text-xs font-medium text-white transition hover:bg-amber-700"
                          >
                            שמור
                          </button>
                        </form>
                      </div>

                      {/* DETAILS */}
                      <div className="mt-6 grid gap-5 border-t border-stone-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                        <ContactInfo
                          label="טלפון"
                        >
                          <a
                            href={`tel:${contact.phone}`}
                            dir="ltr"
                            className="font-medium transition hover:text-amber-700"
                          >
                            {
                              contact.phone
                            }
                          </a>
                        </ContactInfo>

                        <ContactInfo
                          label="אימייל"
                        >
                          {contact.email ? (
                            <a
                              href={`mailto:${contact.email}`}
                              dir="ltr"
                              className="break-all font-medium transition hover:text-amber-700"
                            >
                              {
                                contact.email
                              }
                            </a>
                          ) : (
                            <span className="text-stone-400">
                              לא הוזן
                            </span>
                          )}
                        </ContactInfo>

                        <ContactInfo
                          label="תאריך"
                        >
                          <span className="font-medium">
                            {formatDate(
                              contact.created_at
                            )}
                          </span>
                        </ContactInfo>
                      </div>

                      {/* MESSAGE */}
                      {contact.message && (
                        <div className="mt-6 rounded-2xl bg-[#f7f6f3] p-5">
                          <p className="text-[11px] font-medium text-stone-400">
                            הודעת הלקוח
                          </p>

                          <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-stone-700">
                            {
                              contact.message
                            }
                          </p>
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-5">
                        <a
                          href={`tel:${contact.phone}`}
                          className="rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-amber-700"
                        >
                          התקשר
                        </a>

                        {whatsappUrl && (
                          <a
                            href={
                              whatsappUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-medium text-green-700 transition hover:bg-green-100"
                          >
                            WhatsApp
                          </a>
                        )}

                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="rounded-full border border-stone-300 px-4 py-2 text-xs font-medium transition hover:bg-stone-100"
                          >
                            אימייל
                          </a>
                        )}

                        <DeleteContactButton
                          contactId={
                            contact.id
                          }
                          customerName={
                            contact.name
                          }
                        />
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ========================================= */
/* STAT */
/* ========================================= */

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
      className={`rounded-[1.5rem] border p-5 ${
        highlight
          ? "border-amber-200 bg-amber-50"
          : "border-stone-200 bg-white"
      }`}
    >
      <p
        className={`text-sm ${
          highlight
            ? "text-amber-800"
            : "text-stone-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

/* ========================================= */
/* CONTACT INFO */
/* ========================================= */

function ContactInfo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] text-stone-400">
        {label}
      </p>

      <div className="mt-1 text-sm">
        {children}
      </div>
    </div>
  );
}

/* ========================================= */
/* STATUS */
/* ========================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "contacted") {
    return (
      <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-medium text-blue-700">
        טופל
      </span>
    );
  }

  if (status === "closed") {
    return (
      <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-medium text-stone-600">
        נסגר
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-medium text-green-700">
      חדש
    </span>
  );
}

/* ========================================= */
/* DATE */
/* ========================================= */

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "he-IL",
    {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Asia/Jerusalem",
    }
  ).format(new Date(value));
}