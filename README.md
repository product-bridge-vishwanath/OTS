# Own the System

> AI writes the code; a human still owns the system.

A learning platform for people who ship real products with AI coding agents but can't yet
diagnose production failures themselves. Full scope, curriculum and build order live in
[PLAN.md](./PLAN.md) — that document is the source of truth.

## Status

Phase 1, build-order steps 1–4 complete:

- Next.js (App Router) + MDX content pipeline, Tailwind, light/dark theme.
- **54 lessons across M0, M1, M2, M4, M5, M6, M7 and M8** — content wave 2 is now fully
  complete per PLAN §6 — each lesson with all 9 anatomy sections
  (story, what-you-already-did, mental model + theme-aware SVG diagram, tools, hands-on
  against the demo app, break-fix with evidence + reveal, three ask-your-agent prompts
  with verification steps, checklist, 5-question quiz):
  - **M0 Map your own product** — request journey (7 hops), boxes-and-arrows vocabulary,
    draw-your-own-product exercise, per-box failure tour with the three triage questions.
  - **M1 The server is just a computer** — PaaS/serverless/VPS and the process-vs-function
    shape, SSH and lockout prevention, commands taught by question, processes/ports/
    permissions, environment variables and precedence, supervision and crash loops.
  - **M2 Git and shipping** (wave 2) — git's snapshot model and the 15 commands, merge vs
    rebase with `bisect` as a debugging tool, reading a diff you didn't write, CI/CD
    anatomy, build-vs-runtime and staging-vs-prod, rollback-first incident response.
    Verified on this repo's own real history and a disposable clone: `git bisect run`
    finding a planted bug in 3 steps out of 8; a real merge conflict's markers; a real
    `git revert` + re-revert preserving history; a genuine `docker compose up --build`
    downtime gap (~0.5–1s of failed requests) measured with a polling loop; build-time
    vs runtime failure (a syntax error fails the build; a bad `DATABASE_URL` builds fine
    and fails only at request time). Added a real `.github/workflows/ci.yml` to this
    project (lint + build on every push/PR) — every command in it verified to run
    cleanly locally; not yet pushed to trigger a live Actions run.
  - **M4 Config, secrets and keys** (wave 2) — env files and leaks, secret managers and
    rotation, third-party key scopes, usage quotas and bills, config vs secrets vs flags.
  - **M6 Data: databases, cache, storage, queues** (wave 2) — relational fundamentals and
    `EXPLAIN ANALYZE`, connection pooling, migrations (forward-only, and why rollback is a
    lie), backups and the restore drill, Redis's five jobs, object storage and egress,
    queues and workers, data-modelling anti-patterns. Verified against the live demo app:
    a 400k-row seq scan dropping from ~11.7ms to ~2.1ms after `CREATE INDEX CONCURRENTLY`;
    `pg_stat_statements` enabled via `shared_preload_libraries` so query-ranking drills
    actually work; real connection exhaustion ("too many clients already") and recovery;
    `ADD COLUMN` instant vs. a ~275ms full-table rewrite; a `pg_dump`/`pg_restore`
    round-trip; Redis `INCR` atomicity and TTL expiry; two workers claiming disjoint rows
    via `SKIP LOCKED`.
  - **M7 Concurrency, jobs and time** (wave 2) — what "concurrent" means and shared
    state, race conditions fixed with exclusion constraints, transactions and isolation
    (including why `BEGIN` doesn't stop duplicates), locks and the lock *queue*,
    optimistic vs pessimistic, the single-cell anti-pattern, idempotency and
    at-least-once delivery, cron (ran twice / ran never), safe backfills, and
    UTC/DST/clock skew. Every lesson's mechanics were verified against the running
    demo app — deadlock detection, serialization failures, `pg_blocking_pids`,
    advisory locks, `SKIP LOCKED`, exclusion constraints and DST arithmetic.
  - **M5 Networking: DNS, HTTP, TLS** (wave 2) — DNS and why "propagation" is really many
    independent caches honoring their own TTL, HTTP methods as promises, TLS/certificates,
    reverse proxies, CDN caching, CORS/cookies, firewalls/open ports. Added a real nginx
    reverse proxy as a permanent demo-app service (`demo-app/nginx/`, port 8080) — verified
    a genuine 502 (connection refused, ~2.6ms) and 504 (upstream hangs, fails at exactly the
    configured 5s timeout) through it; verified a real CORS fix (allowlisted origin gets
    `Access-Control-Allow-Origin`, others don't) on the live app, then reverted; verified
    DNS/TLS tooling (`dig`, `openssl s_client`) and real CDN cache headers against stable
    public targets; verified the `0.0.0.0` vs `127.0.0.1` bind distinction with throwaway
    containers.
  - **M8 Observability and the debugging method** — four signals, where logs live,
    structured logging and request IDs, golden signals and dashboards, error tracking and
    tracing, **the debugging method** (`/lessons/m08-l06`, the template lesson), building a
    failure catalogue, alerting without fatigue.
- `overview` / `operator` depth toggle (persisted), glossary hover terms, copyable code
  blocks, localStorage progress + quiz scores.
- **Reference layer, fully written** (content as YAML in `/content/reference`, each page
  searchable): command cheat sheet (43 commands by task, copyable), HTTP status codes
  (27 codes with layer-to-suspect + how to confirm), failure catalogue (26 entries:
  symptom → causes → confirm → fix), glossary (113 terms, also powering lesson hovers),
  cloud concept map (18 concepts across AWS/GCP/Azure/PaaS), decision library index
  (D1–D17 with honest defaults; full pages come with M11).
- **Demo app** (`/demo-app` — "Riverside Studios"): a real full-stack teaching app
  (Next.js + Postgres + Redis + cron worker + webhook endpoint + AI assistant) that runs
  with one command (`docker compose up --build`). It deliberately contains 9 planted
  anti-patterns (double-booking race, single-cell jsonb notes with lost updates, no
  indexes/FKs, non-idempotent webhooks, unlocked cron, stale cache, uncached LLM calls)
  plus `scripts/break/*` and `scripts/load/*` to trigger each one — see
  `demo-app/README.md` for the full map. These are drill material for the lessons and
  Phase 2 scenarios.
- Phase 2 hooks: `scenario_ids` + `lab` frontmatter, **54 scenario definitions** in
  `/content/scenarios/*.yaml` rendered read-only at `/scenarios` (one per break-fix,
  each with breakage, agent bias, probes, root-cause vs symptom-only markers, hint
  ladder and scoring), Drizzle schema includes `scenario_attempts`.
- Content lint: `npm run lint:content` — frontmatter schema, controlled vocabularies,
  prerequisite/scenario link integrity, 9-section completeness, glossary term
  resolution, unknown components, unknown section kinds, quiz-id binding, nested
  code fences and escaped backticks in prose (both break MDX parsing and otherwise
  only surface at build time), plus a note on mental-model diagram coverage. The
  component checks are fence-aware, so TypeScript generics in code samples don't
  trip them.

Not wired yet (deliberately): auth + server-side persistence (schema is ready in `/db`;
progress lives in localStorage until a Postgres instance is chosen — see PLAN §7 open
decisions), site-wide full-text search (each reference page has its own), demo repo.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint:content
```

No database or env vars required to run the site.

## Writing a lesson

1. Create `content/modules/<MXX-dir>/<mXX-lYY-slug>.mdx` (module dirs are registered in
   `content/modules/modules.yaml`).
2. Frontmatter must satisfy the schema in `lib/content.ts` (see PLAN §4 for the reference
   shape). `concepts` must come from `content/_vocab/concepts.yaml`; `platforms` from the
   PLAN §8 list.
3. Use the 9 sections, in order, via `<Section kind="...">`:
   `story`, `already-did`, `mental-model`, `tools`, `hands-on`, `break-fix`, `ask-agent`,
   `checklist`, `check`.
4. Components available in MDX: `<Operator>` (operator-depth block), `<Term k="slug">`
   (glossary hover — add terms to `content/reference/glossary.yaml`), `<Evidence title="">`,
   `<Reveal>`, `<AgentTask prompt="">`, `<Callout type="info|warn|key">`,
   `<Quiz lessonId="" questions={[...]} />`.
5. Every break-fix needs a scenario definition in `content/scenarios/` referenced from
   `scenario_ids`.
6. `npm run lint:content` must pass.

`m08-l06` is the canonical example of all of the above.

## Database

Schema in `db/schema.ts` (Drizzle, Postgres): `users`, `lesson_progress`, `quiz_attempts`,
`notes`, `maps`, `decision_records`, `scenario_attempts`. When a Postgres instance exists:
copy `.env.example` → `.env`, then `npm run db:push`.

## Next (per PLAN §6)

Content wave 2 is complete (M7, M6, M4, M5, M2 — every module PLAN §6 lists for it).

6. Content wave 3: M11 (decision pages), M9, M10, M13, M14.
7. Content wave 4: M3, M12.
8. Personal map editor and decision records; then auth + server-side progress.

One repo-level item from this wave not yet done: `.github/workflows/ci.yml` exists and
every command in it has been verified to run cleanly locally, but it hasn't been pushed to
trigger a live GitHub Actions run — that's a deliberate choice (pushing wasn't requested),
not an oversight. Push it whenever you're ready to see a real run.

The demo app's planted anti-patterns now have lessons that fix them properly: the
double-booking race (M7.2), single-cell notes (M7.6), the non-idempotent webhook
(M7.7), the unlocked cron (M7.8), missing indexes (M6.1), and a full five-question
schema audit that names all of them at once (M6.8). Each lesson's hands-on
restores the anti-pattern at the end so the app stays teachable — verified clean
(only primary-key constraints, original seed data) after every module's work.
