"use client";

import { useEffect, useState } from "react";
import { readProgress } from "@/lib/progress";

export function LessonProgressBadge({ lessonId }: { lessonId: string }) {
  const [state, setState] = useState<"todo" | "done">("todo");

  useEffect(() => {
    const update = () =>
      setState(readProgress()[lessonId]?.completedAt ? "done" : "todo");
    update();
    window.addEventListener("ots-progress-changed", update);
    return () => window.removeEventListener("ots-progress-changed", update);
  }, [lessonId]);

  if (state === "done") {
    return (
      <span className="rounded-full bg-good-soft px-2 py-0.5 text-xs font-medium text-good">
        done
      </span>
    );
  }
  return null;
}
