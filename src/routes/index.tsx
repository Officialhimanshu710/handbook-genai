import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock3, Layers } from "lucide-react";
import { AppShell } from "@/components/handbook/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { chapters, groups } from "@/data";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({ component: Home });

const tracks: { title: string; text: string; slug: string }[] = [
  {
    title: "LLM core",
    text: "Tokens, context, embeddings, attention — the language you need before RAG.",
    slug: "llm-fundamentals",
  },
  {
    title: "Retrieval",
    text: "Chunk, embed, search, rerank, evaluate. This is the hiring-manager round.",
    slug: "rag",
  },
  {
    title: "Agents & training",
    text: "Tool calling, LangGraph, QLoRA, PEFT, hallucination as a system problem.",
    slug: "agents",
  },
  {
    title: "Ship it",
    text: "Cost, latency, security, FastAPI, and how to defend the project on your resume.",
    slug: "production",
  },
];

function Home() {
  const completed = useProgress((s) => s.completed);
  const lastSlug = useProgress((s) => s.lastSlug);
  const last = chapters.find((c) => c.slug === lastSlug) ?? chapters[0]!;
  const pct = Math.round((completed.length / Math.max(chapters.length, 1)) * 100);
  const nextUnread = chapters.find((c) => !completed.includes(c.slug)) ?? chapters[0]!;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Junior GenAI · India MNCs
        </p>
        <h1 className="mt-3 font-display text-[2.35rem] leading-[1.12] tracking-tight sm:text-5xl">
          Become interview-ready for GenAI engineering roles.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A full beginner handbook: what it is, why it exists, how it works, a real example, how you
          build it, and what to say when they ask. Study like an engineer, not a flashcard deck.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/learn/$slug" params={{ slug: nextUnread.slug }}>
              {completed.length ? "Continue" : "Start chapter 00"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/drill">35-question drill</Link>
          </Button>
        </div>

        <section className="mt-10 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Handbook progress
              </p>
              <p className="mt-1 font-display text-3xl tabular-nums">{pct}%</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {completed.length} / {chapters.length} chapters marked complete
            </p>
          </div>
          <Progress value={pct} className="mt-4" />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-md bg-muted px-2.5 py-1">
              Last open: {last.number} {last.title}
            </span>
            <span className="rounded-md bg-muted px-2.5 py-1">{groups().length} tracks</span>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Four tracks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every topic uses the same loop: What → Why → How → Example → Build → Interview.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {tracks.map((t) => (
              <Link
                key={t.title}
                to="/learn/$slug"
                params={{ slug: t.slug }}
                className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] transition-transform duration-150 hover:-translate-y-0.5"
              >
                <h3 className="font-display text-xl">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-primary px-5 py-6 text-primary-foreground">
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary-foreground/70">
            India hiring map
          </p>
          <h2 className="mt-2 font-display text-2xl leading-snug">
            Product MNCs still test DSA. AI teams still open your GitHub.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
            Microsoft, Google, Amazon, Adobe, Salesforce, GCCs, and services AI tracks all want a
            defensible RAG story plus clean Python. Read the map before you spray applications.
          </p>
          <Button variant="secondary" className="mt-5" asChild>
            <Link to="/learn/$slug" params={{ slug: "india-mnc" }}>
              Open the India MNC chapter
            </Link>
          </Button>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">How to read a chapter</h2>
          <ol className="mt-4 space-y-2">
            {[
              "What it is, in one honest sentence",
              "Why engineers use it — the problem, not the buzzword",
              "How the machinery actually runs",
              "A concrete example (invoices, policies, APIs)",
              "A small implementation you could type",
              "The spoken interview answer",
            ].map((s, i) => (
              <li key={s} className="flex gap-3 rounded-lg bg-muted/80 px-3 py-2.5 text-sm">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">All chapters</h2>
            <Badge variant="outline">{chapters.length}</Badge>
          </div>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
            {chapters.map((c) => {
              const done = completed.includes(c.slug);
              return (
                <li key={c.slug}>
                  <Link
                    to="/learn/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-muted/60"
                  >
                    <span className="w-10 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {c.number}
                    </span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{c.title}</span>
                        <Badge
                          variant={
                            c.priority === "critical"
                              ? "critical"
                              : c.priority === "high"
                                ? "high"
                                : c.priority === "career"
                                  ? "career"
                                  : "core"
                          }
                        >
                          {c.priority}
                        </Badge>
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{c.subtitle}</span>
                    </span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      {c.minutes}m
                      {done ? (
                        <Check className="size-3.5 text-good" />
                      ) : (
                        <Layers className="size-3.5" />
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
