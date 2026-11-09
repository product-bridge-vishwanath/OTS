import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonsForModule, getModule, getModules } from "@/lib/content";
import { LessonProgressBadge } from "@/components/LessonProgressBadge";

export function generateStaticParams() {
  return getModules().map((m) => ({ id: m.id.toLowerCase() }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mod = getModule(id);
  if (!mod) notFound();

  const lessons = getLessonsForModule(mod.id);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-sm font-semibold text-accent">{mod.id}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{mod.title}</h1>
      <p className="mt-2 text-lg text-fg-muted">{mod.tagline}</p>

      {lessons.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-fg-muted">
          Lessons for this module are being written (content wave {mod.wave}).
          The curriculum outline lives in{" "}
          <code className="text-sm">PLAN.md</code>.
        </div>
      ) : (
        <ol className="mt-8 space-y-3">
          {lessons.map((l) => (
            <li key={l.id}>
              <Link
                href={`/lessons/${l.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg-raised p-4 transition-colors hover:border-accent"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-fg-faint">
                      L{l.order}
                    </span>
                    <LessonProgressBadge lessonId={l.id} />
                  </div>
                  <h2 className="mt-0.5 font-semibold">{l.title}</h2>
                  <p className="mt-0.5 text-sm text-fg-faint">
                    ~{l.estimated_minutes} min · difficulty {l.difficulty}/3
                  </p>
                </div>
                <span className="text-fg-faint">→</span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-10">
        <Link href="/#curriculum" className="text-sm text-accent">
          ← All modules
        </Link>
      </div>
    </div>
  );
}
