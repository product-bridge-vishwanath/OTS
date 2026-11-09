# PLAN.md — "Own the System"
### A learning + simulation platform for people who ship with AI but don't yet own what they ship

> Working title. One-line thesis: **AI writes the code; a human still owns the system.**
> This document is the source of truth for scope, curriculum, platform architecture and build order. Phase 1 = curriculum platform. Phase 2 = simulation layer.

---

## 0. Learner, promise, non-goals

### Who this is for
A technically literate PM / founder / builder who has shipped real products with AI coding agents (Claude Code, Cursor, Copilot, Lovable, Bolt, etc.). They:
- Can read code roughly, but didn't write most of it and don't read all of it.
- Have run terminal commands when the agent told them to.
- Have deployed to Vercel / Render / Railway / Supabase / Fly / a VPS.
- Have had production break and could not tell *where* or *why*; they pasted errors back into the agent and hoped.
- Are now making real decisions (which database, which host, what to do about a bot attack, why the AI bill tripled) without understanding the trade-offs.

### The promise
By the end of the program the learner can:
1. Draw how their own product works, end to end, box by box.
2. Diagnose the ~25 most common production failures themselves, with the debugging method.
3. Direct an AI agent (or an engineer) with precision on server-side work, and **verify** what it did.
4. Make stack, scaling, security and cost decisions with a real model of the trade-offs.
5. Operate a live product: incidents, rollbacks, cron/batch jobs, concurrency, cost.

### Non-goals (Phase 1)
- Not teaching programming or a framework.
- Not a certification.
- Not deep DevOps / SRE (no Kubernetes mastery, no Terraform/IaC depth, no networking certs).
- Not vendor training. Tools are shown as *implementations of a fundamental*, never as the subject.

---

## 1. Teaching principles (apply to every lesson)

1. **Concept first, tools second.** Teach the fundamental, then show 3–4 tools that implement it. Tools rotate; fundamentals don't.
2. **Start from the failure.** Every module opens with a real "it broke / the bill tripled / we got attacked" story.
3. **"What you already did."** Every lesson connects to something the learner has done by following an agent's instructions, and explains what was actually happening.
4. **Two depths on the same page.** `overview` (what it is, why it matters, what to ask, what good looks like) and `operator` (commands, config, internals). Toggle, never separate tracks.
5. **Learn → do → break-fix.** Read, do it, then get a broken version and fix it. Phase 1 does break-fix as reading exercises; Phase 2 makes them live.
6. **Decisions are first-class content.** Every place a builder must choose (SQL vs NoSQL, PaaS vs VM, build vs buy auth, which LLM) gets a decision page with trade-offs, cost, and "when to switch."
7. **Verify the agent.** Each lesson ends with prompts to give an AI agent *and* how to check its work.

---

## 2. Curriculum

Module list, then detail. ~14 modules, ~70 lessons, 6 reference pages, 1 failure catalogue, 1 decision library.

| # | Module | Why it's here for this learner |
|---|--------|-------------------------------|
| M0 | Map your own product | Builds the mental map everything else zooms into |
| M1 | The server is just a computer | Demystifies every command the agent ever made them run |
| M2 | Git and shipping | Reading diffs they didn't write; deploy ≠ works |
| M3 | Docker and where code runs | Their PaaS is hiding this from them |
| M4 | Config, secrets and keys | Leaked keys and exploding provider bills |
| M5 | Networking: DNS, HTTP, TLS | 502s, CORS, expired certs, DNS "propagation" |
| M6 | Data: databases, cache, storage, queues | The layer most vibe-coded apps get wrong |
| M7 | Concurrency, jobs and time | Cron, batches, locks, race conditions, multiple users writing at once |
| M8 | Observability and the debugging method | The core skill of the whole program |
| M9 | Scaling and cost | What breaks first at 10x, and what the bill says |
| M10 | Security and abuse | Auth, OWASP, bots, supply chain from agent-installed packages |
| M11 | Choosing your stack (decision library) | SQL vs NoSQL, PaaS vs VM, build vs buy, and when to switch |
| M12 | Clouds mapped to concepts | Same pieces, different names |
| M13 | AI systems in production | Tokens, RAG, embeddings, cost, evals, agents |
| M14 | Operating a product: incidents | Rollback first, runbooks, comms, briefing an agent safely |

### M0 — Map your own product
- L0.1 The request journey: browser → DNS → CDN → load balancer → reverse proxy → app → cache → DB → back. One canonical diagram, referenced by every module.
- L0.2 Boxes and arrows vocabulary: client, server, API, service, database, cache, queue, worker, CDN, proxy.
- L0.3 **Exercise:** draw the architecture of something you shipped (personal map editor). Revisit after each module.
- L0.4 Where things break: a tour of the map with one failure per box.

### M1 — The server is just a computer
- L1.1 What Vercel / Render / Railway / a VPS actually are. Serverless vs server. Regions.
- L1.2 SSH: keys, `~/.ssh`, `authorized_keys`, what "connecting" means, `scp`.
- L1.3 The 25 commands: `ls cd pwd cat less tail -f head grep find ps top/htop df du free kill chmod chown curl wget scp env export systemctl journalctl`. Taught by task, not alphabetically.
- L1.4 Processes, ports, users, permissions. "Port already in use." "Permission denied."
- L1.5 Environment variables: where they live (shell, `.env`, platform dashboard, systemd), precedence, why `undefined` in prod.
- L1.6 Keeping things running: systemd, pm2, restart policies, what a "crash loop" is.

### M2 — Git and shipping
- L2.1 Git's mental model: snapshots, branches, HEAD, remotes. The 15 commands.
- L2.2 Merge vs rebase, conflicts, `git log`/`git blame`/`git bisect` as debugging tools.
- L2.3 **Reading a diff you didn't write.** How to review an agent's PR: scope, side effects, dependencies added, config changed, tests. Red flags checklist.
- L2.4 CI/CD: what a pipeline is, GitHub Actions anatomy, environments, secrets in CI.
- L2.5 Deploying: build vs runtime, staging vs prod, blue-green, canary, feature flags.
- L2.6 Rollback: why it's the first fix, how each platform does it, what *can't* be rolled back (DB migrations).

### M3 — Docker and where code runs
- L3.1 "Works on my machine": what the container solves.
- L3.2 Images vs containers, Dockerfile line by line, layers, `.dockerignore`.
- L3.3 Volumes, networks, `docker compose` for local full-stack.
- L3.4 The hosting spectrum: PaaS → VM + Docker → container platforms (ECS, Cloud Run, Fly) → Kubernetes. When you need each; when you don't.
- L3.5 What your PaaS is doing for you (buildpacks, Nixpacks, auto-TLS) and when that becomes a limit.

### M4 — Config, secrets and keys
- L4.1 `.env` files: what they are, why they leak, `.gitignore`, what to do when a key hits GitHub.
- L4.2 Secret managers: platform secrets, AWS Secrets Manager, Vault, Doppler, 1Password. Rotation.
- L4.3 Third-party keys: scopes, restrictions (domain/IP), separate keys per environment.
- L4.4 Usage and quotas: provider dashboards (Stripe, OpenAI/Anthropic, Supabase, Twilio), budget alerts, hard caps. Why the AI bill exploded.
- L4.5 Config vs secrets vs feature flags: what goes where.

### M5 — Networking: DNS, HTTP, TLS
- L5.1 DNS: A/AAAA/CNAME/TXT/MX, TTL, "propagation", nameservers, where to debug (`dig`, `nslookup`).
- L5.2 HTTP: methods, headers, status codes by family, reading `curl -v`. The status-code reference page.
- L5.3 TLS/HTTPS: what a certificate is, Let's Encrypt, expiry, "NET::ERR_CERT_…", mixed content.
- L5.4 Reverse proxies and load balancers: Nginx, Caddy, platform LBs. 502 vs 503 vs 504 and what each tells you.
- L5.5 CDNs and caching headers. Cloudflare as proxy, cache and shield.
- L5.6 CORS, cookies, same-site, preflight — the vibe-coder classics.
- L5.7 Firewalls, security groups, open ports, `0.0.0.0` vs `localhost`.

### M6 — Data: databases, cache, storage, queues
- L6.1 Relational fundamentals: tables, keys, constraints, indexes, why a query is slow (`EXPLAIN`).
- L6.2 Connections and pools: connection limits, poolers (PgBouncer, Supabase pooler, Prisma Accelerate), "too many connections."
- L6.3 Migrations: what they are, forward-only thinking, zero-downtime patterns, why migrations and rollbacks fight.
- L6.4 Backups and restore: snapshots, PITR, and the restore drill most teams never do.
- L6.5 Why Redis exists: cache, session store, rate limiter, pub/sub, job queue. TTLs, eviction, "cache stampede."
- L6.6 Object storage (S3/R2/GCS): buckets, signed URLs, public vs private, CDN in front, egress cost.
- L6.7 Queues and workers: why async exists, SQS/RabbitMQ/BullMQ/Kafka at a glance, at-least-once delivery, dead-letter queues.
- L6.8 Data modelling anti-patterns from AI-generated apps: JSON blob columns, everything in one table, no indexes, no foreign keys, storing files in the DB.

### M7 — Concurrency, jobs and time
This module exists because almost every vibe-coded app meets these in production without knowing their names.
- L7.1 Multiple users at once: what "concurrent" actually means on a server, requests interleaving, shared state.
- L7.2 Race conditions: double-booking, double-charging, negative inventory, lost updates. Read-modify-write explained.
- L7.3 Transactions and isolation: ACID in plain language, `BEGIN/COMMIT`, isolation levels, what "serializable" buys and costs.
- L7.4 Locks: row locks, table locks, `SELECT … FOR UPDATE`, deadlocks, lock waits, long transactions blocking everyone. How to see blocked queries (`pg_stat_activity`, `pg_locks`).
- L7.5 Optimistic vs pessimistic concurrency: version columns, compare-and-set, when each fits.
- L7.6 **The single-cell anti-pattern:** storing a whole document/array/counter in one JSON cell that many users update. Consequences: lost writes, hot rows, lock contention, no indexing, giant rows, impossible analytics. How to split it.
- L7.7 Idempotency: idempotency keys, retries, "the webhook fired twice", exactly-once is a lie.
- L7.8 Cron jobs: crontab syntax, platform crons (Vercel Cron, Render, GitHub Actions schedule, pg_cron), timezones, overlapping runs, locking a cron so it runs once, monitoring that it ran at all (dead man's switch).
- L7.9 Batch jobs and backfills: chunking, rate limiting against third parties, resumability, progress tables, running at off-peak, impact on the live DB.
- L7.10 Time itself: UTC everywhere, timezones, DST, clock skew, timestamps vs dates.

### M8 — Observability and the debugging method
- L8.1 Logs, metrics, traces, alerts: what question each answers.
- L8.2 Where logs live: stdout, `docker logs`, `journalctl`, platform log tabs, ELK/Kibana, CloudWatch, Datadog, Grafana Loki, Sentry. How to search them (Kibana/KQL basics, `grep` on a server).
- L8.3 Structured logging, log levels, correlation/request IDs, logging the right things (and not logging secrets/PII).
- L8.4 Metrics and dashboards: the four golden signals (latency, traffic, errors, saturation). Prometheus/Grafana, platform metrics.
- L8.5 Error tracking (Sentry) and tracing (OpenTelemetry) at a usable level.
- L8.6 **The debugging method:** reproduce → read the actual error (not the summary) → build a timeline → isolate the layer (client / network / app / data / third party) → what changed? → fix the cause, not the symptom → confirm → write it down.
- L8.7 **The failure catalogue** (reference page, ~25 entries): symptom → likely causes → how to confirm → fix. Includes: OOM, disk full, port in use, expired cert, missing env var, DB connections exhausted, DNS misconfig, bad deploy, CORS, 502/504 from proxy, crash loop, slow query / missing index, lock wait / deadlock, cron didn't run, cron ran twice, webhook replayed, cache stale, rate-limited by provider, provider outage, clock skew, timezone bug, wrong region, cold starts, N+1 queries, memory leak.
- L8.8 Alerting without alert fatigue: what to page on, what to dashboard.

### M9 — Scaling and cost
- L9.1 Stateless vs stateful; why statelessness unlocks everything.
- L9.2 Vertical vs horizontal; autoscaling; what autoscaling can't fix.
- L9.3 Caching layers end to end: browser → CDN → app cache → Redis → DB cache. Invalidation.
- L9.4 Database scaling: indexes first, then pooling, read replicas, partitioning, sharding (last).
- L9.5 Queues to absorb spikes; rate limiting to protect yourself and your providers.
- L9.6 **Exercise:** "what breaks first at 10x?" on your own map.
- L9.7 Cost: reading a cloud/PaaS bill, egress, idle resources, budget alerts, right-sizing and **downsizing**, reserved vs on-demand, LLM token spend as a line item.
- L9.8 Performance basics: p50/p95/p99, cold starts, bundle size, N+1, where latency actually comes from.

### M10 — Security and abuse
- L10.1 Auth properly explained: sessions vs JWT, cookies, OAuth/OIDC, refresh tokens, password hashing, MFA. Build vs buy (Clerk, Auth0, Supabase Auth, NextAuth).
- L10.2 Authorization: roles, row-level security, the "IDOR" bug where user A sees user B's data.
- L10.3 OWASP Top 10 in plain language with examples from AI-generated code (injection, broken access control, secrets in client bundle).
- L10.4 Least privilege: IAM, service accounts, scoped keys, DB users per service.
- L10.5 Supply chain: agent-installed packages, lockfiles, `npm audit`/Dependabot, typosquatting, pinning.
- L10.6 Bots, scraping and DDoS: how attacks look in logs, WAF (Cloudflare), rate limiting, CAPTCHA/Turnstile, bot management, blocking by ASN/country, cost-based attacks on AI endpoints.
- L10.7 Data protection basics: PII inventory, encryption at rest/in transit, retention, GDPR/DPDP awareness, data residency.
- L10.8 Secure defaults checklist for a new product.

### M11 — Choosing your stack (decision library)
Each decision page has the same structure: **the question → options → how each works → cost (money, time, complexity) → trade-offs → pick this if… → when to switch → migration cost → questions to ask.**
- D1 SQL vs NoSQL: Postgres / MySQL vs MongoDB / DynamoDB / Firestore. Schema, joins, consistency, scaling model, cost at each stage. Default recommendation and the exceptions.
- D2 Which Postgres: Supabase vs Neon vs RDS vs self-hosted. Managed vs self-managed generally.
- D3 Serverless vs servers vs containers: Lambda/Vercel functions vs a long-running process. Cold starts, connection limits, cost curve, background work.
- D4 PaaS vs VM vs cloud: Vercel/Render/Railway/Fly vs a VPS (Hetzner/DO) vs AWS/GCP. The cost curve crossover, lock-in, operational burden.
- D5 Monolith vs services: why monolith first, when to split, what splitting costs.
- D6 Cache or not: when Redis is worth the moving part; alternatives (in-process, CDN, DB-level).
- D7 Which queue: BullMQ vs SQS vs RabbitMQ vs Kafka vs a DB table as a queue.
- D8 Auth: build vs buy; Clerk vs Auth0 vs Supabase Auth vs roll-your-own with a library.
- D9 File storage: S3 vs R2 vs GCS vs Supabase Storage vs Vercel Blob; egress economics.
- D10 Search: Postgres full-text vs Meilisearch/Typesense vs Elasticsearch vs Algolia.
- D11 Vector store: pgvector vs Pinecone vs Qdrant vs Weaviate vs Chroma.
- D12 LLM provider and model: capability vs cost vs latency, routing, fallback, self-hosting (when it's not worth it).
- D13 Observability stack: platform-native vs Sentry + Grafana vs Datadog; cost at scale.
- D14 CDN/WAF: Cloudflare vs platform CDN vs none.
- D15 Region and multi-region: where to put the server relative to users and DB; what multi-region actually costs.
- D16 Email/SMS/payments providers at a glance (Resend/Postmark/SES, Twilio, Stripe) — chosen for reliability and debuggability.
- D17 **Decision record template** (ADR-lite) the learner uses for their own product.

### M12 — Clouds mapped to concepts
- L12.1 One table: compute, containers, serverless, DB, cache, queue, storage, DNS, CDN, secrets, logs, IAM — across AWS, GCP, Azure, plus the PaaS equivalents.
- L12.2 Reading a cloud console without panic: the 6 pages that matter.
- L12.3 IAM mental model shared by all clouds.

### M13 — AI systems in production
- L13.1 Tokens and tokenization: the unit of cost and latency; why context size matters; counting tokens.
- L13.2 Embeddings: vectors as geometry, similarity, dimensions, which model, re-embedding when you change models.
- L13.3 Vector databases and indexes (HNSW at a usable level), metadata filtering, hybrid search.
- L13.4 RAG end to end: ingest → chunk → embed → store → retrieve → rerank → generate. Each step's failure modes (bad chunking, wrong top-k, stale index, retrieval that looks right but isn't).
- L13.5 Context windows, prompt caching, system prompts as config, structured outputs.
- L13.6 Cost and latency engineering: model routing, caching responses, streaming, batching, per-request cost as a metric.
- L13.7 Evals and guardrails: why "it looked fine" isn't a test; golden sets, LLM-as-judge, regression on prompt changes, input/output filtering, prompt injection.
- L13.8 LLM observability: Langfuse / LangSmith / Helicone / OpenTelemetry GenAI; tracing a bad answer back to its retrieval.
- L13.9 Agents and tools: function calling, MCP, long-running agents, failure modes (loops, runaway cost), sandboxing.
- L13.10 RAG vs fine-tuning vs long context: a decision page.
- L13.11 "Why is my AI feature slow / expensive / wrong?" — the AI failure catalogue.

### M14 — Operating a product: incidents
- L14.1 Severity levels, who does what, the first 10 minutes.
- L14.2 Rollback first, debug second. Feature flags as a kill switch.
- L14.3 Runbooks: what they are, the 5 your product needs on day one.
- L14.4 Postmortems: blameless, timeline, contributing causes, action items.
- L14.5 Incident communication: status page, internal updates, customer comms templates.
- L14.6 **Briefing an AI agent on infra work safely:** give context, constraints, and a verification step; never let it run destructive commands unreviewed; how to check what it did (diff, logs, config).
- L14.7 Working with engineers: what to ask, how to tell a real fix from a patch, when to bring in a specialist.

### Reference layer (standalone pages, linked from everywhere)
1. Command cheat sheet (searchable, copyable, grouped by task).
2. HTTP status code reference.
3. Failure catalogue (M8) and AI failure catalogue (M13).
4. Decision library index (M11).
5. Cloud concept mapping table (M12).
6. Glossary (hover definitions site-wide).

---

## 3. Lesson anatomy (every lesson, same sections)

1. **The story** — ~150 words, a real incident this concept explains.
2. **What you already did** — the moment the learner met this concept while following an agent.
3. **The mental model** — one diagram (Mermaid/SVG), one analogy, the fundamental.
4. **The tools** — comparison table of 3–4 implementations, tagged by platform.
5. **Hands-on** — a task. Phase 1: in their own environment or the provided demo repo. Phase 2: live sandbox.
6. **Break-fix** — symptom + evidence (logs/config/metrics as text). Learner identifies cause; explanation follows. Phase 2 makes this live.
7. **Ask your agent** — 3 precise prompts for an AI coding agent **plus how to verify the result**.
8. **Decision / PM checklist** — questions to ask, what good looks like.
9. **Check** — 5-question quiz with explanations.

---

## 4. Phase 1 — Curriculum platform

### Scope
A content-driven learning site. Platform thin, content rich. Everything versioned in git.

### Features
- **Content system:** MDX in-repo, frontmatter-driven nav. Diagrams as Mermaid or SVG. Code blocks copyable.
- **Reader:** module/lesson nav, progress, `overview`/`operator` depth toggle per lesson, inline glossary hover, full-text search, bookmarks, private notes.
- **Reference layer:** the 6 pages above, each with filter/search.
- **Personal map:** simple node/edge editor for the learner's own architecture (M0). Annotatable per module. (Can be deferred; see §7.)
- **Decision records:** learner fills D17 template per decision for their product; stored with their account.
- **Assessment:** quizzes with explanations, module completion, final self-assessment against §0 promise.
- **Auth + persistence:** email/magic-link login. Tables: `users`, `lesson_progress`, `quiz_attempts`, `notes`, `maps`, `decision_records`.
- **Analytics:** drop-off per lesson, quiz miss rate per concept tag. Drives content rewrites.
- **Demo repo:** one small full-stack app (Next.js + Postgres + Redis + a cron + an LLM feature) used by all hands-on tasks. Deliberately contains the anti-patterns from M6.8/M7.6 for later drills.

### Suggested stack
Next.js (App Router) + MDX (Velite or Contentlayer or next-mdx-remote) · Tailwind · Postgres (Supabase or Neon) · Drizzle or Prisma · Auth.js or Supabase Auth · Vercel. Mermaid for diagrams, Pagefind or Postgres FTS for search.
Rationale: it is the learner's own stack, so the platform doubles as a worked example in M3/M5/M6.

### Content frontmatter schema
```yaml
id: m07-l04
module: M7
title: "Locks: when one query blocks everyone"
order: 4
difficulty: 2            # 1–3
depth: both              # overview | operator | both
platforms: [postgres, supabase, neon, rds]
concepts: [locks, transactions, deadlock, blocking]
prerequisites: [m06-l01, m07-l03]
lab: demo-repo           # self | demo-repo | sandbox (Phase 2)
scenario_ids: [sc-lock-wait-01]
estimated_minutes: 25
```

### Repo structure
```
/content
  /modules/M00-map/...mdx
  /modules/M07-concurrency/...mdx
  /decisions/D01-sql-vs-nosql.mdx
  /reference/commands.mdx, status-codes.mdx, failures.mdx, glossary.mdx, cloud-map.mdx
  /scenarios/*.yaml            # Phase 2 definitions, rendered read-only in Phase 1
/app                            # Next.js
/db                             # schema + migrations
/demo-app                       # the teaching application (separate deployable)
/scripts                        # content lint, link check, quiz validation
PLAN.md
```

### Phase 1 acceptance criteria
- All modules and reference pages published; every lesson has all 9 sections.
- Depth toggle, glossary hover, search, progress and quizzes working.
- Demo repo deploys with one command and is referenced by every hands-on task.
- Content lint passes: frontmatter valid, concept tags from a controlled vocabulary, no broken links, every break-fix has a `scenario_id`.

---

## 5. Phase 2 — Simulation layer

### Goal
Put the learner in a broken system with only a symptom, give them a real terminal and a real AI agent, and grade whether they found and fixed the **cause**.

### Core experience
1. Learner picks a scenario ("Checkout returns 502 since 14:00", "Users report duplicate charges", "Nightly report hasn't arrived for 3 days", "AI assistant started answering from last month's docs").
2. An isolated environment is provisioned with the demo app in a deliberately broken state: config, data, code, infra or a combination.
3. Learner gets a browser terminal, log viewer, metrics panel, DB console, and the app URL.
4. **An AI coding agent is available in the environment** (same agent experience they use day to day). The agent can read and edit code and run commands, like Claude Code. The learner must direct it, question it, and verify it.
5. Learner submits when they believe it's fixed. Grader checks health probes, data invariants, and whether the root cause was addressed vs papered over.

### The agent in the loop (key design)
- The agent is real, not scripted, but **scenarios set the agent's context and sometimes handicap it**: wrong assumptions in its system context, no access to logs, a plausible-but-wrong first hypothesis, or a tendency to patch symptoms (e.g. add a retry instead of fixing the lock). This mirrors reality.
- Learner wins by: giving the agent the right evidence, rejecting bad fixes, asking for verification, and reading what it changed.
- Difficulty tiers: *guided* (agent helpful), *realistic* (agent average, learner must steer), *hard* (agent confidently wrong at least once; learner must catch it).
- A separate **tutor agent** provides a hint ladder (nudge → narrow the layer → point at evidence → reveal) and never touches the environment. Hints cost score.

### Scenario families (one per module, examples)
- M1: wrong env var in prod; process crash-looping; disk full from logs.
- M2: bad deploy, rollback needed; migration ran but code didn't.
- M4: leaked key, rotate it without downtime; provider quota exhausted.
- M5: expired cert; CORS blocking the frontend; proxy 504 from slow upstream; DNS pointing at old server.
- M6: connection pool exhausted; missing index after data growth; cache serving stale data.
- M7: **double-booking race**; **deadlock between two jobs**; **single JSON cell lost updates**; cron ran twice and double-sent emails; cron silently stopped; batch backfill locking the live table; timezone shift at DST.
- M8: pure diagnosis drills — given logs across 4 services, find the origin.
- M9: traffic spike simulation, decide scale vs cache vs queue, watch cost meter.
- M10: bot flood on signup; IDOR leaking another user's data; malicious dependency; secret in client bundle.
- M13: RAG answering from stale index; retrieval returning wrong chunks; runaway token cost loop; prompt injection via a document.
- M14: full incident — detect, mitigate, roll back, fix, write the postmortem.
- Capstone: take the demo app from laptop to production yourself — containerise, deploy with CI/CD, secrets, HTTPS, logging, Redis, cron, RAG — then survive a scripted 3-incident day.

### Scenario definition (YAML)
```yaml
id: sc-single-cell-lost-updates-01
module: M7
lesson: m07-l06
title: "Collaborative notes are losing edits"
difficulty: realistic
symptom: "Users say their edits disappear when two people edit the same note."
environment:
  base: demo-app@v1.4
  breakage:
    - type: data-model
      apply: scripts/break/notes-json-blob.sql     # whole note array in one jsonb cell
    - type: traffic
      apply: scripts/load/concurrent-editors.js    # 5 simulated users writing
agent:
  context: "You previously implemented notes as a jsonb array for speed."
  bias: "suggests retry logic before considering the data model"
  tools: [read, edit, shell]
  denied: [db-console]
evidence:
  logs: true
  metrics: [db.lock_wait_ms, http.5xx]
  db_console: true
grading:
  probes:
    - concurrent-edit-invariant   # no lost writes under 5 writers
    - app-health
  root_cause_markers:
    - schema: notes split into rows OR versioned writes with CAS
  symptom_only_markers:
    - retry-wrapper-added-without-schema-change
hints:
  - "Where do two users' writes land?"
  - "Look at lock waits and the size of the row."
  - "Read-modify-write on one cell: what happens between read and write?"
  - "Reveal: split the array into rows, or add a version column and compare-and-set."
scoring:
  time_to_diagnose: true
  hints_used: true
  root_cause: 60
  stability: 20
  agent_verification: 20          # did learner check the agent's diff/logs before submitting
```

### Phase 2 architecture
- **Sandbox runtime:** per-learner ephemeral microVMs/containers (Firecracker, gVisor, or a provider like E2B / Daytona / Modal / Fly Machines). Hard time and cost limits. Snapshots for fast provisioning.
- **Browser UI:** xterm.js terminal, log viewer, metrics panel (Grafana embed or custom), DB console, file viewer, agent chat, tutor chat, submit button.
- **Scenario runner:** reads YAML → provisions base snapshot → applies breakage → starts traffic → exposes evidence → runs probes on submit → scores.
- **Agent harness:** Claude (or configurable) with tools (read/edit/shell) scoped to the sandbox, plus scenario-injected context/bias. All agent actions logged for grading "agent_verification".
- **Tutor:** separate model call with scenario hints and the learner's transcript; no environment access.
- **Grading:** probes as scripts in the sandbox; marker detection via diff analysis + probe results; manual review queue for ambiguous submissions.
- **Safety:** sandboxes have no egress except allow-listed LLM API; secrets are fake; destructive-command confirmation inside the terminal for learning purposes.
- **Progress model extension:** `scenario_attempts` (start, submit, score breakdown, hints, agent transcript, diff).

### Phase 2 acceptance criteria
- Provision-to-terminal under 20 seconds from snapshot.
- 30+ scenarios across all modules; 3 difficulty tiers each for the core 10.
- Grader distinguishes root-cause fixes from symptom patches on all M7 scenarios.
- Capstone completable end to end.

### Phase 2 hooks to build in during Phase 1
- Every break-fix section carries a `scenario_id` and concept tags.
- `lab` frontmatter field exists from day one.
- `/content/scenarios/*.yaml` exists and is rendered read-only in Phase 1.
- Progress model stores attempts with timestamps, not just completion.
- Demo app contains the planted anti-patterns and has scripted breakage + load scripts under `/demo-app/scripts/break` and `/demo-app/scripts/load`.

---

## 6. Build order

### Phase 1
1. Scaffold Next.js + MDX pipeline + DB + auth. Ship **one complete lesson** (M8.6 the debugging method) as the template, with all 9 sections, depth toggle, quiz.
2. Reference layer: command cheat sheet, status codes, glossary, failure catalogue, cloud map, decision index. Fastest value; everything links here.
3. Demo app (with planted anti-patterns and break/load scripts) deployable in one command.
4. Content wave 1 — MVP for the persona: **M0, M1, M8**.
5. Content wave 2: **M7, M6, M4, M5, M2**.
6. Content wave 3: **M11 (decision library), M9, M10, M13, M14**.
7. Content wave 4: **M3, M12**.
8. Personal map editor and decision records (can run in parallel from step 4 if capacity allows).
9. Analytics, content lint, polish, launch.

### Phase 2
1. Sandbox runtime spike: provision demo app snapshot, browser terminal, teardown. Measure time and cost.
2. Scenario runner + grading for 3 M7 scenarios (race, deadlock, single-cell). These are the hardest to grade; derisk first.
3. Agent harness with scenario-injected context and action logging.
4. Tutor + hint ladder + scoring.
5. Scenario authoring across modules (target 30+).
6. Capstone.
7. Review queue, cost controls, launch.

---

## 7. Open decisions
- Product name and voice (recommend second person, conversational, opinionated, no hedging).
- Free vs paid from day one (affects auth/billing scope).
- Demo stack: recommend one opinionated stack (Next.js + Postgres on Supabase/Neon + Redis on Upstash + Cloudflare + Vercel for frontend, one small VPS for the worker/cron so M1/M3 have a real server) with "on other platforms" notes.
- Personal map editor in MVP or deferred.
- Phase 2 sandbox provider: build on Firecracker/Fly Machines vs buy (E2B/Daytona/Modal). Decide after the spike.
- Which agent model(s) the Phase 2 harness supports; whether learners can bring their own API key.

---

## 8. Controlled vocabularies (for content lint)
- `platforms`: vercel, render, railway, fly, supabase, neon, rds, aws, gcp, azure, cloudflare, docker, kubernetes, postgres, mysql, mongodb, redis, upstash, s3, r2, github-actions, nginx, caddy, sentry, datadog, grafana, kibana, langfuse, openai, anthropic.
- `concepts`: maintained in `/content/_vocab/concepts.yaml`; one entry per fundamental taught; every lesson, failure and scenario tags from this list. This is what links lessons ↔ failures ↔ decisions ↔ scenarios.
