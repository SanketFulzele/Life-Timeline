import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteEventAction } from "@/app/actions";
import { DeleteButton } from "@/components/delete-button";
import { KindBadge, moodColor, moodLabel } from "@/components/event-bits";
import { requireViewer } from "@/lib/access";
import { birthDate } from "@/lib/config";
import { ageOn, formatDate, parts } from "@/lib/dates";
import { getEvent, getNeighbours } from "@/lib/events";

export default function EventPage(props: PageProps<"/event/[id]">) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <EventView params={props.params} />
      </Suspense>
    </main>
  );
}

async function EventView({ params }: { params: PageProps<"/event/[id]">["params"] }) {
  const viewer = await requireViewer();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [event, around] = await Promise.all([getEvent(id), getNeighbours(id)]);
  if (!event) notFound();

  const year = parts(event.date).y;
  const age = event.precision === "day" ? ageOn(birthDate(), event.date) : null;

  return (
    <article>
      <Link href={`/year/${year}`} className="text-sm text-zinc-400 hover:text-zinc-100">← Back to {year}</Link>

      <p className="mt-6 text-sm text-zinc-400">
        {formatDate(event.date, event.precision)}
        {age !== null && age >= 0 && <span className="text-zinc-600"> · age {age}</span>}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-50">{event.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <KindBadge kind={event.kind} />
        <span className={moodColor(event.mood)}>
          Mood {event.mood > 0 ? `+${event.mood}` : event.mood} · {moodLabel(event.mood)}
        </span>
      </div>

      {event.description && (
        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-zinc-300">{event.description}</div>
      )}

      {event.links.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-zinc-400">Photos</h2>
          <ul className="mt-2 space-y-2">
            {event.links.map((l) => (
              <li key={l.id}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-700"
                >
                  <span className="min-w-0">
                    <span className="block text-zinc-100">{l.label || "Open photos"}</span>
                    <span className="block truncate text-xs text-zinc-500">{l.url}</span>
                  </span>
                  <span className="text-zinc-400">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {event.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {event.tags.map((t) => (
            <span key={t} className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs text-zinc-400">#{t}</span>
          ))}
        </div>
      )}

      {viewer.isOwner && (
        <div className="mt-10 flex items-center gap-3 border-t border-zinc-800 pt-6">
          <Link href={`/event/${event.id}/edit`} className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700">
            Edit
          </Link>
          <DeleteButton action={deleteEventAction.bind(null, event.id)} />
        </div>
      )}

      <nav className="mt-10 flex justify-between text-sm">
        {around.prev ? <Link href={`/event/${around.prev}`} className="text-zinc-400 hover:text-zinc-100">← Earlier</Link> : <span />}
        {around.next ? <Link href={`/event/${around.next}`} className="text-zinc-400 hover:text-zinc-100">Later →</Link> : <span />}
      </nav>
    </article>
  );
}
