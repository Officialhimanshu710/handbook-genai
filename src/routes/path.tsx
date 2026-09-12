import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/handbook/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { chapters, groups } from "@/data";
import { questionsFor } from "@/data/quizzes";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/path")({ component: PathPage });

function PathPage() {
  const completed = useProgress((s) => s.completed);
  const bookmarks = useProgress((s) => s.bookmarks);
  const quizzes = useProgress((s) => s.quizzes);
  const reset = useProgress((s) => s.reset);
  const pct = Math.round((completed.length / Math.max(chapters.length, 1)) * 100);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Your path</p>
        <h1 className="mt-2 font-display text-4xl">Study in this order. Apply before perfect.</h1>
        <p className="mt-3 text-muted-foreground">
          DSA and SQL get you into the building. This handbook gets you through the AI round.
          Saved chapters and quiz scores stay on this device.
        </p>
        <div className="mt-6 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <div className="flex justify-between text-sm">
            <span>Overall</span>
            <span className="font-mono tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} className="mt-2" />
        </div>

        {bookmarks.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-2xl">Saved</h2>
            <ul className="mt-3 space-y-1">
              {bookmarks.map((slug) => {
                const c = chapters.find((x) => x.slug === slug);
                if (!c) return null;
                return (
                  <li key={slug}>
                    <Link
                      to="/learn/$slug"
                      params={{ slug }}
                      className="block rounded-lg px-3 py-2 hover:bg-muted"
                    >
                      <span className="font-mono text-xs text-muted-foreground">{c.number}</span>{" "}
                      {c.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section className="mt-8 space-y-6">
          {groups().map((g) => {
            const done = g.items.filter((c) => completed.includes(c.slug)).length;
            return (
              <div key={g.name}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="font-display text-2xl">{g.name}</h2>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {done}/{g.items.length}
                  </span>
                </div>
                <ul className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
                  {g.items.map((c) => {
                    const q = quizzes[c.slug];
                    const hasQuiz = questionsFor(c.slug).length > 0;
                    return (
                      <li key={c.slug} className="flex items-center gap-3 border-t border-border first:border-0 px-4 py-3">
                        <span className="w-8 font-mono text-xs text-muted-foreground">{c.number}</span>
                        <Link to="/learn/$slug" params={{ slug: c.slug }} className="flex-1 text-sm font-medium">
                          {c.title}
                        </Link>
                        {q ? (
                          <Badge variant="good">
                            Quiz {q.score}/{q.total}
                          </Badge>
                        ) : hasQuiz ? (
                          <Link to="/quiz/$slug" params={{ slug: c.slug }} className="text-xs text-muted-foreground">
                            Quiz
                          </Link>
                        ) : null}
                        {completed.includes(c.slug) ? (
                          <Badge variant="critical">Done</Badge>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>

        <div className="mt-10">
          <Button variant="outline" onClick={() => reset()}>
            Reset local progress
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
