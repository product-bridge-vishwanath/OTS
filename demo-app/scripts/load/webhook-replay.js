// Webhook replay drill (M7.7): the payment provider delivers the SAME event
// twice (at-least-once delivery — this is normal, not a bug on their side).
//   node scripts/load/webhook-replay.js
const APP = process.env.APP_URL ?? "http://localhost:3001";

async function main() {
  const event = {
    event_id: `evt_${Date.now()}`,
    booking_id: 1,
    amount: 240.0,
  };

  console.log(`delivering payment webhook ${event.event_id} twice (provider retry)…`);
  const r1 = await fetch(`${APP}/api/webhooks/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  const r2 = await fetch(`${APP}/api/webhooks/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  console.log(`delivery 1: ${r1.status}, delivery 2: ${r2.status}`);
  console.log(
    "Now check: SELECT provider_event_id, count(*) FROM payments GROUP BY 1 HAVING count(*) > 1;"
  );
  console.log("One event, how many payment rows? If 2 — the customer was double-charged.");
}

main();
