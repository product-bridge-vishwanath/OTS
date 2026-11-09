import Link from "next/link";
import {
  getCloudRows,
  getCommandGroups,
  getDecisions,
  getFailures,
  getGlossary,
  getStatusFamilies,
} from "@/lib/content";

export const metadata = { title: "Reference · Own the System" };

export default function ReferenceIndex() {
  const pages = [
    {
      href: "/reference/commands",
      title: "Command cheat sheet",
      desc: "Grouped by the question you're answering, not alphabetically. Every example copyable.",
      count: `${getCommandGroups().reduce((n, g) => n + g.commands.length, 0)} commands`,
    },
    {
      href: "/reference/status-codes",
      title: "HTTP status codes",
      desc: "What each code means, which layer to suspect, and how to confirm it.",
      count: `${getStatusFamilies().reduce((n, f) => n + f.codes.length, 0)} codes`,
    },
    {
      href: "/reference/failures",
      title: "Failure catalogue",
      desc: "Symptom → likely causes → how to confirm → fix. The ~25 ways production actually breaks.",
      count: `${getFailures().length} failures`,
    },
    {
      href: "/reference/glossary",
      title: "Glossary",
      desc: "Every term the lessons hover-define, in one searchable list.",
      count: `${Object.keys(getGlossary()).length} terms`,
    },
    {
      href: "/reference/cloud-map",
      title: "Cloud concept map",
      desc: "Same pieces, different names — AWS, GCP, Azure and the PaaS world, mapped to concepts.",
      count: `${getCloudRows().length} concepts`,
    },
    {
      href: "/decisions",
      title: "Decision library",
      desc: "The 17 decisions every builder faces, each with an honest default.",
      count: `${getDecisions().length} decisions`,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">Reference</h1>
      <p className="mt-2 text-fg-muted">
        The pages you&apos;ll open mid-incident. Every lesson links here;
        everything is searchable.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-xl border border-border bg-bg-raised p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">{p.title}</h2>
              <span className="text-xs whitespace-nowrap text-fg-faint">
                {p.count}
              </span>
            </div>
            <p className="mt-1 text-sm text-fg-muted">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
