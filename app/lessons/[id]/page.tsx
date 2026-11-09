import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllLessons, getLessonById, getModule } from "@/lib/content";
import { mdxComponents } from "@/components/mdx";
import { DepthProvider, DepthToggle } from "@/components/DepthProvider";
import { MarkComplete } from "@/components/MarkComplete";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ id: l.id }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) notFound();

  const mod = getModule(lesson.module);
  const siblings = mod ? getAllLessons().filter((l) => l.module === mod.id) : [];
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : undefined;

  return (
    <DepthProvider>
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          {mod && (
            <Link
              href={`/modules/${mod.id.toLowerCase()}`}
              className="font-mono text-sm font-semibold text-accent"
            >
              {mod.id} · {mod.title}
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {lesson.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-faint">
            <span>~{lesson.estimated_minutes} min</span>
            <span>difficulty {lesson.difficulty}/3</span>
            <span className="flex flex-wrap gap-1">
              {lesson.concepts.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-bg-inset px-2 py-0.5 text-xs"
                >
                  {c}
                </span>
              ))}
            </span>
          </div>
          <div className="mt-5">
            <DepthToggle />
          </div>
        </header>

        <div className="prose">
          <MDXRemote source={lesson.content} components={mdxComponents} />
        </div>

        <footer className="mt-14 border-t border-border pt-8">
          <MarkComplete lessonId={lesson.id} />
          <div className="mt-8 flex justify-between gap-4 text-sm">
            {prev ? (
              <Link href={`/lessons/${prev.id}`} className="text-accent">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/lessons/${next.id}`} className="text-right text-accent">
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </footer>
      </article>
    </DepthProvider>
  );
}
