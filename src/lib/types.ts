export type Precision = "day" | "month" | "year";
export type Kind = "milestone" | "high" | "low" | "everyday";

export const KINDS: Kind[] = ["milestone", "high", "low", "everyday"];

export type PhotoLink = { id?: number; url: string; label: string };

/** Lightweight event used on timeline views. */
export type EventSummary = {
  id: number;
  date: string; // YYYY-MM-DD
  precision: Precision;
  title: string;
  kind: Kind;
  mood: number;
  linkCount: number;
};

export type LifeEvent = EventSummary & {
  description: string;
  tags: string[];
  links: PhotoLink[];
};

export const KIND_META: Record<Kind, { label: string; dot: string; text: string; ring: string }> = {
  milestone: { label: "Milestone", dot: "bg-amber-400", text: "text-amber-300", ring: "ring-amber-400/40" },
  high: { label: "High", dot: "bg-emerald-400", text: "text-emerald-300", ring: "ring-emerald-400/40" },
  low: { label: "Low", dot: "bg-rose-400", text: "text-rose-300", ring: "ring-rose-400/40" },
  everyday: { label: "Everyday", dot: "bg-sky-400", text: "text-sky-300", ring: "ring-sky-400/40" },
};
