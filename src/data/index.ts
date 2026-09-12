import type { Chapter } from "./types";
import { startChapters } from "./chapters/start";
import { llmChapters } from "./chapters/llm";
import { ragChapters } from "./chapters/rag";
import { agentChapters } from "./chapters/agents";
import { trainChapters } from "./chapters/train";
import { prodChapters } from "./chapters/prod";
import { projectChapters } from "./chapters/projects";
import { coreChapters } from "./chapters/core";

export const chapters: Chapter[] = [
  ...startChapters,
  ...llmChapters,
  ...ragChapters,
  ...agentChapters,
  ...trainChapters,
  ...prodChapters,
  ...projectChapters,
  ...coreChapters,
];

export const chaptersBySlug: Record<string, Chapter> = Object.fromEntries(
  chapters.map((c) => [c.slug, c]),
);

export function groups(): { name: string; items: Chapter[] }[] {
  const order: string[] = [];
  const map = new Map<string, Chapter[]>();
  for (const c of chapters) {
    if (!map.has(c.group)) {
      map.set(c.group, []);
      order.push(c.group);
    }
    map.get(c.group)!.push(c);
  }
  return order.map((name) => ({ name, items: map.get(name)! }));
}

export function adjacent(slug: string) {
  const i = chapters.findIndex((c) => c.slug === slug);
  return {
    prev: i > 0 ? chapters[i - 1] : null,
    next: i >= 0 && i < chapters.length - 1 ? chapters[i + 1] : null,
  };
}

export type SearchHit = {
  slug: string;
  number: string;
  title: string;
  snippet: string;
};

export function searchChapters(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const c of chapters) {
    const hay = [
      c.title,
      c.subtitle,
      c.summary,
      ...c.youWillLearn,
      ...c.sections.flatMap((s) =>
        s.blocks.flatMap((b) => {
          if (b.type === "p" || b.type === "h") return [b.text];
          if (b.type === "ul" || b.type === "ol") return b.items;
          if (b.type === "code") return [b.code, b.title ?? ""];
          if (b.type === "callout") return [b.title, b.text];
          if (b.type === "qa") return [b.q, b.a, b.why ?? ""];
          if (b.type === "table") return [...b.headers, ...b.rows.flat()];
          if (b.type === "steps") return b.items.flatMap((x) => [x.title, x.text]);
          if (b.type === "diagram") return [b.title ?? "", ...b.lines];
          return [];
        }),
      ),
    ]
      .join("\n")
      .toLowerCase();
    const idx = hay.indexOf(q);
    if (idx === -1) continue;
    const start = Math.max(0, idx - 48);
    const snippet = hay.slice(start, start + 140).replace(/\s+/g, " ").trim();
    hits.push({ slug: c.slug, number: c.number, title: c.title, snippet });
  }
  return hits.slice(0, 12);
}
