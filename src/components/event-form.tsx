"use client";

import { useState, useTransition } from "react";
import type { FormResult } from "@/app/actions";
import { PlusIcon } from "@/components/icons";
import StarBorder from "@/components/reactbits/StarBorder";
import { moodColor, moodLabel } from "@/lib/mood";
import { daysInMonth, MONTHS } from "@/lib/dates";
import { KIND_META, KINDS, type Kind, type PhotoLink } from "@/lib/types";

export type EventFormValues = {
  id?: number;
  year: number;
  month: number | "";
  day: number | "";
  title: string;
  description: string;
  kind: Kind;
  mood: number;
  tags: string;
  links: PhotoLink[];
};

const field = "field";
const labelCls = "mb-2 block text-sm font-medium text-zinc-200";

export function EventForm({
  initial,
  minYear,
  maxYear,
  labelSuggestions,
  action,
}: {
  initial: EventFormValues;
  minYear: number;
  maxYear: number;
  labelSuggestions: string[];
  action: (form: FormData) => Promise<FormResult>;
}) {
  const [v, setV] = useState(initial);
  const [links, setLinks] = useState<PhotoLink[]>(initial.links.length ? initial.links : []);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) =>
    setV((old) => ({ ...old, [key]: value }));

  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);
  const dayCount = v.month === "" ? 0 : daysInMonth(v.year, v.month);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await action(form);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="panel space-y-7 p-5 sm:p-8">
      {v.id && <input type="hidden" name="id" value={v.id} />}

      <div>
        <span className={labelCls}>When did it happen?</span>
        <div className="grid grid-cols-3 gap-2">
          <select name="year" value={v.year} onChange={(e) => set("year", Number(e.target.value))} className={field}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            name="month"
            value={v.month}
            onChange={(e) => {
              const month = e.target.value === "" ? "" : Number(e.target.value);
              setV((old) => ({
                ...old,
                month,
                day: month === "" || (old.day !== "" && old.day > daysInMonth(old.year, month)) ? "" : old.day,
              }));
            }}
            className={field}
          >
            <option value="">Month: not sure</option>
            {MONTHS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
          </select>
          <select
            name="day"
            value={v.day}
            disabled={v.month === ""}
            onChange={(e) => set("day", e.target.value === "" ? "" : Number(e.target.value))}
            className={`${field} disabled:opacity-40`}
          >
            <option value="">Day: not sure</option>
            {Array.from({ length: dayCount }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
          </select>
        </div>
        <p className="mt-1.5 text-xs text-zinc-500">Don&apos;t remember the exact date? Leave month or day as “not sure”.</p>
      </div>

      <div>
        <label htmlFor="title" className={labelCls}>Title</label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          value={v.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Passed 10th with 85%"
          className={field}
        />
      </div>

      <div>
        <span className={labelCls}>Type</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {KINDS.map((k) => (
            <label
              key={k}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#8b7bff]/50 ${
                v.kind === k
                  ? `border-white/20 bg-white/[0.07] ${KIND_META[k].text}`
                  : "border-white/[0.07] text-zinc-400 hover:border-white/15 hover:text-zinc-200"
              }`}
            >
              <input type="radio" name="kind" value={k} checked={v.kind === k} onChange={() => set("kind", k)} className="sr-only" />
              <span className={`size-2.5 rounded-full ${KIND_META[k].dot} ${v.kind === k ? KIND_META[k].glow : ""}`} />
              {KIND_META[k].label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="mood" className={labelCls}>
          How did it feel?{" "}
          <span className={`font-normal ${moodColor(v.mood)}`}>
            {v.mood > 0 ? `+${v.mood}` : v.mood} · {moodLabel(v.mood)}
          </span>
        </label>
        <input
          id="mood"
          name="mood"
          type="range"
          min={-5}
          max={5}
          step={1}
          value={v.mood}
          onChange={(e) => set("mood", Number(e.target.value))}
          className="w-full accent-[#8b7bff]"
        />
        <div className="flex justify-between text-xs text-zinc-600"><span>-5 worst</span><span>0</span><span>+5 best</span></div>
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>What happened?</label>
        <textarea
          id="description"
          name="description"
          rows={6}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Write as much or as little as you like…"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="tags" className={labelCls}>Tags <span className="font-normal text-zinc-500">(comma separated)</span></label>
        <input
          id="tags"
          name="tags"
          value={v.tags}
          onChange={(e) => set("tags", e.target.value)}
          placeholder="family, trip, school"
          className={field}
        />
      </div>

      <div>
        <span className={labelCls}>Google Photos links</span>
        <p className="mb-2 text-xs text-zinc-500">
          In Google Photos open the album or photo → Share → Create link, then paste it here. Share links open whichever
          Google account you&apos;re signed in to.
        </p>
        <datalist id="label-suggestions">
          {labelSuggestions.map((l) => <option key={l} value={l} />)}
        </datalist>
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_11rem_auto]">
              <input
                name="linkUrl"
                type="url"
                value={link.url}
                onChange={(e) => setLinks(links.map((l, j) => (j === i ? { ...l, url: e.target.value } : l)))}
                placeholder="https://photos.app.goo.gl/…"
                className={field}
              />
              <input
                name="linkLabel"
                list="label-suggestions"
                value={link.label}
                onChange={(e) => setLinks(links.map((l, j) => (j === i ? { ...l, label: e.target.value } : l)))}
                placeholder="Which account?"
                className={`${field} col-span-1 row-start-2 sm:row-start-auto`}
              />
              <button
                type="button"
                onClick={() => setLinks(links.filter((_, j) => j !== i))}
                className="rounded-xl px-3 text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                aria-label="Remove link"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLinks([...links, { url: "", label: "" }])}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-white/15 px-3 py-2 text-sm text-zinc-400 transition hover:border-white/30 hover:text-zinc-100"
        >
          <PlusIcon className="size-4" />Add a photo link
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200">{error}</p>
      )}

      <div className="flex items-center gap-3 border-t border-white/[0.06] pt-6">
        <StarBorder
          type="submit"
          disabled={pending}
          color="#8b7bff"
          trailColor="#22d3ee"
          radius={12}
          duration={5}
          className="!px-5 !py-2.5 text-sm"
        >
          {pending ? "Saving…" : v.id ? "Save changes" : "Add to timeline"}
        </StarBorder>
        <button type="button" onClick={() => history.back()} className="rounded-xl px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100">
          Cancel
        </button>
      </div>
    </form>
  );
}
