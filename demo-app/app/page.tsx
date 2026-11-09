import Link from "next/link";
import { db } from "@/lib/db";
import { BookingForm } from "./BookingForm";
import { AssistantBox } from "./AssistantBox";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [rooms, bookings] = await Promise.all([
    db.query(`SELECT id, name, hourly_rate FROM rooms ORDER BY id`),
    db.query(
      `SELECT b.id, r.name AS room, b.customer_name, b.date::text, b.start_hour, b.end_hour,
              jsonb_array_length(b.notes) AS note_count
         FROM bookings b LEFT JOIN rooms r ON r.id = b.room_id
        WHERE b.date >= CURRENT_DATE
        ORDER BY b.date, b.start_hour
        LIMIT 50`
    ),
  ]);

  return (
    <div>
      <h1>Book a studio</h1>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {rooms.rows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>${Number(r.hourly_rate).toFixed(0)}/hr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <BookingForm
          rooms={rooms.rows.map((r) => ({ id: r.id, name: r.name }))}
        />
      </div>

      <h2>Upcoming bookings</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Room</th>
              <th>Customer</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {bookings.rows.map((b) => (
              <tr key={b.id}>
                <td>{b.date}</td>
                <td>
                  {b.start_hour}:00–{b.end_hour}:00
                </td>
                <td>{b.room}</td>
                <td>
                  <Link href={`/bookings/${b.id}`}>{b.customer_name}</Link>
                </td>
                <td>{b.note_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Front-desk assistant</h2>
      <div className="card">
        <AssistantBox />
      </div>
    </div>
  );
}
