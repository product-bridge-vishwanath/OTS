import Link from "next/link";
import { getCommandGroups } from "@/lib/content";
import { CommandsExplorer } from "@/components/reference/CommandsExplorer";

export const metadata = { title: "Command cheat sheet · Own the System" };

export default function CommandsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/reference" className="text-sm text-accent">
        ← Reference
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Command cheat sheet
      </h1>
      <p className="mt-2 text-fg-muted">
        Grouped by the question you&apos;re trying to answer. The note under
        each command is the gotcha that costs people an hour. Full teaching in
        module M1.
      </p>
      <div className="mt-4">
        <CommandsExplorer groups={getCommandGroups()} />
      </div>
    </div>
  );
}
