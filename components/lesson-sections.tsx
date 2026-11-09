import type { ReactNode } from "react";
import { getGlossary } from "@/lib/content";

/**
 * The 9 lesson sections (PLAN §3). Every lesson renders the same anatomy,
 * in the same order, with the same visual grammar — so the learner always
 * knows where they are.
 */

const SECTION_META: Record<
  string,
  { label: string; hint: string }
> = {
  story: { label: "The story", hint: "A real incident this concept explains" },
  "already-did": {
    label: "What you already did",
    hint: "Where you met this while following an agent",
  },
  "mental-model": {
    label: "The mental model",
    hint: "The fundamental — tools come later",
  },
  tools: { label: "The tools", hint: "Implementations of the fundamental" },
  "hands-on": { label: "Hands-on", hint: "Do it in your own environment" },
  "break-fix": {
    label: "Break-fix",
    hint: "Symptom and evidence. Find the cause before revealing.",
  },
  "ask-agent": {
    label: "Ask your agent",
    hint: "Prompts to give an AI agent — and how to verify its work",
  },
  checklist: {
    label: "Decision / PM checklist",
    hint: "Questions to ask, what good looks like",
  },
  check: { label: "Check", hint: "Five questions, explanations included" },
};

export function Section({
  kind,
  children,
}: {
  kind: keyof typeof SECTION_META;
  children: ReactNode;
}) {
  const meta = SECTION_META[kind] ?? { label: kind, hint: "" };
  return (
    <section id={kind} className="mt-12 scroll-mt-24 first:mt-0">
      <div className="mb-4 border-b border-border pb-2">
        <h2 className="!mt-0 text-xl font-bold tracking-tight">
          {meta.label}
        </h2>
        {meta.hint && (
          <p className="mt-0.5 text-sm text-fg-faint">{meta.hint}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/** Glossary hover term. Pure CSS tooltip, no client JS. */
export function Term({ k, children }: { k: string; children: ReactNode }) {
  const term = getGlossary()[k];
  if (!term) return <>{children}</>;
  return (
    <span className="group relative inline-block cursor-help border-b border-dotted border-fg-faint">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-72 -translate-x-1/2 rounded-lg border border-border bg-bg-raised p-3 text-sm leading-snug font-normal text-fg shadow-lg group-hover:visible"
      >
        <span className="mb-1 block font-semibold">{term.name}</span>
        {term.def}
      </span>
    </span>
  );
}

/** Styled reveal, used for break-fix answers and hints. No JS. */
export function Reveal({
  label = "Reveal the cause",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <details className="not-prose my-4 rounded-xl border border-border bg-bg-raised">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent select-none">
        {label}
      </summary>
      <div className="prose border-t border-border px-4 py-3">{children}</div>
    </details>
  );
}

/** Evidence block for break-fix: logs/config/metrics as the learner would see them. */
export function Evidence({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border border-border">
      <div className="border-b border-border bg-bg-inset px-4 py-2 font-mono text-xs font-semibold text-fg-muted">
        {title}
      </div>
      <div className="evidence-body [&_pre]:!my-0 [&_pre]:!rounded-none">
        {children}
      </div>
    </div>
  );
}

/** One prompt for the learner's AI agent, paired with its verification step. */
export function AgentTask({
  prompt,
  children,
}: {
  prompt: string;
  children: ReactNode; // the "how to verify" content
}) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border border-border">
      <div className="bg-bg-inset px-4 py-3">
        <div className="mb-1 text-[11px] font-semibold tracking-wider text-fg-faint uppercase">
          Give your agent
        </div>
        <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {prompt}
        </p>
      </div>
      <div className="border-t border-border bg-bg-raised px-4 py-3">
        <div className="mb-1 text-[11px] font-semibold tracking-wider text-good uppercase">
          Then verify
        </div>
        <div className="prose text-sm">{children}</div>
      </div>
    </div>
  );
}

/** Callout for key ideas. */
export function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warn" | "key";
  children: ReactNode;
}) {
  const styles = {
    info: "border-info bg-info-soft",
    warn: "border-bad bg-bad-soft",
    key: "border-accent bg-accent-soft",
  }[type];
  return (
    <div className={`not-prose my-4 rounded-xl border-l-4 px-4 py-3 ${styles}`}>
      <div className="prose text-[0.95rem]">{children}</div>
    </div>
  );
}
