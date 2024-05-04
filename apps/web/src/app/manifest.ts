import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spek",
    short_name: "Spek",
    description: "Real-time public communities",
    start_url: "/",
    display: "standalone",
    background_color: "#222326",
    theme_color: "#222326",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
