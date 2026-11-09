import Link from "next/link";
import { getGlossary } from "@/lib/content";
import { GlossaryExplorer } from "@/components/reference/GlossaryExplorer";

export const metadata = { title: "Glossary · Own the System" };

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/reference" className="text-sm text-accent">
        ← Reference
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Glossary</h1>
      <p className="mt-2 text-fg-muted">
        Every term the lessons define on hover, in one place. Plain language,
        two sentences max, and the production consequence included.
      </p>
      <div className="mt-4">
        <GlossaryExplorer terms={getGlossary()} />
      </div>
    </div>
  );
}
