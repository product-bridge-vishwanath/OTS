import Link from "next/link";
import { getDecisions } from "@/lib/content";

export const metadata = { title: "Decision library · Own the System" };

export default function DecisionsPage() {
  const decisions = getDecisions();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/reference" className="text-sm text-accent">
        ← Reference
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Decision library
      </h1>
      <p className="mt-2 text-fg-muted">
        Every place a builder has to choose, with an honest default. Each entry
        becomes a full decision page (options → cost → trade-offs → when to
        switch → migration cost) in module M11; until then, the default is the
        position to beat.
      </p>
      <div className="mt-8 space-y-3">
        {decisions.map((d) => (
          <div
            key={d.id}
            className="rounded-xl border border-border bg-bg-raised p-4"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-accent">
                {d.id}
              </span>
              <h2 className="font-semibold">{d.title}</h2>
              <span className="ml-auto rounded-full bg-bg-inset px-2 py-0.5 text-xs text-fg-faint">
                full page in M11
              </span>
            </div>
            <p className="mt-1 text-sm text-fg-muted">
              <span className="font-medium text-fg">{d.question}</span>{" "}
              <span className="text-fg-faint">({d.options})</span>
            </p>
            <p className="mt-2 border-l-2 border-accent pl-3 text-sm">
              <span className="font-semibold text-accent">Default: </span>
              {d.default}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
