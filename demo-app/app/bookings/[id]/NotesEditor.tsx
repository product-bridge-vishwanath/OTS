"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NotesEditor({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/bookings/${bookingId}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: f.get("author"), text: f.get("text") }),
    });
    setBusy(false);
    if (res.ok) {
      form.reset();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setErr(data.error ?? `error ${res.status}`);
    }
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 16 }}>
      <div className="row" style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input name="author" placeholder="Your name" required />
      </div>
      <textarea name="text" rows={2} placeholder="Add a note for the studio team…" required />
      <div style={{ marginTop: 8 }}>
        <button disabled={busy}>{busy ? "Saving…" : "Add note"}</button>
        {err && <span className="msg-err" style={{ marginLeft: 8 }}>{err}</span>}
      </div>
    </form>
  );
}
