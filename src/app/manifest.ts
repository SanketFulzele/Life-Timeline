import type { MetadataRoute } from "next";

/** Makes the site installable as a standalone app on phones. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Life Timeline",
    short_name: "Life Timeline",
    description: "A personal timeline of milestones, highs, lows and everyday moments.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07070a",
    theme_color: "#07070a",
    icons: [
      { src: "/images/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/images/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/images/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/images/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
