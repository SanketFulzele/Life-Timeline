import Link from "next/link";

export const metadata = { title: "Offline · Life Timeline" };

export default function OfflinePage() {
  return (
    <main
      data-safe-x
      className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-20 text-center"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-white">You&apos;re offline</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        Your memories are safe. Reconnect and we&apos;ll bring your timeline back.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-zinc-900 shadow-[0_8px_24px_-8px_rgba(139,123,255,0.6)] transition hover:bg-zinc-100"
      >
        Try again
      </Link>
    </main>
  );
}
