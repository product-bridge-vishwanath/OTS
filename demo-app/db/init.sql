-- pg_stat_statements is loaded via shared_preload_libraries in compose.yaml;
-- this just creates the view onto its collected stats.
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Riverside Studios — teaching schema.
-- ⚠ This schema DELIBERATELY contains the anti-patterns from OTS modules
-- M6.8 and M7.6. They are drill material. Do not "fix" them here; the
-- lessons and Phase 2 scenarios walk through fixing them properly.
--
-- Planted anti-patterns:
--   [AP1] bookings.notes: a whole array of notes in ONE jsonb cell
--         (single-cell anti-pattern -> lost updates under concurrent edits, M7.6)
--   [AP2] no unique constraint on (room_id, date, hours)
--         (double-booking race survives because nothing enforces it, M7.2)
--   [AP3] bookings.room_id has no foreign key; meta is a grab-bag jsonb blob (M6.8)
--   [AP4] no indexes beyond primary keys
--         (fine at 50 rows; scripts/break/missing-index-growth.sql makes it hurt, M6.1)
--   [AP5] events: the everything-in-one-table log with a jsonb payload (M6.8)
--   [AP6] payments.provider_event_id has no unique constraint
--         (replayed webhooks create duplicate payments, M7.7)
--   [AP7] reports has no unique(day) and no run lock
--         (a cron that fires twice writes the report twice, M7.8)

CREATE TABLE rooms (
  id          serial PRIMARY KEY,
  name        text NOT NULL,
  hourly_rate numeric(8, 2) NOT NULL
);

CREATE TABLE bookings (
  id            serial PRIMARY KEY,
  room_id       integer NOT NULL,                 -- [AP3] no FK
  customer_name text NOT NULL,
  date          date NOT NULL,
  start_hour    integer NOT NULL,
  end_hour      integer NOT NULL,
  notes         jsonb NOT NULL DEFAULT '[]',      -- [AP1] single-cell notes
  meta          jsonb,                            -- [AP3] grab-bag blob
  created_at    timestamptz NOT NULL DEFAULT now()
);                                                -- [AP2] no unique constraint, [AP4] no indexes

CREATE TABLE events (
  id         serial PRIMARY KEY,                  -- [AP5] everything-table
  type       text NOT NULL,
  payload    jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id                serial PRIMARY KEY,
  booking_id        integer NOT NULL,             -- [AP3] no FK
  amount            numeric(10, 2) NOT NULL,
  provider_event_id text NOT NULL,                -- [AP6] no unique constraint
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reports (
  id           serial PRIMARY KEY,
  day          date NOT NULL,                     -- [AP7] no unique(day)
  body         text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed data ------------------------------------------------------------

INSERT INTO rooms (name, hourly_rate) VALUES
  ('Studio A — recording',  80.00),
  ('Studio B — rehearsal',  45.00),
  ('Studio C — podcast',    35.00),
  ('The Loft — video',     120.00);

INSERT INTO bookings (room_id, customer_name, date, start_hour, end_hour, notes, meta) VALUES
  (1, 'Mara & The Tides', CURRENT_DATE, 10, 13,
   '[{"author":"mara","text":"Need the vintage ribbon mic set up","at":"2026-01-10T09:00:00Z"}]',
   '{"source":"web","deposit_paid":true}'),
  (2, 'Delta Collective', CURRENT_DATE, 14, 18,
   '[]',
   '{"source":"phone"}'),
  (3, 'Signal & Noise podcast', CURRENT_DATE + 1, 9, 11,
   '[{"author":"host","text":"Two guests this week, need 4 headphones","at":"2026-01-11T18:30:00Z"}]',
   '{"source":"web","recurring":"weekly"}');

INSERT INTO events (type, payload) VALUES
  ('booking.created', '{"booking_id":1,"via":"web"}'),
  ('booking.created', '{"booking_id":2,"via":"phone"}'),
  ('page.viewed',     '{"path":"/","session":"a1b2"}'),
  ('booking.created', '{"booking_id":3,"via":"web"}');
