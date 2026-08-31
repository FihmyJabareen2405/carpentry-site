"use server";

import { Buffer } from "node:buffer";
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

export async function updateProject(
  projectId: string,
  formData: FormData
) {
  const supabase = await getAdminClient();

  const title = String(formData.get("title") || "").trim();

  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase();

  const description =
    String(formData.get("description") || "").trim() || null;

  const categoryId =
    String(formData.get("category_id") || "") || null;

  const roomId =
    String(formData.get("room_id") || "") || null;

  const styleId =
    String(formData.get("style_id") || "") || null;

  const city =
    String(formData.get("city") || "").trim() || null;

  const finish =
    String(formData.get("finish") || "").trim() || null;

  const yearValue = String(formData.get("year") || "");

  const year = yearValue ? Number(yearValue) : null;

  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";

  const woodTypeIds = formData
    .getAll("wood_types")
    .map(String)
    .filter(Boolean);

  const newImages = formData
    .getAll("images")
    .filter(
      (value): value is File =>
        value instanceof File && value.size > 0
    );

  if (!title) {
    throw new Error("חובה להזין שם עבודה.");
  }

  if (!slug) {
    throw new Error("חובה להזין Slug.");
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(
      "ה-Slug יכול להכיל רק אותיות באנגלית, מספרים ומקפים."
    );
  }

  if (
    year !== null &&
    (!Number.isInteger(year) ||
      year < 1900 ||
      year > 2100)
  ) {
    throw new Error("שנת הביצוע אינה תקינה.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const maxFileSize = 10 * 1024 * 1024;

  for (const file of newImages) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `סוג הקובץ ${file.name} אינו נתמך.`
      );
    }

    if (file.size > maxFileSize) {
      throw new Error(
        `התמונה ${file.name} גדולה מ-10MB.`
      );
    }
  }

  // Update main project information
  const { error: updateError } = await supabase
    .from("projects")
    .update({
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
    .eq("id", projectId);

  if (updateError) {
    console.error(updateError);

    throw new Error(
      "עדכון הפרויקט נכשל. ייתכן שה-Slug כבר קיים."
    );
  }

  // Replace wood types
  const { error: deleteWoodError } = await supabase
    .from("project_wood_types")
    .delete()
    .eq("project_id", projectId);

  if (deleteWoodError) {
    console.error(deleteWoodError);
    throw new Error("עדכון סוגי העץ נכשל.");
  }

  if (woodTypeIds.length > 0) {
    const woodRows = woodTypeIds.map((woodTypeId) => ({
      project_id: projectId,
      wood_type_id: woodTypeId,
    }));

    const { error: woodError } = await supabase
      .from("project_wood_types")
      .insert(woodRows);

    if (woodError) {
      console.error(woodError);
      throw new Error("שמירת סוגי העץ נכשלה.");
    }
  }

  // Find highest current image position
  const { data: lastImage } = await supabase
    .from("project_images")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  let nextSortOrder =
    (lastImage?.sort_order ?? 0) + 1;

  // Upload additional images
  for (const file of newImages) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName =
      `${String(nextSortOrder).padStart(2, "0")}-${crypto.randomUUID()}.${extension}`;

    const storagePath = `${slug}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } =
      await supabase.storage
        .from("project-images")
        .upload(storagePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      console.error(uploadError);

      throw new Error(
        `העלאת התמונה ${file.name} נכשלה.`
      );
    }

    const { error: imageRowError } = await supabase
      .from("project_images")
      .insert({
        project_id: projectId,
        storage_path: storagePath,
        alt_text:
          nextSortOrder === 1
            ? title
            : `${title} - תמונה ${nextSortOrder}`,
        sort_order: nextSortOrder,
      });

    if (imageRowError) {
      await supabase.storage
        .from("project-images")
        .remove([storagePath]);

      console.error(imageRowError);

      throw new Error(
        "שמירת פרטי התמונה נכשלה."
      );
    }

    nextSortOrder++;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);

  redirect("/admin/projects");
}

export async function deleteProjectImage(
  imageId: string,
  projectId: string
) {
  const supabase = await getAdminClient();

  const { data: image, error: imageError } =
    await supabase
      .from("project_images")
      .select("storage_path")
      .eq("id", imageId)
      .eq("project_id", projectId)
      .single();

  if (imageError || !image) {
    throw new Error("התמונה לא נמצאה.");
  }

  // Delete DB row first
  const { error: deleteRowError } = await supabase
    .from("project_images")
    .delete()
    .eq("id", imageId);

  if (deleteRowError) {
    console.error(deleteRowError);
    throw new Error("מחיקת התמונה נכשלה.");
  }

  // Delete actual file
  const { error: storageError } =
    await supabase.storage
      .from("project-images")
      .remove([image.storage_path]);

  if (storageError) {
    console.error(
      "Image row deleted but Storage cleanup failed:",
      storageError
    );
  }

  revalidatePath(
    `/admin/projects/${projectId}/edit`
  );

  revalidatePath("/projects");
}