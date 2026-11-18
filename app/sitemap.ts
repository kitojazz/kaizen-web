import type { MetadataRoute } from "next";
import { getContent, getPublishedPosts, sortServices } from "@/lib/content";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://kaizen.com.uy").replace(
  /\/$/,
  "",
);

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const services = sortServices(content.services).filter((service) => service.slug);
  const posts = getPublishedPosts(content.posts);

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/servicios`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    ...services.map((service) => ({
      url: `${BASE_URL}/servicios/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
