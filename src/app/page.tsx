import Link from "next/link";
import { Suspense } from "react";
import { EventCard, Legend } from "@/components/event-bits";
import { HeroAurora } from "@/components/hero-aurora";
import { PlusIcon } from "@/components/icons";
import BlurText from "@/components/reactbits/BlurText";
import GradientText from "@/components/reactbits/GradientText";
import { StatCard } from "@/components/stat-card";
import { YearTrack } from "@/components/year-track";
import { requireViewer } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { ageOn, MONTHS, parts } from "@/lib/dates";
import { listAllEvents } from "@/lib/events";
import { KIND_META, type EventSummary } from "@/lib/types";

export default function Home() {
  return (
    <main className="relative isolate w-full flex-1 overflow-hidden">
      <HeroAurora />
      <div data-safe-x className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14 sm:pt-20">
        <Suspense fallback={<HomeSkeleton />}>
          <Life />
        </Suspense>
      </div>
    </main>
  );
}

function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-40 rounded bg-white/5" />
      <div className="mt-5 h-12 w-3/4 rounded-lg bg-white/5" />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-white/[0.04]" />)}
      </div>
    </div>
  );
}

async function Life() {
  const viewer = await requireViewer();
  const events = await listAllEvents();
  const birth = birthDate();
  const now = today();
  const birthYear = parts(birth).y;
  const currentYear = parts(now).y;

  const byYear = new Map<number, EventSummary[]>();
  for (const e of events) {
    const y = parts(e.date).y;
    byYear.set(y, [...(byYear.get(y) ?? []), e]);
  }

  // Newest year at the top, birth year at the bottom. A new year appears
  // automatically because currentYear comes from today's date.
  const years: number[] = [];
  for (let y = currentYear; y >= birthYear; y--) years.push(y);

  const daysAlive = Math.floor(
    (Date.parse(`${now}T00:00:00Z`) - Date.parse(`${birth}T00:00:00Z`)) / 86_400_000,
  );
  const age = ageOn(birth, now);
  const milestones = events.filter((e) => e.kind === "milestone").length;
  const latest = events.slice(-3).reverse();

  return (
    <>
      {/* Hero */}
      <section className="max-w-3xl">
        <p className="eyebrow rise">
          {MONTHS[parts(now).m - 1]} {parts(now).d}, {currentYear} · Age {age}
        </p>
        <div role="heading" aria-level={1} className="mt-4">
          <BlurText
            text="Life Timeline"
            trigger="load"
            delay={110}
            className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
          />
        </div>
        <p className="rise mt-4 max-w-xl text-zinc-400 [animation-delay:300ms]">
          {years.length} years on one line, from {birthYear} at the bottom to today at the top. Click any year to
          open it, or any dot to read the memory.
        </p>
        {viewer.isOwner && (
          <Link
            href="/new"
            className="rise mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-[0_10px_30px_-10px_rgba(139,123,255,0.7)] transition hover:bg-zinc-100 [animation-delay:400ms]"
          >
            <PlusIcon className="size-4" />
            Add a memory
          </Link>
        )}
      </section>

      {/* Stats */}
      <section className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Days lived" value={daysAlive} hint={`since ${birthYear}`} delay={150} />
        <StatCard label="Memories" value={events.length} hint="written down" color="rgba(34, 211, 238, 0.2)" delay={250} />
        <StatCard label="Milestones" value={milestones} hint="big moments" color="rgba(251, 191, 36, 0.18)" delay={350} />
        <StatCard
          label="Years covered"
          value={byYear.size}
          suffix={` / ${years.length}`}
          hint="with at least one memory"
          color="rgba(52, 211, 153, 0.18)"
          delay={450}
        />
      </section>

      {viewer.isOwner && events.length === 0 && (
        <p className="panel mt-8 p-5 text-sm text-zinc-400">
          Your timeline is empty. Start with a big milestone you remember, like passing 10th, then fill in the
          rest whenever something comes back to you.
        </p>
      )}

      {latest.length > 0 && (
        <section className="mt-12">
          <h2 className="eyebrow">Latest moments</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {latest.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="panel mt-12 p-4 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Timeline</h2>
            <p className="text-sm text-zinc-500">Each row is one year, January to December.</p>
          </div>
          <Legend />
        </div>

        <div className="mt-6 pl-6">
          <div className="grid grid-cols-[3rem_1fr] gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
            <span />
            <div className="grid grid-cols-12 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-600">
              {MONTHS.map((m) => <span key={m}>{m[0]}</span>)}
            </div>
          </div>
        </div>

        <ol className="relative mt-1">
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[5px] top-6 w-px bg-gradient-to-b from-[#8b7bff]/70 via-white/10 to-amber-400/50"
          />
          {years.map((year) => {
            const list = byYear.get(year) ?? [];
            const highlights = list.filter((e) => e.kind !== "everyday");
            const shown = highlights.slice(-3).reverse();
            const isNow = year === currentYear;
            const yrAge = year - birthYear;
            return (
              <li key={year} className="relative py-3 pl-6">
                <span
                  className={`absolute left-0 top-[1.45rem] size-[11px] rounded-full ring-4 ring-[#0c0c0f] ${
                    isNow
                      ? "bg-[#8b7bff] shadow-[0_0_12px_rgba(139,123,255,0.9)]"
                      : list.length
                        ? "bg-zinc-300"
                        : "bg-zinc-700"
                  }`}
                />
                <div className="grid grid-cols-[3rem_1fr] items-start gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
                  <Link href={`/year/${year}`} className="group pt-1">
                    <span className="block text-lg font-semibold leading-tight tabular-nums text-zinc-200 group-hover:text-white">
                      {isNow ? (
                        <GradientText colors={["#8b7bff", "#22d3ee", "#8b7bff"]} animationSpeed={6}>
                          {year}
                        </GradientText>
                      ) : (
                        year
                      )}
                    </span>
                    <span className="block text-[11px] text-zinc-500">
                      {year === birthYear ? "Born" : isNow ? "Now" : `Age ${yrAge}`}
                    </span>
                  </Link>
                  <div className="min-w-0">
                    <YearTrack
                      year={year}
                      events={list}
                      birth={year === birthYear ? birth : undefined}
                      today={isNow ? now : undefined}
                    />
                    {(shown.length > 0 || list.length > 0) && (
                      <div className="mt-1 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        {shown.map((e) => (
                          <Link key={e.id} href={`/event/${e.id}`} className={`max-w-full truncate hover:underline ${KIND_META[e.kind].text}`}>
                            {e.title}
                          </Link>
                        ))}
                        {list.length > shown.length && (
                          <Link href={`/year/${year}`} className="text-zinc-500 hover:text-zinc-300">
                            {shown.length ? `+${list.length - shown.length} more` : `${list.length} ${list.length === 1 ? "memory" : "memories"}`}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
