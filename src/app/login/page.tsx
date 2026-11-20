import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { getViewer } from "@/lib/access";

export const metadata = { title: "Sign in · Life Timeline" };

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Life Timeline</h1>
      <p className="mt-2 text-sm text-zinc-400">
        This timeline is private. Sign in with the owner&apos;s Google account.
      </p>
      <Suspense>
        <LoginBody searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function LoginBody({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const [{ error }, viewer] = await Promise.all([searchParams, getViewer()]);
  if (viewer.isOwner) redirect("/");

  return (
    <>
      {error && (
        <p className="mt-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          That Google account isn&apos;t allowed to sign in here.
        </p>
      )}
      <form
        className="mt-6"
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button className="w-full rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white">
          Continue with Google
        </button>
      </form>
    </>
  );
}
