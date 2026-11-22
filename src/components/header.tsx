import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/auth";
import { PlusIcon } from "@/components/icons";
import { getViewer } from "@/lib/access";
import { today } from "@/lib/config";

export async function Header() {
  const viewer = await getViewer();
  const year = today().slice(0, 4);

  return (
    <header data-safe-top className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#07070a]/70 backdrop-blur-xl">
      <div data-safe-x className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/images/lifetimeline.png"
            alt=""
            width={32}
            height={32}
            className="size-8 drop-shadow-[0_0_10px_rgba(59,89,255,0.5)]"
            priority
          />
          <span className="font-semibold tracking-tight text-zinc-100 group-hover:text-white">Life Timeline</span>
        </Link>

        {viewer.canView && (
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100 sm:block">
              Timeline
            </Link>
            <Link href={`/year/${year}`} className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100 sm:block">
              {year}
            </Link>
            {viewer.isOwner && (
              <>
                <Link
                  href="/new"
                  className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-zinc-900 shadow-[0_8px_24px_-8px_rgba(139,123,255,0.6)] transition hover:bg-zinc-100"
                >
                  <PlusIcon className="size-4" />
                  <span>Add<span className="hidden sm:inline"> memory</span></span>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <button className="rounded-lg px-2.5 py-1.5 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-200">
                    Sign out
                  </button>
                </form>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05]">
      <div data-safe-x data-safe-bottom className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-600">
        <span>Life Timeline</span>
        <span>Private · only you can edit</span>
      </div>
    </footer>
  );
}
