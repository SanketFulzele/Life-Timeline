import Link from "next/link";
import { formatDate, parts, yearFraction } from "@/lib/dates";
import { KIND_META, type EventSummary } from "@/lib/types";

/**
 * A horizontal Jan→Dec strip for one year with a dot per memory.
 * Exact dates are solid dots; month/year-only dates are hollow rings.
 */
export function YearTrack({
  year,
  events,
  birth,
  today,
}: {
  year: number;
  events: EventSummary[];
  birth?: string;
  today?: string;
}) {
  const unsureYear = events.filter((e) => e.precision === "year");

  function position(e: EventSummary) {
    if (e.precision === "day") return yearFraction(e.date);
    if (e.precision === "month") return (parts(e.date).m - 0.5) / 12;
    const i = unsureYear.indexOf(e);
    return (i + 1) / (unsureYear.length + 1);
  }

  const birthAt = birth ? yearFraction(birth) : null;
  const todayAt = today ? yearFraction(today) : null;

  return (
    <div className="relative h-8">
      {/* clicking the empty track opens the year */}
      <Link href={`/year/${year}`} aria-label={`Open ${year}`} className="absolute inset-0 rounded-md hover:bg-zinc-900/60" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-zinc-800" />
      {Array.from({ length: 11 }, (_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute top-1/2 h-2 w-px -translate-y-1/2 bg-zinc-800"
          style={{ left: `${((i + 1) / 12) * 100}%` }}
        />
      ))}
      {birthAt !== null && (
        <>
          <div className="pointer-events-none absolute inset-y-1 left-0 rounded-l-md bg-zinc-950/70" style={{ width: `${birthAt * 100}%` }} />
          <span
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-amber-300"
            style={{ left: `${birthAt * 100}%` }}
            title={`Born ${birth}`}
          >
            ★
          </span>
        </>
      )}
      {todayAt !== null && (
        <>
          <div
            className="pointer-events-none absolute inset-y-1 right-0 rounded-r-md bg-[repeating-linear-gradient(135deg,transparent_0_4px,rgba(39,39,42,0.6)_4px_5px)]"
            style={{ width: `${(1 - todayAt) * 100}%` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-zinc-400"
            style={{ left: `${todayAt * 100}%` }}
            title="Today"
          />
        </>
      )}
      {events.map((e) => {
        const meta = KIND_META[e.kind];
        const size = e.kind === "milestone" ? "size-3.5" : e.kind === "everyday" ? "size-2" : "size-2.5";
        const look = e.precision === "day" ? meta.dot : `border-2 bg-zinc-950 ${meta.text} border-current`;
        return (
          <Link
            key={e.id}
            href={`/event/${e.id}`}
            title={`${e.title} — ${formatDate(e.date, e.precision)}`}
            className={`absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-zinc-950 transition-transform hover:scale-150 ${size} ${look}`}
            style={{ left: `${position(e) * 100}%` }}
          />
        );
      })}
    </div>
  );
}
