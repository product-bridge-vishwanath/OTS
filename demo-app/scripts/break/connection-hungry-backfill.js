// Breakage (M6.2 / scenario sc-debug-method-01): a "backfill job" that greedily
// opens database connections and holds them inside long transactions —
// starving the app's pool. Web requests start timing out intermittently.
//   node scripts/break/connection-hungry-backfill.js [connections] [minutes]
// Stop with Ctrl-C to release every connection.
const { Client } = require("pg");

const DB = process.env.DATABASE_URL ?? "postgres://ots:ots@localhost:5432/demo";
const CONNECTIONS = Number(process.argv[2] ?? 90);
const MINUTES = Number(process.argv[3] ?? 10);

async function hold(i) {
  const client = new Client({ connectionString: DB });
  await client.connect();
  await client.query("BEGIN");
  // Pretend to re-process one invoice, slowly, without committing.
  await client.query(
    `UPDATE events SET payload = payload WHERE id = (SELECT min(id) FROM events)`
  );
  console.log(`[backfill] worker ${i} holding a connection + open transaction`);
  await client.query(`SELECT pg_sleep($1)`, [MINUTES * 60]);
  await client.query("COMMIT");
  await client.end();
}

async function main() {
  console.log(
    `[backfill] monthly-invoice-backfill starting: ${CONNECTIONS} workers, ~${MINUTES} min each`
  );
  console.log(`[backfill] watch the app: requests will start failing as the pool starves`);
  const workers = [];
  for (let i = 1; i <= CONNECTIONS; i++) {
    workers.push(hold(i).catch((e) => console.error(`[backfill] worker ${i}: ${e.message}`)));
    await new Promise((r) => setTimeout(r, 400)); // steady climb, like a real job
  }
  await Promise.all(workers);
  console.log("[backfill] done");
}

main();
