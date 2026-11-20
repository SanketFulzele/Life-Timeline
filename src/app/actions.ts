"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/access";
import { birthDate, today } from "@/lib/config";
import { daysInMonth, parts } from "@/lib/dates";
import { deleteEvent, getEvent, saveEvent } from "@/lib/events";
import { KINDS, type Kind, type PhotoLink, type Precision } from "@/lib/types";

export type FormResult = { error: string } | undefined;

function text(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function safeUrl(raw: string) {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function saveEventAction(form: FormData): Promise<FormResult> {
  await requireOwner();

  const idRaw = text(form, "id");
  const id = idRaw ? Number(idRaw) : null;
  if (id !== null && !Number.isInteger(id)) return { error: "Invalid event id." };

  // Date: year is required, month and day are optional ("I don't remember").
  const y = Number(text(form, "year"));
  const m = text(form, "month") ? Number(text(form, "month")) : null;
  const d = m !== null && text(form, "day") ? Number(text(form, "day")) : null;
  const minYear = parts(birthDate()).y;
  const now = parts(today());
  if (!Number.isInteger(y) || y < minYear || y > now.y) {
    return { error: `Year must be between ${minYear} and ${now.y}.` };
  }
  if (m !== null && (!Number.isInteger(m) || m < 1 || m > 12)) return { error: "Pick a valid month." };
  if (d !== null && m !== null && (!Number.isInteger(d) || d < 1 || d > daysInMonth(y, m))) {
    return { error: "That day doesn't exist in that month." };
  }
  const precision: Precision = m === null ? "year" : d === null ? "month" : "day";
  const date = `${y}-${String(m ?? 1).padStart(2, "0")}-${String(d ?? 1).padStart(2, "0")}`;

  const title = text(form, "title");
  if (!title) return { error: "Give the memory a title." };
  if (title.length > 200) return { error: "Title is too long (200 characters max)." };

  const kind = text(form, "kind") as Kind;
  if (!KINDS.includes(kind)) return { error: "Pick a type." };

  const mood = Number(text(form, "mood") || 0);
  if (!Number.isInteger(mood) || mood < -5 || mood > 5) return { error: "Mood must be between -5 and +5." };

  const description = text(form, "description").slice(0, 20_000);
  const tags = [
    ...new Set(
      text(form, "tags")
        .split(",")
        .map((t) => t.trim().replace(/^#/, "").toLowerCase())
        .filter(Boolean),
    ),
  ].slice(0, 20);

  const urls = form.getAll("linkUrl").map(String);
  const labels = form.getAll("linkLabel").map(String);
  const links: PhotoLink[] = [];
  for (let i = 0; i < urls.length; i++) {
    const raw = urls[i].trim();
    if (!raw) continue;
    const url = safeUrl(raw);
    if (!url) return { error: `"${raw}" is not a valid link. It should start with https://` };
    links.push({ url, label: (labels[i] ?? "").trim().slice(0, 60) });
  }

  let savedId: number;
  try {
    savedId = await saveEvent(id, { date, precision, title, description, kind, mood, tags, links });
  } catch (err) {
    console.error(err);
    return { error: "Could not save. Check the database connection and try again." };
  }

  revalidatePath("/", "layout");
  redirect(`/event/${savedId}`);
}

export async function deleteEventAction(id: number) {
  await requireOwner();
  const event = await getEvent(id);
  if (!event) redirect("/");
  await deleteEvent(id);
  revalidatePath("/", "layout");
  redirect(`/year/${parts(event.date).y}`);
}
