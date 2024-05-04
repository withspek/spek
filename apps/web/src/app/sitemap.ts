import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://spek.vercel.app/c/spek",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
