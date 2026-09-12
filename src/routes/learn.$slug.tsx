import { useEffect, useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bookmark, Check, Circle } from "lucide-react";
import { AppShell } from "@/components/handbook/app-shell";
import { BlockView } from "@/components/handbook/blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adjacent, chaptersBySlug } from "@/data";
import { questionsFor } from "@/data/quizzes";
import { SECTION_META, type SectionId } from "@/data/types";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const EMPTY: string[] = [];

export const Route = createFileRoute("/learn/$slug")({
  component: ChapterPage,
});

function ChapterPage() {
  const { slug } = Route.useParams();
  const chapter = chaptersBySlug[slug];
  if (!chapter) throw notFound();

  const setLast = useProgress((s) => s.setLast);
  const markSection = useProgress((s) => s.markSection);
  const toggleComplete = useProgress((s) => s.toggleComplete);
  const toggleBookmark = useProgress((s) => s.toggleBookmark);
  const completed = useProgress((s) => s.completed);
  const bookmarks = useProgress((s) => s.bookmarks);
  const sectionsDone = useProgress((s) => s.sections[slug] ?? EMPTY);
  const { prev, next } = adjacent(slug);
  const quizCount = questionsFor(slug).length;
  const done = completed.includes(slug);
  const bookmarked = bookmarks.includes(slug);

  useEffect(() => {
    setLast(slug);
  }, [slug, setLast]);

  const ids = useMemo(() => chapter.sections.map((s) => s.id), [chapter]);

  return (
    <AppShell>
      <article className="mx-auto max-w-2xl">
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          {chapter.number} · {chapter.group} · {chapter.minutes} min
        </p>
        <h1 className="mt-2 font-display text-4xl leading-[1.15] tracking-tight">{chapter.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{chapter.subtitle}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge
            variant={
              chapter.priority === "critical"
                ? "critical"
                : chapter.priority === "high"
                  ? "high"
                  : chapter.priority === "career"
                    ? "career"
                    : "core"
            }
          >
            {chapter.priority}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => toggleComplete(slug)}>
            {done ? <Check className="size-3.5" /> : <Circle className="size-3.5" />}
            {done ? "Completed" : "Mark complete"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toggleBookmark(slug)}>
            <Bookmark className={cn("size-3.5", bookmarked && "fill-current")} />
            {bookmarked ? "Saved" : "Save"}
          </Button>
        </div>

        <p className="mt-6 text-[17px] leading-relaxed">{chapter.summary}</p>
        <div className="mt-5 rounded-xl bg-muted/80 p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            You will be able to
          </p>
          <ul className="mt-2 space-y-1.5">
            {chapter.youWillLearn.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <nav className="sticky top-14 z-20 -mx-1 mt-8 flex gap-1 overflow-x-auto bg-background/95 py-2 backdrop-blur-sm">
          {SECTION_META.filter((m) => ids.includes(m.id)).map((m) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className={cn(
                "h-10 shrink-0 rounded-md px-3 text-sm leading-10",
                sectionsDone.includes(m.id)
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {m.label}
            </a>
          ))}
        </nav>

        {chapter.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="mt-8 scroll-mt-32 border-t border-border pt-8"
            onMouseEnter={() => markSection(slug, section.id as SectionId)}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {SECTION_META.find((m) => m.id === section.id)?.short}
            </p>
            <h2 className="mt-1 font-display text-2xl">{section.title}</h2>
            {section.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </section>
        ))}

        {quizCount > 0 ? (
          <div className="mt-10 rounded-xl bg-primary px-5 py-5 text-primary-foreground">
            <p className="font-display text-xl">Check this chapter</p>
            <p className="mt-1 text-sm text-primary-foreground/75">
              {quizCount} questions. Mark complete after you can answer without peeking.
            </p>
            <Button variant="secondary" className="mt-4" asChild>
              <Link to="/quiz/$slug" params={{ slug }}>
                Start quiz
              </Link>
            </Button>
          </div>
        ) : null}

        <div className="mt-10 flex items-stretch gap-3">
          {prev ? (
            <Link
              to="/learn/$slug"
              params={{ slug: prev.slug }}
              className="flex min-h-16 flex-1 flex-col justify-center rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                <ArrowLeft className="size-3" /> Previous
              </span>
              <span className="mt-1 text-sm font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              to="/learn/$slug"
              params={{ slug: next.slug }}
              className="flex min-h-16 flex-1 flex-col items-end justify-center rounded-xl bg-card px-4 py-3 text-right shadow-[var(--shadow-border)]"
            >
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                Next <ArrowRight className="size-3" />
              </span>
              <span className="mt-1 text-sm font-medium">{next.title}</span>
            </Link>
          ) : null}
        </div>
      </article>
    </AppShell>
  );
}
