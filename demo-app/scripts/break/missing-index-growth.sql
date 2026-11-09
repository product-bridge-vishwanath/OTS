-- Breakage (M6.1): simulate a year of growth. The schema has no index on
-- bookings(date) or bookings(room_id), so queries that were instant at 50
-- rows start sequential-scanning 400k rows.
--   psql postgres://ots:ots@localhost:5432/demo -f scripts/break/missing-index-growth.sql
-- Afterwards, compare:
--   EXPLAIN ANALYZE SELECT * FROM bookings WHERE date = CURRENT_DATE;

INSERT INTO bookings (room_id, customer_name, date, start_hour, end_hour, notes, meta)
SELECT
  1 + (g % 4),
  'archived-customer-' || g,
  CURRENT_DATE - (g % 365),
  7 + (g % 14),
  8 + (g % 14),
  '[]'::jsonb,
  jsonb_build_object('source', 'import', 'batch', g / 1000)
FROM generate_series(1, 400000) AS g;

ANALYZE bookings;

SELECT 'bookings now: ' || count(*) FROM bookings;
