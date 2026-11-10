// Background traffic generator: a steady stream of browsing and bookings, so
// metrics and logs have signal during drills. Runs until Ctrl-C.
//   node scripts/load/steady-browse-and-order.js
const APP = process.env.APP_URL ?? "http://localhost:3001";
const INTERVAL_MS = Number(process.env.INTERVAL_MS ?? 700);

let n = 0;
let errors = 0;

async function tick() {
  n++;
  try {
    const roll = Math.random();
    if (roll < 0.6) {
      await fetch(`${APP}/api/bookings`);
    } else if (roll < 0.85) {
      await fetch(`${APP}/api/rooms`);
    } else {
      const days = 1 + Math.floor(Math.random() * 30);
      const date = new Date(Date.now() + 86400000 * days).toISOString().slice(0, 10);
      const start = 7 + Math.floor(Math.random() * 14);
      await fetch(`${APP}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: 1 + Math.floor(Math.random() * 4),
          customer_name: `walk-in-${n}`,
          date,
          start_hour: start,
          end_hour: start + 1 + Math.floor(Math.random() * 2),
        }),
      });
    }
  } catch {
    errors++;
  }
  if (n % 50 === 0) console.log(`${n} requests sent, ${errors} network errors`);
}

console.log(`steady traffic against ${APP} every ${INTERVAL_MS}ms — Ctrl-C to stop`);
setInterval(tick, INTERVAL_MS);
