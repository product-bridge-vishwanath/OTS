import { Pool } from "pg";

// One shared pool per process. POOL_MAX is deliberately configurable so the
// connection-exhaustion drill (scripts/break/connection-hungry-backfill.js)
// can starve it against Postgres's max_connections.
const globalForDb = globalThis as unknown as { pgPool?: Pool };

export const db =
  globalForDb.pgPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ?? "postgres://ots:ots@localhost:5432/demo",
    max: Number(process.env.POOL_MAX ?? 10),
    // 5s instead of the default 0 (wait forever): a starved pool should
    // produce a readable error, not an infinite hang.
    connectionTimeoutMillis: 5_000,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = db;
