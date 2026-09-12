import type { Chapter } from "../types";

export const ragChapters: Chapter[] = [
  {
    slug: "rag",
    number: "09",
    title: "Retrieval-Augmented Generation",
    subtitle: "Give the model the right pages, not the whole company wiki.",
    priority: "critical",
    minutes: 15,
    group: "Retrieval (RAG)",
    summary:
      "RAG fetches a small set of relevant passages at question time and asks the LLM to answer from those passages. That is how you use private, fresh, or domain data without stuffing a 400-page wiki into the prompt.",
    youWillLearn: [
      "What RAG is in one sentence, and what it is not",
      "Why context windows, privacy, and freshness make naive prompting fail",
      "The retrieve-then-generate loop you must draw on a whiteboard",
      "Why more retrieved text is not always a better answer",
    ],
    sections: [
      {
        id: "what",
        title: "What RAG is",
        blocks: [
          {
            type: "p",
            text: "Retrieval-Augmented Generation is a two-step pattern: first find a handful of passages that are likely relevant to the user’s question, then generate an answer that is grounded in those passages. The LLM does not “know” your company. You hand it the pages it needs, for this question, now.",
          },
          {
            type: "p",
            text: "It is not fine-tuning. Fine-tuning changes how a model behaves. RAG changes what evidence the model sees. Leave-policy updates, GST circulars, and last week’s invoice SOP belong in a store you can re-index, not in a training run.",
          },
          {
            type: "ul",
            items: [
              "Private data — HR policy, customer contracts, internal wikis the public model never saw.",
              "Fresh data — a circular published yesterday. You re-index. You do not retrain.",
              "Domain data — HSN codes, PF rules, your firm’s leave matrix. Embeddings plus keywords beat hoping the base model memorized it.",
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "One-sentence definition",
            text: "RAG = retrieve relevant context at query time + generate an answer constrained to that context. If you cannot say that out loud, you are not ready for the project round.",
          },
        ],
      },
      {
        id: "why",
        title: "Why you cannot paste the wiki",
        blocks: [
          {
            type: "p",
            text: "A 200-page employee handbook will not fit in a small context window, and even a 128k window is the wrong place to dump it. You pay for every token. The model gets slower. Important clauses drown in the middle. And you just sent the entire handbook to a vendor API.",
          },
          {
            type: "ul",
            items: [
              "Limits — prompts have a hard cap. Retrieval picks the 3–10 passages that matter.",
              "Cost — input tokens are billed. Ten focused chunks beat 80 pages of leave policy.",
              "Quality — extra context is noise. Models miss the right sentence when you bury it.",
              "Privacy — the whole wiki in a prompt is a data-leak waiting for a log.",
              "Freshness — index last night’s SOP. The base model’s cutoff is irrelevant.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "The GCC wiki problem",
            text: "A typical India GCC has HR leave policy, travel policy, GST invoice SOPs, and a Confluence dump. An interviewer will ask: “Why not put all of it in the system prompt?” Your answer is tokens, noise, PII, and the fact that finance updates GST treatment every budget cycle.",
          },
          {
            type: "callout",
            tone: "trap",
            title: "More context is not always better",
            text: "Juniors “fix” bad answers by raising top-k from 4 to 20. That often makes answers worse: the model attends to a nearby but wrong clause, or blends two policies. Retrieve less, rerank, and cite. Do not hoard chunks.",
          },
        ],
      },
      {
        id: "how",
        title: "How the loop works",
        blocks: [
          {
            type: "p",
            text: "There are two clocks. Indexing runs when documents change. Querying runs on every user question. Do not mix them on the whiteboard.",
          },
          {
            type: "diagram",
            title: "RAG at query time",
            lines: [
              "User question",
              "    → embed the question",
              "    → search vector DB (optional keyword / hybrid)",
              "    → top-k chunks  →  optional rerank",
              "    → build prompt: instructions + chunks + question",
              "    → LLM generates an answer (ideally with citations)",
            ],
          },
          {
            type: "widget",
            widget: "rag-flow",
          },
          {
            type: "p",
            text: "The prompt is a contract: “Answer only from the context. If the context is missing the fact, say you do not know.” Without that instruction, the model will happily invent a PF matching percentage.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: leave policy, not the whole handbook",
        blocks: [
          {
            type: "p",
            text: "Question: “Can I take casual leave the day before Diwali if I have two days left?” The useful passage is clause 4.2 of the leave policy, plus the holiday-calendar note. The travel policy, POSH policy, and last year’s GST memo are irrelevant even if they sit in the same wiki.",
          },
          {
            type: "ol",
            items: [
              "Index the leave policy as chunks with metadata {doc: leave, section: 4.2, fy: 2026}.",
              "Embed the question. Search. Top-k returns 4.2 and the restricted-holiday list.",
              "Prompt the LLM with those chunks only. Ask for a yes/no plus the clause id.",
              "If retrieval is empty, the API returns “not in policy” — it does not guess from internet Diwali lore.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "What the interviewer wants to hear",
            text: "You chose RAG because the policy is private, changes yearly, and is too large to prompt. You did not fine-tune a model on the handbook to “teach it HR.”",
          },
        ],
      },
      {
        id: "implementation",
        title: "A minimal retrieve-then-generate in Python",
        blocks: [
          {
            type: "p",
            text: "This is the smallest honest demo: embed with sentence-transformers, store in Chroma, stuff top chunks into a prompt. Swap the print for an LLM call in FastAPI later.",
          },
          {
            type: "code",
            lang: "python",
            title: "Index a policy clause and retrieve it",
            code: `from sentence_transformers import SentenceTransformer
import chromadb

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path="./chroma_hr")
col = client.get_or_create_collection("leave_policy")

docs = [
    "Clause 4.2: Casual leave is 12 days per calendar year. "
    "It cannot be combined with the day immediately before a restricted holiday.",
    "Clause 6.1: Privilege leave can be encashed up to 15 days at year end.",
]
embs = model.encode(docs).tolist()
col.add(
    ids=["leave-4.2", "leave-6.1"],
    documents=docs,
    embeddings=embs,
    metadatas=[{"section": "4.2"}, {"section": "6.1"}],
)

q = "Can I take casual leave the day before Diwali?"
q_emb = model.encode([q]).tolist()
hits = col.query(query_embeddings=q_emb, n_results=2)
context = "\\n\\n".join(hits["documents"][0])
prompt = (
    "Answer only from the context. If missing, say you do not know.\\n\\n"
    f"Context:\\n{context}\\n\\nQuestion: {q}"
)
print(prompt)`,
          },
          {
            type: "callout",
            tone: "note",
            title: "Then put it behind FastAPI",
            text: "The handbook’s default junior project is this loop behind POST /ask, with metadata filters and a log of retrieved ids. That is more hireable than a Streamlit chat that hides retrieval.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What is RAG, in one sentence?",
            a: "I retrieve a small set of relevant passages for this question, then I generate an answer that has to stay faithful to those passages. The model is not my knowledge base — the index is.",
            why: "They are checking you do not confuse RAG with fine-tuning or with “I added memory.”",
          },
          {
            type: "qa",
            q: "Why not put the whole company wiki in the prompt?",
            a: "Three reasons: it may not fit, it is expensive and slow, and extra pages become noise so the model misses the clause that matters. Also I do not want to ship the entire handbook to a vendor log. I retrieve the few passages that match this question.",
          },
          {
            type: "qa",
            q: "When would you fine-tune instead of using RAG?",
            a: "Fine-tune when I need a style, a format, or a skill the base model lacks — say a consistent JSON schema or a domain tone. I use RAG when the facts change, are private, or live in documents. For an HR copilot, RAG first. Fine-tune later, if at all.",
          },
        ],
      },
    ],
  },
  {
    slug: "rag-pipeline",
    number: "10",
    title: "Indexing vs query path",
    subtitle: "Index once. Query many times. Draw both arrows.",
    priority: "critical",
    minutes: 12,
    group: "Retrieval (RAG)",
    summary:
      "A RAG system is two pipelines that share a vector store. The index path turns documents into searchable chunks. The query path turns a question into a grounded answer. Mixing them is the most common junior whiteboard mistake.",
    youWillLearn: [
      "The indexing path: parse, clean, chunk, embed, upsert",
      "The query path: embed, search, top-k, optional rerank, prompt, LLM",
      "What you persist versus what you compute per request",
      "How a FastAPI service splits the two jobs",
    ],
    sections: [
      {
        id: "what",
        title: "What the two paths are",
        blocks: [
          {
            type: "p",
            text: "Indexing is a batch (or event-driven) job. You take files, turn them into chunks with metadata, embed those chunks, and write them to a vector database. Querying is a request. You embed the question, search, optionally rerank, build a prompt, and call the LLM.",
          },
          {
            type: "table",
            headers: ["", "Indexing path", "Query path"],
            rows: [
              ["When", "On ingest / on document change", "Every user question"],
              ["Input", "PDFs, DOCX, HTML, markdown", "A question (+ filters)"],
              ["Heavy work", "Parse, OCR, chunk, embed corpus", "Embed 1 query, search, generate"],
              ["Output", "Vectors + metadata in a store", "An answer, citations, logs"],
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Do not re-embed the corpus per question",
            text: "If your /ask handler loops every PDF and calls encode() again, you do not have RAG. You have a very expensive grep. Indexing is offline. Query embedding is one vector.",
          },
        ],
      },
      {
        id: "why",
        title: "Why interviewers split the whiteboard this way",
        blocks: [
          {
            type: "p",
            text: "If you can name both paths, they believe you have shipped something. If you only say “we used LangChain,” they will ask what runs at 2 a.m. when finance drops a new GST SOP, versus what runs when an AP clerk asks a question at noon.",
          },
          {
            type: "ul",
            items: [
              "Indexing owns parse quality. Garbage PDF tables become garbage answers forever.",
              "Query owns latency. Users feel search + rerank + LLM, not last night’s job.",
              "Re-index is how freshness works. There is no magic “the model learned the new policy.”",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "Invoice pack vs. a single ask",
            text: "A junior project that indexes a folder of GST invoices and HR PDFs with a CLI, then serves questions on FastAPI, is the shape hiring managers recognize. A notebook that does both in one cell is not.",
          },
        ],
      },
      {
        id: "how",
        title: "How each step earns its place",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Parse",
                text: "PDF/DOCX → text. Keep headings, tables, and page numbers if you can. This is where invoice line-items usually die.",
              },
              {
                title: "Clean",
                text: "Drop repeated headers, watermarks, “Page 3 of 40.” Normalize Unicode. Do not strip every newline — you need structure for chunking.",
              },
              {
                title: "Chunk",
                text: "Split into passages the retriever can score. Attach metadata: doc id, section, FY, department.",
              },
              {
                title: "Embed + upsert",
                text: "Encode each chunk. Write id, vector, text, metadata to the vector DB. Idempotent upserts so re-index is safe.",
              },
              {
                title: "Query: embed → search → top-k → rerank → prompt → LLM",
                text: "One query vector. ANN search. Keep k wide if you rerank (say 20), then cut to 5. Build the prompt. Generate. Log retrieved ids.",
              },
            ],
          },
          {
            type: "diagram",
            title: "Two arrows, one store",
            lines: [
              "INDEX:  files → parse → clean → chunk → embed → Vector DB",
              "QUERY:  question → embed → search top-k → [rerank] → prompt → LLM → answer",
              "Both meet at the Vector DB. Only QUERY calls the LLM.",
            ],
          },
        ],
      },
      {
        id: "example",
        title: "Example: new GST circular at 11 p.m.",
        blocks: [
          {
            type: "p",
            text: "Finance drops FY2026-27_GST_circular.pdf on a share. The index job parses it, chunks by heading, embeds, and upserts with metadata {doc_type: circular, fy: 2026-27}. No LLM is called.",
          },
          {
            type: "p",
            text: "At 9 a.m. an AP clerk asks, “Is RCM applicable on this GTA invoice?” The query path embeds that sentence, filters fy=2026-27, retrieves four chunks, reranks to two, and the LLM answers with a section citation. The circular was never in the model weights.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Split the jobs in FastAPI",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Index is a function. Query is a route.",
            code: `from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import chromadb

app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")
col = chromadb.PersistentClient(path="./chroma_gst").get_or_create_collection("policies")

def index_texts(items: list[dict]) -> None:
    """Run from a CLI or a queue worker — not from /ask."""
    texts = [x["text"] for x in items]
    col.upsert(
        ids=[x["id"] for x in items],
        documents=texts,
        embeddings=model.encode(texts).tolist(),
        metadatas=[x["meta"] for x in items],
    )

class Ask(BaseModel):
    question: str
    fy: str | None = None

@app.post("/ask")
def ask(body: Ask):
    where = {"fy": body.fy} if body.fy else None
    q_emb = model.encode([body.question]).tolist()
    hits = col.query(query_embeddings=q_emb, n_results=5, where=where)
    context = "\\n\\n".join(hits["documents"][0])
    prompt = f"Answer only from context.\\n\\n{context}\\n\\nQ: {body.question}"
    # llm_answer = client.chat(prompt)
    return {"ids": hits["ids"][0], "prompt": prompt}`,
          },
          {
            type: "callout",
            tone: "rule",
            title: "Log retrieved ids on every request",
            text: "You cannot debug RAG if you only log the final sentence. Persist query, filters, chunk ids, and scores. That log is your eval starter kit.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Walk me through your RAG pipeline.",
            a: "Two paths. Index: parse, clean, chunk, embed, upsert into Chroma with metadata. Query: embed the question, search top-k, optionally rerank, build a grounded prompt, call the LLM. I re-index when documents change. I never embed the whole corpus inside the request.",
            why: "This is the whiteboard. If you skip parse or skip metadata, they will keep digging.",
          },
          {
            type: "qa",
            q: "A new HR policy PDF arrives. What happens?",
            a: "An ingest job parses it, replaces the old chunks for that doc id, embeds the new ones, and upserts. Live queries start hitting the new vectors immediately. I do not fine-tune overnight and I do not restart the API unless the schema changed.",
          },
          {
            type: "qa",
            q: "Where does latency live?",
            a: "On the query path: query embed is cheap, ANN search is cheap at junior scale, rerank and the LLM dominate. Indexing can take minutes and that is fine — it is not on the user clock.",
          },
        ],
      },
    ],
  },
  {
    slug: "chunking",
    number: "11",
    title: "Chunking",
    subtitle: "Split so retrieval can hit a clause, not a 40-page PDF.",
    priority: "critical",
    minutes: 16,
    group: "Retrieval (RAG)",
    summary:
      "Chunking is the cut you make in a document before embedding. Too small loses meaning. Too large dilutes similarity and wastes prompt space. Start around 400–800 tokens, respect document structure, and measure — do not copy a blog’s 512.",
    youWillLearn: [
      "Fixed, recursive, semantic, and document-aware splitting",
      "The small-vs-large tradeoff in plain language",
      "How to pick a starting size and what to measure",
      "Why markdown headers beat blind character windows on policy PDFs",
    ],
    sections: [
      {
        id: "what",
        title: "What a chunk is",
        blocks: [
          {
            type: "p",
            text: "A chunk is the unit you embed and retrieve. The vector database never sees “the leave policy.” It sees passage 17 of 42. If that passage is the whole PDF, similarity is mush. If it is half a sentence, the match has no meaning.",
          },
          {
            type: "table",
            headers: ["Strategy", "How it splits", "Use when"],
            rows: [
              [
                "Fixed size",
                "Every N characters or tokens, plus overlap",
                "You have messy text and no headings. Baseline only.",
              ],
              [
                "Recursive",
                "Try big separators first (\\n\\n, headings, sentences), then fall back",
                "Default for most junior projects. Cheap and strong.",
              ],
              [
                "Semantic",
                "Cut where embedding similarity between sentences drops",
                "Narrative docs. Slower. Easy to overfit.",
              ],
              [
                "Document-aware",
                "Split on markdown headers, HTML tags, page blocks, tables as units",
                "HR policy, GST manuals, anything with a real outline.",
              ],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Recursive is “respect structure, then size”",
            text: "You do not invent a new algorithm. You say: split on headings, then paragraphs, then sentences, then words, until each piece is under the token budget. That is the recursive character splitter idea.",
          },
        ],
      },
      {
        id: "why",
        title: "Why size is a product decision",
        blocks: [
          {
            type: "p",
            text: "Small chunks retrieve precisely — “clause 4.2, sentence 2” — but the LLM may not see the exception in the next paragraph. Large chunks keep the exception, but the embedding averages the whole page, so a question about casual leave may match a page that also talks about maternity leave.",
          },
          {
            type: "ul",
            items: [
              "Small: higher precision, lower context, more chunks to store, clauses split in half.",
              "Large: more context, worse similarity, more prompt tokens, more noise.",
              "There is no universal best size. There is a size that works on your golden questions.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Copying 512 because a tutorial said so",
            text: "512 tokens is a habit from old embedding models with 512-token limits. Your model may handle 8192. Your policy clauses may be 120 tokens. Start 400–800, look at retrieved chunks for 20 real questions, then move. Measurement beats folklore.",
          },
        ],
      },
      {
        id: "how",
        title: "How to choose a size",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Start at 400–800 tokens with ~10–15% overlap",
                text: "This is a default, not a result. Use recursive separators that match your files.",
              },
              {
                title: "Prefer document structure",
                text: "For markdown HR policy: split on ## and ### first. Keep a table as one chunk if it fits.",
              },
              {
                title: "Inspect, do not only score",
                text: "Print chunk 0 and chunk 1 of the leave policy. If clause 4.2 is cut mid-sentence, overlap or split on headings.",
              },
              {
                title: "Measure on a golden set",
                text: "Retrieval hit-rate at k=5, plus faithfulness of the final answer. Change one variable at a time.",
              },
              {
                title: "Escalate to parent-child if needed",
                text: "Retrieve small, return the parent section to the LLM. That is the next chapter’s move.",
              },
            ],
          },
          {
            type: "widget",
            widget: "chunking",
          },
          {
            type: "callout",
            tone: "india",
            title: "Policy PDFs are not blog posts",
            text: "Indian HR and GST documents are heading-heavy, table-heavy, and bilingual in places. A character window that works on a news article will bisect “4.2 Casual Leave” and the table of entitlements. Parse headings. Treat tables as first-class chunks.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: one leave-policy page, three cuts",
        blocks: [
          {
            type: "p",
            text: "A page has heading “4. Casual Leave”, a 80-token definition, a 200-token table of entitlements, and a 60-token exception about restricted holidays. A 200-token fixed window either steals the exception from the definition or glues half the table to maternity leave on the next page.",
          },
          {
            type: "p",
            text: "A document-aware split keeps 4.x as a family: one chunk for the definition plus exception, one chunk for the table with the heading copied into the chunk prefix so the embedding still says “casual leave.”",
          },
        ],
      },
      {
        id: "implementation",
        title: "Recursive splitter, without hiding behind magic",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Recursive split with heading-aware separators",
            code: `from langchain_text_splitters import RecursiveCharacterTextSplitter

# Idea: try structure first, size second.
splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=80,
    separators=["\\n## ", "\\n### ", "\\n\\n", "\\n", ". ", " "],
)

leave_md = open("hr_leave_policy.md").read()
chunks = splitter.split_text(leave_md)

# Always look. If a GST table is shredded, handle tables separately.
for i, c in enumerate(chunks[:5]):
    print(i, len(c.split()), c[:120].replace("\\n", " "), "...")`,
          },
          {
            type: "p",
            text: "If you do not want the library, the idea is the same: walk separators from coarse to fine, pack pieces until you hit the size budget, then start a new chunk with overlap from the tail of the previous one.",
          },
          {
            type: "code",
            lang: "python",
            title: "Prefix the heading so the embedding knows the section",
            code: `def with_heading(heading: str, body: str) -> str:
    return f"{heading.strip()}\\n{body.strip()}"

chunk = with_heading("4.2 Casual Leave", table_or_clause)
# Embed this chunk text, not the table cells alone.`,
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "How did you choose your chunk size?",
            a: "I started at 600 tokens with 80-token overlap on a recursive splitter that prefers headings. Then I took 20 real questions from the HR and GST set, looked at what was retrieved, and measured hit-rate at k=5. I moved size only when I saw a failure mode — tables split, or answers missing the exception clause.",
            why: "“I used 512” is a fail. A starting point plus a measurement is a pass.",
          },
          {
            type: "qa",
            q: "Small chunks or large chunks?",
            a: "Small is better for retrieval precision, large is better for generation context. If I have to pick one number, I start 400–800 tokens. If both matter, I retrieve small and expand to a parent section — small-to-big — instead of one giant chunk.",
          },
          {
            type: "qa",
            q: "Our answers miss tables in the policy PDF. What do you change?",
            a: "I fix parse first — extract tables as structured text, not OCR soup. Then I keep a table as one chunk with the section heading prefixed. I do not just shrink chunk size and hope. If the table is huge, I store a summary chunk for retrieval and pass the full table as the parent.",
          },
        ],
      },
    ],
  },
  {
    slug: "overlap",
    number: "12",
    title: "Overlap",
    subtitle: "A 10–15% hedge against unlucky cuts. Then parent-child.",
    priority: "critical",
    minutes: 10,
    group: "Retrieval (RAG)",
    summary:
      "Overlap copies the tail of one chunk into the head of the next so a sentence that sits on the boundary is still fully inside at least one chunk. It is cheap insurance with a real cost: duplicated tokens, larger indexes, and repeated passages in the prompt.",
    youWillLearn: [
      "Why overlap exists",
      "The 10–15% heuristic and when to ignore it",
      "The duplication and cost side effects",
      "Parent-child / small-to-big as the next design",
    ],
    sections: [
      {
        id: "what",
        title: "What overlap does",
        blocks: [
          {
            type: "p",
            text: "If you cut every 600 tokens with zero overlap, a GST condition that starts at token 580 and ends at 640 is split. Neither chunk contains the full rule. Similarity may still match one half; the LLM will complete the sentence from memory. That is how hallucinations sneak in on “almost retrieved” clauses.",
          },
          {
            type: "p",
            text: "Overlap of 60–90 tokens on a 600-token chunk (about 10–15%) means that boundary sentence appears whole in chunk n or chunk n+1. You are buying completeness at the cut, not a new retrieval algorithm.",
          },
          {
            type: "diagram",
            title: "A boundary sentence",
            lines: [
              "Chunk n:     [... Casual leave is 12 days. It cannot be combined with]",
              "Chunk n+1:   [with the day before a restricted holiday. Privilege leave ...]",
              "With overlap, chunk n+1 starts at “It cannot be combined with the day before...”",
            ],
          },
        ],
      },
      {
        id: "why",
        title: "Why the heuristic is only a heuristic",
        blocks: [
          {
            type: "p",
            text: "10–15% is a starting ratio, not a law. It should cover a typical sentence or two in your domain. Legal GST sentences are long. A 40-token overlap can still rip a proviso. Look at real boundaries.",
          },
          {
            type: "ul",
            items: [
              "Duplication — every overlapped token is stored twice, embedded twice, paid twice.",
              "Prompt bloat — top-k=5 with heavy overlap often means the same sentence appears twice in the context.",
              "False confidence — overlap does not fix a bad parse or a heading-unaware splitter.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Overlap is not a substitute for structure",
            text: "If you are using 40% overlap to glue a shredded policy back together, stop. Split on headings, prefix the section title, or move to parent-child. Huge overlap is a smell, not a strategy.",
          },
        ],
      },
      {
        id: "how",
        title: "How to apply it, then grow up",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Set overlap to ~10–15% of chunk size",
                text: "600-token chunks → 60–90 tokens. Keep it in the same units you use for size (tokens, not mixed chars).",
              },
              {
                title: "Dedup at prompt time",
                text: "If two retrieved chunks share a long prefix, keep the better score and drop the twin. Overlap makes this common.",
              },
              {
                title: "When boundaries still hurt, go parent-child",
                text: "Index small child chunks for retrieval. When a child hits, pass the parent section (the whole 4.2) to the LLM. That is small-to-big.",
              },
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "PF / gratuity provisos",
            text: "Indian policy writing loves “Provided that…” on the next line. That proviso is the actual answer. Overlap exists so “Provided that” does not live alone in chunk n+1 with no subject. Parent-child is even better: retrieve the sentence, send clause 8 in full.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: the restricted-holiday line",
        blocks: [
          {
            type: "p",
            text: "Chunk ends: “Casual leave cannot be combined with.” Next chunk starts: “the day immediately before a restricted holiday.” Query: “Can I take CL before Diwali?” A model that only sees the first chunk may say yes. With overlap, one of the two chunks has the full prohibition.",
          },
          {
            type: "p",
            text: "Small-to-big version: the child is the 40-token sentence, the parent is section 4.2 including the holiday table. Retrieval stays sharp. Generation sees the table.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Overlap, then parent-child metadata",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Fixed windows with overlap (teaching version)",
            code: `def chunk_with_overlap(tokens: list[str], size=600, overlap=80) -> list[list[str]]:
    if overlap >= size:
        raise ValueError("overlap must be smaller than size")
    step = size - overlap
    chunks = []
    i = 0
    while i < len(tokens):
        chunks.append(tokens[i : i + size])
        if i + size >= len(tokens):
            break
        i += step
    return chunks`,
          },
          {
            type: "code",
            lang: "python",
            title: "Parent-child records in Chroma",
            code: `# Child is what you embed and search.
# Parent is what you put in the prompt.
col.add(
    ids=["leave-4.2-s3"],
    documents=["Casual leave cannot be combined with the day before a restricted holiday."],
    metadatas=[{
        "parent_id": "leave-4.2",
        "section": "4.2",
        "doc": "HR-leave-2026",
    }],
)
# On hit: fetch parent_id from a doc store and send the full section to the LLM.`,
          },
          {
            type: "callout",
            tone: "rule",
            title: "Count duplicated tokens",
            text: "If overlap is 15% and you have 10k chunks, you stored roughly 15% extra embeddings. Know the number. Interviewers like candidates who can price a design.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Why do we overlap chunks?",
            a: "Because a hard cut splits sentences and clauses. Overlap makes sure a boundary sentence lives fully inside at least one chunk so retrieval and the LLM see a complete rule. I start at 10–15% of chunk size and inspect real cuts on the policy PDF.",
          },
          {
            type: "qa",
            q: "What is the downside?",
            a: "Duplication. More storage, more embedding cost, and the same sentence showing up twice in the prompt. I keep overlap modest and I drop near-duplicate chunks before calling the LLM.",
          },
          {
            type: "qa",
            q: "What do you do after overlap still fails?",
            a: "Parent-child, or small-to-big: retrieve on a small sentence-level child, then expand to the parent heading or page for generation. That gives precision and context without a 40% overlap hack.",
          },
        ],
      },
    ],
  },
  {
    slug: "vector-db",
    number: "13",
    title: "Vector databases",
    subtitle: "Chroma is enough to learn. Know why you would leave it.",
    priority: "critical",
    minutes: 14,
    group: "Retrieval (RAG)",
    summary:
      "A vector database stores embeddings, runs nearest-neighbor search, and usually lets you filter on metadata. Chroma and FAISS are the junior defaults. Pinecone, Weaviate, and Milvus show up when you need a managed service, hybrid search, or scale.",
    youWillLearn: [
      "What a vector DB actually does (and does not)",
      "Chroma vs FAISS vs Pinecone vs Weaviate vs Milvus",
      "Local vs managed, and metadata filters",
      "A clean story for why a junior project uses Chroma — and when to move",
    ],
    sections: [
      {
        id: "what",
        title: "What you are storing",
        blocks: [
          {
            type: "p",
            text: "Each row is roughly: an id, a vector, the original text, and metadata (doc, section, fy, department). Search is “find vectors close to this query vector,” often cosine similarity or inner product, optionally restricted by a metadata filter.",
          },
          {
            type: "p",
            text: "It is not a replacement for Postgres. You still want a system of record for the PDFs, ACLs, and parent documents. The vector DB is an index, not your source of truth.",
          },
          {
            type: "table",
            headers: ["Store", "Kind", "Junior-project fit"],
            rows: [
              [
                "Chroma",
                "Embedded / local server, simple API",
                "Yes. Persist to disk, metadata filters, good docs.",
              ],
              [
                "FAISS",
                "Library (index in process / files), not a full DB",
                "Yes if you like control. You bring metadata and persistence.",
              ],
              [
                "Pinecone",
                "Managed cloud, namespaces, filters",
                "When you do not want to run infra. Costs money.",
              ],
              [
                "Weaviate",
                "DB with vectors + inverted index (hybrid)",
                "When you want hybrid and a real query language.",
              ],
              [
                "Milvus / Zilliz",
                "Scale-out vector DB",
                "When the corpus is large or the team already runs it.",
              ],
            ],
          },
        ],
      },
      {
        id: "why",
        title: "Why the choice is an interview question",
        blocks: [
          {
            type: "p",
            text: "They are not testing whether you memorized ANN algorithms. They are testing whether you picked a tool for a reason, know the lock-in, and know the escape hatch.",
          },
          {
            type: "ul",
            items: [
              "Local (Chroma, FAISS): zero cloud bill, data stays on laptop, perfect for a portfolio RAG on HR PDFs.",
              "Managed (Pinecone, Weaviate Cloud, Zilliz): backups, auth, scale, someone else’s uptime. You pay, and you plan an export.",
              "Metadata filters: “only FY 2025-26 GST circulars” is not optional in production. If your store cannot filter, you will post-filter in Python and lie to yourself about recall.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Putting Pinecone on a resume with 200 chunks",
            text: "If the corpus is a folder of policies, Chroma is the honest choice. Name-dropping a managed vector DB without a scale or ops reason looks like a tutorial clone. Say Chroma, say why, say the metric that would make you move.",
          },
        ],
      },
      {
        id: "how",
        title: "How search and filters work",
        blocks: [
          {
            type: "p",
            text: "Default query: encode the question, ask for k nearest neighbors. With filters: encode the question, ask for k nearest neighbors among rows where fy=2025-26 and doc_type=policy. Filtering first (or during search) is how you avoid retrieving last year’s leave matrix.",
          },
          {
            type: "widget",
            widget: "cosine",
          },
          {
            type: "callout",
            tone: "note",
            title: "FAISS is an index, Chroma is a small database",
            text: "FAISS gives you fast kNN. You store ids, text, and fy in something else (sqlite, parquet, dict). Chroma stores the payload next to the vector. That is why Chroma is nicer for a first FastAPI project.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Filter like an AP clerk",
            text: "Queries are never just semantic. “Show the HSN note for FY 2025-26, GST only, not the HR wiki.” Metadata is how you stop the leave policy from answering an invoice question because both mention “exemption.”",
          },
        ],
      },
      {
        id: "example",
        title: "Example: why you would move off Chroma",
        blocks: [
          {
            type: "p",
            text: "Your portfolio: 300 HR + GST chunks, one developer, FastAPI on a VM. Chroma persistent client. Fine.",
          },
          {
            type: "p",
            text: "You would move when any of these show up: multiple writers, millions of vectors, the need for hybrid search inside the DB, SSO and row-level security, or a team that already standardizes on one engine. Then Weaviate/Milvus/Pinecone become a reason, not a brand.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Chroma with metadata filters",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Persistent Chroma + FY filter",
            code: `import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

ef = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path="./chroma_data")
col = client.get_or_create_collection("gcc_docs", embedding_function=ef)

col.upsert(
    ids=["gst-rcm-12-2"],
    documents=["Section 12(2) CGST: reverse charge on GTA under notified conditions."],
    metadatas=[{"doc_type": "policy", "fy": "2025-26", "act": "CGST"}],
)

hits = col.query(
    query_texts=["Is reverse charge applicable on this GTA invoice?"],
    n_results=4,
    where={"$and": [{"doc_type": "policy"}, {"fy": "2025-26"}]},
)
print(hits["ids"][0], hits["documents"][0])`,
          },
          {
            type: "callout",
            tone: "rule",
            title: "Always store the text you will send to the LLM",
            text: "If you only store vectors, you cannot build a prompt. Persist document text, or persist a pointer to the parent in object storage. Interviewers will ask which.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Why Chroma for your project?",
            a: "Because I had thousands of chunks, not millions, I wanted metadata filters, and I wanted to persist on disk without running a cluster. Chroma let me ship a FastAPI RAG in a week. I would move if I needed hybrid search inside the engine, HA, or a much larger corpus.",
            why: "This is the expected junior answer. Humble and specific.",
          },
          {
            type: "qa",
            q: "Chroma vs FAISS vs Pinecone?",
            a: "FAISS is a kNN library — I manage text and metadata. Chroma is a small vector DB with a Python API. Pinecone is managed: good when ops and scale matter, overkill and paid when my data is a folder of policies. Weaviate and Milvus sit in the “real DB / scale-out” bucket, especially if I want hybrid.",
          },
          {
            type: "qa",
            q: "How do you stop HR chunks from answering a GST question?",
            a: "Metadata filters: doc_type, fy, department. I also namespace collections if the domains never should mix. Semantic search alone will confuse “exemption” in leave policy with “exemption” in GST.",
          },
        ],
      },
    ],
  },
  {
    slug: "hybrid-search",
    number: "14",
    title: "Hybrid search",
    subtitle: "Keywords catch GSTIN. Vectors catch meaning. Production usually wants both.",
    priority: "critical",
    minutes: 14,
    group: "Retrieval (RAG)",
    summary:
      "Semantic search finds paraphrases. Keyword search (BM25) finds exact tokens — invoice numbers, HSN codes, section ids. Hybrid combines the two, often with reciprocal rank fusion. In production, hybrid is frequently the best default.",
    youWillLearn: [
      "When BM25 wins and when embeddings win",
      "Why “GST invoice” and identifiers need keywords",
      "Reciprocal rank fusion as a simple, robust combiner",
      "Why hybrid is the usual production choice",
    ],
    sections: [
      {
        id: "what",
        title: "What the three modes are",
        blocks: [
          {
            type: "p",
            text: "Keyword / BM25 scores exact and rare terms. It loves “HSN 9983”, “Section 12(2)”, “GSTIN”, a ticket id. It fails when the user says “reverse charge on transport” and the policy says “RCM on GTA.”",
          },
          {
            type: "p",
            text: "Semantic search embeds the question and the chunks into the same space. It loves paraphrase. It fails on rare identifiers that the embedding model never treated as precious, and it sometimes matches a thematically similar but legally wrong clause.",
          },
          {
            type: "p",
            text: "Hybrid runs both, then merges the ranked lists. You do not need a neural fusion model on day one. Reciprocal rank fusion is enough to explain and to ship.",
          },
          {
            type: "table",
            headers: ["Query", "Keyword", "Semantic", "Hybrid"],
            rows: [
              ["“HSN 9983 treatment”", "Wins if 9983 is in the text", "May miss the number", "Keeps the hit"],
              ["“Can I take CL before a festival?”", "May miss “casual leave”", "Wins on paraphrase", "Keeps the hit"],
              ["“GST invoice RCM GTA”", "Strong on GST, RCM, GTA", "Strong on meaning", "Usually best"],
            ],
          },
        ],
      },
      {
        id: "why",
        title: "Why production teams default to hybrid",
        blocks: [
          {
            type: "p",
            text: "User queries are messy. Half are natural language, half are identifiers copied from an ERP. A system that can only embed will look brilliant in a demo on “what is casual leave” and then fail on the first GSTIN paste.",
          },
          {
            type: "callout",
            tone: "rule",
            title: "Hybrid is often best in production",
            text: "If you remember one retrieval sentence from this handbook: run BM25 and vector search, fuse the ranks, then rerank. Pure embedding search is a demo. Pure keyword is 2012. Hybrid is what survives contact with invoices.",
          },
          {
            type: "callout",
            tone: "india",
            title: "The “GST invoice” query",
            text: "Clerks search “GST invoice”, a GSTIN, an IRN, an HSN, or “Section 31.” Those tokens must match. Embeddings will retrieve a paragraph about e-invoicing that never contains the number they pasted. Keywords catch the number; vectors catch “debit note for tax already paid.” You want both.",
          },
        ],
      },
      {
        id: "how",
        title: "How reciprocal rank fusion works",
        blocks: [
          {
            type: "p",
            text: "RRF does not use raw scores. Scores from BM25 and cosine are not on the same scale, so adding them is a trap. RRF uses rank position: each list contributes 1 / (k + rank), with k usually 60. Documents that appear near the top of either list rise. Documents that appear in both rise more.",
          },
          {
            type: "diagram",
            title: "Fuse, then cut",
            lines: [
              "BM25 top 20  ──┐",
              "               ├─ RRF → fused top 20 → optional cross-encoder rerank → top 5 → prompt",
              "Vector top 20 ─┘",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Do not add cosine to BM25",
            text: "0.82 cosine and 12.4 BM25 are not comparable. You will silently let one retriever dominate. Rank fusion (or a learned mixer you actually evaluate) — not arithmetic on raw scores.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: identifier vs paraphrase",
        blocks: [
          {
            type: "p",
            text: "Query A: “GSTIN 27AABCU9603R1ZN not printing on invoice.” BM25 finds the SOP row with that GSTIN or the template field name. Semantic search finds a generic “how to print invoices” page.",
          },
          {
            type: "p",
            text: "Query B: “Do we charge tax when the customer is SEZ?” Semantic search maps SEZ to the exemption clause even if the user never said “zero rated.” BM25 may miss if the policy never uses the word “SEZ” in that spelling.",
          },
          {
            type: "p",
            text: "Hybrid returns both families. Rerank decides which five enter the prompt.",
          },
        ],
      },
      {
        id: "implementation",
        title: "BM25 + vectors + RRF",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Reciprocal rank fusion",
            code: `def rrf(rank_lists: list[list[str]], k: int = 60) -> list[str]:
    scores: dict[str, float] = {}
    for ranks in rank_lists:
        for rank, doc_id in enumerate(ranks, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)

bm25_ids = ["gst-31", "gst-12-2", "hr-leave-4"]   # from a keyword index
vec_ids = ["gst-12-2", "gst-rcm-note", "gst-31"]  # from Chroma
fused = rrf([bm25_ids, vec_ids])
top20 = fused[:20]
# then rerank top20 → top5 for the prompt`,
          },
          {
            type: "p",
            text: "You can BM25 with rank-bm25 or Elasticsearch, and vectors with Chroma. Weaviate and some managed stores will hybrid for you. In an interview, explain RRF even if a product feature hides it.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Keyword vs semantic vs hybrid?",
            a: "Keyword / BM25 is exact tokens — HSN, GSTIN, section numbers. Semantic is meaning and paraphrase. Hybrid runs both and fuses ranks. In production I default to hybrid because real users mix English questions with identifiers.",
          },
          {
            type: "qa",
            q: "What is reciprocal rank fusion?",
            a: "A way to merge ranked lists without mixing incompatible scores. Each document gets 1 over (k plus its rank) in each list, usually k=60. I add those and sort. It is simple, strong, and easy to defend.",
          },
          {
            type: "qa",
            q: "Give me a query where embeddings alone fail.",
            a: "“GST invoice 9983” or a pasted GSTIN. The embedding may retrieve a nearby discussion of e-invoicing and miss the chunk that actually contains 9983. I want BM25 in that path.",
          },
        ],
      },
    ],
  },
  {
    slug: "reranking",
    number: "15",
    title: "Reranking",
    subtitle: "Retrieve 20 cheaply, then spend compute to keep 5.",
    priority: "high",
    minutes: 12,
    group: "Retrieval (RAG)",
    summary:
      "First-stage retrieval is fast and approximate. A reranker takes a wider candidate list (say 20) and scores each (query, document) pair more carefully, keeping the best 5 for the prompt. You buy quality with latency and money.",
    youWillLearn: [
      "Why a two-stage retrieve-then-rerank pipeline exists",
      "Cross-encoder vs LLM rerank",
      "The latency and cost bill",
      "How to talk about k=20 → n=5 in an interview",
    ],
    sections: [
      {
        id: "what",
        title: "What a reranker is",
        blocks: [
          {
            type: "p",
            text: "Bi-encoders (your embedding model) encode the query once and each chunk once, then compare vectors. That is why indexing is possible. It is also why the score is a bit dumb: the query and the document never saw each other during encoding.",
          },
          {
            type: "p",
            text: "A cross-encoder reads the query and the document together and outputs a relevance score. That is much more accurate and much too slow to run on 100,000 chunks. So you retrieve 20 with ANN, rerank 20, keep 5.",
          },
          {
            type: "diagram",
            title: "Two stages",
            lines: [
              "100k chunks → ANN / hybrid → 20 candidates → cross-encoder or LLM → 5 chunks → prompt",
            ],
          },
        ],
      },
      {
        id: "why",
        title: "Why the extra hop is worth it",
        blocks: [
          {
            type: "p",
            text: "First-stage recall is the goal: the right clause must be in the 20. Precision in the prompt is the reranker’s job: the LLM should not see 15 distractors. More context is not always better; reranking is how you refuse the distractors.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Two clauses, one word",
            text: "“Exemption” in GST and “exemption” in leave policy both retrieve. A cross-encoder that sees the full question “GTA reverse charge exemption” will push the GST chunk up and the HR chunk down. That is the point.",
          },
        ],
      },
      {
        id: "how",
        title: "How the two rerankers differ",
        blocks: [
          {
            type: "table",
            headers: ["", "Cross-encoder", "LLM rerank"],
            rows: [
              [
                "What",
                "Small model, query+doc → score",
                "Prompt an LLM: “order these passages”",
              ],
              [
                "Quality",
                "Strong on relevance if the model matches the domain",
                "Flexible, can follow custom rules, noisier",
              ],
              [
                "Latency",
                "Tens of ms to a few hundred ms for 20 pairs on CPU/GPU",
                "Seconds, and you pay generation tokens",
              ],
              [
                "Cost",
                "Mostly your GPU/CPU",
                "API bill per request, easy to explode",
              ],
              [
                "Junior default",
                "ms-marco MiniLM-style cross-encoder",
                "Only if you must apply business rules in language",
              ],
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Reranking 200 chunks with GPT on every request",
            text: "You just added a second, slower LLM call and you still might not beat a MiniLM cross-encoder. Start with a local cross-encoder on 20 candidates. Escalate to LLM rerank only with a measured win and a latency budget.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: retrieve 20, keep 5",
        blocks: [
          {
            type: "p",
            text: "Question: “Is RCM applicable on this inbound GTA invoice in FY 2025-26?” Hybrid search returns 20 chunks: three on GTA, two on outbound freight, several on “reverse charge” for other categories, one HR chunk that mentioned “charges.”",
          },
          {
            type: "p",
            text: "Cross-encoder scores the 20 pairs. The three GTA chunks rise. You send the top 5. The LLM no longer has to ignore a leave-policy hit in slot 2.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Cross-encoder rerank in a few lines",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Retrieve wide, rerank narrow",
            code: `from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def rerank(query: str, docs: list[str], keep: int = 5) -> list[str]:
    pairs = [(query, doc) for doc in docs]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(docs, scores), key=lambda x: float(x[1]), reverse=True)
    return [doc for doc, _ in ranked[:keep]]

# hits = chroma.query(..., n_results=20)
# prompt_docs = rerank(question, hits["documents"][0], keep=5)`,
          },
          {
            type: "callout",
            tone: "note",
            title: "Measure the bill",
            text: "Log p50/p95 for search, rerank, and LLM separately. If rerank is 80 ms and the LLM is 1.6 s, the quality win is cheap. If you moved rerank to a large LLM and p95 became 4 s, you need a product decision, not a default.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Why retrieve 20 and rerank to 5?",
            a: "First-stage search is fast but approximate, so I keep recall high with a wider k. The reranker looks at query and document together and is too slow for the whole corpus, so I run it on 20 and pass 5 to the LLM. Five clean chunks beat twenty noisy ones.",
          },
          {
            type: "qa",
            q: "Cross-encoder vs LLM rerank?",
            a: "Cross-encoder is a small model that scores a pair — my default, local, cheap, tens to hundreds of milliseconds. LLM rerank asks a generative model to order passages. It can follow custom rules but it is slower and costs tokens. I use it only when I have evidence it wins.",
          },
          {
            type: "qa",
            q: "What is the cost of reranking?",
            a: "Latency on the query path, plus hardware or API spend. I always split timings in logs. I also remember that a bad reranker can drop the one correct chunk — so I evaluate recall@5 after rerank, not only the final answer.",
          },
        ],
      },
    ],
  },
  {
    slug: "rag-failures",
    number: "16",
    title: "RAG failure modes",
    subtitle: "Most “the LLM is dumb” bugs are retrieval. Debug in order.",
    priority: "critical",
    minutes: 16,
    group: "Retrieval (RAG)",
    summary:
      "RAG can fail at parse, chunk, embed, retrieve, context noise, or generation. A fluent wrong answer is often a retrieval miss, not a weak model. Debug from the documents upward. Never start by swapping GPT for Claude.",
    youWillLearn: [
      "The failure chain: parse → chunk → embed → retrieve → noise → hallucination",
      "Why RAG quality is not LLM quality",
      "A debugging order you can use on a call",
      "What logs you need before you touch the model",
    ],
    sections: [
      {
        id: "what",
        title: "What actually breaks",
        blocks: [
          {
            type: "table",
            headers: ["Stage", "What you see", "Typical cause"],
            rows: [
              [
                "Parse",
                "Tables empty, numbers wrong, Hindi/English mixed into garbage",
                "PDF text layer missing, columns read left-to-right across a table",
              ],
              [
                "Chunk",
                "Answer misses the proviso, clause cut in half",
                "Window too small, no overlap, headings ignored",
              ],
              [
                "Embed",
                "Paraphrases miss, or every policy looks similar",
                "Wrong model for the language/domain, un-prefixed headings",
              ],
              [
                "Retrieve",
                "Right doc never in top-k",
                "No hybrid, no filters, k too small, stale index",
              ],
              [
                "Noise",
                "Model quotes the wrong section confidently",
                "top-k too large, no rerank, duplicate overlap",
              ],
              [
                "Hallucination",
                "Fluent answer not in any chunk",
                "Prompt does not forbid invention, or retrieval was empty and you still called the LLM",
              ],
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "RAG quality is not LLM quality",
            text: "If the right chunk never entered the prompt, a larger model cannot save you. If the right chunk entered and the model still invented a number, that is generation. Know which one you are in before you spend money.",
          },
        ],
      },
      {
        id: "why",
        title: "Why juniors debug the wrong end",
        blocks: [
          {
            type: "p",
            text: "The visible artifact is a sentence from the LLM, so people change temperature, the model name, or the system prompt. Those knobs matter last. Interviewers have watched this movie. They want you to open the retrieved chunks first.",
          },
          {
            type: "callout",
            tone: "trap",
            title: "“Let’s try GPT-4o” as step one",
            text: "That hides the bug and raises the bill. If chunk ids for the Diwali-CL question never include 4.2, the model is not the patient. Swap the model only after retrieval looks correct on a golden set.",
          },
        ],
      },
      {
        id: "how",
        title: "Debugging order",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "1. Look at the raw parse",
                text: "Open the extracted text for that PDF page. If the GST table is a single mashed line, stop. Fix parse or OCR.",
              },
              {
                title: "2. Look at the chunks",
                text: "Is the gold sentence intact in some chunk? If it is split, fix size, overlap, or headers.",
              },
              {
                title: "3. Look at retrieval",
                text: "Log query, filters, ids, scores. Is the gold chunk in top-20? If no: hybrid, filters, embedding, index freshness. If yes but not top-5: rerank.",
              },
              {
                title: "4. Look at the prompt",
                text: "Did you actually send those chunks? Any duplication? Instructions to refuse when missing?",
              },
              {
                title: "5. Only then look at generation",
                text: "Faithfulness failures with good context are prompt or model issues. Empty retrieval should not call the LLM without a fallback.",
              },
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "Invoice PDF special",
            text: "Indian GST invoices are often scans or dual-language printouts. Parse failures here are the default, not the edge case. A project that admits “we extract line-items with a table parser, not a generic PDF-to-text” scores well.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: wrong PF rate, confident tone",
        blocks: [
          {
            type: "p",
            text: "User: “What is the employee PF contribution?” System answers “12% of basic” with a smile. Gold policy says 12% with a wage ceiling. Debug: the ceiling sentence lived in the next chunk, k=3 missed it, and the prompt never said “if incomplete, say so.” You do not need a new model. You need the ceiling chunk in the prompt — overlap, parent-child, or higher recall.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Log the chain, not the vibe",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "A trace you can actually debug",
            code: `import json, time

def ask_with_trace(question: str, col, rerank_fn, llm) -> dict:
    t0 = time.perf_counter()
    hits = col.query(query_texts=[question], n_results=20)
    retrieve_ms = (time.perf_counter() - t0) * 1000
    docs = hits["documents"][0]
    ids = hits["ids"][0]
    kept = rerank_fn(question, list(zip(ids, docs)), keep=5)
    prompt = (
        "Answer only from the context. If the context is insufficient, say so.\\n\\n"
        + "\\n\\n".join(f"[{i}] {t}" for i, t in kept)
        + f"\\n\\nQuestion: {question}"
    )
    answer = llm(prompt) if kept else "I do not have that in the indexed policies."
    trace = {
        "question": question,
        "retrieved_ids": ids,
        "kept_ids": [i for i, _ in kept],
        "retrieve_ms": round(retrieve_ms, 1),
        "answer": answer,
    }
    print(json.dumps(trace, ensure_ascii=False))
    return trace`,
          },
          {
            type: "callout",
            tone: "note",
            title: "Empty retrieval is a first-class outcome",
            text: "Do not let the LLM answer from pretraining when Chroma returned nothing. Return a structured “not in index” and, in a product, a ticket to the policy owner.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "The answers are wrong. What do you do first?",
            a: "I open the trace: parsed text, chunks, retrieved ids, what actually went into the prompt. I check whether the gold clause was retrieved. If it was not, I do not touch the LLM. I fix parse, chunking, hybrid search, or filters first.",
            why: "This is the senior-sounding junior answer. Order is the skill.",
          },
          {
            type: "qa",
            q: "Is that an LLM failure or a RAG failure?",
            a: "If the supporting chunk never entered the prompt, it is RAG — retrieval or ingest. If the chunk was there and the model still invented a rate, it is generation: prompt contract, temperature, or the model ignoring instructions. I do not mix those two in a postmortem.",
          },
          {
            type: "qa",
            q: "How do you debug a hallucination on an invoice question?",
            a: "Confirm parse of the invoice and the GST SOP, confirm the HSN/GSTIN chunks exist, confirm hybrid retrieval hit them, confirm they survived rerank, then read the prompt. Hallucinated HSN numbers almost always mean the identifier never made it into context.",
          },
        ],
      },
    ],
  },
  {
    slug: "rag-eval",
    number: "17",
    title: "Evaluating RAG",
    subtitle: "Score retrieval and generation separately. A pretty answer is not a metric.",
    priority: "critical",
    minutes: 14,
    group: "Retrieval (RAG)",
    summary:
      "You evaluate RAG on faithfulness, relevance, retrieval precision and recall, plus latency and cost. You need a golden set of real questions with cited passages. If you only grade the final sentence, you will tune the wrong stage.",
    youWillLearn: [
      "Faithfulness vs relevance vs precision vs recall",
      "Why latency and cost belong on the same scorecard",
      "How to build a small golden set from HR and GST questions",
      "The rule: never evaluate only the final answer",
    ],
    sections: [
      {
        id: "what",
        title: "What to measure",
        blocks: [
          {
            type: "table",
            headers: ["Metric", "Question it answers", "Stage"],
            rows: [
              [
                "Context recall",
                "Did we retrieve the passages that contain the answer?",
                "Retrieval",
              ],
              [
                "Context precision",
                "Of the chunks we sent, how many were actually useful?",
                "Retrieval / rerank",
              ],
              [
                "Faithfulness",
                "Are the claims in the answer supported by the context?",
                "Generation",
              ],
              [
                "Answer relevance",
                "Does the answer address this question?",
                "Generation",
              ],
              [
                "Latency",
                "p50 / p95 of retrieve, rerank, LLM, total",
                "System",
              ],
              [
                "Cost",
                "₹ per query, tokens in/out, rerank compute",
                "System",
              ],
            ],
          },
          {
            type: "p",
            text: "A golden set is a spreadsheet you trust: question, answer (or notes), and the passage ids that must be retrieved. Twenty well-chosen HR and GST questions beat two hundred random chatbot logs.",
          },
        ],
      },
      {
        id: "why",
        title: "Why final-answer grading lies",
        blocks: [
          {
            type: "p",
            text: "The model can give a correct-looking answer from pretraining while retrieving the wrong policy year. Faithfulness would fail; a human glancing at the sentence might pass it. The model can also retrieve the right clause and then ramble. Relevance would fail; retrieval was fine. If you only thumbs-up the final answer, you will “fix” the wrong pipeline.",
          },
          {
            type: "callout",
            tone: "trap",
            title: "Demo-driven eval",
            text: "Five live questions in a screen-share are not eval. They are a demo. Interviewers will ask for a set, a metric, and a before/after. “Users liked it” is not a number.",
          },
        ],
      },
      {
        id: "how",
        title: "How to run a junior-scale eval",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Write 20–50 gold questions",
                text: "Real phrasing: “can I take CL before Diwali”, “RCM on GTA inbound”, “PF ceiling.” Attach the source clause id.",
              },
              {
                title: "Score retrieval first",
                text: "For each question, is the gold id in top-5? In top-20? That is recall. How many of the 5 were irrelevant? That is precision.",
              },
              {
                title: "Score the answer second",
                text: "Faithfulness: every claim traceable to a sent chunk. Relevance: it answered this question, not a nearby one.",
              },
              {
                title: "Record p95 and ₹/query",
                text: "A 0.04 faithfulness win that triples latency is a product decision. Put both on the README table.",
              },
              {
                title: "Change one knob",
                text: "Chunk size or hybrid or rerank — not all three. Re-run the same 20.",
              },
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "Gold from the business, not from you",
            text: "Ask an AP clerk or HR coordinator for the ten questions they actually search. Your paraphrases will overfit the chunk text you already read. Interviewers love “I sat with finance for 30 minutes and took their queries.”",
          },
        ],
      },
      {
        id: "example",
        title: "Example: two systems, one pretty answer",
        blocks: [
          {
            type: "p",
            text: "System A answers PF contribution “12%” with no ceiling, retrieved HR 2019. Human demo: looks fine. Recall of the 2026 clause: 0. Faithfulness vs 2026 policy: fail.",
          },
          {
            type: "p",
            text: "System B retrieves the 2026 clause including the ceiling, answers with the ceiling, p95 1.9 s, ₹0.18/query. The README shows recall@5 0.81 → 0.90 after hybrid, faithfulness 0.74 → 0.86 after rerank. That is an interview artifact. System A is a chatbot.",
          },
        ],
      },
      {
        id: "implementation",
        title: "A golden set is a JSONL file",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Retrieval recall@k on a gold file",
            code: `import json

def recall_at_k(gold_path: str, retrieve_fn, k: int = 5) -> float:
    hits = 0
    n = 0
    with open(gold_path) as f:
        for line in f:
            row = json.loads(line)
            got = set(retrieve_fn(row["question"], k=k))
            need = set(row["gold_ids"])
            hits += int(len(got & need) > 0)
            n += 1
    return hits / n

# gold.jsonl line:
# {"question": "Can I take CL the day before Diwali?",
#  "gold_ids": ["leave-4.2"],
#  "notes": "Must include restricted-holiday proviso"}`,
          },
          {
            type: "p",
            text: "Add a second loop that sends the prompt to the LLM and grades faithfulness against the retrieved texts — by hand at first, then with a judge model. Hand labels on 20 rows teach you more than a dashboard you do not trust.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "How do you evaluate your RAG system?",
            a: "I keep a golden set of real questions with the passage ids that must be retrieved. I score recall@5 and precision of the context first, then faithfulness and answer relevance of the generation, plus p95 latency and rupees per query. I do not only read the final sentence.",
            why: "Separating retrieval from generation is the bar.",
          },
          {
            type: "qa",
            q: "What is faithfulness vs relevance?",
            a: "Faithfulness: the answer’s claims are supported by the retrieved context — no invented PF ceiling. Relevance: the answer is actually about this question — not a correct-looking paragraph about maternity leave when I asked about casual leave.",
          },
          {
            type: "qa",
            q: "Why not evaluate only the final answer?",
            a: "Because a right-looking answer can come from the model’s memory with wrong retrieval, and a right retrieval can still produce a waffle. If I only score the end, I will swap models when I should have fixed BM25. I need stage-level metrics to know which knob to turn.",
          },
        ],
      },
    ],
  },
  {
    slug: "ragas",
    number: "18",
    title: "RAGAS",
    subtitle: "A starter harness with LLM-as-judge. Useful, biased, not a court.",
    priority: "high",
    minutes: 12,
    group: "Retrieval (RAG)",
    summary:
      "RAGAS is a library that scores RAG runs with metrics like faithfulness, answer relevancy, context precision, and context recall. Under the hood many scores are LLM-as-judge. You must know how to run it conceptually and where the judge is weak.",
    youWillLearn: [
      "The main RAGAS metrics and which pipeline stage they hit",
      "The conceptual run: dataset of question, contexts, answer, optional ground truth",
      "Why LLM-as-judge is convenient and untrustworthy",
      "How to talk about RAGAS in a junior interview without overselling it",
    ],
    sections: [
      {
        id: "what",
        title: "What RAGAS gives you",
        blocks: [
          {
            type: "p",
            text: "RAGAS (Retrieval Augmented Generation Assessment) packages a dataset schema and metrics so you are not inventing spreadsheets from zero. You pass rows of question, retrieved contexts, generated answer, and optionally a ground-truth answer.",
          },
          {
            type: "table",
            headers: ["Metric", "Needs ground truth?", "In one line"],
            rows: [
              [
                "Faithfulness",
                "No",
                "Are answer claims entailed by the contexts?",
              ],
              [
                "Answer relevancy",
                "No",
                "Does the answer address the question?",
              ],
              [
                "Context precision",
                "Yes (or annotated relevant chunks)",
                "Are useful chunks ranked higher in the retrieved list?",
              ],
              [
                "Context recall",
                "Yes",
                "Do the contexts cover the ground-truth answer?",
              ],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Names move; ideas do not",
            text: "The library’s metric names and defaults change. In an interview, define the idea. Do not freeze an import path from a blog dated last quarter.",
          },
        ],
      },
      {
        id: "why",
        title: "Why people use it — and why they should be careful",
        blocks: [
          {
            type: "p",
            text: "Without a harness, teams argue from vibes. RAGAS gives you a loop: change chunking, re-generate, compare a table. That is worth putting on a junior README.",
          },
          {
            type: "p",
            text: "Many metrics ask another LLM to extract claims and judge support. That judge has a model family, a prompt, a temperature, and a bill. It can be wrong on GST the same way your generator can be wrong on GST.",
          },
          {
            type: "callout",
            tone: "trap",
            title: "Treating 0.86 as a scientific constant",
            text: "Faithfulness 0.86 on RAGAS is “this judge, this prompt, this sample, this week.” It is not a law of physics. Do not compare your 0.86 to someone else’s 0.91 across models and quietly declare victory. Use it to compare your system A vs system B on the same set.",
          },
        ],
      },
      {
        id: "how",
        title: "How to run it conceptually",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Freeze a dataset",
                text: "N questions. For each: the contexts your pipeline retrieved, the answer it generated, and a ground-truth answer if you have one.",
              },
              {
                title: "Run the pipeline once, store traces",
                text: "Do not call RAGAS against a live non-deterministic system without saving the contexts. You need replay.",
              },
              {
                title: "Compute metrics",
                text: "Faithfulness and answer relevancy can run without gold answers. Context recall/precision need gold or labeled contexts.",
              },
              {
                title: "Read failures, not only the mean",
                text: "Open the worst 10 rows. If the judge flagged a correct GST citation as unfaithful, that is a judge error. If the context missed clause 4.2, that is yours.",
              },
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "LLM-as-judge on Indian policy",
            text: "Judges trained on generic English web text miss “Provided that”, wage ceilings, and RCM notifications. For GST and HR, keep a human-labelled slice. Use RAGAS to triage, not to certify.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: a number that moved for the wrong reason",
        blocks: [
          {
            type: "p",
            text: "You raise top-k from 4 to 12. RAGAS answer relevancy ticks up because the model now has more room to sound complete. Context precision drops. Faithfulness is flat. A team that only watches relevancy ships more noise. A team that reads all four metrics puts rerank back in and keeps k wide only before the reranker.",
          },
        ],
      },
      {
        id: "implementation",
        title: "The shape of a run, not a version pin",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Conceptual RAGAS-style dataset",
            code: `# You will wrap this in whatever the current RAGAS API is.
# The contract to remember in an interview:

rows = [
    {
        "question": "Can I take casual leave the day before Diwali?",
        "contexts": [
            "Clause 4.2: Casual leave cannot be combined with the day before a restricted holiday."
        ],
        "answer": "No. Clause 4.2 forbids combining casual leave with the day before a restricted holiday such as Diwali.",
        "ground_truth": "No — CL cannot be taken the day before a restricted holiday.",
    }
]

# Faithfulness: judge whether each claim in answer is supported by contexts.
# Answer relevancy: judge whether answer addresses question.
# Context recall: judge whether contexts cover ground_truth.
# Then average over the golden set and compare two pipeline versions.`,
          },
          {
            type: "p",
            text: "In code, that is “build a dataset object, call evaluate, print a table.” In engineering, that is “same gold, two traces, one comparison.” Put the table in the README next to p95 and ₹/query.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What is RAGAS?",
            a: "A library for scoring RAG runs. I feed it questions, retrieved contexts, answers, and optional ground truth, and it reports metrics like faithfulness, answer relevancy, context precision, and context recall. Several of those scores use an LLM as a judge.",
          },
          {
            type: "qa",
            q: "How do you run it?",
            a: "I freeze a dataset from traces — not a live moving target. I run evaluate, then I read the worst rows. I use it to compare my hybrid-plus-rerank pipeline against my baseline on the same 30 GST and HR questions, together with latency and cost.",
          },
          {
            type: "qa",
            q: "What are the limits of LLM-as-judge?",
            a: "The judge can be biased, expensive, unstable across model versions, and weak on domain text like GST notifications. It disagrees with humans, especially on partial credit. I treat RAGAS as a regression harness, not as ground truth. I still keep a human-labelled golden set.",
          },
        ],
      },
    ],
  },
];
