import Link from "next/link";
import { Suspense } from "react";
import { Legend } from "@/components/event-bits";
import { YearTrack } from "@/components/year-track";
import { requireViewer } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { ageOn, parts } from "@/lib/dates";
import { listAllEvents } from "@/lib/events";
import { KIND_META, type EventSummary } from "@/lib/types";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading your life…</p>}>
        <Life />
      </Suspense>
    </main>
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

  return (
    <>
      <section className="mb-8">
        <p className="text-sm text-zinc-500">
          Age {ageOn(birth, now)} · {daysAlive.toLocaleString("en-IN")} days · {events.length}{" "}
          {events.length === 1 ? "memory" : "memories"}
        </p>
        <div className="mt-3">
          <Legend />
        </div>
        {viewer.isOwner && events.length === 0 && (
          <p className="mt-6 rounded-xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">
            Your timeline is empty. Click <span className="text-zinc-200">+ Add memory</span> to add your
            first one. A good start is a big milestone you remember, like passing 10th.
          </p>
        )}
      </section>

      <ol className="relative border-l border-zinc-800 pl-0">
        {years.map((year) => {
          const list = byYear.get(year) ?? [];
          const highlights = list.filter((e) => e.kind !== "everyday");
          const shown = highlights.slice(-3).reverse();
          const age = year - birthYear;
          return (
            <li key={year} className="relative py-4 pl-5">
              <span
                className={`absolute -left-[5px] top-[1.6rem] size-2.5 rounded-full ${
                  list.length ? "bg-zinc-300" : "bg-zinc-700"
                }`}
              />
              <div className="grid grid-cols-[4.25rem_1fr] items-start gap-3 sm:grid-cols-[5.5rem_1fr] sm:gap-5">
                <Link href={`/year/${year}`} className="group">
                  <span className="block text-lg font-semibold tabular-nums text-zinc-100 group-hover:text-white">
                    {year}
                  </span>
                  <span className="block text-xs text-zinc-500">
                    {year === birthYear ? "Born" : `Age ${age - 1}–${age}`}
                  </span>
                </Link>
                <div className="min-w-0">
                  <YearTrack
                    year={year}
                    events={list}
                    birth={year === birthYear ? birth : undefined}
                    today={year === currentYear ? now : undefined}
                  />
                  <div className="mt-2 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {shown.map((e) => (
                      <Link key={e.id} href={`/event/${e.id}`} className={`truncate hover:underline ${KIND_META[e.kind].text}`}>
                        {e.title}
                      </Link>
                    ))}
                    {list.length > shown.length && (
                      <Link href={`/year/${year}`} className="text-zinc-500 hover:text-zinc-300">
                        {shown.length ? `+${list.length - shown.length} more` : `${list.length} memories`}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
