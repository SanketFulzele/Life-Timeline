import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EventCard, Legend } from "@/components/event-bits";
import { requireViewer } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { daysInMonth, formatDate, MONTHS, parts } from "@/lib/dates";
import { listEventsInYear } from "@/lib/events";
import { KIND_META, type EventSummary } from "@/lib/types";

export default function YearPage(props: PageProps<"/year/[year]">) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <Year params={props.params} />
      </Suspense>
    </main>
  );
}

async function Year({ params }: { params: PageProps<"/year/[year]">["params"] }) {
  const viewer = await requireViewer();
  const year = Number((await params).year);
  const birth = birthDate();
  const now = today();
  const birthYear = parts(birth).y;
  const { y: currentYear, m: currentMonth } = parts(now);
  if (!Number.isInteger(year) || year < birthYear || year > currentYear) notFound();

  const events = await listEventsInYear(year);
  const unsure = events.filter((e) => e.precision === "year");
  const byMonth = new Map<number, EventSummary[]>();
  for (const e of events) {
    if (e.precision === "year") continue;
    const m = parts(e.date).m;
    byMonth.set(m, [...(byMonth.get(m) ?? []), e]);
  }

  const firstMonth = year === birthYear ? parts(birth).m : 1;
  const lastMonth = year === currentYear ? currentMonth : 12;
  // Latest month first, matching the life view (newest at the top).
  const months: number[] = [];
  for (let m = lastMonth; m >= firstMonth; m--) months.push(m);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        {year > birthYear ? (
          <Link href={`/year/${year - 1}`} className="text-sm text-zinc-400 hover:text-zinc-100">← {year - 1}</Link>
        ) : <span />}
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">Whole life</Link>
        {year < currentYear ? (
          <Link href={`/year/${year + 1}`} className="text-sm text-zinc-400 hover:text-zinc-100">{year + 1} →</Link>
        ) : <span />}
      </div>

      <h1 className="mt-6 text-4xl font-semibold tabular-nums tracking-tight">{year}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {year === birthYear ? `The year you were born · ${formatDate(birth, "day")}` : `Age ${year - birthYear - 1}–${year - birthYear}`}
        {" · "}{events.length} {events.length === 1 ? "memory" : "memories"}
      </p>
      <div className="mt-3"><Legend /></div>

      {unsure.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-zinc-400">Sometime in {year}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {unsure.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      <div className="mt-8">
        {months.map((m) => {
          const list = byMonth.get(m) ?? [];
          const days = daysInMonth(year, m);
          if (list.length === 0) {
            // Empty months stay compact so the year page isn't mostly blank space.
            return (
              <div key={m} id={`m${m}`} className="flex items-center justify-between gap-3 border-b border-zinc-900 py-2 text-sm">
                <span className="text-zinc-600">{MONTHS[m - 1]}</span>
                {viewer.isOwner && (
                  <Link href={`/new?y=${year}&m=${m}`} className="text-xs text-zinc-600 hover:text-zinc-200">+ Add</Link>
                )}
              </div>
            );
          }
          return (
            <section key={m} id={`m${m}`} className="border-b border-zinc-900 py-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-medium text-zinc-200">
                  {MONTHS[m - 1]}
                  <span className="ml-2 text-xs font-normal text-zinc-500">{list.length || ""}</span>
                </h2>
                {viewer.isOwner && (
                  <Link href={`/new?y=${year}&m=${m}`} className="text-xs text-zinc-500 hover:text-zinc-200">+ Add</Link>
                )}
              </div>
              {/* day strip */}
              <div className="relative mt-2 h-5">
                <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-800" />
                {list.map((e) => {
                  const d = e.precision === "day" ? parts(e.date).d : (days + 1) / 2;
                  const look = e.precision === "day" ? KIND_META[e.kind].dot : `border-2 border-current bg-zinc-950 ${KIND_META[e.kind].text}`;
                  return (
                    <Link
                      key={e.id}
                      href={`/event/${e.id}`}
                      title={e.title}
                      className={`absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-zinc-950 hover:scale-150 ${look}`}
                      style={{ left: `${((d - 0.5) / days) * 100}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[...list].reverse().map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
