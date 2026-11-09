// Riverside Studios worker: generates the "daily" revenue report on a schedule.
// For demo visibility it runs every REPORT_EVERY_MINUTES (default 10) instead
// of nightly. Run with: node worker/cron.js   (or the compose `worker` service)
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgres://ots:ots@localhost:5432/demo",
  max: 3,
});

const EVERY_MS = Number(process.env.REPORT_EVERY_MINUTES ?? 10) * 60 * 1000;

async function generateReport() {
  const started = new Date();
  console.log(`[worker] report run starting at ${started.toISOString()}`);

  const { rows } = await pool.query(
    `SELECT count(*)::int AS bookings,
            coalesce(sum((b.end_hour - b.start_hour) * r.hourly_rate), 0)::numeric(10,2) AS revenue
       FROM bookings b
       LEFT JOIN rooms r ON r.id = b.room_id
      WHERE b.date = CURRENT_DATE`
  );

  const body = `Bookings today: ${rows[0].bookings}. Projected revenue: $${rows[0].revenue}.`;

  await pool.query(
    `INSERT INTO reports (day, body) VALUES (CURRENT_DATE, $1)`,
    [body]
  );

  console.log(`[worker] report written: ${body}`);
}

async function loop() {
  console.log(
    `[worker] started, generating a report every ${EVERY_MS / 60000} minute(s)`
  );
  // First run shortly after boot so there's something to look at.
  setTimeout(run, 10_000);
  setInterval(run, EVERY_MS);
}

async function run() {
  try {
    await generateReport();
  } catch (err) {
    console.error(`[worker] report failed: ${err.message}`);
  }
}

loop();
