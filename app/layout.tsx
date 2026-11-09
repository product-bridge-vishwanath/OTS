import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Own the System",
  description:
    "AI writes the code; a human still owns the system. Learn to diagnose, direct, and decide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-bold tracking-tight">
              Own<span className="text-accent"> the </span>System
            </Link>
            <nav className="flex items-center gap-5 text-sm text-fg-muted">
              <Link href="/#curriculum" className="hover:text-fg">
                Curriculum
              </Link>
              <Link href="/scenarios" className="hover:text-fg">
                Scenarios
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <footer className="border-t border-border py-8">
          <p className="mx-auto max-w-5xl px-4 text-sm text-fg-faint">
            AI writes the code; a human still owns the system.
          </p>
        </footer>
      </body>
    </html>
  );
}
