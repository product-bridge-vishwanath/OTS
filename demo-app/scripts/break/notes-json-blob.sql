-- Breakage (M7.6 / scenario sc-single-cell-lost-updates-01): seed a "hot"
-- booking whose notes cell is already large and busy, so the lost-update and
-- giant-row consequences of the single-cell model are easy to observe.
-- (The anti-pattern itself — the jsonb notes array — is the schema default.)
--   psql postgres://ots:ots@localhost:5432/demo -f scripts/break/notes-json-blob.sql
-- Then run: node scripts/load/concurrent-editors.js <booking id printed below>

WITH hot AS (
  INSERT INTO bookings (room_id, customer_name, date, start_hour, end_hour, notes, meta)
  VALUES (
    2,
    'Weekly Jam Collective',
    CURRENT_DATE + 2,
    18, 22,
    (SELECT jsonb_agg(jsonb_build_object(
        'author', 'member-' || g,
        'text', 'Setlist idea #' || g || ': ' || repeat('la ', 40),
        'at', (now() - (g || ' hours')::interval)::text
     )) FROM generate_series(1, 300) g),
    '{"source":"import","hot_row":true}'
  )
  RETURNING id
)
SELECT 'hot booking created with id: ' || id
     , 'row size: ' || pg_size_pretty(pg_column_size(
         (SELECT notes FROM bookings WHERE id = hot.id))::bigint) AS note_cell
FROM hot;
