import { getScenarios } from "@/lib/content";

export const metadata = { title: "Scenarios · Own the System" };

export default function ScenariosPage() {
  const scenarios = getScenarios();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">Scenarios</h1>
      <p className="mt-2 text-fg-muted">
        Phase 2 puts you inside a broken system with a real terminal and a real
        AI agent, and grades whether you fixed the <em>cause</em> or papered
        over the symptom. The scenario definitions are written alongside the
        lessons — here they are, read-only, until the simulation layer ships.
      </p>

      {scenarios.length === 0 ? (
        <p className="mt-8 text-fg-faint">No scenarios defined yet.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {scenarios.map((s) => (
            <details
              key={s.id}
              className="overflow-hidden rounded-xl border border-border bg-bg-raised"
            >
              <summary className="cursor-pointer p-4 select-none">
                <span className="font-mono text-xs font-semibold text-accent">
                  {s.module}
                </span>
                <span className="ml-2 font-semibold">{s.title}</span>
                <span className="ml-2 rounded-full bg-bg-inset px-2 py-0.5 text-xs text-fg-muted">
                  {s.difficulty}
                </span>
                <p className="mt-1 text-sm text-fg-muted">
                  Symptom: {s.symptom}
                </p>
              </summary>
              <pre className="overflow-x-auto border-t border-border bg-code-bg p-4 text-xs leading-relaxed text-code-fg">
                {s.raw}
              </pre>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
