import type { Chapter } from "../types";

export const projectChapters: Chapter[] = [
  {
    slug: "rag-project",
    number: "33",
    title: "Invoice compliance RAG project",
    subtitle: "How to build it for real, and how to talk about it without lying.",
    priority: "career",
    minutes: 22,
    group: "Projects",
    summary:
      "A defensible Invoice Compliance & Fraud Detection system: why RAG, embeddings, ChromaDB, FastAPI, Docker, and a vision LLM — plus an honest script for the project round.",
    youWillLearn: [
      "Why this problem is a RAG problem, not a chatbot",
      "A real architecture you can actually build as a junior",
      "How to speak about it if it is a personal/campus project",
      "What never to fake on a resume",
    ],
    sections: [
      {
        id: "what",
        title: "What the project is",
        blocks: [
          {
            type: "p",
            text: "Accounts-payable teams check supplier invoices against GST rules, PO terms, and company policy. Mismatches (wrong GST rate, duplicate invoice number, vendor not on the approved list, inflated quantity) are a retrieval-plus-reasoning problem. The model should not “know” your policy from pretraining. It should fetch the clause and ground the verdict.",
          },
          {
            type: "ul",
            items: [
              "Input: invoice PDF or photo + vendor id + amount.",
              "Retrieve: policy chunks, approved vendor list, historical invoices for duplicates.",
              "Output: structured verdict (ok / mismatch / fraud_review) with citations.",
              "Stack: embeddings, ChromaDB, FastAPI, Docker, a vision LLM or OCR for the image, a text LLM for the verdict.",
            ],
          },
          {
            type: "widget",
            widget: "rag-flow",
          },
          {
            type: "callout",
            tone: "rule",
            title: "Honesty first",
            text: "If you built this on weekends with public sample invoices, say that. Do not say you deployed it at a bank, led a team of eight, or processed production PAN data you never had. Interviewers will ask for the GitHub. The repo must match the story.",
          },
        ],
      },
      {
        id: "why",
        title: "Why RAG — and why this stack",
        blocks: [
          {
            type: "p",
            text: "Policies change. GST rates change. Vendor lists change. Fine-tuning a 7B on last quarter’s PDFs will be stale next month and will not cite a clause. RAG keeps the corpus editable: drop a new circular into the index, re-embed, done. Fine-tune later only for format (JSON shape, OCR noise), not for facts.",
          },
          {
            type: "table",
            headers: ["Choice", "Why", "What you almost used"],
            rows: [
              ["RAG", "Policies must be current and citable", "Fine-tune for knowledge — wrong default"],
              ["Embeddings + ChromaDB", "Local, free, enough for 10k–100k chunks on a laptop", "Pinecone — extra cost, extra story you may not need"],
              ["FastAPI", "Typed routes, SSE streaming, easy to Docker", "Streamlit-only — looks like a demo"],
              ["Docker", "Repro for the interviewer: docker compose up", "“It works on my Colab”"],
              ["Vision LLM / OCR", "Invoices arrive as photos", "Pretending the PDF text layer always exists"],
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "Why this project hits India MNC JDs",
            text: "Document AI + GST + Azure OpenAI is a real GCC and services workload. You are not claiming you built Infosys’s platform. You are showing the same verbs: ingest, retrieve, ground, evaluate, containerize.",
          },
        ],
      },
      {
        id: "how",
        title: "How the system works",
        blocks: [
          {
            type: "diagram",
            title: "Invoice compliance RAG",
            lines: [
              "  [PDF / photo] --> OCR or vision extract (fields JSON)",
              "         |",
              "         v",
              "  [field JSON] --> duplicate check (invoice_no + vendor in Postgres)",
              "         |",
              "         +--> embed query (vendor + HSN + question)",
              "         |         |",
              "         |         v",
              "         |    Chroma (policies, GST tables, vendor list)",
              "         |         |",
              "         |         v",
              "         +--> rerank --> prompt + citations --> text LLM",
              "                              |",
              "                              v",
              "                         Verdict JSON --> FastAPI --> UI / auditor",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "Ingest policies, not just invoices",
                text: "Chunk GST rate tables and AP policy with overlap. Store metadata: doc_id, section, effective_date, tenant.",
              },
              {
                title: "Extract fields first",
                text: "Invoice number, GSTIN, HSN, tax rate, amount, line items. A vision LLM or Azure Document Intelligence / Tesseract. Do not dump 8MP pixels into the reasoning prompt if you already have fields.",
              },
              {
                title: "Retrieve with a filter",
                text: "Query is “HSN 8708 GST rate and 3-way match rules,” not the whole invoice text. Filter by tenant and doc type.",
              },
              {
                title: "Generate a schema, not an essay",
                text: "decision, reasons[], chunk_ids[], needs_human. Eval against labeled invoices.",
              },
            ],
          },
        ],
      },
      {
        id: "example",
        title: "How to talk about it in 90 seconds",
        blocks: [
          {
            type: "p",
            text: "Spoken, not recited. Fill the brackets with numbers you actually measured. If you did not measure it, do not say it.",
          },
          {
            type: "code",
            lang: "text",
            title: "The honest 90-second pitch",
            code: `I built a personal / campus project that flags GST and
policy mismatches on invoices. I used public sample invoices
and a policy pack I wrote from public CBIC rate tables —
not live bank data.

Flow: extract fields (OCR + a vision LLM on photos),
embed the question, retrieve from Chroma, then a text LLM
returns JSON with citations. FastAPI + Docker.

I chose RAG because rates change; I did not want to
fine-tune facts. After hybrid retrieve + rerank, faithfulness
on my [N]-invoice labeled set went from [x] to [y].
p95 is [z]s on my machine. Cost is [mini vs 4o] per invoice.

Limitations: [synthetic data / small corpus / no SSO].
If I productionized it I would add tenant auth, PII redaction,
and a human queue for fraud_review.`,
          },
          {
            type: "callout",
            tone: "trap",
            title: "Phrases that get you failed",
            text: "“We processed 2 crore invoices at my internship.” “I designed the architecture for the bank.” “Accuracy 99.8%.” If the internship was data entry, say data entry. If the metric is “I eyeballed 20 PDFs,” say that. Interviewers have seen the same copied GitHub ten times this week.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build a real version, not a screenshot",
        blocks: [
          {
            type: "p",
            text: "A real version is a repo an HM can clone. It does not need Kubernetes. It does need data you are allowed to share, an eval table, and a README that shows a failure case.",
          },
          {
            type: "ol",
            items: [
              "Collect 50–200 invoices you may use: public samples, synthetic invoices you generated, or redacted intern data with written permission. Never leak a real PAN.",
              "Write 20–40 policy chunks from public GST materials and a made-up company AP policy. Version them.",
              "Extract fields (start with text PDFs; add vision for photos later).",
              "Chunk, embed, store in Chroma with metadata. Persist the volume in Docker Compose.",
              "FastAPI: POST /extract, POST /query, GET /health. Stream the verdict tokens if you have a UI.",
              "Label 50 invoices: ok / mismatch / fraud_review. Log faithfulness, citation precision, latency, tokens.",
              "Dockerfile + compose: api, chroma (or local dir), maybe postgres. .env.example with no real keys.",
              "README: problem, diagram, how to run, eval table, limitations, next three improvements.",
            ],
          },
          {
            type: "code",
            lang: "python",
            title: "Core retrieve-and-judge (sketch)",
            code: `def judge(invoice: dict, tenant: str) -> dict:
    q = f"{invoice['hsn']} GST rate, vendor {invoice['gstin']}"
    hits = chroma.query(
        q, k=6, where={"tenant": tenant, "type": "policy"}
    )
    prompt = build_prompt(invoice, hits)
    raw = llm.json(prompt, schema=VERDICT)
    raw["chunk_ids"] = [h.id for h in hits]
    return raw`,
          },
          {
            type: "callout",
            tone: "note",
            title: "If you only have a Streamlit demo",
            text: "Wrap the same function in FastAPI before you apply. Docker Compose is the difference between “notebook” and “service” in an India MNC screen. You still must not claim production users.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Why RAG and not just a vision LLM on the invoice?",
            a: "The vision model can read the page. It cannot be trusted to remember our policy or this quarter’s GST rate. I extract fields with vision/OCR, then retrieve the clause, then judge. That split is cheaper, citable, and updatable.",
          },
          {
            type: "qa",
            q: "Is this production experience?",
            a: "No. It is a personal project designed like a service: API, Docker, eval, failure cases. I have not run this on live customer invoices. Here is what I would add for prod: auth, PII, rate limits, monitoring. Then stop. Do not inflate.",
          },
          {
            type: "qa",
            q: "Why ChromaDB?",
            a: "I needed a local embedded store I could Dockerize with zero account. At 10k chunks it is enough. If I had to share an index across services or hit 1M invoices I would evaluate pgvector or a managed store. I did not start there because the bottleneck was eval and extraction, not the database brand.",
          },
          {
            type: "qa",
            q: "What would you not put on the resume?",
            a: "Company names I did not work for, user counts I did not have, “fine-tuned GPT-4,” and accuracy numbers I cannot reproduce from the repo. I would put stack, my role (solo builder), dataset source, and one real metric.",
          },
        ],
      },
    ],
  },
  {
    slug: "finetune-project",
    number: "34",
    title: "Mistral-7B QLoRA project",
    subtitle: "When you fine-tune, why this model, and how you prove it helped.",
    priority: "career",
    minutes: 18,
    group: "Projects",
    summary:
      "QLoRA/PEFT on Mistral-7B with ~15k samples, 80/10/10 split, one GPU. Use it to improve structured extraction or RAGAS scores — not to “teach GST.”",
    youWillLearn: [
      "Why QLoRA exists and what PEFT actually updates",
      "Why Mistral-7B is a sensible junior choice",
      "How to split 15k samples and not leak the test set",
      "How to measure improvement with RAGAS and task metrics",
    ],
    sections: [
      {
        id: "what",
        title: "What you trained",
        blocks: [
          {
            type: "p",
            text: "QLoRA is fine-tuning with the base weights frozen in 4-bit and small LoRA adapters trained on top (PEFT). You are not training Mistral from scratch. You are teaching a 7B to follow your JSON schema, survive OCR noise, or write grounded answers in your style — on a single 16–24 GB GPU.",
          },
          {
            type: "ul",
            items: [
              "Base: Mistral-7B-Instruct (Apache-2.0-friendly story vs a Llama license fight in an interview).",
              "Method: 4-bit load (bitsandbytes) + LoRA on q/k/v/o (and maybe MLP) via Hugging Face PEFT.",
              "Data: ~15,000 prompt–completion pairs. Split 80/10/10 train/val/test by invoice id, not by row.",
              "Hardware: one GPU (colab A100/T4, campus lab, or a cloud spot). Hours, not weeks.",
              "Success: test-set JSON exact-match / field F1, plus RAGAS faithfulness if it sits in a RAG loop — not “loss went down.”",
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "Fine-tune format, retrieve facts",
            text: "If the fact can change (GST rate, vendor list), it belongs in RAG. If the behavior is stable (emit this schema from noisy OCR), it can belong in QLoRA. Mixing those is how projects fail in the HM round.",
          },
        ],
      },
      {
        id: "why",
        title: "Why Mistral-7B and why QLoRA",
        blocks: [
          {
            type: "p",
            text: "Full fine-tune of 7B is multi-GPU reality. QLoRA fits on one 16–24 GB card. Mistral-7B is strong for its size, well documented with PEFT, and a license you can actually discuss. You pick it because you can run it, not because a blog said “SOTA.”",
          },
          {
            type: "table",
            headers: ["Option", "When it wins", "When you reject it"],
            rows: [
              ["Prompt a hosted 4o", "Low volume, no GPU, need quality now", "You need on-prem or a fixed JSON dialect at scale"],
              ["QLoRA 7B", "Format, domain phrasing, private deploy", "Facts that change weekly"],
              ["Train 7B from scratch", "Never, as a junior", "Always"],
              ["Llama-3-8B QLoRA", "Fine if license is cleared", "If the company legal team has not approved Meta’s license"],
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "Why this shows up on JDs",
            text: "Service MNCs and some GCCs want “hands-on PEFT/QLoRA” because client data cannot always leave the VPC. A junior who ran one honest 15k-sample job and can explain rank, dropout, and eval is rare. A junior who writes “fine-tuned GPT-4 on 15k invoices” is rejected.",
          },
        ],
      },
      {
        id: "how",
        title: "How the training run works",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Build pairs without leakage",
                text: "One invoice id only in one split. If two rows share the same invoice, they travel together. 12k train / 1.5k val / 1.5k test for 15k.",
              },
              {
                title: "Load 4-bit, attach LoRA",
                text: "Typical start: r=16, alpha=32, dropout=0.05, targets q_proj, k_proj, v_proj, o_proj. You can name these in an interview even if you later tuned them.",
              },
              {
                title: "Train against val loss and a real metric",
                text: "Early-stop on val. Every N steps, generate on a 100-row slice and compute JSON-valid % and field F1. Loss-only is how you overfit polite English.",
              },
              {
                title: "Export adapters, evaluate on test once",
                text: "You peek at test only at the end. Then plug the adapter into the RAG judge and rerun RAGAS on the same frozen invoice set.",
              },
            ],
          },
          {
            type: "diagram",
            title: "QLoRA on one GPU",
            lines: [
              "Mistral-7B weights  --4-bit-->  frozen backbone",
              "                         +",
              "                    LoRA adapters (trainable, few MB–a few hundred MB)",
              "                         ^",
              "              12k labeled (prompt = OCR + optional retrieved chunks,",
              "                           completion = verdict JSON)",
              "                         |",
              "                    val 1.5k -> early stop",
              "                    test 1.5k -> report once",
            ],
          },
        ],
      },
      {
        id: "example",
        title: "Example: RAGAS moved, so the FT was worth it",
        blocks: [
          {
            type: "p",
            text: "Baseline: GPT-4o-mini judge on retrieved chunks. Faithfulness 0.71, answer relevancy 0.76, JSON-valid 91% on noisy OCR. After QLoRA on 15k synthetic-plus-public pairs (schema + OCR noise), the 7B JSON-valid hits 98% and faithfulness on the same retrieved chunks goes to 0.79 because the model stops inventing extra taxes when the chunk is silent. If RAGAS does not move, you say so and keep the hosted model. That sentence is maturity.",
          },
          {
            type: "callout",
            tone: "trap",
            title: "RAGAS is not a trophy",
            text: "Improving RAGAS by stuffing the prompt with gold chunks on the test set is cheating. Freeze retrieval. Change only the generator. Report sample size. If you used LLM-as-judge, name the judge model — it can be biased toward its own style.",
          },
        ],
      },
      {
        id: "implementation",
        title: "A run you can defend",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "PEFT sketch (names you should recognize)",
            code: `from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

bnb = BitsAndBytesConfig(load_in_4bit=True,
                         bnb_4bit_quant_type="nf4")
base = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-Instruct-v0.2",
    quantization_config=bnb,
    device_map="auto",
)
lora = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05,
                  target_modules=["q_proj","k_proj","v_proj","o_proj"],
                  task_type="CAUSAL_LM")
model = get_peft_model(base, lora)
# train with TRL SFTTrainer, eval JSON F1 each epoch
# save only adapter_model.safetensors`,
          },
          {
            type: "ul",
            items: [
              "Log: GPU type, hours, peak VRAM, token length, effective batch, seed.",
              "Publish: adapters if license allows, or a training card + metrics if data cannot leave your laptop.",
              "Do not upload real invoices to a public HF repo.",
              "Measure: JSON-valid %, field-level F1, hallucination rate on “chunk silent” cases, RAGAS faithfulness/relevancy, latency vs the hosted baseline.",
            ],
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Why Mistral-7B?",
            a: "It fits QLoRA on one GPU, instruction-tunes well, and the license is straightforward compared with some Llama variants. I needed a generator I could host, not a research SOTA. If the team standard is Llama-3-8B and legal is fine, I can repeat the same PEFT recipe.",
          },
          {
            type: "qa",
            q: "What did QLoRA change in the weights?",
            a: "The 7B stays frozen in 4-bit. I train low-rank adapters on attention projections. At inference I load base + adapter. That is why the artifact is small and why I can swap adapters without retraining the backbone.",
          },
          {
            type: "qa",
            q: "How do you know it improved RAG?",
            a: "Same retriever, same test invoices. I report field F1 and RAGAS faithfulness before vs after, plus JSON-valid %. If only loss dropped, I would not claim product improvement.",
          },
          {
            type: "qa",
            q: "15k samples — is that enough?",
            a: "For a narrow JSON task with synthetic variation, yes as a start. I watch val vs train. If they diverge, I simplify LoRA rank or add data. I would not claim a general accountant model from 15k rows.",
          },
        ],
      },
    ],
  },
  {
    slug: "system-design",
    number: "35",
    title: "Design a production RAG system",
    subtitle: "An 8-minute HM whiteboard: architecture, then scale, cache, security, eval, cost, latency.",
    priority: "critical",
    minutes: 20,
    group: "Projects",
    summary:
      "The canonical junior system-design round: draw a production RAG, then push on scale, cache, security, monitoring, eval, cost, and latency — and speak for eight minutes without drowning.",
    youWillLearn: [
      "An ASCII architecture you can redraw from memory",
      "The order to talk: path, then scale, then risk",
      "What “1M invoices” does to each box",
      "How to use the last minute on trade-offs",
    ],
    sections: [
      {
        id: "what",
        title: "What they want on the board",
        blocks: [
          {
            type: "p",
            text: "This is not a FAANG distributed-systems puzzle. It is: can you design a retrieval-grounded invoice (or policy) service that would survive first contact with real users? They want a picture, a request path, and then the production knobs from chapters 29–32.",
          },
          {
            type: "diagram",
            title: "Production RAG (draw this first)",
            lines: [
              "  [Web / reviewer UI]",
              "           |  HTTPS",
              "           v",
              "  [API gateway]  authn, TLS, rate limit",
              "           |",
              "           v",
              "  [FastAPI workers]  authz, PII mask, timeouts",
              "      |         |            |",
              "      |         |            +--> [Postgres] invoices, users, audit",
              "      |         |",
              "      |         +--> [cache] query hash -> verdict JSON",
              "      |",
              "      +--> embed query --> [vector index] (Chroma / pgvector)",
              "      |                         ^",
              "      |                         |  ingest workers",
              "      |                    [object store] PDFs  --> OCR/vision",
              "      |                         |",
              "      |                         v",
              "      |                    chunk + embed + metadata (tenant, doc)",
              "      |",
              "      +--> rerank --> LLM gateway (route mini/4o, stream)",
              "                        |",
              "                        v",
              "                   logs / metrics / eval sample",
            ],
          },
        ],
      },
      {
        id: "why",
        title: "Why they stop you at eight minutes",
        blocks: [
          {
            type: "p",
            text: "HMs have another candidate at :30. They grade structure. If you spend six minutes on cosine similarity you never reach PII. If you start with Kubernetes you never show you understand retrieval. Eight minutes is enough to draw, walk one request, then hit scale/cache/security/monitoring/eval/cost/latency in that order.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Junior bar at GCCs vs services",
            text: "A Microsoft/Google/Amazon AI team will still poke at failure modes and complexity. A services MNC will poke at Azure components (APIM, Key Vault, App Insights, Document Intelligence). Draw in generic boxes first, then map to Azure/AWS names if they ask.",
          },
        ],
      },
      {
        id: "how",
        title: "How to speak for eight minutes",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Minute 0–1 — clarify",
                text: "Users? Invoices per day? PDF or photo? SLA? On-prem or Azure? “I’ll assume 1M invoices/year, p95 3s, India region, human review for fraud.” Write assumptions.",
              },
              {
                title: "Minute 1–3 — draw and walk the happy path",
                text: "Point at each box: upload, extract, index, query, retrieve, generate, store audit. One finger on the diagram. Do not skip ingest — RAG dies on ingest.",
              },
              {
                title: "Minute 3–6 — production knobs",
                text: "Scale (stateless API, queue ingest). Cache (exact verdict, embeddings). Security (tenant filter, no secrets in prompt). Monitoring (p50/p95, tokens, errors). Eval (offline set + sampled traces). Cost (routing). Latency (parallel retrieve, stream).",
              },
              {
                title: "Minute 6–8 — trade-offs and questions",
                text: "Chroma vs pgvector vs managed. Mini vs 4o. Vision vs OCR. What you would measure in week one. Then: “Where should I go deeper?”",
              },
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "Narrate the request, not the product catalog",
            text: "“The reviewer opens invoice 8821. We cache-miss, embed, retrieve four clauses filtered by tenant, stream a JSON verdict, log tokens.” That sentence is system design. A list of fifteen Azure SKUs is not.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: they say “scale to 1M invoices”",
        blocks: [
          {
            type: "table",
            headers: ["Knob", "At 100 invoices", "At 1M invoices / year"],
            rows: [
              ["Index", "Chroma volume on one box", "Sharded collection or pgvector; ingest queue; versioned indexes"],
              ["Extract", "Synchronous vision call", "Async workers, OCR first, vision on failures"],
              ["Cache", "Optional", "Mandatory on re-open; cache key includes index version"],
              ["LLM", "One 4o key", "Routed mini/4o, quotas, maybe PTU for month-end"],
              ["API", "One container", "Stateless replicas behind the gateway; backpressure"],
              ["Eval", "Spreadsheet", "CI on 200 gold + weekly sampled traces"],
              ["Security", "Single user", "Tenant ACL, PII redact, human approval"],
            ],
          },
          {
            type: "p",
            text: "1M/year is ~3k/day, not Google-scale. Say that. The hard parts are month-end spikes, photos, and tenancy — not inventing Kafka for sport. If they want 1M *per day*, you add partitions, a dedicated embed cluster, and a serious queue. Do not jump there unasked.",
          },
        ],
      },
      {
        id: "implementation",
        title: "A checklist you can recite",
        blocks: [
          {
            type: "ul",
            items: [
              "Scale: separate ingest from query; make query workers stateless; put OCR/vision on a queue.",
              "Cache: (tenant, invoice_version, question, index_semver) -> verdict. Don’t cache across policy updates.",
              "Security: authn at gateway, authz in query filter, allowlisted tools, schema-validated output, PII policy.",
              "Monitoring: RED metrics + token counters + queue depth + GPU/API 429s. Trace by request_id.",
              "Eval: gold set in CI; online sampling; alert if faithfulness or citation precision drops.",
              "Cost: routing, max_tokens, OCR-before-vision, prepaid envelope alerts.",
              "Latency: budgets per span, parallel retrieve, stream, region choice.",
            ],
          },
          {
            type: "code",
            lang: "text",
            title: "Closing line (practice this)",
            code: `That's the skeleton. The first production risk I would
instrument is p95 latency and tenant isolation — not the
choice of vector database. Happy to go deeper on any box.`,
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Draw a production RAG system.",
            a: "I draw UI → gateway → FastAPI → cache / Postgres / vector index / LLM gateway, plus an ingest path from object store through OCR to the index. Then I walk one query. Then I add rate limits, tenant filters, and eval sampling. I keep Kafka and Kubernetes off the board until they ask.",
          },
          {
            type: "qa",
            q: "Where do you cache?",
            a: "Three layers: embedding of the query, retrieved chunk ids for an unchanged invoice+policy version, and the final verdict JSON. I bust cache when the index version or the invoice bytes change.",
          },
          {
            type: "qa",
            q: "How do you know the system is healthy?",
            a: "p50/p95 latency by span, error rate, 429s, tokens and rupees per day, queue lag on ingest, and a weekly eval on a frozen gold set. Logs have request ids and chunk ids, not PANs.",
          },
          {
            type: "qa",
            q: "Security in one minute.",
            a: "Authn at the edge, authz on every retrieve, untrusted documents, schema on output, no powerful tools without a human, PII redaction, rate limits so we cannot melt the prepaid credit.",
          },
        ],
      },
    ],
  },
  {
    slug: "defense",
    number: "36",
    title: "Project defense question bank",
    subtitle: "Ten questions they actually ask — with spoken answers you can reuse.",
    priority: "career",
    minutes: 16,
    group: "Projects",
    summary:
      "Q1–Q10: why RAG not fine-tune, chunk size, why Chroma, irrelevant chunks, eval, hallucinations, 100→1M invoices, latency, PII, and what you change when prod is poor.",
    youWillLearn: [
      "How to answer without memorizing a script",
      "What a strong vs fake answer sounds like",
      "How to admit limits and still look senior-for-junior",
      "The ten questions that decide the project round",
    ],
    sections: [
      {
        id: "what",
        title: "What a defense round is",
        blocks: [
          {
            type: "p",
            text: "Someone who has shipped retrieval will pick one project and press on decisions. They are not trying to catch a definition. They are trying to see if the GitHub is yours and if you notice when the system is wrong. The ten questions below are the canonical set for the invoice RAG project. Swap the domain; keep the shape.",
          },
          {
            type: "callout",
            tone: "rule",
            title: "How to use this chapter",
            text: "Cover the answer. Speak for 30–45 seconds. Then read. If you cannot name a metric, a failure, and an alternative, you are not ready to put the project on the resume.",
          },
        ],
      },
      {
        id: "why",
        title: "Why these ten",
        blocks: [
          {
            type: "p",
            text: "They map to every weak demo: people fine-tune facts, copy chunk=512 from a blog, cannot replace Chroma, ignore bad retrieval, never evaluate, shrug at hallucinations, hand-wave scale, never measured latency, never thought about PAN, and have no rollback story.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Format in India MNC loops",
            text: "Often 30–45 minutes after DSA. One interviewer shares the repo on call. They will ask you to open a file. If you cannot find the retriever, the round is over. Practice with the laptop closed, then with the repo open.",
          },
        ],
      },
      {
        id: "how",
        title: "How to structure any answer",
        blocks: [
          {
            type: "ol",
            items: [
              "Decision in one sentence.",
              "Problem it solved in this project.",
              "Alternative you rejected, and why.",
              "Limitation you still have.",
              "Metric or example if you have one.",
            ],
          },
          {
            type: "p",
            text: "That is the same five-question loop from the handbook intro. Defense is that loop under time pressure.",
          },
        ],
      },
      {
        id: "example",
        title: "Weak vs strong on the same question",
        blocks: [
          {
            type: "table",
            headers: ["", "Weak", "Strong"],
            rows: [
              [
                "Chunk size",
                "I used 512 because LangChain default.",
                "I started 400/40 overlap on policy clauses, inspected splits that cut rate tables, then moved tables to a CSV retriever. I would A/B 200 vs 400 on citation precision.",
              ],
              [
                "Hallucinations",
                "Temperature 0.",
                "Temperature 0 plus refuse-on-empty-retrieval plus citations plus RAGAS on a silent-chunk test. Still fails when OCR drops the HSN — that’s a next ticket.",
              ],
            ],
          },
        ],
      },
      {
        id: "implementation",
        title: "Rehearsal, not memorization",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Write your numbers in a card",
                text: "N invoices, chunk size, k, faithfulness before/after, p95, rupees/query, GPU hours. If a cell is empty, either measure it or do not claim it.",
              },
              {
                title: "Record yourself on Q1–Q10",
                text: "One take each. Cut filler. Keep “I don’t know, here’s how I’d find out” for things you truly did not do.",
              },
              {
                title: "Open the repo and point",
                text: "Retriever, schema, Dockerfile, eval script. Defense dies when the file does not exist.",
              },
            ],
          },
        ],
      },
      {
        id: "interview",
        title: "Interview — Q1 to Q10",
        blocks: [
          {
            type: "qa",
            q: "Q1. Why RAG and not fine-tuning?",
            a: "Policies and GST rates change. RAG lets me update the corpus without a training job, and I can cite the clause. I would QLoRA only for stable behavior — JSON shape, OCR noise — not to store facts. If I fine-tuned the rates, I would be wrong next circular.",
            why: "This is the first filter. If you say “RAG is more advanced,” you fail.",
          },
          {
            type: "qa",
            q: "Q2. How did you choose chunk size?",
            a: "I treat chunk size as a retrieval hyperparameter. For AP policy I started around 400 tokens with ~40 overlap so a GST clause stayed intact. I inspected failures: rate tables split across chunks, so I parsed tables separately. I would not copy 512 from a tutorial without looking at the splits.",
            why: "They want inspection, not a magic number.",
          },
          {
            type: "qa",
            q: "Q3. Why ChromaDB?",
            a: "Local, open source, good enough for tens of thousands of chunks, trivial to Docker. I needed to spend time on extraction and eval, not on a vendor account. At a million invoices or multi-service prod I would re-evaluate pgvector or a managed index — same embeddings, different store.",
          },
          {
            type: "qa",
            q: "Q4. Retrieved chunks are irrelevant. What do you do?",
            a: "I debug retrieval before I touch the LLM. Look at the query, the top-k, metadata filters, and the actual chunk text. Fixes: better query (fields, not raw dump), hybrid search, rerank, metadata filter, re-chunk the offending doc, or reject when similarity is below a threshold. I do not add more temperature.",
          },
          {
            type: "qa",
            q: "Q5. How did you evaluate?",
            a: "A labeled set of invoices with gold decisions and gold clause ids. I track decision F1, citation precision, JSON-valid %, faithfulness/relevancy (RAGAS or a judged subset), latency, and tokens. I freeze the set. I do not call “my friends thought it was good” an eval.",
          },
          {
            type: "qa",
            q: "Q6. How do you reduce hallucinations?",
            a: "Ground every verdict in retrieved chunks, return “insufficient evidence” when retrieval is empty or low-scoring, constrain output with a schema, keep temperature low for extraction, and test silent-chunk cases. Hallucinations that remain are usually OCR misses — I fix ingest, not the adjective in the system prompt.",
          },
          {
            type: "qa",
            q: "Q7. How would this scale from 100 to 1 million invoices?",
            a: "100 fits on one box. At 1M/year I async the ingest, OCR before vision, version the index, cache verdicts, replica the stateless API, and watch month-end queues. 1M is not internet scale; tenancy, photos, and spikes are the real design. I would not introduce five new systems unasked.",
          },
          {
            type: "qa",
            q: "Q8. How do you attack latency?",
            a: "I measure spans. Then parallel embed+metadata, cap k, rerank 10 not 50, stream the LLM, route mini for easy invoices, cache re-opens, put the model in-region. I quote p50 and p95. Streaming without cutting tokens is only a UI fix.",
          },
          {
            type: "qa",
            q: "Q9. Where does PII go?",
            a: "PAN, GSTIN, bank accounts never belong in logs or in a prompt if I can send a redacted extract. Tenant filters on retrieve. Access via authn/authz, not a public demo URL. Retention: I would not keep raw photos forever. This project uses public or synthetic invoices — I would not claim I handled live PAN.",
          },
          {
            type: "qa",
            q: "Q10. Production quality is poor. What do you change first?",
            a: "I look at traces, not vibes. If citations are wrong, I fix retrieval and chunking. If JSON is messy, I schema and maybe QLoRA. If p95 is high, I cut tokens and queueing. If cost explodes, I route and cache. If tenants mix, I stop feature work and fix authz. I ship one change with a metric, not a rewrite in LangChain.",
            why: "This is the senior-for-junior question. Order by evidence.",
          },
        ],
      },
    ],
  },
];
