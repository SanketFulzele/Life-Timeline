import Link from "next/link";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { PhotoIcon } from "@/components/icons";
import { formatDate } from "@/lib/dates";
import { KIND_META, type EventSummary, type Kind } from "@/lib/types";

export function KindDot({ kind, className = "" }: { kind: Kind; className?: string }) {
  return <span className={`inline-block size-2.5 shrink-0 rounded-full ${KIND_META[kind].dot} ${KIND_META[kind].glow} ${className}`} />;
}

export function KindBadge({ kind }: { kind: Kind }) {
  const meta = KIND_META[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-xs font-medium ring-1 ${meta.ring} ${meta.text}`}>
      <KindDot kind={kind} className="size-2" />
      {meta.label}
    </span>
  );
}

export { moodColor, moodLabel } from "@/lib/mood";

/** -5..+5 shown as a centred bar. */
export function MoodMeter({ mood }: { mood: number }) {
  const pct = (Math.abs(mood) / 5) * 50;
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
      <div
        className={`absolute inset-y-0 rounded-full ${mood >= 0 ? "bg-gradient-to-r from-emerald-500/60 to-emerald-300" : "bg-gradient-to-l from-rose-500/60 to-rose-300"}`}
        style={mood >= 0 ? { left: "50%", width: `${pct}%` } : { right: "50%", width: `${pct}%` }}
      />
    </div>
  );
}

export function EventCard({ event }: { event: EventSummary }) {
  const meta = KIND_META[event.kind];
  return (
    <SpotlightCard
      spotlightColor={meta.spot}
      spotlightSize={200}
      className="group !rounded-2xl !p-0 transition-transform duration-200 hover:-translate-y-0.5"
      style={{ "--spotlight-card-surface": "rgba(17,17,20,0.72)" } as React.CSSProperties}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <KindDot kind={event.kind} className="mt-1.5" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-zinc-100 group-hover:text-white">{event.title}</p>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
            <span>{formatDate(event.date, event.precision)}</span>
            {event.linkCount > 0 && (
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <PhotoIcon className="size-3.5" />
                {event.linkCount}
              </span>
            )}
          </p>
        </div>
      </div>
      <Link href={`/event/${event.id}`} className="absolute inset-0 z-[2] rounded-[inherit]" aria-label={event.title} />
    </SpotlightCard>
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
        Date not exact
      </span>
    </div>
  );
}
