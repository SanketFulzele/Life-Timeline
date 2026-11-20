import Link from "next/link";
import { formatDate, parts, yearFraction } from "@/lib/dates";
import { KIND_META, type EventSummary } from "@/lib/types";

/**
 * A horizontal Jan→Dec strip for one year with a dot per memory.
 * Exact dates are solid glowing dots; month/year-only dates are hollow rings.
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
    <div className="relative h-9">
      {/* clicking the empty track opens the year */}
      <Link
        href={`/year/${year}`}
        aria-label={`Open ${year}`}
        className="absolute inset-0 rounded-lg transition-colors hover:bg-white/[0.03]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-white/[0.04] via-white/[0.12] to-white/[0.04]" />
      {Array.from({ length: 11 }, (_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute top-1/2 h-1.5 w-px -translate-y-1/2 bg-white/10"
          style={{ left: `${((i + 1) / 12) * 100}%` }}
        />
      ))}
      {birthAt !== null && (
        <>
          <div className="pointer-events-none absolute inset-y-1.5 left-0 rounded-l-lg bg-[#07070a]/80" style={{ width: `${birthAt * 100}%` }} />
          <span
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-base text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
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
            className="pointer-events-none absolute inset-y-1.5 right-0 rounded-r-lg bg-[repeating-linear-gradient(135deg,transparent_0_5px,rgba(255,255,255,0.04)_5px_6px)]"
            style={{ width: `${(1 - todayAt) * 100}%` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0.5 w-0.5 rounded-full bg-gradient-to-b from-[#8b7bff] to-[#22d3ee] shadow-[0_0_10px_rgba(139,123,255,0.9)]"
            style={{ left: `${todayAt * 100}%` }}
            title="Today"
          />
        </>
      )}
      {events.map((e) => {
        const meta = KIND_META[e.kind];
        const size = e.kind === "milestone" ? "size-3.5" : e.kind === "everyday" ? "size-2" : "size-2.5";
        const look = e.precision === "day" ? `${meta.dot} ${meta.glow}` : `border-2 bg-[#07070a] ${meta.text} border-current`;
        return (
          <Link
            key={e.id}
            href={`/event/${e.id}`}
            title={`${e.title} — ${formatDate(e.date, e.precision)}`}
            className={`absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#07070a] transition-transform duration-200 hover:scale-[1.7] ${size} ${look}`}
            style={{ left: `${position(e) * 100}%` }}
          />
        );
      })}
    </div>
  );
}
