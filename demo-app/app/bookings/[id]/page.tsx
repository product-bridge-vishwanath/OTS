import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { NotesEditor } from "./NotesEditor";

export const dynamic = "force-dynamic";

type Note = { author: string; text: string; at: string };

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { rows } = await db.query(
    `SELECT b.id, r.name AS room, b.customer_name, b.date::text, b.start_hour, b.end_hour, b.notes
       FROM bookings b LEFT JOIN rooms r ON r.id = b.room_id
      WHERE b.id = $1`,
    [id]
  );
  if (rows.length === 0) notFound();
  const b = rows[0];
  const notes: Note[] = b.notes ?? [];

  return (
    <div>
      <p>
        <Link href="/">← All bookings</Link>
      </p>
      <h1>
        {b.room}: {b.customer_name}
      </h1>
      <p className="muted">
        {b.date}, {b.start_hour}:00–{b.end_hour}:00 · booking #{b.id}
      </p>

      <h2>Shared notes</h2>
      <div className="card">
        {notes.length === 0 && <p className="muted">No notes yet.</p>}
        {notes.map((n, i) => (
          <div className="note" key={i}>
            <div>{n.text}</div>
            <div className="meta">
              {n.author} · {new Date(n.at).toLocaleString()}
            </div>
          </div>
        ))}
        <NotesEditor bookingId={b.id} />
      </div>
    </div>
  );
}
