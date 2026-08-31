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

export async function togglePublished(
  projectId: string,
  currentValue: boolean
) {
  const supabase = await getAdminClient();

  const { error } = await supabase
    .from("projects")
    .update({
      published: !currentValue,
    })
    .eq("id", projectId);

  if (error) {
    console.error(error);
    throw new Error("שינוי מצב הפרסום נכשל.");
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function toggleFeatured(
  projectId: string,
  currentValue: boolean
) {
  const supabase = await getAdminClient();

  const { error } = await supabase
    .from("projects")
    .update({
      featured: !currentValue,
    })
    .eq("id", projectId);

  if (error) {
    console.error(error);
    throw new Error("שינוי מצב העבודה המומלצת נכשל.");
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function deleteProject(projectId: string) {
  const supabase = await getAdminClient();

  // קודם נשמור את נתיבי התמונות
  const { data: images, error: imagesError } = await supabase
    .from("project_images")
    .select("storage_path")
    .eq("project_id", projectId);

  if (imagesError) {
    console.error(imagesError);
    throw new Error("לא ניתן היה לקרוא את תמונות הפרויקט.");
  }

  // מחיקת הפרויקט
  // project_images ו-project_wood_types יימחקו אוטומטית בגלל CASCADE
  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (deleteError) {
    console.error(deleteError);
    throw new Error("מחיקת הפרויקט נכשלה.");
  }

  // מחיקת הקבצים מ-Storage
  const paths = images?.map((image) => image.storage_path) || [];

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("project-images")
      .remove(paths);

    if (storageError) {
      // הפרויקט כבר נמחק, לכן רק נרשום את השגיאה
      console.error(
        "Project deleted, but some storage files could not be removed:",
        storageError
      );
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}