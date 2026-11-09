import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { rows } = await db.query(
    `SELECT b.id, b.room_id, r.name AS room_name, b.customer_name,
            b.date::text, b.start_hour, b.end_hour,
            jsonb_array_length(b.notes) AS note_count
       FROM bookings b
       LEFT JOIN rooms r ON r.id = b.room_id
      ORDER BY b.date, b.start_hour
      LIMIT 200`
  );
  return NextResponse.json({ bookings: rows });
}

// Simulates the external fraud/payment pre-check every real booking flow has.
function fraudCheck(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 150));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { room_id, customer_name, date, start_hour, end_hour } = body ?? {};

  if (!room_id || !customer_name || !date || start_hour == null || end_hour == null) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (end_hour <= start_hour || start_hour < 7 || end_hour > 23) {
    return NextResponse.json({ error: "invalid hours" }, { status: 400 });
  }

  // Availability check: is any existing booking overlapping this slot?
  const { rows: clashes } = await db.query(
    `SELECT id FROM bookings
      WHERE room_id = $1 AND date = $2
        AND start_hour < $4 AND end_hour > $3`,
    [room_id, date, start_hour, end_hour]
  );
  if (clashes.length > 0) {
    return NextResponse.json({ error: "slot already booked" }, { status: 409 });
  }

  await fraudCheck();

  const { rows } = await db.query(
    `INSERT INTO bookings (room_id, customer_name, date, start_hour, end_hour, meta)
     VALUES ($1, $2, $3, $4, $5, '{"source":"web"}')
     RETURNING id`,
    [room_id, customer_name, date, start_hour, end_hour]
  );

  await db.query(`INSERT INTO events (type, payload) VALUES ('booking.created', $1)`, [
    JSON.stringify({ booking_id: rows[0].id, via: "web" }),
  ]);

  console.log(`booking.created id=${rows[0].id} room=${room_id} ${date} ${start_hour}-${end_hour}`);
  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}
