"use client";

import { useState } from "react";

export function AssistantBox() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function ask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const question = new FormData(form).get("question");
    setBusy(true);
    setAnswer(null);
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setAnswer(data.answer ?? data.error ?? `error ${res.status}`);
  }

  return (
    <div>
      <form className="row" onSubmit={ask}>
        <input
          name="question"
          placeholder='Try "Is Studio A free tomorrow afternoon?"'
          required
          style={{ flex: 1, minWidth: 260 }}
        />
        <button disabled={busy}>{busy ? "Thinking…" : "Ask"}</button>
      </form>
      {answer && <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>}
    </div>
  );
}
