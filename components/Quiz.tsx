"use client";

import { useState } from "react";
import { recordQuiz } from "@/lib/progress";

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number; // index into options
  explain: string;
};

export function Quiz({
  lessonId,
  questions,
}: {
  lessonId: string;
  questions: QuizQuestion[];
}) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((_, i) => picked[i] !== undefined);
  const score = questions.reduce(
    (n, q, i) => n + (picked[i] === q.answer ? 1 : 0),
    0
  );

  function submit() {
    setSubmitted(true);
    recordQuiz(lessonId, score, questions.length);
  }

  return (
    <div className="not-prose my-6 space-y-6">
      {questions.map((q, qi) => {
        const chosen = picked[qi];
        return (
          <fieldset
            key={qi}
            className="rounded-xl border border-border bg-bg-raised p-4"
          >
            <legend className="sr-only">Question {qi + 1}</legend>
            <p className="mb-3 font-medium">
              <span className="mr-2 text-fg-faint">{qi + 1}.</span>
              {q.q}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const isRight = submitted && oi === q.answer;
                const isWrongPick = submitted && isChosen && oi !== q.answer;
                return (
                  <label
                    key={oi}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      isRight
                        ? "border-good bg-good-soft"
                        : isWrongPick
                          ? "border-bad bg-bad-soft"
                          : isChosen
                            ? "border-accent bg-accent-soft"
                            : "border-border hover:border-fg-faint"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${lessonId}-${qi}`}
                      className="mt-0.5 accent-current"
                      disabled={submitted}
                      checked={isChosen ?? false}
                      onChange={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <p
                className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                  chosen === q.answer
                    ? "bg-good-soft text-good"
                    : "bg-bad-soft text-bad"
                }`}
              >
                {chosen === q.answer ? "Correct. " : "Not quite. "}
                <span className="text-fg-muted">{q.explain}</span>
              </p>
            )}
          </fieldset>
        );
      })}
      {!submitted ? (
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {allAnswered
            ? "Check my answers"
            : `Answer all ${questions.length} questions to check`}
        </button>
      ) : (
        <div className="rounded-xl border border-border bg-bg-raised p-4">
          <p className="font-semibold">
            Score: {score} / {questions.length}
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            {score === questions.length
              ? "All correct — the method is yours. Mark the lesson complete below."
              : "Re-read the explanations above, then revisit the sections they point to. The quiz is a checkpoint, not a gate."}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setPicked({});
            }}
            className="mt-3 cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted hover:text-fg"
          >
            Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}
