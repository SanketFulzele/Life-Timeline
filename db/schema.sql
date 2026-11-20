-- Life Timeline schema. Safe to run more than once.

CREATE TABLE IF NOT EXISTS events (
  id             SERIAL PRIMARY KEY,
  -- For month-precision events this is the 1st of the month,
  -- for year-precision events it is Jan 1st of that year.
  event_date     DATE NOT NULL,
  date_precision TEXT NOT NULL DEFAULT 'day'
                 CHECK (date_precision IN ('day', 'month', 'year')),
  title          TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  kind           TEXT NOT NULL DEFAULT 'everyday'
                 CHECK (kind IN ('milestone', 'high', 'low', 'everyday')),
  mood           SMALLINT NOT NULL DEFAULT 0 CHECK (mood BETWEEN -5 AND 5),
  tags           TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_event_date_idx ON events (event_date);

CREATE TABLE IF NOT EXISTS photo_links (
  id        SERIAL PRIMARY KEY,
  event_id  INTEGER NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  url       TEXT NOT NULL,
  label     TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS photo_links_event_id_idx ON photo_links (event_id);
