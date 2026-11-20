import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Footer, Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Timeline",
  description: "Everything that has happened, year by year.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#07070a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <Suspense fallback={<div className="h-16 border-b border-white/[0.06]" />}>
          <Header />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
