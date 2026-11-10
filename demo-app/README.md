# Riverside Studios — the Own the System teaching app

A small, real full-stack app: studio room bookings with shared notes, a Redis
cache, a report-generating worker, payment webhooks, and an AI front-desk
assistant. Every hands-on task in the OTS curriculum runs against it.

> ⚠ **This app is deliberately imperfect.** It contains planted anti-patterns
> that the curriculum uses as drill material. **Do not fix them casually** —
> each one is the subject of a lesson and a Phase 2 scenario. The table below
> is the map.

## Run it (one command)

```bash
docker compose up --build
```

- App: http://localhost:3001 (3000 inside the container; the platform site uses 3000 locally)
- Health: http://localhost:3001/api/health
- Postgres: `docker compose exec db psql -U ots -d demo`
- Logs: `docker compose logs -f app worker`
- Reset to clean seed data: `docker compose down -v && docker compose up -d --build`

Verified working: health reports both dependencies `ok`, the room list goes
`cache: miss` → `cache: hit`, and all three drill scripts below reproduce their
failure on a fresh stack.

Without Docker: start Postgres + Redis yourself, `cp .env.example .env`,
apply `db/init.sql`, then `npm install && npm run dev` (+ `npm run worker`).

The AI assistant works in offline mode by default; set `ANTHROPIC_API_KEY`
(in your shell or a `.env` file next to `compose.yaml`) to enable it.

## The planted anti-patterns

| # | What | Where | Lesson | Make it visible |
|---|------|-------|--------|-----------------|
| AP1 | Whole notes array in one jsonb cell; read-modify-write without locking → **lost updates** | `bookings.notes`, `app/api/bookings/[id]/notes/route.ts` | M7.6 | `node scripts/load/concurrent-editors.js` |
| AP2 | Check-then-insert availability with no unique constraint → **double booking** | `app/api/bookings/route.ts` POST | M7.2 | `node scripts/load/booking-rush.js` |
| AP3 | No foreign keys; `meta` grab-bag jsonb | `db/init.sql` | M6.8 | read the schema |
| AP4 | No indexes beyond primary keys → **slow queries after growth** | `db/init.sql` | M6.1 | `psql … -f scripts/break/missing-index-growth.sql`, then `EXPLAIN ANALYZE` |
| AP5 | `events`: everything-in-one-table log | `db/init.sql` | M6.8 | `SELECT type, count(*) FROM events GROUP BY 1` |
| AP6 | Webhook handler without idempotency → **duplicate payments** | `app/api/webhooks/payment/route.ts` | M7.7 | `node scripts/load/webhook-replay.js` |
| AP7 | Report cron with no lock, no unique(day), no dead-man's switch → **runs twice / stops silently** | `worker/cron.js` | M7.8 | `sh scripts/break/double-worker.sh` |
| AP8 | Room list cached in Redis for 10 min, **never invalidated** on rate updates → stale prices | `app/api/rooms/route.ts` + `[id]/route.ts` | M6.5 | `curl -X PATCH localhost:3001/api/rooms/1 -d '{"hourly_rate":99}' -H 'Content-Type: application/json'` then `curl localhost:3001/api/rooms` |
| AP9 | Assistant rebuilds full context every request: no prompt caching, no per-request cost ceiling | `app/api/assistant/route.ts` | M13.5/.6 | watch `assistant.answered … in=` token counts grow with data |

## Break & load scripts (Phase 2 hooks)

- `scripts/break/` — put the system into a broken state:
  - `connection-hungry-backfill.js` — backfill starves the connection pool (scenario `sc-debug-method-01`)
  - `missing-index-growth.sql` — 400k rows of growth, no indexes
  - `notes-json-blob.sql` — seed a hot, oversized notes cell (scenario `sc-single-cell-lost-updates-01`)
  - `double-worker.sh` — second worker, duplicated cron runs
- `scripts/load/` — generate traffic that exposes the breakage:
  - `booking-rush.js`, `concurrent-editors.js`, `webhook-replay.js`, `steady-browse-and-order.js`

All load scripts take `APP_URL` (default `http://localhost:3001`, matching
compose); break scripts take `DATABASE_URL` or a psql connection string.

Observed on a fresh stack: `booking-rush.js` created **15 bookings for one
slot**; `concurrent-editors.js` accepted 20 notes and kept **6**;
`webhook-replay.js` produced **two payment rows for one event**.

## Stack

Next.js (App Router) · Postgres 16 (`pg`, raw SQL on purpose — you can read
every query) · Redis (`ioredis`) · a plain Node worker · Anthropic SDK for the
assistant. The platform site in the repo root teaches with this exact stack.

Postgres runs with `pg_stat_statements` loaded via `shared_preload_libraries`
(see `compose.yaml`), not just `CREATE EXTENSION`'d — that extension needs the
preload flag to actually collect stats, or every query against the view fails
with "must be loaded via shared_preload_libraries." This makes the M6.1/M8.5
"which query is actually slow, ranked by total time" drills work out of the box.
