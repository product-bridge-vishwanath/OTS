"use client";

import { useMemo, useState } from "react";
import type { FailureEntry } from "@/lib/content";
import { FilterPills, SearchBox } from "./SearchBox";

export function FailuresExplorer({ failures }: { failures: FailureEntry[] }) {
  const [q, setQ] = useState("");
  const [mod, setMod] = useState<string | null>(null);

  const modules = Array.from(new Set(failures.map((f) => f.module))).sort(
    (a, b) => Number(a.slice(1)) - Number(b.slice(1))
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return failures.filter(
      (f) =>
        (!mod || f.module === mod) &&
        (!needle ||
          [
            f.title,
            f.symptom,
            ...f.causes,
            ...f.confirm,
            ...f.fix,
            ...f.concepts,
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle))
    );
  }, [failures, q, mod]);

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-1 space-y-3 bg-bg px-1 py-3">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder={`Search ${failures.length} failures by symptom — try "slow", "intermittent", "cron"…`}
        />
        <FilterPills options={modules} active={mod} onChange={setMod} />
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((f) => (
          <details
            key={f.id}
            className="group overflow-hidden rounded-xl border border-border bg-bg-raised"
          >
            <summary className="cursor-pointer p-4 select-none">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{f.title}</span>
                <span className="rounded-full bg-bg-inset px-2 py-0.5 font-mono text-xs text-fg-muted">
                  {f.module}
                </span>
                <span className="ml-auto text-fg-faint transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </div>
              <p className="mt-1 text-sm text-fg-muted">{f.symptom}</p>
            </summary>
            <div className="grid gap-4 border-t border-border p-4 text-sm sm:grid-cols-3">
              <div>
                <h3 className="mb-1.5 text-xs font-semibold tracking-wider text-bad uppercase">
                  Likely causes
                </h3>
                <ul className="list-disc space-y-1 pl-4 text-fg-muted">
                  {f.causes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-1.5 text-xs font-semibold tracking-wider text-info uppercase">
                  How to confirm
                </h3>
                <ul className="list-disc space-y-1 pl-4 text-fg-muted [&_code]:font-mono [&_code]:text-xs">
                  {f.confirm.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-1.5 text-xs font-semibold tracking-wider text-good uppercase">
                  Fix
                </h3>
                <ul className="list-disc space-y-1 pl-4 text-fg-muted">
                  {f.fix.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-8 text-fg-faint">No failure matches “{q}”.</p>
      )}
    </div>
  );
}
