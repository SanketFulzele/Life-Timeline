import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Timeline",
  description: "Everything that has happened, year by year.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#09090b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <Suspense fallback={<div className="h-14 border-b border-zinc-800/80" />}>
          <Header />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
