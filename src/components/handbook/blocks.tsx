import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Block, CalloutTone } from "@/data/types";
import { cn } from "@/lib/utils";
import { Widget } from "./widgets";

const toneLabel: Record<CalloutTone, string> = {
  note: "Note",
  trap: "Interview trap",
  india: "India MNC",
  rule: "Rule",
};

function CodeBlock({ code, title, lang }: { code: string; title?: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="my-5 overflow-hidden rounded-xl bg-ink text-paper">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="truncate text-[11px] uppercase tracking-[0.14em] text-paper/60">
          {title ?? lang ?? "code"}
        </span>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-sm text-paper/70 hover:bg-white/10 hover:text-paper"
          onClick={() => {
            void navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="my-3 text-[17px] leading-[1.65] text-foreground">{block.text}</p>;
    case "h":
      return (
        <h3 className="mt-8 mb-2 font-display text-xl text-foreground first:mt-0">{block.text}</h3>
      );
    case "ul":
      return (
        <ul className="my-4 space-y-2 pl-0">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[16px] leading-relaxed text-foreground"
            >
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-[16px] leading-relaxed">
              <span className="mt-0.5 w-6 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "code":
      return <CodeBlock code={block.code} title={block.title} lang={block.lang} />;
    case "callout":
      return (
        <aside
          className={cn(
            "my-5 rounded-xl p-4 shadow-[var(--shadow-border)]",
            block.tone === "trap" && "bg-destructive/8",
            block.tone === "rule" && "bg-primary/8",
            block.tone === "india" && "bg-wash",
            block.tone === "note" && "bg-muted/80",
          )}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {toneLabel[block.tone]}
          </p>
          <p className="mt-1 font-medium text-foreground">{block.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{block.text}</p>
        </aside>
      );
    case "qa":
      return (
        <article className="my-5 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Say this
          </p>
          <h4 className="mt-1 font-display text-lg leading-snug">{block.q}</h4>
          <p className="mt-3 text-[16px] leading-relaxed">{block.a}</p>
          {block.why ? (
            <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
              {block.why}
            </p>
          ) : null}
        </article>
      );
    case "table":
      return (
        <div className="my-5 overflow-x-auto rounded-xl shadow-[var(--shadow-border)]">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="bg-muted">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="px-3 py-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border bg-card">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2.5 align-top leading-relaxed">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "steps":
      return (
        <ol className="my-5 space-y-3">
          {block.items.map((item, i) => (
            <li key={item.title} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                Step {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-medium">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
      );
    case "diagram":
      return (
        <figure className="my-5 overflow-hidden rounded-xl bg-ink p-4 text-paper">
          {block.title ? (
            <figcaption className="mb-3 text-[11px] uppercase tracking-[0.14em] text-paper/60">
              {block.title}
            </figcaption>
          ) : null}
          <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-paper/90">
            {block.lines.join("\n")}
          </pre>
        </figure>
      );
    case "widget":
      return <Widget id={block.widget} />;
    default:
      return null;
  }
}
