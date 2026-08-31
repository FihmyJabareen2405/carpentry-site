"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function sendContactRequest(
  formData: FormData
) {
  const supabase = await createClient();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const phone = String(
    formData.get("phone") || ""
  ).trim();

  const email =
    String(
      formData.get("email") || ""
    ).trim() || null;

  const message =
    String(
      formData.get("message") || ""
    ).trim() || null;

  if (name.length < 2) {
    redirect("/contact?error=1");
  }

  if (phone.length < 5) {
    redirect("/contact?error=1");
  }

  if (name.length > 100) {
    redirect("/contact?error=1");
  }

  if (phone.length > 30) {
    redirect("/contact?error=1");
  }

  if (email && email.length > 200) {
    redirect("/contact?error=1");
  }

  if (message && message.length > 3000) {
    redirect("/contact?error=1");
  }

  const { error } = await supabase
    .from("contact_requests")
    .insert({
      name,
      phone,
      email,
      message,
    });

  if (error) {
    console.error(
      "Contact request error:",
      error
    );

    redirect("/contact?error=1");
  }

  redirect("/contact?sent=1");
}