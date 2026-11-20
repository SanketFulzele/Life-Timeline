import { Suspense } from "react";
import { saveEventAction } from "@/app/actions";
import { EventForm } from "@/components/event-form";
import { requireOwner } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { parts } from "@/lib/dates";
import { listLinkLabels } from "@/lib/events";

export const metadata = { title: "Add memory · Life Timeline" };

export default function NewEventPage(props: PageProps<"/new">) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Add a memory</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <NewForm searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function NewForm({ searchParams }: { searchParams: PageProps<"/new">["searchParams"] }) {
  await requireOwner();
  const sp = await searchParams;
  const now = parts(today());
  const minYear = parts(birthDate()).y;

  // /new?y=2018&m=11 pre-fills the date (used by the "+ Add" links on year pages).
  const y = Number(sp.y);
  const m = Number(sp.m);
  const year = Number.isInteger(y) && y >= minYear && y <= now.y ? y : now.y;
  const prefilled = sp.y !== undefined;
  const month = Number.isInteger(m) && m >= 1 && m <= 12 ? m : prefilled ? "" : now.m;
  const day = prefilled ? "" : now.d;

  return (
    <EventForm
      action={saveEventAction}
      minYear={minYear}
      maxYear={now.y}
      labelSuggestions={await listLinkLabels()}
      initial={{ year, month, day, title: "", description: "", kind: "everyday", mood: 0, tags: "", links: [] }}
    />
  );
}
