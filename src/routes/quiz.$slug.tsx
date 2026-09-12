import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/handbook/app-shell";
import { Button } from "@/components/ui/button";
import { chaptersBySlug } from "@/data";
import { mixedQuiz, questionsFor } from "@/data/quizzes";
import type { QuizQuestion } from "@/data/types";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz/$slug")({ component: QuizPage });

function QuizPage() {
  const { slug } = Route.useParams();
  const chapter = slug === "mixed" ? null : chaptersBySlug[slug];
  if (slug !== "mixed" && !chapter) throw notFound();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [ready, setReady] = useState(false);
  const saveQuiz = useProgress((s) => s.saveQuiz);
  const markComplete = useProgress((s) => s.markComplete);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    setQuestions(slug === "mixed" ? mixedQuiz(12) : questionsFor(slug));
    setI(0);
    setPicked(null);
    setCorrectCount(0);
    setDone(false);
    setFinalScore(0);
    setReady(true);
  }, [slug]);

  if (!ready) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-3xl">Loading questions</h1>
        </div>
      </AppShell>
    );
  }

  if (questions.length === 0) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-3xl">No quiz for this chapter yet</h1>
          {chapter ? (
            <Button className="mt-4" asChild>
              <Link to="/learn/$slug" params={{ slug }}>
                Back to chapter
              </Link>
            </Button>
          ) : null}
        </div>
      </AppShell>
    );
  }

  const q = questions[i]!;
  const locked = picked !== null;

  function choose(idx: number) {
    if (locked) return;
    setPicked(idx);
  }

  function next() {
    const gained = picked === q.answer ? 1 : 0;
    const totalCorrect = correctCount + gained;
    if (i + 1 >= questions.length) {
      saveQuiz(slug, totalCorrect, questions.length);
      if (chapter && totalCorrect >= Math.ceil(questions.length * 0.7)) {
        markComplete(slug);
      }
      setFinalScore(totalCorrect);
      setDone(true);
      return;
    }
    setCorrectCount(totalCorrect);
    setI((n) => n + 1);
    setPicked(null);
  }

  if (done) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Result</p>
          <h1 className="mt-2 font-display text-4xl">
            {finalScore} / {questions.length}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {finalScore / questions.length >= 0.7
              ? "Strong enough to defend this topic. Revise the misses, then move on."
              : "Not ready to bluff this in a hiring-manager round. Re-read the How and Interview sections."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {chapter ? (
              <Button asChild>
                <Link to="/learn/$slug" params={{ slug }}>
                  Back to chapter
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/">Desk</Link>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setQuestions(slug === "mixed" ? mixedQuiz(12) : questionsFor(slug));
                setI(0);
                setPicked(null);
                setCorrectCount(0);
                setDone(false);
                setFinalScore(0);
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          {chapter ? `${chapter.number} ${chapter.title}` : "Mixed drill"} · {i + 1} /{" "}
          {questions.length}
        </p>
        <h1 className="mt-3 font-display text-2xl leading-snug sm:text-3xl">{q.q}</h1>
        <ul className="mt-6 space-y-2">
          {q.options.map((opt, idx) => {
            const correct = locked && idx === q.answer;
            const wrong = locked && idx === picked && idx !== q.answer;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => choose(idx)}
                  className={cn(
                    "w-full rounded-xl px-4 py-3.5 text-left text-sm leading-relaxed shadow-[var(--shadow-border)]",
                    "min-h-12",
                    correct && "bg-good/15",
                    wrong && "bg-destructive/10",
                    !locked && "bg-card hover:bg-muted",
                    locked && !correct && !wrong && "bg-card opacity-70",
                  )}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
        {locked ? (
          <div className="mt-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{q.explain}</p>
            <Button className="mt-4" onClick={next}>
              {i + 1 >= questions.length ? "See score" : "Next"}
            </Button>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
