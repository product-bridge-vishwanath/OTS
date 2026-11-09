"use client";

import { useMemo, useState } from "react";
import type { CloudRow } from "@/lib/content";
import { SearchBox } from "./SearchBox";

export function CloudMapExplorer({ rows }: { rows: CloudRow[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) =>
      [r.concept, r.what, r.aws, r.gcp, r.azure, r.paas]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [rows, q]);

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-1 bg-bg px-1 py-3">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder='Search — try "S3", "queue", "Lambda", "cron"…'
        />
      </div>
      <div className="mt-4 space-y-3">
        {filtered.map((r) => (
          <div
            key={r.concept}
            className="rounded-xl border border-border bg-bg-raised p-4"
          >
            <h2 className="font-semibold">{r.concept}</h2>
            <p className="mt-0.5 text-sm text-fg-muted">{r.what}</p>
            <div className="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["AWS", r.aws],
                  ["GCP", r.gcp],
                  ["Azure", r.azure],
                  ["PaaS / indie", r.paas],
                ] as const
              ).map(([label, val]) => (
                <div key={label} className="rounded-lg bg-bg-inset px-3 py-2">
                  <div className="text-[10px] font-semibold tracking-wider text-fg-faint uppercase">
                    {label}
                  </div>
                  <div className="mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-8 text-fg-faint">No concept matches “{q}”.</p>
      )}
    </div>
  );
}
