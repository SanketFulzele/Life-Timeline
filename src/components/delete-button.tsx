"use client";

import { useTransition } from "react";

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this memory? This can't be undone.")) startTransition(() => action());
      }}
      className="rounded-xl px-3.5 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
