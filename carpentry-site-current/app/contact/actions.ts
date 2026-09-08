"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  success: boolean;
  message: string;
};

export async function sendContactRequest(
  _previousState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const supabase = await createClient();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const phone = String(
    formData.get("phone") || ""
  ).trim();

  const email =
    String(formData.get("email") || "").trim() ||
    null;

  const message =
    String(formData.get("message") || "").trim() ||
    null;

  if (name.length < 2) {
    return {
      success: false,
      message: "יש להזין שם מלא.",
    };
  }

  if (phone.length < 5) {
    return {
      success: false,
      message: "יש להזין מספר טלפון תקין.",
    };
  }

  if (name.length > 100) {
    return {
      success: false,
      message: "השם ארוך מדי.",
    };
  }

  if (phone.length > 30) {
    return {
      success: false,
      message: "מספר הטלפון ארוך מדי.",
    };
  }

  if (email && email.length > 200) {
    return {
      success: false,
      message: "כתובת האימייל ארוכה מדי.",
    };
  }

  if (message && message.length > 3000) {
    return {
      success: false,
      message: "ההודעה ארוכה מדי.",
    };
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

    return {
      success: false,
      message:
        "לא הצלחנו לשלוח את הפנייה. נסה שוב בעוד רגע.",
    };
  }

  return {
    success: true,
    message:
      "הפנייה נשלחה בהצלחה. נחזור אליך בהקדם.",
  };
}