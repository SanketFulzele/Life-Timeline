import { Suspense } from "react";
import { saveEventAction } from "@/app/actions";
import { HeroAurora } from "@/components/hero-aurora";
import { EventForm } from "@/components/event-form";
import { requireOwner } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { parts } from "@/lib/dates";
import { listLinkLabels } from "@/lib/events";

export const metadata = { title: "Add memory · Life Timeline" };

export default function NewEventPage(props: PageProps<"/new">) {
  return (
    <main className="relative isolate w-full flex-1 overflow-hidden">
      <HeroAurora height="h-[320px]" opacity={0.45} />
      <div data-safe-x className="mx-auto w-full max-w-2xl px-4 pb-20 pt-12">
      <p className="eyebrow rise">Life Timeline</p>
      <h1 className="rise mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Add a memory</h1>
      <p className="rise mb-8 mt-2 text-sm text-zinc-400">Write it down while you remember. You can always come back and add more.</p>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <NewForm searchParams={props.searchParams} />
      </Suspense>
      </div>
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
