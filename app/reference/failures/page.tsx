import Link from "next/link";
import { getFailures } from "@/lib/content";
import { FailuresExplorer } from "@/components/reference/FailuresExplorer";

export const metadata = { title: "Failure catalogue · Own the System" };

export default function FailuresPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/reference" className="text-sm text-accent">
        ← Reference
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Failure catalogue
      </h1>
      <p className="mt-2 text-fg-muted">
        The ~25 ways production actually breaks: symptom → likely causes → how
        to confirm → fix. Search by what you&apos;re seeing, not by what you
        suspect. Pairs with the debugging method (
        <Link href="/lessons/m08-l06" className="text-accent underline">
          M8.6
        </Link>
        ) — confirm before you fix.
      </p>
      <div className="mt-4">
        <FailuresExplorer failures={getFailures()} />
      </div>
    </div>
  );
}
