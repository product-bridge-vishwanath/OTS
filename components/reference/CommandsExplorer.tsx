"use client";

import { useMemo, useState } from "react";
import type { CommandGroup } from "@/lib/content";
import { SearchBox } from "./SearchBox";

function CopyableCmd({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      title="Copy"
      className="cursor-pointer rounded-md bg-code-bg px-2.5 py-1 text-left font-mono text-sm text-code-fg"
    >
      {text}
      <span className="ml-2 text-xs text-fg-faint">{copied ? "✓" : "⧉"}</span>
    </button>
  );
}

export function CommandsExplorer({ groups }: { groups: CommandGroup[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return groups;
    return groups
      .map((g) => ({
        ...g,
        commands: g.commands.filter((c) =>
          [c.cmd, c.does, c.example, c.note ?? "", g.title]
            .join(" ")
            .toLowerCase()
            .includes(needle)
        ),
      }))
      .filter((g) => g.commands.length > 0);
  }, [groups, q]);

  const total = groups.reduce((n, g) => n + g.commands.length, 0);
  const shown = filtered.reduce((n, g) => n + g.commands.length, 0);

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-1 bg-bg px-1 py-3">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder={`Search ${total} commands — try "port", "logs", "memory"…`}
        />
      </div>
      {q && (
        <p className="mb-2 text-sm text-fg-faint">
          {shown} of {total} commands
        </p>
      )}
      {filtered.map((g) => (
        <section key={g.title} className="mt-8">
          <h2 className="text-lg font-bold tracking-tight">{g.title}</h2>
          <div className="mt-3 space-y-3">
            {g.commands.map((c) => (
              <div
                key={c.cmd}
                className="rounded-xl border border-border bg-bg-raised p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold">
                    {c.cmd}
                  </span>
                  <CopyableCmd text={c.example} />
                </div>
                <p className="mt-2 text-sm">{c.does}</p>
                {c.note && (
                  <p className="mt-1.5 border-l-2 border-accent pl-3 text-sm text-fg-muted">
                    {c.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 && (
        <p className="mt-8 text-fg-faint">No command matches “{q}”.</p>
      )}
    </div>
  );
}
