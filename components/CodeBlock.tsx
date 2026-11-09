"use client";

import { useRef, useState, type ReactNode } from "react";

/** Replaces `pre` in MDX: adds a copy button to every code block. */
export function CodeBlock({ children }: { children?: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="group relative">
      <button
        onClick={copy}
        aria-label="Copy code"
        className="absolute top-2 right-2 cursor-pointer rounded-md border border-border bg-bg-raised px-2 py-1 text-xs text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}
