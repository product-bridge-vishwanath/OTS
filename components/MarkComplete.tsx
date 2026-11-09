"use client";

import { useEffect, useState } from "react";
import { isComplete, markComplete, unmarkComplete } from "@/lib/progress";

export function MarkComplete({ lessonId }: { lessonId: string }) {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDone(isComplete(lessonId));
  }, [lessonId]);

  if (!mounted) return null;

  return (
    <button
      onClick={() => {
        if (done) {
          unmarkComplete(lessonId);
          setDone(false);
        } else {
          markComplete(lessonId);
          setDone(true);
        }
      }}
      className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        done
          ? "bg-good-soft text-good border border-good"
          : "bg-accent text-white"
      }`}
    >
      {done ? "✓ Completed — click to undo" : "Mark lesson complete"}
    </button>
  );
}
