import Link from "next/link";
import { signOut } from "@/auth";
import { getViewer } from "@/lib/access";
import { ownerName } from "@/lib/config";

export async function Header() {
  const viewer = await getViewer();
  const name = ownerName();
  const title = name === "My" ? "My Life" : `${name}'s Life`;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between gap-3 px-4">
        <Link href="/" className="font-semibold tracking-tight text-zinc-100">
          {title}
        </Link>
        {viewer.isOwner && (
          <nav className="flex items-center gap-2">
            <Link
              href="/new"
              className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white"
            >
              + Add memory
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="rounded-lg px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-100">
                Sign out
              </button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}
