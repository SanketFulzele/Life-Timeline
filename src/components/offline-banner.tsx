"use client";

import { useOffline } from "next/offline";

export function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-[env(safe-area-inset-top)] z-50 mx-auto w-fit max-w-[calc(100%-1.5rem)] rounded-full border border-white/10 bg-[#18181b]/95 px-4 py-2 text-center text-xs text-zinc-200 shadow-lg backdrop-blur"
    >
      Offline · changes will sync when you&apos;re back
    </div>
  );
}
