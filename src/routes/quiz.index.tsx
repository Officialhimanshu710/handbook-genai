import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/handbook/app-shell";
import { Button } from "@/components/ui/button";
import { chapters } from "@/data";
import { questionsFor } from "@/data/quizzes";

export const Route = createFileRoute("/quiz/")({ component: QuizHub });

function QuizHub() {
  const withQuiz = chapters.filter((c) => questionsFor(c.slug).length > 0);
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl">Quizzes</h1>
        <p className="mt-3 text-muted-foreground">
          Chapter quizzes after you read. Mixed set when you want a cold start.
        </p>
        <Button className="mt-5" asChild>
          <Link to="/quiz/$slug" params={{ slug: "mixed" }}>
            Mixed 12
          </Link>
        </Button>
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
          {withQuiz.map((c) => (
            <li key={c.slug}>
              <Link
                to="/quiz/$slug"
                params={{ slug: c.slug }}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/60"
              >
                <span>
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{c.number}</span>
                  {c.title}
                </span>
                <span className="text-xs text-muted-foreground">{questionsFor(c.slug).length} q</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
