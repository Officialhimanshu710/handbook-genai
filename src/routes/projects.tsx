import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/handbook/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

const five = [
  "Why did I use it?",
  "What problem does it solve?",
  "What are the alternatives?",
  "What are its limitations?",
  "How would I improve it?",
];

const stack = [
  "FastAPI",
  "RAG",
  "embeddings",
  "ChromaDB",
  "LLM APIs",
  "LangGraph",
  "QLoRA",
  "PEFT",
  "RAGAS",
  "Docker",
];

function ProjectsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Project defense
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">
          If it is on your resume, you must survive five questions.
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Do not list a stack you cannot defend. Do not invent internships. Build one honest
          system, measure it, and learn the failure modes.
        </p>

        <section className="mt-8 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-2xl">The five questions</h2>
          <ol className="mt-3 space-y-2">
            {five.map((q, i) => (
              <li key={q} className="flex gap-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {q}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-2xl">Ask them for every tool</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span key={s} className="rounded-md bg-muted px-2.5 py-1.5 text-sm">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            to="/learn/$slug"
            params={{ slug: "rag-project" }}
            className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
          >
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Project A</p>
            <h3 className="mt-1 font-display text-xl">Invoice compliance RAG</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Policies + invoices, embeddings, Chroma, FastAPI, optional vision LLM.
            </p>
          </Link>
          <Link
            to="/learn/$slug"
            params={{ slug: "finetune-project" }}
            className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
          >
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Project B</p>
            <h3 className="mt-1 font-display text-xl">Mistral-7B QLoRA</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              PEFT on one GPU, 80/10/10 split, RAGAS before and after.
            </p>
          </Link>
        </section>

        <Button className="mt-8" asChild>
          <Link to="/learn/$slug" params={{ slug: "defense" }}>
            Open the 10 defense questions
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
