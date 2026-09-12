export type Priority = "critical" | "high" | "core" | "career";

export type SectionId =
  | "what"
  | "why"
  | "how"
  | "example"
  | "implementation"
  | "interview";

export type CalloutTone = "note" | "trap" | "india" | "rule";

export type WidgetId =
  | "temperature"
  | "tokens"
  | "chunking"
  | "cosine"
  | "rag-flow";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang?: string; title?: string; code: string }
  | { type: "callout"; tone: CalloutTone; title: string; text: string }
  | { type: "qa"; q: string; a: string; why?: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "diagram"; title?: string; lines: string[] }
  | { type: "widget"; widget: WidgetId };

export interface Section {
  id: SectionId;
  title: string;
  blocks: Block[];
}

export interface Chapter {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  priority: Priority;
  minutes: number;
  group: string;
  summary: string;
  youWillLearn: string[];
  sections: Section[];
}

export interface QuizQuestion {
  id: string;
  chapter: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface DrillItem {
  id: string;
  q: string;
  a: string;
  hint?: string;
}

export const SECTION_META: { id: SectionId; label: string; short: string }[] = [
  { id: "what", label: "What", short: "What it is" },
  { id: "why", label: "Why", short: "Why it matters" },
  { id: "how", label: "How", short: "How it works" },
  { id: "example", label: "Example", short: "A real example" },
  { id: "implementation", label: "Build", short: "How you build it" },
  { id: "interview", label: "Interview", short: "What they ask" },
];
