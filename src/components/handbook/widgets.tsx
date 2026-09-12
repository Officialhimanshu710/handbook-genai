import { useMemo, useState, type ReactNode } from "react";
import type { WidgetId } from "@/data/types";
import { cn } from "@/lib/utils";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Try it
      </p>
      <h4 className="font-display text-lg text-foreground">{title}</h4>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function TemperatureWidget() {
  const [temp, setTemp] = useState(0.2);
  const options = [
    { token: "Delhi", base: 0.62 },
    { token: "Mumbai", base: 0.18 },
    { token: "Paris", base: 0.12 },
    { token: "Atlantis", base: 0.08 },
  ];
  const softened = options.map((o) => ({
    ...o,
    p: Math.exp(Math.log(o.base) / Math.max(temp, 0.05)),
  }));
  const sum = softened.reduce((a, b) => a + b.p, 0);
  const rows = softened.map((o) => ({ ...o, p: o.p / sum }));

  return (
    <Panel title="Temperature changes sampling, not intelligence">
      <p className="text-sm text-muted-foreground">Prompt: “The capital of India is”</p>
      <label className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Temperature</span>
        <span className="font-mono tabular-nums text-foreground">{temp.toFixed(2)}</span>
      </label>
      <input
        type="range"
        min={0.05}
        max={1.4}
        step={0.05}
        value={temp}
        onChange={(e) => setTemp(Number(e.target.value))}
        className="mt-2 h-11 w-full accent-primary"
      />
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.token} className="grid grid-cols-[7rem_1fr_3.5rem] items-center gap-2 text-sm">
            <span className="font-mono">{r.token}</span>
            <span className="h-2 overflow-hidden rounded-full bg-muted">
              <span className="block h-full bg-primary" style={{ width: `${Math.round(r.p * 100)}%` }} />
            </span>
            <span className="font-mono tabular-nums text-muted-foreground">{Math.round(r.p * 100)}%</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Low temperature peaks on Delhi. High temperature spreads mass onto weaker tokens. Use ~0 for
        extraction and JSON; higher only when you want variety.
      </p>
    </Panel>
  );
}

function estimateTokens(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const latin = (text.match(/[A-Za-z0-9]/g) ?? []).length;
  const other = Math.max(chars - latin, 0);
  return Math.max(1, Math.round(latin / 4 + other / 2 + words * 0.1));
}

function TokensWidget() {
  const [text, setText] = useState("I love artificial intelligence");
  const tokens = estimateTokens(text);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <Panel title="Words are not tokens">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-md bg-background p-3 text-sm shadow-[var(--shadow-border)] outline-none"
      />
      <div className="mt-3 flex gap-6 font-mono text-sm tabular-nums">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Words</p>
          <p className="text-lg">{words}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Est. tokens</p>
          <p className="text-lg">{tokens}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Rough estimator (not a real tokenizer). Paste Hindi or code — token count jumps even when
        word count does not.
      </p>
      <button
        type="button"
        className="mt-3 min-h-11 text-sm text-primary underline-offset-4 hover:underline"
        onClick={() => setText("मुझे कृत्रिम बुद्धिमत्ता पसंद है")}
      >
        Try a Hindi sentence
      </button>
    </Panel>
  );
}

const SAMPLE_POLICY = `Leave policy
Employees may take 18 days of earned leave each calendar year.
Unused leave up to 8 days may be carried forward.
Medical leave requires a certificate after 2 consecutive days.
Notice of resignation is 30 days for junior staff and 60 days for managers.`;

function chunkText(text: string, size: number, overlap: number) {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let i = 0;
  const step = Math.max(size - overlap, 1);
  while (i < words.length) {
    chunks.push(words.slice(i, i + size).join(" "));
    i += step;
  }
  return chunks;
}

function ChunkingWidget() {
  const [size, setSize] = useState(18);
  const [overlap, setOverlap] = useState(4);
  const chunks = useMemo(() => chunkText(SAMPLE_POLICY, size, overlap), [size, overlap]);

  return (
    <Panel title="Chunk size vs overlap">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="flex justify-between text-muted-foreground">
            Words per chunk <span className="font-mono tabular-nums text-foreground">{size}</span>
          </span>
          <input
            type="range"
            min={8}
            max={40}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-2 h-11 w-full accent-primary"
          />
        </label>
        <label className="text-sm">
          <span className="flex justify-between text-muted-foreground">
            Overlap <span className="font-mono tabular-nums text-foreground">{overlap}</span>
          </span>
          <input
            type="range"
            min={0}
            max={12}
            value={overlap}
            onChange={(e) => setOverlap(Number(e.target.value))}
            className="mt-2 h-11 w-full accent-primary"
          />
        </label>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {chunks.length} chunks from a tiny HR policy. In production you count tokens, not words.
      </p>
      <ol className="mt-3 space-y-2">
        {chunks.map((c, i) => (
          <li key={i} className="rounded-md bg-muted/70 p-3 text-sm leading-relaxed">
            <span className="mr-2 font-mono text-[11px] text-muted-foreground">#{i + 1}</span>
            {c}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function tokenize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function fakeEmbed(text: string) {
  const vocab = ["reset", "password", "login", "invoice", "gst", "policy", "leave", "api", "auth", "jwt"];
  const bag = new Set(tokenize(text));
  const vec = vocab.map((w) => (bag.has(w) ? 1 : 0.05));
  const mag = Math.sqrt(vec.reduce((a, b) => a + b * b, 0)) || 1;
  return vec.map((v) => v / mag);
}

function cosine(a: number[], b: number[]) {
  return a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0);
}

function CosineWidget() {
  const [q, setQ] = useState("How do I reset my password?");
  const docs = [
    "Password reset: open settings, choose forgot password, check email.",
    "GST invoices must include HSN codes and the supplier GSTIN.",
    "API authentication uses JWT access tokens and a refresh token.",
  ];
  const qv = fakeEmbed(q);
  const ranked = docs
    .map((d) => ({ d, score: cosine(qv, fakeEmbed(d)) }))
    .sort((a, b) => b.score - a.score);

  return (
    <Panel title="Meaning, not keywords">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="h-11 w-full rounded-md bg-background px-3 text-sm shadow-[var(--shadow-border)] outline-none"
      />
      <ul className="mt-4 space-y-2">
        {ranked.map((r) => (
          <li key={r.d} className="rounded-md bg-muted/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm">{r.d}</p>
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {r.score.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Toy bag-of-words vectors so you can see ranking move. Real embeddings capture paraphrase far
        better than this demo.
      </p>
    </Panel>
  );
}

function RagFlowWidget() {
  const steps = [
    "User question",
    "Embed query",
    "Hybrid search",
    "Rerank top 20 → 5",
    "Prompt + citations",
    "LLM answer",
    "Validate / log",
  ];
  return (
    <Panel title="Query path, left to right">
      <ol className="grid gap-2 sm:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 rounded-md bg-muted/70 px-3 py-2.5 text-sm">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function Widget({ id }: { id: WidgetId }) {
  switch (id) {
    case "temperature":
      return <TemperatureWidget />;
    case "tokens":
      return <TokensWidget />;
    case "chunking":
      return <ChunkingWidget />;
    case "cosine":
      return <CosineWidget />;
    case "rag-flow":
      return <RagFlowWidget />;
    default:
      return null;
  }
}

export function PriorityBadgeClass(priority: string) {
  return cn(
    priority === "critical" && "critical",
    priority === "high" && "high",
    priority === "core" && "core",
    priority === "career" && "career",
  );
}
