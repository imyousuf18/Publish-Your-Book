import type { MetadataRoute } from "next";
import { serviceSlugs } from "@/lib/service-pages";
import { site } from "@/lib/site";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  ...serviceSlugs.map((slug) => ({
    path: `/services/${slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  })),
  { path: "/process", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/work", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/genres", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/case-studies", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/author-guide", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.9, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
