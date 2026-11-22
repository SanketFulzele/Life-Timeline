import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { OfflineBanner } from "@/components/offline-banner";
import { Footer, Header } from "@/components/header";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

/** iOS only shows a splash screen for the exact device size it matches. */
const splash = (file: string, width: number, height: number, ratio: number) => ({
  url: `/splash/splash-${file}.png`,
  media: `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio})`,
});

export const metadata: Metadata = {
  title: "Life Timeline",
  applicationName: "Life Timeline",
  description: "Everything that has happened, year by year.",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: "Life Timeline",
    statusBarStyle: "black-translucent",
    startupImage: [
      splash("750x1334", 375, 667, 2),
      splash("1125x2436", 375, 812, 3),
      splash("1170x2532", 390, 844, 3),
      splash("1179x2556", 393, 852, 3),
      splash("1284x2778", 428, 926, 3),
      splash("1290x2796", 430, 932, 3),
      splash("1536x2048", 768, 1024, 2),
      splash("1640x2360", 820, 1180, 2),
      splash("1668x2388", 834, 1194, 2),
      splash("2048x2732", 1024, 1366, 2),
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07070a",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <OfflineBanner />
        <Suspense fallback={<div data-safe-top className="h-16 border-b border-white/[0.06]" />}>
          <Header />
        </Suspense>
        {children}
        <Footer />
        <PwaRegister />
      </body>
    </html>
  );
}
