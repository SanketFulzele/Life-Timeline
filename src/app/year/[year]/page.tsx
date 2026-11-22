import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EventCard, Legend } from "@/components/event-bits";
import { HeroAurora } from "@/components/hero-aurora";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "@/components/icons";
import GradientText from "@/components/reactbits/GradientText";
import { requireViewer } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { daysInMonth, formatDate, MONTHS, parts } from "@/lib/dates";
import { listEventsInYear } from "@/lib/events";
import { KIND_META, type EventSummary, type Kind } from "@/lib/types";

export default function YearPage(props: PageProps<"/year/[year]">) {
  return (
    <main className="relative isolate w-full flex-1 overflow-hidden">
      <HeroAurora height="h-[380px]" opacity={0.5} />
      <div data-safe-x className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/[0.03]" />}>
          <Year params={props.params} />
        </Suspense>
      </div>
    </main>
  );
}

const navBtn =
  "inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-300 backdrop-blur transition hover:border-white/20 hover:text-white";

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
  const counts = (Object.keys(KIND_META) as Kind[]).map((k) => ({ k, n: events.filter((e) => e.kind === k).length }));

  const firstMonth = year === birthYear ? parts(birth).m : 1;
  const lastMonth = year === currentYear ? currentMonth : 12;
  // Latest month first, matching the life view (newest at the top).
  const months: number[] = [];
  for (let m = lastMonth; m >= firstMonth; m--) months.push(m);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        {year > birthYear ? (
          <Link href={`/year/${year - 1}`} className={navBtn}><ArrowLeftIcon className="size-4" />{year - 1}</Link>
        ) : <span />}
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-200">Whole life</Link>
        {year < currentYear ? (
          <Link href={`/year/${year + 1}`} className={navBtn}>{year + 1}<ArrowRightIcon className="size-4" /></Link>
        ) : <span />}
      </div>

      <header className="mt-10">
        <p className="eyebrow rise">
          {year === birthYear ? `Born ${formatDate(birth, "day")}` : `Age ${year - birthYear - 1}–${year - birthYear}`}
        </p>
        <h1 className="rise mt-2 text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl [animation-delay:100ms]">
          <GradientText colors={["#ffffff", "#c4bcff", "#7dd3fc", "#ffffff"]} animationSpeed={8}>
            {year}
          </GradientText>
        </h1>
        <div className="rise mt-4 flex flex-wrap items-center gap-2 [animation-delay:200ms]">
          <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-300">
            {events.length} {events.length === 1 ? "memory" : "memories"}
          </span>
          {counts.filter((c) => c.n > 0).map(({ k, n }) => (
            <span key={k} className={`rounded-full bg-white/[0.03] px-3 py-1 text-xs ring-1 ${KIND_META[k].ring} ${KIND_META[k].text}`}>
              {n} {KIND_META[k].label.toLowerCase()}
            </span>
          ))}
        </div>
        <div className="mt-4"><Legend /></div>
      </header>

      {unsure.length > 0 && (
        <section className="panel mt-10 p-5 sm:p-6">
          <h2 className="eyebrow">Sometime in {year}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {unsure.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      <section className="panel mt-6 px-5 py-2 sm:px-7">
        {months.map((m) => {
          const list = byMonth.get(m) ?? [];
          const days = daysInMonth(year, m);
          const addLink = viewer.isOwner && (
            <Link
              href={`/new?y=${year}&m=${m}`}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
            >
              <PlusIcon className="size-3.5" />Add
            </Link>
          );
          if (list.length === 0) {
            // Empty months stay compact so the year page isn't mostly blank space.
            return (
              <div key={m} id={`m${m}`} className="flex items-center justify-between gap-3 border-b border-white/[0.05] py-2.5 text-sm last:border-0">
                <span className="text-zinc-600">{MONTHS[m - 1]}</span>
                {addLink}
              </div>
            );
          }
          return (
            <section key={m} id={`m${m}`} className="border-b border-white/[0.05] py-6 last:border-0">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                  {MONTHS[m - 1]}
                  <span className="ml-2 text-xs font-normal text-zinc-500">{list.length}</span>
                </h2>
                {addLink}
              </div>
              {/* day strip */}
              <div className="relative mt-3 h-5">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-white/[0.04] via-white/[0.12] to-white/[0.04]" />
                {list.map((e) => {
                  const d = e.precision === "day" ? parts(e.date).d : (days + 1) / 2;
                  const meta = KIND_META[e.kind];
                  const look = e.precision === "day" ? `${meta.dot} ${meta.glow}` : `border-2 border-current bg-[#0c0c0f] ${meta.text}`;
                  return (
                    <Link
                      key={e.id}
                      href={`/event/${e.id}`}
                      title={e.title}
                      className={`absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#0c0c0f] transition-transform hover:scale-150 ${look}`}
                      style={{ left: `${((d - 0.5) / days) * 100}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[...list].reverse().map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </section>
          );
        })}
      </section>
    </>
  );
}
