import "server-only";
import { db } from "./db";
import type { EventSummary, LifeEvent, PhotoLink } from "./types";

const SUMMARY_COLUMNS = `
  e.id,
  to_char(e.event_date, 'YYYY-MM-DD') AS date,
  e.date_precision AS precision,
  e.title,
  e.kind,
  e.mood,
  (SELECT count(*)::int FROM photo_links l WHERE l.event_id = e.id) AS "linkCount"
`;

export async function listAllEvents(): Promise<EventSummary[]> {
  const rows = await db().query(
    `SELECT ${SUMMARY_COLUMNS} FROM events e ORDER BY e.event_date, e.id`,
  );
  return rows as EventSummary[];
}

export async function listEventsInYear(year: number): Promise<EventSummary[]> {
  const rows = await db().query(
    `SELECT ${SUMMARY_COLUMNS} FROM events e
     WHERE e.event_date >= make_date($1, 1, 1) AND e.event_date < make_date($1 + 1, 1, 1)
     ORDER BY e.event_date, e.id`,
    [year],
  );
  return rows as EventSummary[];
}

export async function getEvent(id: number): Promise<LifeEvent | null> {
  const rows = await db().query(
    `SELECT ${SUMMARY_COLUMNS}, e.description, e.tags,
       COALESCE((SELECT json_agg(json_build_object('id', l.id, 'url', l.url, 'label', l.label) ORDER BY l.id)
                 FROM photo_links l WHERE l.event_id = e.id), '[]'::json) AS links
     FROM events e WHERE e.id = $1`,
    [id],
  );
  return (rows[0] as LifeEvent | undefined) ?? null;
}

/** Previous / next event ids around a given event, in date order. */
export async function getNeighbours(id: number): Promise<{ prev: number | null; next: number | null }> {
  const rows = await db().query(
    `WITH ordered AS (
       SELECT id, lag(id) OVER w AS prev, lead(id) OVER w AS next
       FROM events WINDOW w AS (ORDER BY event_date, id)
     ) SELECT prev, next FROM ordered WHERE id = $1`,
    [id],
  );
  const row = rows[0] as { prev: number | null; next: number | null } | undefined;
  return row ?? { prev: null, next: null };
}

export type EventInput = Omit<LifeEvent, "id" | "linkCount">;

export async function saveEvent(id: number | null, input: EventInput): Promise<number> {
  const sql = db();
  const values = [
    input.date,
    input.precision,
    input.title,
    input.description,
    input.kind,
    input.mood,
    input.tags,
  ];
  let eventId: number;
  if (id === null) {
    const rows = await sql.query(
      `INSERT INTO events (event_date, date_precision, title, description, kind, mood, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values,
    );
    eventId = (rows[0] as { id: number }).id;
  } else {
    const rows = await sql.query(
      `UPDATE events SET event_date = $1, date_precision = $2, title = $3, description = $4,
         kind = $5, mood = $6, tags = $7, updated_at = now()
       WHERE id = $8 RETURNING id`,
      [...values, id],
    );
    if (rows.length === 0) throw new Error("Event not found");
    eventId = id;
  }
  await replaceLinks(eventId, input.links);
  return eventId;
}

async function replaceLinks(eventId: number, links: PhotoLink[]) {
  const sql = db();
  await sql.query(`DELETE FROM photo_links WHERE event_id = $1`, [eventId]);
  if (links.length === 0) return;
  await sql.query(
    `INSERT INTO photo_links (event_id, url, label)
     SELECT $1, u, l FROM unnest($2::text[], $3::text[]) AS t(u, l)`,
    [eventId, links.map((l) => l.url), links.map((l) => l.label)],
  );
}

/** Account labels used before, offered as suggestions in the form. */
export async function listLinkLabels(): Promise<string[]> {
  const rows = await db().query(
    `SELECT label FROM photo_links WHERE label <> '' GROUP BY label ORDER BY count(*) DESC LIMIT 20`,
  );
  return (rows as { label: string }[]).map((r) => r.label);
}

export async function deleteEvent(id: number) {
  await db().query(`DELETE FROM events WHERE id = $1`, [id]);
}
