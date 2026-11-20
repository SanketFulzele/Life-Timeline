import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { KIND_META, type EventSummary, type Kind } from "@/lib/types";

export function KindDot({ kind, className = "" }: { kind: Kind; className?: string }) {
  return <span className={`inline-block size-2.5 shrink-0 rounded-full ${KIND_META[kind].dot} ${className}`} />;
}

export function KindBadge({ kind }: { kind: Kind }) {
  const meta = KIND_META[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs ring-1 ${meta.ring} ${meta.text}`}>
      <KindDot kind={kind} className="size-2" />
      {meta.label}
    </span>
  );
}

export function moodLabel(mood: number) {
  if (mood >= 4) return "Amazing";
  if (mood >= 2) return "Good";
  if (mood >= 1) return "Okay";
  if (mood === 0) return "Neutral";
  if (mood >= -1) return "Meh";
  if (mood >= -3) return "Bad";
  return "Awful";
}

export function moodColor(mood: number) {
  if (mood > 0) return "text-emerald-300";
  if (mood < 0) return "text-rose-300";
  return "text-zinc-400";
}

export function EventCard({ event }: { event: EventSummary }) {
  return (
    <Link
      href={`/event/${event.id}`}
      className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3.5 py-3 hover:border-zinc-700 hover:bg-zinc-900"
    >
      <KindDot kind={event.kind} className="mt-1.5" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-zinc-100">{event.title}</span>
        <span className="mt-0.5 block text-xs text-zinc-500">
          {formatDate(event.date, event.precision)}
          {event.linkCount > 0 && ` · ${event.linkCount} photo link${event.linkCount > 1 ? "s" : ""}`}
        </span>
      </span>
    </Link>
  );
}

export function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500">
      {(Object.keys(KIND_META) as Kind[]).map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <KindDot kind={k} className="size-2" />
          {KIND_META[k].label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block size-2 rounded-full border border-zinc-400" />
        Unsure of the exact date
      </span>
    </div>
  );
}
