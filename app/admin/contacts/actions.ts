"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getAdminClient() {
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
    throw new Error("אין הרשאה לבצע פעולה זו.");
  }

  return supabase;
}

export async function updateContactStatus(
  contactId: string,
  formData: FormData
) {
  const supabase = await getAdminClient();

  const status = String(
    formData.get("status") || ""
  );

  const allowedStatuses = [
    "new",
    "contacted",
    "closed",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("סטטוס לא תקין.");
  }

  const { error } = await supabase
    .from("contact_requests")
    .update({
      status,
    })
    .eq("id", contactId);

  if (error) {
    console.error(error);

    throw new Error(
      "עדכון סטטוס הפנייה נכשל."
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
}

export async function deleteContactRequest(
  contactId: string
) {
  const supabase = await getAdminClient();

  const { error } = await supabase
    .from("contact_requests")
    .delete()
    .eq("id", contactId);

  if (error) {
    console.error(error);

    throw new Error(
      "מחיקת הפנייה נכשלה."
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
}