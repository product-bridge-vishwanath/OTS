"use client";

import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/lib/content";
import { SearchBox } from "./SearchBox";

export function GlossaryExplorer({
  terms,
}: {
  terms: Record<string, GlossaryTerm>;
}) {
  const [q, setQ] = useState("");

  const sorted = useMemo(
    () =>
      Object.entries(terms).sort(([, a], [, b]) =>
        a.name.localeCompare(b.name)
      ),
    [terms]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return sorted;
    return sorted.filter(([k, t]) =>
      [k, t.name, t.def].join(" ").toLowerCase().includes(needle)
    );
  }, [sorted, q]);

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-1 bg-bg px-1 py-3">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder={`Search ${sorted.length} terms…`}
        />
      </div>
      <dl className="mt-4 space-y-4">
        {filtered.map(([k, t]) => (
          <div key={k} className="rounded-xl border border-border bg-bg-raised p-4">
            <dt className="font-semibold">{t.name}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-fg-muted">
              {t.def}
            </dd>
          </div>
        ))}
      </dl>
      {filtered.length === 0 && (
        <p className="mt-8 text-fg-faint">No term matches “{q}”.</p>
      )}
    </div>
  );
}
