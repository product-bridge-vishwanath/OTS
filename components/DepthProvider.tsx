"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Two depths on the same page (teaching principle #4):
//   overview — what it is, why it matters, what to ask, what good looks like
//   operator — adds commands, config, internals on top of overview
export type Depth = "overview" | "operator";

const DepthContext = createContext<{
  depth: Depth;
  setDepth: (d: Depth) => void;
}>({ depth: "overview", setDepth: () => {} });

const KEY = "ots.depth";

export function DepthProvider({ children }: { children: ReactNode }) {
  const [depth, setDepthState] = useState<Depth>("overview");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "operator" || saved === "overview") setDepthState(saved);
    } catch {}
  }, []);

  const setDepth = (d: Depth) => {
    setDepthState(d);
    try {
      window.localStorage.setItem(KEY, d);
    } catch {}
  };

  return (
    <DepthContext.Provider value={{ depth, setDepth }}>
      {children}
    </DepthContext.Provider>
  );
}

export function useDepth() {
  return useContext(DepthContext);
}

export function DepthToggle() {
  const { depth, setDepth } = useDepth();
  const base =
    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer";
  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-raised p-1"
      role="radiogroup"
      aria-label="Lesson depth"
    >
      <button
        role="radio"
        aria-checked={depth === "overview"}
        className={`${base} ${
          depth === "overview"
            ? "bg-accent-soft text-accent"
            : "text-fg-muted hover:text-fg"
        }`}
        onClick={() => setDepth("overview")}
      >
        Overview
      </button>
      <button
        role="radio"
        aria-checked={depth === "operator"}
        className={`${base} ${
          depth === "operator"
            ? "bg-accent-soft text-accent"
            : "text-fg-muted hover:text-fg"
        }`}
        onClick={() => setDepth("operator")}
      >
        Operator
      </button>
    </div>
  );
}

/**
 * Content only shown at operator depth. Rendered (hidden) at overview depth
 * with a visible "operator detail available" hint so learners know depth
 * exists on this section.
 */
export function Operator({ children }: { children: ReactNode }) {
  const { depth, setDepth } = useDepth();
  if (depth === "operator") {
    return (
      <div className="my-4 rounded-lg border-l-3 border border-border border-l-accent bg-bg-raised px-4 py-3">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
          Operator depth
        </div>
        {children}
      </div>
    );
  }
  return (
    <button
      onClick={() => setDepth("operator")}
      className="my-3 block w-full cursor-pointer rounded-lg border border-dashed border-border px-4 py-2 text-left text-sm text-fg-faint transition-colors hover:border-accent hover:text-accent"
    >
      ⌄ Operator detail hidden — switch to Operator depth to see commands and internals
    </button>
  );
}
