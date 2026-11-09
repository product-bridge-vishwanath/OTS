"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookingForm({
  rooms,
}: {
  rooms: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_id: Number(f.get("room_id")),
        customer_name: f.get("customer_name"),
        date: f.get("date"),
        start_hour: Number(f.get("start_hour")),
        end_hour: Number(f.get("end_hour")),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setMsg({ ok: true, text: `Booked! Confirmation #${data.id}` });
      router.refresh();
    } else {
      setMsg({ ok: false, text: data.error ?? `error ${res.status}` });
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form className="row" onSubmit={submit}>
      <select name="room_id" required>
        {rooms.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
      <input name="customer_name" placeholder="Your name" required />
      <input name="date" type="date" defaultValue={today} required />
      <input name="start_hour" type="number" min={7} max={22} defaultValue={10} required style={{ width: 70 }} />
      <span className="muted">to</span>
      <input name="end_hour" type="number" min={8} max={23} defaultValue={12} required style={{ width: 70 }} />
      <button disabled={busy}>{busy ? "Booking…" : "Book"}</button>
      {msg && <span className={msg.ok ? "msg-ok" : "msg-err"}>{msg.text}</span>}
    </form>
  );
}
