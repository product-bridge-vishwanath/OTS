import Link from "next/link";
import { getLessonsForModule, getModules } from "@/lib/content";

export default function Home() {
  const modules = getModules();

  return (
    <div>
      <section className="py-10">
        <p className="mb-3 text-sm font-semibold tracking-wider text-accent uppercase">
          For people who ship with AI
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          AI writes the code.
          <br />
          You still own the system.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
          You&apos;ve shipped real products with AI coding agents. Then
          production broke, and you couldn&apos;t tell where or why — so you
          pasted the error back into the agent and hoped. This program teaches
          you what&apos;s actually happening under the hood: how to diagnose
          failures yourself, direct an agent with precision, and verify what it
          did.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/lessons/m08-l06"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Start with the debugging method →
          </Link>
          <Link
            href="/#curriculum"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-fg-muted hover:text-fg"
          >
            Browse the curriculum
          </Link>
        </div>
      </section>

      <section id="curriculum" className="scroll-mt-20 pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Curriculum</h2>
        <p className="mt-1 text-fg-muted">
          15 modules. Concept first, tools second. Every lesson starts from a
          real failure.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {modules.map((m) => {
            const lessons = getLessonsForModule(m.id);
            const live = lessons.length > 0;
            return (
              <Link
                key={m.id}
                href={`/modules/${m.id.toLowerCase()}`}
                className={`rounded-xl border border-border bg-bg-raised p-5 transition-colors hover:border-accent ${
                  live ? "" : "opacity-60"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs font-semibold text-accent">
                    {m.id}
                  </span>
                  <span className="text-xs text-fg-faint">
                    {live
                      ? `${lessons.length} lesson${lessons.length === 1 ? "" : "s"}`
                      : "in progress"}
                  </span>
                </div>
                <h3 className="mt-1.5 font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-fg-muted">{m.tagline}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
