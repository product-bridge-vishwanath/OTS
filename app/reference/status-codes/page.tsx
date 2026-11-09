import Link from "next/link";
import { getStatusFamilies } from "@/lib/content";
import { StatusExplorer } from "@/components/reference/StatusExplorer";

export const metadata = { title: "HTTP status codes · Own the System" };

export default function StatusCodesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/reference" className="text-sm text-accent">
        ← Reference
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        HTTP status codes
      </h1>
      <p className="mt-2 text-fg-muted">
        Each code is a clue about <em>which layer</em> failed — that&apos;s why
        the entries name a suspect. The 500/502/503/504 family is the most
        diagnostic signal in production. Full teaching in M5.
      </p>
      <div className="mt-4">
        <StatusExplorer families={getStatusFamilies()} />
      </div>
    </div>
  );
}
