import Link from "next/link";
import { getCloudRows } from "@/lib/content";
import { CloudMapExplorer } from "@/components/reference/CloudMapExplorer";

export const metadata = { title: "Cloud concept map · Own the System" };

export default function CloudMapPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/reference" className="text-sm text-accent">
        ← Reference
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Cloud concept map
      </h1>
      <p className="mt-2 text-fg-muted">
        Clouds sell the same ~18 pieces under different names. Learn the
        concept once; translate the branding here. Full teaching in M12.
      </p>
      <div className="mt-4">
        <CloudMapExplorer rows={getCloudRows()} />
      </div>
    </div>
  );
}
