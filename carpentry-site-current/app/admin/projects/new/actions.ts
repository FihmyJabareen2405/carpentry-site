"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // --------------------------------------------------
  // Admin permission
  // --------------------------------------------------

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    throw new Error("אין הרשאה לבצע פעולה זו.");
  }

  // --------------------------------------------------
  // Form values
  // --------------------------------------------------

  const title = String(
    formData.get("title") || ""
  ).trim();

  const slug = String(
    formData.get("slug") || ""
  )
    .trim()
    .toLowerCase();

  const description =
    String(
      formData.get("description") || ""
    ).trim() || null;

  const categoryId =
    String(
      formData.get("category_id") || ""
    ) || null;

  const roomId =
    String(
      formData.get("room_id") || ""
    ) || null;

  const styleId =
    String(
      formData.get("style_id") || ""
    ) || null;

  const city =
    String(
      formData.get("city") || ""
    ).trim() || null;

  const finish =
    String(
      formData.get("finish") || ""
    ).trim() || null;

  const yearValue = String(
    formData.get("year") || ""
  );

  const year = yearValue
    ? Number(yearValue)
    : null;

  const featured =
    formData.get("featured") === "on";

  const published =
    formData.get("published") === "on";

  const woodTypeIds = formData
    .getAll("wood_types")
    .map(String)
    .filter(Boolean);

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  if (!title) {
    throw new Error(
      "חובה להזין שם עבודה."
    );
  }

  if (!slug) {
    throw new Error(
      "חובה להזין Slug."
    );
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(
      "ה-Slug יכול להכיל רק אותיות באנגלית, מספרים ומקפים."
    );
  }

  if (
    year !== null &&
    (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2100
    )
  ) {
    throw new Error(
      "שנת הביצוע אינה תקינה."
    );
  }

  // --------------------------------------------------
  // Create project
  // --------------------------------------------------

  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .insert({
      title,
      slug,
      description,
      category_id: categoryId,
      room_id: roomId,
      style_id: styleId,
      city,
      finish,
      year,
      featured,
      published,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    console.error(
      "Create project error:",
      projectError
    );

    if (
      projectError?.code === "23505"
    ) {
      throw new Error(
        "קיים כבר פרויקט עם ה-Slug הזה."
      );
    }

    throw new Error(
      "אירעה שגיאה ביצירת הפרויקט."
    );
  }

  // --------------------------------------------------
  // Wood types
  // --------------------------------------------------

  if (woodTypeIds.length > 0) {
    const woodRows =
      woodTypeIds.map(
        (woodTypeId) => ({
          project_id: project.id,
          wood_type_id: woodTypeId,
        })
      );

    const { error: woodError } =
      await supabase
        .from("project_wood_types")
        .insert(woodRows);

    if (woodError) {
      console.error(
        "Wood types error:",
        woodError
      );

      // Remove project if relation creation failed
      await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      throw new Error(
        "אירעה שגיאה בשמירת סוגי העץ."
      );
    }
  }

  // --------------------------------------------------
  // Continue to Edit / Image upload
  // --------------------------------------------------

  redirect(
    `/admin/projects/${project.id}/edit?created=1`
  );
}