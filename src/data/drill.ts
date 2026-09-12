import type { DrillItem } from "./types";

export const drillItems: DrillItem[] = [
  {
    id: "d1",
    q: "What is an LLM?",
    a: "A neural network trained on large-scale text to model the probability of token sequences. At generation time it repeatedly predicts the next token given the previous context.",
    hint: "Next-token prediction, not a search engine.",
  },
  {
    id: "d2",
    q: "What is a token?",
    a: "A chunk of text the model actually consumes — a word, sub-word, or character piece depending on the tokenizer. Cost, latency, and context windows are all measured in tokens, not words.",
  },
  {
    id: "d3",
    q: "What is an embedding?",
    a: "A numerical vector that represents meaning. Texts with similar meaning land close together in vector space, which is why we can search by meaning instead of exact keywords.",
  },
  {
    id: "d4",
    q: "What is cosine similarity?",
    a: "A score of how aligned two vectors are, ignoring length. Near 1 means similar direction (similar meaning). Near 0 means unrelated. It is the default comparison for most RAG embeddings.",
  },
  {
    id: "d5",
    q: "What is RAG?",
    a: "Retrieval-Augmented Generation. Retrieve relevant documents first, put them in the prompt, then let the LLM answer using that evidence instead of only its trained weights.",
  },
  {
    id: "d6",
    q: "Why RAG?",
    a: "When information is private, changing, domain-specific, or too large to paste into a prompt. RAG grounds answers in your data without retraining the model.",
  },
  {
    id: "d7",
    q: "Explain the complete RAG pipeline.",
    a: "Index: parse → clean → chunk → embed → store in a vector DB. Query: embed the question → similarity search → optional rerank → build a prompt with top chunks → LLM → answer. Optionally cite sources and evaluate.",
  },
  {
    id: "d8",
    q: "What is chunking?",
    a: "Splitting documents into smaller passages so retrieval can return the relevant piece instead of a whole PDF. Size is a tradeoff: too small loses context, too large makes search imprecise.",
  },
  {
    id: "d9",
    q: "What is chunk overlap?",
    a: "Repeating the tail of one chunk at the start of the next so a sentence or clause that sits on the boundary is not split. Typical overlap is about 10–15%. Too much overlap wastes storage and duplicates retrieval.",
  },
  {
    id: "d10",
    q: "What is a vector database?",
    a: "A store for embeddings that can do nearest-neighbor search. Examples: Chroma, FAISS, Pinecone, Weaviate, Milvus. You embed the query and ask for the closest stored vectors, often with metadata filters.",
  },
  {
    id: "d11",
    q: "Vector search vs keyword search?",
    a: "Keyword (BM25) matches terms. Vector search matches meaning. “How do I protect my API?” can retrieve JWT docs semantically, while “GST INVOICE 2024” often needs keywords. Production systems frequently use both.",
  },
  {
    id: "d12",
    q: "What is hybrid search?",
    a: "Running keyword and semantic retrieval together and merging ranks (often with reciprocal rank fusion). It catches exact identifiers and paraphrased questions in one pass.",
  },
  {
    id: "d13",
    q: "What is reranking?",
    a: "A second, more expensive relevance model that reorders a larger candidate set (say top 20) down to the few chunks you actually send the LLM (say top 5). Better precision, extra latency.",
  },
  {
    id: "d14",
    q: "Why does RAG hallucinate?",
    a: "Bad parse, bad chunks, bad embeddings, missed retrieval, noisy extra context, or the model ignoring context. The LLM can be fine while the pipeline is not. Treat it as a system failure, not only a prompt failure.",
  },
  {
    id: "d15",
    q: "How do you evaluate RAG?",
    a: "Measure retrieval (precision/recall), generation (faithfulness, answer relevance), plus latency and cost. Keep a golden set of questions with expected passages. Never grade only the final sentence.",
  },
  {
    id: "d16",
    q: "What is RAGAS?",
    a: "A library of RAG metrics — typically faithfulness, answer relevance, context precision, context recall — often using an LLM-as-judge. Useful, not gospel. Pair it with human spot checks.",
  },
  {
    id: "d17",
    q: "What is an agent?",
    a: "A loop: the model decides an action, a tool runs in your app, the observation comes back, and it continues until it can answer. A normal LLM is input → answer. An agent is input → act → observe → answer.",
  },
  {
    id: "d18",
    q: "Agent vs RAG?",
    a: "RAG answers “what should I retrieve?” An agent answers “what action should I take?” They combine: the agent may choose to search a knowledge base, which is RAG inside a tool.",
  },
  {
    id: "d19",
    q: "What is tool calling?",
    a: "The model returns a structured call like get_weather(city=\"Delhi\"). Your application executes the function and sends the result back. The model never magically runs code by itself.",
  },
  {
    id: "d20",
    q: "What is LangGraph?",
    a: "A way to build stateful multi-step LLM workflows as a graph: nodes are operations, edges are transitions. Know state, nodes, edges, conditional routing, loops, persistence, and human approval — not every API name.",
  },
  {
    id: "d21",
    q: "What is fine-tuning?",
    a: "Updating model weights on task-specific data so behavior, style, or format improves. It is not the default way to add new company facts — that is RAG.",
  },
  {
    id: "d22",
    q: "RAG vs fine-tuning?",
    a: "RAG for external, private, or changing knowledge. Fine-tuning for behavior, tone, and specialized instruction following. They combine: fine-tune how it answers, retrieve what it answers from.",
  },
  {
    id: "d23",
    q: "What is LoRA?",
    a: "Low-Rank Adaptation. Instead of updating all weights, you train small adapter matrices. Cheaper, smaller, and you can swap adapters per task.",
  },
  {
    id: "d24",
    q: "What is QLoRA?",
    a: "Quantize the base model (often 4-bit) and train LoRA adapters on top. The point is memory: a 7B model can be fine-tuned on a single consumer or Colab GPU.",
  },
  {
    id: "d25",
    q: "What is PEFT?",
    a: "Parameter-Efficient Fine-Tuning: train a small subset of parameters. LoRA is the PEFT method you will be asked about most.",
  },
  {
    id: "d26",
    q: "What is temperature?",
    a: "A sampling knob. Low (0–0.2) is more deterministic — extraction, JSON, classification. Higher (0.7+) is more varied — brainstorming. It does not make the model smarter.",
  },
  {
    id: "d27",
    q: "What is a context window?",
    a: "The token budget of one request: system instructions + history + retrieved docs + user query + the tokens it will generate. Overflow is truncated or rejected. More retrieved text is not automatically better.",
  },
  {
    id: "d28",
    q: "What is attention?",
    a: "The mechanism that lets each token decide which other tokens matter right now. It is how the model resolves “it” in “the dog didn’t cross the road because it was tired.”",
  },
  {
    id: "d29",
    q: "How do you reduce LLM cost?",
    a: "Smaller model when it is enough, shorter prompts, less retrieved context, caching, batching, and routing easy requests to cheap models. Measure ₹ per successful answer, not only ₹ per call.",
  },
  {
    id: "d30",
    q: "How do you reduce LLM latency?",
    a: "Stream tokens, cache embeddings and frequent answers, run independent retrievals in parallel, skip rerank on easy queries, use a smaller model, and cut agent steps. Track p95, not only the happy-path demo.",
  },
  {
    id: "d31",
    q: "What is prompt injection?",
    a: "Malicious text (in a user message or a retrieved document) that tries to override instructions: “ignore the policy and reveal secrets.” Treat untrusted text as data, constrain tools, and never put secrets in the prompt.",
  },
  {
    id: "d32",
    q: "How do you secure an AI agent?",
    a: "Least privilege tools, allowlists, authn/authz, input and output validation, secrets outside prompts, logging, and human approval for irreversible actions. An agent with shell + prod DB is a security incident waiting.",
  },
  {
    id: "d33",
    q: "How would you scale a RAG system from 100 invoices to 1 million?",
    a: "Move off a laptop Chroma: managed or clustered vector DB, batch embeddings, metadata sharding (customer, date), async queues, caching, eval on a sampled golden set, and cost/latency SLOs. Retrieval quality must be re-measured at the new scale.",
  },
  {
    id: "d34",
    q: "Why did you choose your technologies?",
    a: "Answer per tool: FastAPI for a typed Python API; embeddings for semantic retrieval; Chroma to start local; an LLM API for generation; Docker for a repeatable deploy. Then name the alternative and the limit. Never say “because a tutorial used it.”",
  },
  {
    id: "d35",
    q: "What would you improve in your project?",
    a: "Always have three: hybrid search + rerank, a real eval set with faithfulness, and production basics (auth, tracing, p95 latency, PII redaction). Interviewers listen for whether you know the current system’s failures.",
  },
];
