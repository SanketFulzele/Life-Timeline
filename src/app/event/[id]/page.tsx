import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteEventAction } from "@/app/actions";
import { DeleteButton } from "@/components/delete-button";
import { KindBadge, MoodMeter, moodColor, moodLabel } from "@/components/event-bits";
import { HeroAurora } from "@/components/hero-aurora";
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ExternalIcon, PencilIcon, PhotoIcon } from "@/components/icons";
import BlurText from "@/components/reactbits/BlurText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { requireViewer } from "@/lib/access";
import { birthDate } from "@/lib/config";
import { ageOn, formatDate, parts } from "@/lib/dates";
import { getEvent, getNeighbours } from "@/lib/events";
import { KIND_META } from "@/lib/types";

export default function EventPage(props: PageProps<"/event/[id]">) {
  return (
    <main className="relative isolate w-full flex-1 overflow-hidden">
      <HeroAurora height="h-[360px]" opacity={0.45} />
      <div data-safe-x className="mx-auto w-full max-w-3xl px-4 pb-20 pt-10">
        <Suspense fallback={<div className="h-60 animate-pulse rounded-2xl bg-white/[0.03]" />}>
          <EventView params={props.params} />
        </Suspense>
      </div>
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
  const meta = KIND_META[event.kind];

  return (
    <article>
      <Link
        href={`/year/${year}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-zinc-100"
      >
        <ArrowLeftIcon className="size-4" />Back to {year}
      </Link>

      <header className="mt-10">
        <div className="rise flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="size-4" />
            {formatDate(event.date, event.precision)}
          </span>
          {age !== null && age >= 0 && <span className="text-zinc-600">· age {age}</span>}
        </div>
        <div role="heading" aria-level={1} className="mt-3">
          <BlurText
            text={event.title}
            trigger="load"
            delay={60}
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
          />
        </div>
        <div className="rise mt-5 flex flex-wrap items-center gap-3 [animation-delay:200ms]">
          <KindBadge kind={event.kind} />
          <div className="flex min-w-48 items-center gap-3">
            <span className={`text-sm ${moodColor(event.mood)}`}>
              {event.mood > 0 ? `+${event.mood}` : event.mood} · {moodLabel(event.mood)}
            </span>
            <div className="w-28"><MoodMeter mood={event.mood} /></div>
          </div>
        </div>
      </header>

      {event.description && (
        <section className="panel rise mt-8 p-6 sm:p-8 [animation-delay:300ms]">
          <div className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-300">{event.description}</div>
        </section>
      )}

      {event.links.length > 0 && (
        <section className="mt-8">
          <h2 className="eyebrow">Photos</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {event.links.map((l) => (
              <SpotlightCard
                key={l.id}
                spotlightColor={meta.spot}
                className="group !rounded-2xl !p-0"
                style={{ "--spotlight-card-surface": "rgba(17,17,20,0.72)" } as React.CSSProperties}
              >
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300">
                    <PhotoIcon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-zinc-100">{l.label || "Open photos"}</span>
                    <span className="block truncate text-xs text-zinc-500">{l.url.replace(/^https?:\/\//, "")}</span>
                  </span>
                  <ExternalIcon className="size-4 text-zinc-500 transition group-hover:text-zinc-200" />
                </div>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-[2] rounded-[inherit]"
                  aria-label={`${l.label || "Open photos"} (opens in a new tab)`}
                />
              </SpotlightCard>
            ))}
          </div>
        </section>
      )}

      {event.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {event.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">#{t}</span>
          ))}
        </div>
      )}

      {viewer.isOwner && (
        <div className="mt-10 flex items-center gap-2 border-t border-white/[0.06] pt-6">
          <Link
            href={`/event/${event.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <PencilIcon className="size-4" />Edit
          </Link>
          <DeleteButton action={deleteEventAction.bind(null, event.id)} />
        </div>
      )}

      <nav className="mt-10 grid grid-cols-2 gap-3 text-sm">
        {around.prev ? (
          <Link href={`/event/${around.prev}`} className="panel flex items-center gap-2 px-4 py-3 text-zinc-400 transition hover:text-zinc-100">
            <ArrowLeftIcon className="size-4" />Earlier memory
          </Link>
        ) : <span />}
        {around.next ? (
          <Link href={`/event/${around.next}`} className="panel flex items-center justify-end gap-2 px-4 py-3 text-zinc-400 transition hover:text-zinc-100">
            Later memory<ArrowRightIcon className="size-4" />
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
