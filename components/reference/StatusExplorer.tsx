"use client";

import { useMemo, useState } from "react";
import type { StatusFamily } from "@/lib/content";
import { FilterPills, SearchBox } from "./SearchBox";

export function StatusExplorer({ families }: { families: StatusFamily[] }) {
  const [q, setQ] = useState("");
  const [family, setFamily] = useState<string | null>(null);

  const familyNames = families.map((f) => f.family.split(" ")[0]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return families
      .filter((f) => !family || f.family.startsWith(family))
      .map((f) => ({
        ...f,
        codes: f.codes.filter(
          (c) =>
            !needle ||
            [String(c.code), c.name, c.means, c.layer, ...c.causes]
              .join(" ")
              .toLowerCase()
              .includes(needle)
        ),
      }))
      .filter((f) => f.codes.length > 0);
  }, [families, q, family]);

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-1 space-y-3 bg-bg px-1 py-3">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder='Search codes — try "502", "timeout", "redirect"…'
        />
        <FilterPills options={familyNames} active={family} onChange={setFamily} />
      </div>

      {filtered.map((f) => (
        <section key={f.family} className="mt-8">
          <h2 className="text-lg font-bold tracking-tight">{f.family}</h2>
          <p className="mt-1 text-sm text-fg-muted">{f.note}</p>
          <div className="mt-4 space-y-3">
            {f.codes.map((c) => (
              <div
                key={c.code}
                className="rounded-xl border border-border bg-bg-raised p-4"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-lg font-bold text-accent">
                    {c.code}
                  </span>
                  <span className="font-semibold">{c.name}</span>
                  {c.layer && c.layer !== "—" && (
                    <span className="rounded-full bg-bg-inset px-2 py-0.5 text-xs text-fg-muted">
                      suspect: {c.layer}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm">{c.means}</p>
                {c.causes.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-muted">
                    {c.causes.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                )}
                {c.confirm && (
                  <p className="mt-2 text-sm">
                    <span className="font-semibold text-good">Confirm: </span>
                    <span className="font-mono text-xs">{c.confirm}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 && (
        <p className="mt-8 text-fg-faint">No status code matches “{q}”.</p>
      )}
    </div>
  );
}
