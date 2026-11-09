// Double-booking drill (M7.2): 15 customers try to book the SAME slot at the
// same moment. A correct system lets exactly one win.
//   node scripts/load/booking-rush.js
const APP = process.env.APP_URL ?? "http://localhost:3000";

async function main() {
  const date = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);
  const slot = { room_id: 1, date, start_hour: 19, end_hour: 21 };
  console.log(`15 concurrent booking attempts for room 1 on ${date}, 19:00–21:00…`);

  const results = await Promise.all(
    Array.from({ length: 15 }, (_, i) =>
      fetch(`${APP}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...slot, customer_name: `rush-customer-${i + 1}` }),
      }).then(
        (r) => r.status,
        () => "ERR"
      )
    )
  );

  const created = results.filter((s) => s === 201).length;
  const rejected = results.filter((s) => s === 409).length;
  console.log(`statuses: ${results.join(", ")}`);
  console.log(`created: ${created}, rejected as taken: ${rejected}`);
  console.log(
    created === 1
      ? "✓ exactly one booking won — the system is safe"
      : `✗ ${created} bookings exist for ONE slot — that's a double booking. Check the bookings table.`
  );
}

main();
