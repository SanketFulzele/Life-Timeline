import Link from "next/link";

export default function NotFound() {
  return (
    <main data-safe-x className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Nothing here</h1>
      <p className="mt-2 text-sm text-zinc-500">That memory or year doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 inline-block text-sm text-zinc-300 hover:text-white">← Back to the timeline</Link>
    </main>
  );
}
