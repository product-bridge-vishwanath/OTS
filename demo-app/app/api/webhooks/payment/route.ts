import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Receives payment confirmations from the (simulated) payment provider.
// Providers deliver at-least-once: the same event can arrive more than once.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { event_id, booking_id, amount } = body ?? {};
  if (!event_id || !booking_id || amount == null) {
    return NextResponse.json({ error: "event_id, booking_id, amount required" }, { status: 400 });
  }

  await db.query(
    `INSERT INTO payments (booking_id, amount, provider_event_id)
     VALUES ($1, $2, $3)`,
    [booking_id, amount, event_id]
  );

  await db.query(`INSERT INTO events (type, payload) VALUES ('payment.received', $1)`, [
    JSON.stringify({ event_id, booking_id, amount }),
  ]);

  console.log(`payment.received event=${event_id} booking=${booking_id} amount=${amount}`);
  return NextResponse.json({ ok: true });
}
