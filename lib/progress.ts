// Client-side progress store. Phase 1 MVP keeps progress in localStorage;
// the Drizzle schema in /db mirrors this shape so it can move server-side
// behind auth without changing call sites.
"use client";

const KEY = "ots.progress.v1";

export type LessonProgress = {
  completedAt?: string;
  quiz?: { score: number; total: number; at: string };
};

export type ProgressMap = Record<string, LessonProgress>;

export function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeProgress(map: ProgressMap) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("ots-progress-changed"));
  } catch {
    // storage unavailable (private mode etc.) — progress is best-effort
  }
}

export function markComplete(lessonId: string) {
  const map = readProgress();
  map[lessonId] = { ...map[lessonId], completedAt: new Date().toISOString() };
  writeProgress(map);
}

export function unmarkComplete(lessonId: string) {
  const map = readProgress();
  if (map[lessonId]) {
    delete map[lessonId].completedAt;
    writeProgress(map);
  }
}

export function recordQuiz(lessonId: string, score: number, total: number) {
  const map = readProgress();
  map[lessonId] = {
    ...map[lessonId],
    quiz: { score, total, at: new Date().toISOString() },
  };
  writeProgress(map);
}

export function isComplete(lessonId: string): boolean {
  return Boolean(readProgress()[lessonId]?.completedAt);
}
