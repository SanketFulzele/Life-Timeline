import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveEventAction } from "@/app/actions";
import { HeroAurora } from "@/components/hero-aurora";
import { EventForm } from "@/components/event-form";
import { requireOwner } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { parts } from "@/lib/dates";
import { getEvent, listLinkLabels } from "@/lib/events";

export const metadata = { title: "Edit memory · Life Timeline" };

export default function EditEventPage(props: PageProps<"/event/[id]/edit">) {
  return (
    <main className="relative isolate w-full flex-1 overflow-hidden">
      <HeroAurora height="h-[320px]" opacity={0.45} />
      <div data-safe-x className="mx-auto w-full max-w-2xl px-4 pb-20 pt-12">
      <p className="eyebrow rise">Life Timeline</p>
      <h1 className="rise mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Edit memory</h1>
      <p className="rise mb-8 mt-2 text-sm text-zinc-400">Change anything. The timeline updates as soon as you save.</p>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <EditForm params={props.params} />
      </Suspense>
      </div>
    </main>
  );
}

async function EditForm({ params }: { params: PageProps<"/event/[id]/edit">["params"] }) {
  await requireOwner();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [event, labels] = await Promise.all([getEvent(id), listLinkLabels()]);
  if (!event) notFound();

  const { y, m, d } = parts(event.date);
  return (
    <EventForm
      action={saveEventAction}
      minYear={parts(birthDate()).y}
      maxYear={parts(today()).y}
      labelSuggestions={labels}
      initial={{
        id: event.id,
        year: y,
        month: event.precision === "year" ? "" : m,
        day: event.precision === "day" ? d : "",
        title: event.title,
        description: event.description,
        kind: event.kind,
        mood: event.mood,
        tags: event.tags.join(", "),
        links: event.links.map(({ url, label }) => ({ url, label })),
      }}
    />
  );
}
