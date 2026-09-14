import type { MetadataRoute } from "next";

import { supabasePublic } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: projects, error } =
    await supabasePublic
      .from("projects")
      .select("slug, updated_at")
      .eq("published", true);

  if (error) {
    console.error(
      "Error loading projects for sitemap:",
      error
    );
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/visualizer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/hardware/kitchens`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/hardware/doors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/hardware/walk-in-closet`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const projectPages: MetadataRoute.Sitemap =
    (projects ?? []).map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.updated_at
        ? new Date(project.updated_at)
        : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    ...staticPages,
    ...projectPages,
  ];
}