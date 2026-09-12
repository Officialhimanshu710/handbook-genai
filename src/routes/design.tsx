import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/handbook/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/design")({ component: DesignPage });

const talk = [
  {
    t: "1. Clarify the job",
    d: "Internal employee copilot? Invoice compliance? Customer support? Users, SLA, languages (English/Hindi), and whether answers must cite sources.",
  },
  {
    t: "2. Draw the happy path",
    d: "User → API gateway → query embed → hybrid retrieval → rerank → prompt → LLM → output validation → answer + citations.",
  },
  {
    t: "3. Indexing path",
    d: "Object store for PDFs, parser (text + tables + OCR), chunker, embedder, vector index, metadata (customer, date, doc type).",
  },
  {
    t: "4. Quality",
    d: "Golden set, faithfulness, recall, human review queue. Log retrieval IDs with every answer.",
  },
  {
    t: "5. Scale & cost",
    d: "Queue embeddings, cache frequent queries, route easy intents to a small model, measure rupees per answer and p95.",
  },
  {
    t: "6. Safety",
    d: "Authn/authz per tenant, PII redaction, prompt-injection assumption on every document, least-privilege tools, human approval for irreversible actions.",
  },
];

function DesignPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">System design</p>
        <h1 className="mt-2 font-display text-4xl leading-tight">
          Design a production RAG system in eight minutes.
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Junior rounds rarely want a 40-box Kubernetes novel. They want a clear path, then scaling,
          eval, cost, and security. Speak in this order.
        </p>

        <figure className="mt-8 overflow-x-auto rounded-xl bg-ink p-5 text-paper">
          <figcaption className="mb-3 text-[11px] uppercase tracking-[0.14em] text-paper/55">
            Query path
          </figcaption>
          <pre className="font-mono text-[12px] leading-relaxed text-paper/90">{`User
  │
  ▼
FastAPI  ── auth, rate limit, tenant
  │
  ▼
Query embed
  │
  ▼
Hybrid retrieval  (BM25 + vectors)
  │
  ▼
Reranker  (top 20 → top 5)
  │
  ▼
Prompt  + citations + schema
  │
  ▼
LLM  (stream)
  │
  ▼
Validate  (PII, policy, JSON)
  │
  ▼
Answer  + traces + cost log`}</pre>
        </figure>

        <ol className="mt-8 space-y-3">
          {talk.map((s, i) => (
            <li key={s.t} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <p className="font-mono text-[11px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-medium">{s.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/learn/$slug" params={{ slug: "system-design" }}>
              Full design chapter
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/learn/$slug" params={{ slug: "defense" }}>
              Project defense bank
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
