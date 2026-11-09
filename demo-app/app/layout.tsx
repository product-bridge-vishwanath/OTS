import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riverside Studios",
  description: "Studio rental — the Own the System teaching app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <div className="inner">
            <Link href="/">Riverside Studios</Link>
            <span>rehearsal · recording · podcast</span>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
