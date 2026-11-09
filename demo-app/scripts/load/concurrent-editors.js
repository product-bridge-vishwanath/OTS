// Lost-updates drill (M7.6, the single-cell anti-pattern): 5 people add notes
// to the SAME booking at the same time, 4 rounds each = 20 notes sent.
// Count how many survive.
//   node scripts/load/concurrent-editors.js [bookingId]
const APP = process.env.APP_URL ?? "http://localhost:3000";
const BOOKING = process.argv[2] ?? "1";

async function addNote(author, round) {
  const res = await fetch(`${APP}/api/bookings/${BOOKING}/notes`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text: `note from ${author}, round ${round}` }),
  });
  return res.ok;
}

async function main() {
  const before = await fetch(`${APP}/api/bookings/${BOOKING}/notes`).then((r) => r.json());
  const baseline = (before.notes ?? []).length;

  const editors = ["amara", "ben", "chloe", "dev", "esa"];
  const ROUNDS = 4;
  console.log(`5 editors × ${ROUNDS} rounds writing to booking #${BOOKING} simultaneously…`);

  let accepted = 0;
  for (let round = 1; round <= ROUNDS; round++) {
    const oks = await Promise.all(editors.map((e) => addNote(e, round)));
    accepted += oks.filter(Boolean).length;
  }

  const after = await fetch(`${APP}/api/bookings/${BOOKING}/notes`).then((r) => r.json());
  const survived = (after.notes ?? []).length - baseline;

  console.log(`notes accepted by the API: ${accepted}`);
  console.log(`notes actually in the database: ${survived}`);
  console.log(
    survived === accepted
      ? "✓ no lost updates"
      : `✗ ${accepted - survived} notes VANISHED. The API said 200; the data is gone. Why?`
  );
}

main();
