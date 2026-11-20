import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveEventAction } from "@/app/actions";
import { EventForm } from "@/components/event-form";
import { requireOwner } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { parts } from "@/lib/dates";
import { getEvent, listLinkLabels } from "@/lib/events";

export const metadata = { title: "Edit memory · Life Timeline" };

export default function EditEventPage(props: PageProps<"/event/[id]/edit">) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit memory</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <EditForm params={props.params} />
      </Suspense>
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
