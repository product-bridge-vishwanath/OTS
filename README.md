# Own the System

> AI writes the code; a human still owns the system.

A learning platform for people who ship real products with AI coding agents but can't yet
diagnose production failures themselves. Full scope, curriculum and build order live in
[PLAN.md](./PLAN.md) — that document is the source of truth.

## Status

Phase 1, build-order steps 1–3 complete:

- Next.js (App Router) + MDX content pipeline, Tailwind, light/dark theme.
- **One complete template lesson** — `M8.6 The debugging method` at `/lessons/m08-l06` —
  with all 9 anatomy sections (story, what-you-already-did, mental model + SVG diagram,
  tools, hands-on, break-fix with evidence + reveal, ask-your-agent with verification,
  checklist, 5-question quiz).
- `overview` / `operator` depth toggle (persisted), glossary hover terms, copyable code
  blocks, localStorage progress + quiz scores.
- **Reference layer, fully written** (content as YAML in `/content/reference`, each page
  searchable): command cheat sheet (43 commands by task, copyable), HTTP status codes
  (27 codes with layer-to-suspect + how to confirm), failure catalogue (26 entries:
  symptom → causes → confirm → fix), glossary (67 terms, also powering lesson hovers),
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
- Phase 2 hooks: `scenario_ids` + `lab` frontmatter, `/content/scenarios/*.yaml` rendered
  read-only at `/scenarios`, Drizzle schema includes `scenario_attempts`.
- Content lint: `npm run lint:content` (frontmatter schema, controlled vocabularies,
  prerequisite/scenario link integrity, 9-section completeness).

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

4. Content wave 1: M0, M1, rest of M8.
5. Content wave 2: M7, M6, M4, M5, M2.
