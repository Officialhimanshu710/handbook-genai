import type { Chapter } from "../types";

export const llmChapters: Chapter[] = [
  {
    slug: "llm-fundamentals",
    number: "01",
    title: "What is an LLM",
    subtitle: "Tokens to logits to the next token — not a database, not a mind.",
    priority: "critical",
    minutes: 14,
    group: "LLM core",
    summary:
      "An LLM is a next-token predictor. If you can say that in one sentence, walk the token→logit→sample loop, and refuse the 'it stores documents / it thinks' traps, you survive the opening GenAI round.",
    youWillLearn: [
      "A one-sentence definition you can say out loud",
      "The generation loop: tokens → logits → next token",
      "Pretrain vs instruct vs chat — what the API is actually serving",
      "Why an LLM is neither a database nor a reasoning engine",
    ],
    sections: [
      {
        id: "what",
        title: "What it is",
        blocks: [
          {
            type: "p",
            text: "A large language model is a neural network trained to guess the next token given the tokens so far. That is the whole job. Chat, RAG, agents, and 'reasoning' products are software wrapped around that loop.",
          },
          {
            type: "p",
            text: "One sentence you should be able to say without blinking: an LLM maps a sequence of tokens to a probability distribution over the next token, samples (or argmaxes) one, appends it, and repeats.",
          },
          {
            type: "callout",
            tone: "rule",
            title: "The one-sentence answer",
            text: "Written: “An LLM is a next-token predictor: it turns text into tokens, scores every vocabulary item, picks one, and repeats.” Spoken: “Sir, an LLM is a next-token machine. It is not a database and it is not thinking. Text becomes tokens, the model scores the vocab, we pick one token, append, repeat.”",
          },
          {
            type: "ul",
            items: [
              "Token: a subword piece the model actually sees, not a 'word'.",
              "Logits: raw scores for every item in the vocabulary, one forward pass.",
              "Next token: greedy argmax or a sample from the softmax of those logits.",
              "Context: the prefix the model is allowed to look at while it guesses.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Base vs instruct vs chat",
            text: "A base (pretrained) model continues text. An instruct model has been supervised on instruction-response pairs so it follows orders. A chat model adds a role format (system / user / assistant) and usually preference training (RLHF, DPO). Almost every API you will call in an India MNC is a chat model. Do not say you 'used GPT' if you cannot name which of these you called.",
          },
        ],
      },
      {
        id: "why",
        title: "Why this is the first question",
        blocks: [
          {
            type: "p",
            text: "Junior interviews in Bengaluru and Hyderabad often open with “What is an LLM?” They are not testing poetry. They are testing whether you will later claim the model 'knows' the company policy PDF, or that raising temperature 'makes it smarter'. Get this wrong and the RAG round is already lost.",
          },
          {
            type: "table",
            headers: ["Wrong picture", "What actually happens", "What you ship instead"],
            rows: [
              [
                "It is a database of the internet",
                "Weights store compressed statistical patterns, not rows you can SELECT",
                "RAG, search, or a real database for facts you must get right",
              ],
              [
                "It thinks, then writes",
                "It emits tokens left to right. Chain-of-thought is more tokens, not a mind",
                "Tools, retrieval, and checks if you need real reasoning or real data",
              ],
              [
                "ChatGPT is a different species",
                "Same next-token loop plus a product: safety, tools, memory, UI",
                "Name the model, the API, and the wrapping software separately",
              ],
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Do not say “it stores documents in the weights”",
            text: "Training compresses patterns from text. It does not index your PDFs. If the fact must be correct and current — leave policy, invoice rules, last quarter’s numbers — you put it in the prompt, a retriever, or a tool. That is why RAG exists.",
          },
        ],
      },
      {
        id: "how",
        title: "How the loop runs",
        blocks: [
          {
            type: "diagram",
            title: "One generation step",
            lines: [
              "[user / system / history text]",
              "            ↓",
              "[tokenizer → token ids]",
              "            ↓",
              "[transformer blocks]",
              "            ↓",
              "[logits: one score per vocab item]",
              "            ↓",
              "[softmax (+ temperature, top-k, top-p)]",
              "            ↓",
              "[pick next token id]",
              "            ↓",
              "[append to prefix and repeat]",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "Tokenize the prefix",
                text: "The raw string is not the input. A tokenizer (BPE-style) turns it into integer ids from a fixed vocabulary — often 50k to 200k items.",
              },
              {
                title: "Forward pass",
                text: "Embeddings plus transformer blocks produce a vector at the last position. A linear head maps that vector to logits — one number per vocab item.",
              },
              {
                title: "Turn logits into a choice",
                text: "Softmax makes a distribution. Temperature, top-k, and top-p reshape it. Greedy decoding is argmax. Then you have one new token.",
              },
              {
                title: "Autoregressive repeat",
                text: "Append the token and run again. Output length is a sequence of full forward passes. That is why generation latency is mostly about output tokens, not 'thinking time'.",
              },
            ],
          },
          {
            type: "p",
            text: "Pretraining teaches this loop on huge unlabeled text: given the previous tokens, predict the next. Instruction tuning teaches it to treat a prompt as a task. Chat templating teaches it who said what. Preference training teaches it which answers humans liked. None of those stages turn the network into a knowledge base.",
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "p",
            text: "Prompt: “The capital of Karnataka is”. A base model continues: “Bengaluru.” or “also known as Bangalore…” — it is completing text. The same weights, after chat training, see a user message “What is the capital of Karnataka?” and a system instruction “Answer in one word.” and return “Bengaluru”. Same loop. Different prefix.",
          },
          {
            type: "p",
            text: "Now swap the question to “What is our company’s casual-leave cap?” The model will still produce fluent tokens. Those tokens may be a confident wrong number copied from some generic HR blog in pretraining. Fluency is not lookup. A correct system retrieves the leave policy and puts the clause in the prefix.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Spoken vs written",
            text: "In the round they often say “explain like I am the hiring manager.” Use the spoken version: short clauses, no 'autoregressive decoder-only transformer trained with causal LM loss'. Save the jargon for a follow-up. Lead with next-token, then not-a-DB, then the loop.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build",
        blocks: [
          {
            type: "p",
            text: "You will not train GPT. You will call a chat API. Still write the loop once so you never confuse 'the product' with 'the model'.",
          },
          {
            type: "code",
            lang: "python",
            title: "Chat API is still next-token prediction",
            code: `from openai import OpenAI

client = OpenAI()  # or AzureOpenAI with azure_endpoint + api_version

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Answer in one sentence. If you do not know, say so."},
        {"role": "user", "content": "What is an LLM?"},
    ],
    max_tokens=64,
    temperature=0,
)
print(resp.choices[0].message.content)
print("prompt tokens:", resp.usage.prompt_tokens)
print("completion tokens:", resp.usage.completion_tokens)`,
          },
          {
            type: "p",
            text: "That call hides the token-by-token loop on the vendor’s GPU. `max_tokens` caps output. `temperature=0` makes the choice nearly greedy. Usage numbers are what you will later put in a FastAPI cost log — not word counts.",
          },
          {
            type: "callout",
            tone: "note",
            title: "What belongs in FastAPI",
            text: "Your service owns auth, prompt assembly, retrieval, timeouts, and logging. The LLM owns next-token. Do not wrap a 200-line 'brain' class around the client. A junior who shows a thin handler plus a clear prompt is more hireable than a fake agent framework.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What is an LLM, in one sentence?",
            a: "An LLM is a next-token predictor: it turns text into tokens, scores every vocabulary item, picks one, and repeats. It is not a search engine and it is not a database.",
            why: "They want a definition you can defend, not a Wikipedia opening paragraph.",
          },
          {
            type: "qa",
            q: "Does the model store our company PDFs in its weights?",
            a: "No. Pretraining compresses patterns from lots of public text. Your PDFs are not in there unless we put them in the prompt, a RAG index, or we fine-tuned on them — and even then it is not a reliable lookup. For policy facts I retrieve, I do not ask the model to remember.",
            why: "This is the trap that separates course-completers from people who can design RAG.",
          },
          {
            type: "qa",
            q: "Base model vs instruct vs chat — what do we actually call in production?",
            a: "Base continues text. Instruct follows a single instruction. Chat uses system/user/assistant roles and is usually preference-trained. In an MNC we almost always call a chat model through Azure OpenAI, Bedrock, Vertex, or a self-hosted vLLM endpoint. I name the model id, not 'ChatGPT'.",
          },
        ],
      },
    ],
  },
  {
    slug: "tokens",
    number: "02",
    title: "Tokens",
    subtitle: "Why word count lies, and why Hindi-English mixes cost more.",
    priority: "critical",
    minutes: 12,
    group: "LLM core",
    summary:
      "Billing, latency, and context windows are all in tokens, not words. BPE splits on frequent pieces, so English, code, and Hinglish do not cost the same.",
    youWillLearn: [
      "What a token is and the BPE idea without a paper",
      "Why token count is not word count",
      "How tokens drive cost, latency, and context",
      "Why mixed Hindi/English text usually burns more tokens",
    ],
    sections: [
      {
        id: "what",
        title: "What a token is",
        blocks: [
          {
            type: "p",
            text: "A token is the atomic string piece the model was trained on. It might be a whole common word (`the`), a subword (`ing`), a space-plus-word (` Bengaluru`), a punctuation mark, or a few bytes of a Hindi character. The vocabulary is a fixed list of these pieces, typically tens or hundreds of thousands.",
          },
          {
            type: "p",
            text: "Tokenization is the function text → list of ids. Detokenization is the reverse. You never send 'words' to the GPU. You send ids.",
          },
          {
            type: "callout",
            tone: "note",
            title: "BPE in one paragraph",
            text: "Byte Pair Encoding starts from bytes or characters and repeatedly merges the most frequent adjacent pair until it hits a target vocab size. Common English words become one token. Rare words, names, and other scripts get chopped into smaller pieces. WordPiece and Unigram are cousins with a different training rule. For interviews, 'subword tokenizer, BPE-style' is enough unless they push.",
          },
          {
            type: "widget",
            widget: "tokens",
          },
        ],
      },
      {
        id: "why",
        title: "Why token count is the unit that matters",
        blocks: [
          {
            type: "p",
            text: "Three production numbers are token-denominated: what you pay, how long you wait, and whether the prompt fits. Word count helps none of those.",
          },
          {
            type: "ul",
            items: [
              "Cost: APIs bill input tokens plus output tokens, often at different rates. Output is usually dearer.",
              "Latency: each output token is another forward pass. Prefill (reading the prompt) is one parallel-ish pass; decode is sequential.",
              "Context: an 8k or 128k window is tokens, including system, history, retrieved chunks, user text, and the answer so far.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Do not size prompts in words or pages",
            text: "“We send the last 10 pages of the PDF” is not a budget. Ten pages of English prose might be 4k tokens. Ten pages of logs or Devanagari might be 12k. Measure with the same tokenizer the model uses.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Hinglish and Indic scripts",
            text: "Most production tokenizers saw far more English than Hindi. Mixed text — “Kal invoice submit kar dena please” — and pure Devanagari usually take more tokens per word. A GCC team serving India users who ignores this will under-budget Azure spend and blow context on RAG chunks.",
          },
        ],
      },
      {
        id: "how",
        title: "How splitting works in practice",
        blocks: [
          {
            type: "p",
            text: "Take `unhappiness`. A BPE vocab that already merged `happy` and `ness` might emit `un` + `happiness`, or `un` + `happi` + `ness`. Take `ChatGPT`: often two tokens (`Chat`, `GPT`) even though it is one word on the page. Take a Hindi word: you may see several ids for what a speaker thinks is one word.",
          },
          {
            type: "diagram",
            title: "Same idea, different token bills",
            lines: [
              "English:  Please send the report tomorrow.",
              "          ~6 words  →  ~7–8 tokens",
              "               ↓",
              "Hinglish: Kal report bhej dena please.",
              "          ~5 words  →  often more tokens than the English line",
              "               ↓",
              "Code:     payload['invoice_id']",
              "          1 'word'  →  many tokens (quotes, brackets, snake_case)",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "Pick the model's tokenizer",
                text: "tiktoken for OpenAI/Azure GPT; Hugging Face AutoTokenizer for open models. Never mix tokenizers when you count.",
              },
              {
                title: "Count input and output separately",
                text: "A 3k-token RAG prompt with a 200-token answer is not '3200 words'. Prefill cost sits on 3k. User-waited latency sits mostly on 200.",
              },
              {
                title: "Watch special tokens",
                text: "Chat templates inject role markers (`<|user|>`, etc.). Those count. A 'short' system prompt can be hundreds of tokens after templating.",
              },
            ],
          },
        ],
      },
      {
        id: "example",
        title: "Two sentences, same word count, different tokens",
        blocks: [
          {
            type: "p",
            text: "Interviewers like a concrete pair. Say two sentences with roughly the same number of words and different token counts, then explain why.",
          },
          {
            type: "table",
            headers: ["Sentence", "Words (split)", "What happens to tokens"],
            rows: [
              [
                "Please send the report tomorrow.",
                "5",
                "Common English words. Close to one token per word plus punctuation.",
              ],
              [
                "Kal report bhej dena please.",
                "5",
                "Hindi pieces plus English. Tokenizer breaks Kal/bhej/dena into more ids.",
              ],
              [
                "payload[\"invoice_id\"] = 42",
                "2–3 if you squint",
                "Punctuation and identifiers explode into many tokens.",
              ],
            ],
          },
          {
            type: "p",
            text: "Spoken version: “Sir, word count is not token count. ‘Please send the report tomorrow’ and ‘Kal report bhej dena please’ can have the same number of words. The second usually costs more tokens because the tokenizer was trained mostly on English subwords. That is also why our Hindi tickets are more expensive per message.”",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Count tokens the way the model will",
            code: `import tiktoken

enc = tiktoken.get_encoding("o200k_base")  # GPT-4o family

pairs = [
    "Please send the report tomorrow.",
    "Kal report bhej dena please.",
    "payload['invoice_id'] = 42",
]
for text in pairs:
    ids = enc.encode(text)
    print(repr(text))
    print("  words ~", len(text.split()), "tokens", len(ids), "ids", ids[:12], "...")`,
          },
          {
            type: "p",
            text: "Drop this next to any FastAPI handler that builds prompts. Log `prompt_tokens` from the API response too — it includes chat-template overhead your local count might miss if you forgot the roles.",
          },
          {
            type: "callout",
            tone: "note",
            title: "Match tokenizer to model",
            text: "cl100k_base is GPT-4 / GPT-3.5. o200k_base is the 4o family. Llama, Qwen, and Mistral each have their own. A wrong tokenizer is an off-by-20% budget, which is enough to fail a context-window story in a design round.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Why is token count not equal to word count?",
            a: "Because tokenizers split on subwords. 'ChatGPT' might be two tokens, a Hindi word might be four, and spaces and punctuation also count. Billing, latency, and the context window all use tokens, not words.",
          },
          {
            type: "qa",
            q: "Give me two sentences with the same word count but different token counts.",
            a: "Please send the report tomorrow. versus Kal report bhej dena please. Same-ish word count. The Hindi-English mix usually burns more tokens because BPE was trained with far more English pieces. Code and identifiers do the same thing.",
            why: "They want proof you have counted, not a definition of BPE.",
          },
          {
            type: "qa",
            q: "How do tokens affect cost and latency in a RAG API?",
            a: "We pay for input plus output. A fat retrieved prompt makes prefill expensive even before the first word of the answer. Output tokens dominate user-facing latency because each one is a sequential forward pass. I cap max_tokens, trim history, and retrieve few chunks — not because of word count, because of tokens.",
          },
        ],
      },
    ],
  },
  {
    slug: "context-window",
    number: "03",
    title: "Context window",
    subtitle: "Everything that competes for the same token budget.",
    priority: "critical",
    minutes: 12,
    group: "LLM core",
    summary:
      "The context window is a hard token budget shared by system, history, retrieved chunks, the user, and the output. Lost-in-the-middle means stuffing more RAG is often worse.",
    youWillLearn: [
      "What actually occupies the window",
      "That generated output counts too",
      "Lost-in-the-middle and why it hurts RAG",
      "Retrieve relevant chunks, not the maximum that fits",
    ],
    sections: [
      {
        id: "what",
        title: "What the window is",
        blocks: [
          {
            type: "p",
            text: "The context window is the maximum number of tokens the model can attend to in one request: prefix plus the tokens it is currently generating. If you exceed it, the API errors or something is truncated. It is not 'memory'. It is not a database. It is a buffer for this call.",
          },
          {
            type: "diagram",
            title: "One request, one budget",
            lines: [
              "┌──────────────────────────────────┐",
              "│ system prompt                   │",
              "│ conversation history            │",
              "│ retrieved chunks (RAG)          │",
              "│ current user message            │",
              "│ generated output (counts too)   │",
              "└──────────────────────────────────┘",
              "                 ↓",
              "     context window (8k / 32k / 128k / …)",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Output lives in the same window",
            text: "If the window is 8k and your prompt is 7.5k, the model has 500 tokens of room to answer. Long answers fail or get cut. Juniors forget this and then blame the model for 'short replies'.",
          },
        ],
      },
      {
        id: "why",
        title: "Why this shows up in every RAG round",
        blocks: [
          {
            type: "p",
            text: "Every production GenAI system is a fight over this budget. System prompts grow. Multi-turn chat grows. Retrieval grows. Someone pastes a 40-page PDF. Latency and bill grow with them. Quality often falls.",
          },
          {
            type: "ul",
            items: [
              "A 128k window does not mean you should fill 128k. Prefill cost and latency scale with prompt tokens.",
              "Long context is weaker than people think: models use the beginning and the end better than the middle.",
              "RAG that retrieves 'as many chunks as fit' is a common junior failure mode.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Bigger window is not a retrieval strategy",
            text: "If the answer is in chunk 17 of 40, lost-in-the-middle can hide it. The fix is better retrieval and reranking, not `top_k=40`. Interviewers who have shipped this will wait for you to say that.",
          },
        ],
      },
      {
        id: "how",
        title: "How to budget it",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Reserve output first",
                text: "Decide max_tokens for the answer (say 512). Subtract from the model window. The rest is all you may spend on system + history + retrieval + user.",
              },
              {
                title: "Pin the system prompt",
                text: "Keep it short and stable. Role, rules, output schema. Do not paste a style guide novel.",
              },
              {
                title: "Cap history",
                text: "Keep the last N turns or summarize older ones. A 30-turn support chat will evict your retrieved policy if you are not explicit.",
              },
              {
                title: "Retrieve few, relevant",
                text: "Embed, search, rerank, take top 3–5. Put the best evidence near the question. Cite chunk ids so you can debug misses.",
              },
            ],
          },
          {
            type: "table",
            headers: ["Occupant", "Typical junior mistake", "Better default"],
            rows: [
              ["System", "Two pages of persona", "Half a page of rules + schema"],
              ["History", "Send entire session", "Last k turns or a running summary"],
              ["RAG", "top_k=20 'to be safe'", "top_k=5 after rerank, measure recall"],
              ["User", "Unbounded paste", "Truncate with a clear error over silent clip"],
              ["Output", "Forgot it counts", "Reserve max_tokens up front"],
            ],
          },
          {
            type: "p",
            text: "Lost-in-the-middle (Liu et al.): when you bury the needed fact in the middle of a long prompt, accuracy drops compared to putting it at the start or right before the question. So order is a design choice, not an implementation detail.",
          },
        ],
      },
      {
        id: "example",
        title: "A leave-policy assistant",
        blocks: [
          {
            type: "p",
            text: "User: “Can I take casual leave the day before Diwali if I already used 8 days?” A weak design dumps the 60-page HR handbook into the window. A strong design retrieves the casual-leave clause, the festival-eve clause, and the accrual table — three chunks — and places them immediately above the question.",
          },
          {
            type: "ol",
            items: [
              "Window 128k. Reserve 400 tokens for the answer.",
              "System prompt 400 tokens: answer only from context, cite clause ids, say 'not in policy' if missing.",
              "History: last 4 turns, ~600 tokens.",
              "Retrieval: 4 chunks × 400 tokens = 1600, reranked.",
              "User question ~80 tokens. Plenty of room — and you did not spend it on page 41 of the handbook.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "What the interviewer wants to hear",
            text: "“I do not stuff the PDF. I retrieve the clauses that match the question. Extra chunks cost money and they hide the useful one in the middle.” That sentence is more valuable than naming a 1M-token model.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Assemble a prompt with an explicit budget",
            code: `SYSTEM = "Answer only from CONTEXT. If missing, say you do not know."
MAX_INPUT = 6000  # leave room for the completion

def build_messages(history, chunks, user, encode):
    messages = [{"role": "system", "content": SYSTEM}]
    used = len(encode(SYSTEM))
    context = "\\n\\n".join(chunks[:5])
    user_block = f"CONTEXT:\\n{context}\\n\\nQUESTION:\\n{user}"
    used += len(encode(user_block))
    trimmed = []
    for turn in reversed(history):
        n = len(encode(turn["content"]))
        if used + n > MAX_INPUT:
            break
        trimmed.append(turn)
        used += n
    messages.extend(reversed(trimmed))
    messages.append({"role": "user", "content": user_block})
    return messages, used`,
          },
          {
            type: "p",
            text: "Wire this in FastAPI before you call the vendor. Return 413 if the user paste alone exceeds the budget. Silent truncation is how you ship confident wrong answers.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What sits in the context window?",
            a: "System prompt, conversation history, any retrieved chunks, the current user message, and the tokens the model is generating. Output counts. If we overflow, we drop something on purpose or the API errors — we do not hope.",
          },
          {
            type: "qa",
            q: "What is lost-in-the-middle?",
            a: "Models use the start and the end of a long prompt better than the middle. If the supporting paragraph is buried in chunk 12 of 30, it may as well be missing. So I retrieve few, relevant chunks and put the best evidence next to the question.",
            why: "A named failure mode plus a design consequence. That is the junior bar.",
          },
          {
            type: "qa",
            q: "For RAG, should I stuff as many chunks as the window allows?",
            a: "No. Retrieve relevant, not maximum. Extra chunks add cost, latency, and lost-in-the-middle. I start with top 3 to 5 after reranking and I only increase if recall on the eval set is actually missing.",
          },
        ],
      },
    ],
  },
  {
    slug: "sampling",
    number: "04",
    title: "Sampling",
    subtitle: "Temperature, top-k, top-p — entropy, not intelligence.",
    priority: "critical",
    minutes: 12,
    group: "LLM core",
    summary:
      "After logits, you choose a token. Temperature, top-k, and top-p change how random that choice is. They do not make the model smarter. Use 0 for facts; ~0.7 for drafts.",
    youWillLearn: [
      "Greedy vs temperature vs top-k vs top-p",
      "Why temperature is not intelligence",
      "When to use 0 versus 0.7 in production",
      "What to set for RAG answers vs copywriting",
    ],
    sections: [
      {
        id: "what",
        title: "What sampling is",
        blocks: [
          {
            type: "p",
            text: "The model’s last layer emits logits — one raw score per vocabulary item. Sampling is how you turn that vector into a single next token. Everything after 'the model ran' is this choice.",
          },
          {
            type: "ul",
            items: [
              "Greedy: pick argmax. Deterministic, often repetitive on long text.",
              "Temperature T: divide logits by T, then softmax. T → 0 approaches greedy. T = 1 is the trained distribution. T > 1 flattens it.",
              "Top-k: keep only the k highest logits, renormalize, then sample.",
              "Top-p (nucleus): keep the smallest set of tokens whose probabilities sum to at least p, then sample.",
            ],
          },
          {
            type: "widget",
            widget: "temperature",
          },
          {
            type: "callout",
            tone: "trap",
            title: "Temperature is not intelligence",
            text: "Raising temperature does not add knowledge, tools, or reasoning. It increases the chance of lower-probability tokens. Sometimes that looks 'creative'. Sometimes it looks like a wrong invoice total. Never say “we set temperature 1.2 so the model thinks better.”",
          },
        ],
      },
      {
        id: "why",
        title: "Why juniors get this question",
        blocks: [
          {
            type: "p",
            text: "Every OpenAI-style call exposes `temperature`. Hiring managers have watched candidates copy 0.7 from a blog into a KYC extraction pipeline. They want to know if you can match the knob to the job.",
          },
          {
            type: "table",
            headers: ["Job", "Typical T", "Why"],
            rows: [
              ["JSON / SQL / classification / extraction", "0 (or 0–0.2)", "There is a right token sequence. Variance is a bug."],
              ["RAG answer over a policy", "0–0.2", "Stay on the retrieved clauses. Do not invent a third rule."],
              ["Email draft, brainstorm, UI copy", "0.7-ish", "You want variety. A human will edit."],
              ["Eval harness", "0", "You need comparable runs tomorrow."],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Seed is not a contract",
            text: "temperature=0 is usually greedy enough for interviews and evals. Vendors still do not guarantee bit-identical output across hardware and versions. Design evals around graders and retries, not 'it will always be the same string'.",
          },
        ],
      },
      {
        id: "how",
        title: "How the knobs compose",
        blocks: [
          {
            type: "diagram",
            title: "From logits to a token",
            lines: [
              "logits (one score per vocab item)",
              "        ↓  divide by temperature T",
              "softmax → full distribution",
              "        ↓  optional top-k filter",
              "        ↓  optional top-p (nucleus) filter",
              "sample (or argmax if T ~ 0)",
            ],
          },
          {
            type: "p",
            text: "Temperature rescales before softmax. Low T sharpens the peak so the mode dominates. High T flattens so the tail gets mass. Top-k is a hard cutoff on rank. Top-p is a cutoff on cumulative probability — the set is small when the model is confident and larger when the distribution is spread out. Most APIs you will use expose temperature and top-p; top-k is more common in self-hosted samplers.",
          },
          {
            type: "p",
            text: "Do not crank temperature and top-p at the same time 'for creativity'. You will get garbage and not know which knob did it. Change one, measure.",
          },
          {
            type: "callout",
            tone: "india",
            title: "What they type in the score sheet",
            text: "“Knows 0 vs 0.7” is a real checkbox. Follow with: extraction and RAG at 0, drafts at 0.7, never both knobs wild, never 'temperature = smart'.",
          },
        ],
      },
      {
        id: "example",
        title: "Same prompt, two temperatures",
        blocks: [
          {
            type: "p",
            text: "Prompt: “From the context, what is the casual-leave cap?” Context states 12 days. At temperature 0 the model almost always returns “12 days”. At 0.9 it may say “around 12”, “12 or 15 depending on band”, or a fluent wrong number. For a FastAPI that a payroll team will call, that variance is a defect.",
          },
          {
            type: "p",
            text: "Swap the task to “Write three subject lines for a Diwali leave reminder.” Temperature 0 gives you near-duplicates. 0.7 gives you usable variants. Same model, same prompt family, different job.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Temperature is just scaled softmax",
            code: `import numpy as np

def sample(logits, temperature=1.0, top_p=1.0):
    t = max(float(temperature), 1e-8)
    x = logits / t
    x = x - x.max()
    p = np.exp(x)
    p = p / p.sum()
    if top_p < 1.0:
        order = np.argsort(p)[::-1]
        cdf = np.cumsum(p[order])
        keep = order[cdf <= top_p]
        if keep.size == 0:
            keep = order[:1]
        trimmed = np.zeros_like(p)
        trimmed[keep] = p[keep]
        p = trimmed / trimmed.sum()
    return int(np.random.choice(len(p), p=p))

# Production RAG: temperature=0. Greedy enough for facts.
# Copy draft: temperature=0.7, top_p=0.9. One knob at a time.`,
          },
          {
            type: "p",
            text: "In FastAPI, do not take temperature from the client on a compliance endpoint. Hard-code 0. Expose it only on an internal 'playground' route.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What does temperature do?",
            a: "It scales the logits before softmax. Low temperature makes the distribution peaky so we pick the most likely token. High temperature flattens it so rarer tokens can appear. It does not make the model smarter and it does not add knowledge.",
          },
          {
            type: "qa",
            q: "When do you use 0 versus 0.7?",
            a: "Zero for extraction, classification, SQL, JSON, eval, and production RAG answers — there is a right answer and I do not want extra facts. Around 0.7 for drafts and brainstorming where a human will edit. I do not ship 0.7 on an invoice field.",
            why: "This is the practical question. Definitions without a default will not pass.",
          },
          {
            type: "qa",
            q: "Top-k versus top-p?",
            a: "Top-k keeps a fixed k tokens. Top-p keeps the smallest set whose probabilities sum to p, so the set grows when the model is unsure. Most hosted APIs give me temperature plus top-p. I set a conservative top-p and leave it, then I only move temperature.",
          },
        ],
      },
    ],
  },
  {
    slug: "transformers",
    number: "05",
    title: "Transformers",
    subtitle: "Encoder, decoder, and why GPT-style models are decoder-only.",
    priority: "high",
    minutes: 14,
    group: "LLM core",
    summary:
      "The transformer is a stack of attention plus feed-forward blocks. Encoder-only, decoder-only, and encoder-decoder are three layouts. Chat GPTs are decoder-only because generation scaled.",
    youWillLearn: [
      "The high-level transformer stack",
      "Encoder vs decoder vs encoder-decoder",
      "Why decoder-only won for GPT-style products",
      "What you do and do not need to derive on a whiteboard",
    ],
    sections: [
      {
        id: "what",
        title: "What a transformer is",
        blocks: [
          {
            type: "p",
            text: "A transformer is an architecture: stacked blocks that mix information across tokens with self-attention, then a feed-forward network on each token, plus residual connections and layer norm. It replaced recurrence (RNNs) so training could parallelize over the sequence.",
          },
          {
            type: "diagram",
            title: "High-level stack (decoder-only GPT style)",
            lines: [
              "token ids",
              "   ↓",
              "token embedding + position info",
              "   ↓",
              "× N blocks:  (masked) self-attention  →  FFN",
              "              residuals + layer norm around both",
              "   ↓",
              "linear head → logits over vocabulary",
            ],
          },
          {
            type: "table",
            headers: ["Layout", "Classic example", "What it is good at"],
            rows: [
              [
                "Encoder-only",
                "BERT, RoBERTa, most embedding models",
                "Bidirectional understanding: classify, tag, embed",
              ],
              [
                "Decoder-only",
                "GPT, Llama, Qwen, Mistral, Gemini-style LLMs",
                "Left-to-right generation: chat, code, agents",
              ],
              [
                "Encoder-decoder",
                "Original Transformer, T5, BART",
                "Map an input sequence to an output sequence: translate, summarize",
              ],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Junior bar",
            text: "You should draw the stack and name the three layouts. You should not be asked to write multi-head attention in einsum from memory. If they go there, they are screening for ML-engineer, not applied GenAI.",
          },
        ],
      },
      {
        id: "why",
        title: "Why the layout matters for the job",
        blocks: [
          {
            type: "p",
            text: "The product you are hired to ship is almost always decoder-only generation plus a separate encoder for embeddings. Mixing those two in your head leads to nonsense like 'we fine-tune BERT to chat' or 'GPT is bidirectional so it understands the whole document at once'.",
          },
          {
            type: "ul",
            items: [
              "RAG retrieval: encoder-only or embedding checkpoint (sentence-transformers, e5, OpenAI embeddings).",
              "RAG generation: decoder-only chat model.",
              "Translation teams may still use encoder-decoder. Your copilot will not.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "GPT is not BERT with a bigger GPU",
            text: "BERT looks both ways and is not trained to emit long answers. GPT looks left-to-right with a causal mask so it can generate. You can extract embeddings from a decoder if you must. It is the wrong default for a retrieval index.",
          },
        ],
      },
      {
        id: "how",
        title: "How decoder-only won",
        blocks: [
          {
            type: "p",
            text: "The original 2017 Transformer was encoder-decoder for translation. Then three lines of work split. BERT showed bidirectional encoders crush understanding benchmarks. GPT showed that a decoder trained on next-token prediction, scaled up, becomes a general generator. T5 kept both stacks and treated every task as text-to-text.",
          },
          {
            type: "steps",
            items: [
              {
                title: "One objective scales",
                text: "Next-token prediction on the internet is simple to implement, easy to shard, and does not need task labels. That is what you can spend $10M–$100M on.",
              },
              {
                title: "The products are generation",
                text: "Chat, code, tools, agents: the model must emit tokens. A decoder already is a generator. An encoder is not.",
              },
              {
                title: "Causal mask + KV cache",
                text: "Each new token only depends on the past. You can cache past keys and values (next chapter) and decode cheaply enough to ship a chatbot.",
              },
              {
                title: "Instruction and preference training sit on top",
                text: "SFT + RLHF/DPO turn a base decoder into a chat model without changing the stack. The industry standardized on that recipe.",
              },
            ],
          },
          {
            type: "p",
            text: "Encoder-decoder is not 'wrong'. It is the right tool when the input and output are different sequences and you want a full bidirectional read of the input — translation, some ASR, some summarization. It lost the general-assistant race because teams did not want to train and serve two stacks when one decoder did chat, code, and tools.",
          },
        ],
      },
      {
        id: "example",
        title: "Same sentence, three models",
        blocks: [
          {
            type: "p",
            text: "Sentence: “Mark the invoice as paid.” Encoder-only: you take a pooled vector and classify it as an `update_status` intent, or you embed it for search. Decoder-only: you prompt a chat model to emit a JSON tool call `{\"status\": \"paid\"}`. Encoder-decoder: you could train T5 to map the sentence to that JSON. In a 2026 FastAPI copilot you pick the decoder for the action and a small encoder for retrieval — not T5 — unless you have a translation-shaped problem.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Whiteboard in 90 seconds",
            text: "Draw tokens → embed → N × (attention + FFN) → logits. Label the mask as causal for GPT. Say “BERT is encoder-only, GPT is decoder-only, T5 is both.” Stop. Let them ask why decoder-only won. Then say the four reasons above.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build",
        blocks: [
          {
            type: "p",
            text: "You will not implement GPT. You should still be able to sketch one block in numpy-shaped Python so the stack is not magic.",
          },
          {
            type: "code",
            lang: "python",
            title: "One decoder block, conceptually",
            code: `import numpy as np

def layer_norm(x, eps=1e-5):
    mu = x.mean(axis=-1, keepdims=True)
    var = x.var(axis=-1, keepdims=True)
    return (x - mu) / np.sqrt(var + eps)

def decoder_block(x, Wq, Wk, Wv, Wo, W1, W2):
    # x: [seq, d] — already embedded tokens
    q, k, v = x @ Wq, x @ Wk, x @ Wv
    scale = np.sqrt(q.shape[-1])
    scores = (q @ k.T) / scale
    seq = x.shape[0]
    causal = np.triu(np.ones((seq, seq)), k=1) * -1e9
    weights = np.exp(scores + causal)
    weights = weights / weights.sum(axis=-1, keepdims=True)
    attn = weights @ v @ Wo
    x = layer_norm(x + attn)
    ff = np.maximum(x @ W1, 0) @ W2
    return layer_norm(x + ff)

# Stack N of these, then logits = x @ W_vocab.T
# Real models add multi-head, RoPE, SwiGLU, etc. Same skeleton.`,
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Encoder versus decoder versus encoder-decoder?",
            a: "Encoder-only like BERT sees both sides of the sentence — good for embeddings and classification. Decoder-only like GPT reads left to right with a causal mask and generates — that is chat. Encoder-decoder like T5 encodes the input then generates — good for translation. The GPT-style products we ship are decoder-only.",
          },
          {
            type: "qa",
            q: "Why did decoder-only win for GPT-style models?",
            a: "One objective — next token — scales on unlabeled text. Chat, code, and agents are generation. KV cache makes serving practical. Instruction and preference training sit on the same stack. Encoder-decoder still wins at some seq2seq jobs, but assistants standardized on decoders.",
          },
          {
            type: "qa",
            q: "Walk the transformer stack at a high level.",
            a: "Tokenizer, token plus position embeddings, then N blocks of self-attention and a feed-forward net with residuals and layer norm, then a linear head to vocab logits. For GPT the attention is causally masked. That is the skeleton. Variants change the block internals, not the story.",
          },
        ],
      },
    ],
  },
  {
    slug: "attention",
    number: "06",
    title: "Attention",
    subtitle: "How “it” finds “dog” — QKV, then KV cache for latency.",
    priority: "high",
    minutes: 14,
    group: "LLM core",
    summary:
      "Self-attention lets each token mix information from the others. Q, K, V are just look-up, label, and payload. KV cache is why first-token latency and memory blow up on long prompts.",
    youWillLearn: [
      "The 'dog / street / it' intuition for self-attention",
      "Q, K, V in one minute with no matrix-calculus",
      "Causal masking in decoder-only models",
      "KV cache as a latency and memory topic",
    ],
    sections: [
      {
        id: "what",
        title: "What attention is doing",
        blocks: [
          {
            type: "p",
            text: "Classic pair: “The dog didn’t cross the street because it was too tired.” versus “…because it was too wide.” Humans know `it` is the dog in the first sentence and the street in the second. Self-attention is the mechanism that lets the token `it` pull more from `dog` or from `street` depending on the rest of the prefix.",
          },
          {
            type: "p",
            text: "For every token, the layer computes a weighted mix of the other (allowed) tokens. The weights are the 'who should I listen to'. The mix is how context moves around the sequence without an RNN stepping one by one.",
          },
          {
            type: "callout",
            tone: "note",
            title: "Self vs cross",
            text: "Self-attention: queries, keys, and values all come from the same sequence. Cross-attention (encoder-decoder): queries from the decoder, keys/values from the encoder. GPT-style decoder-only models use masked self-attention. They do not need cross-attention.",
          },
        ],
      },
      {
        id: "why",
        title: "Why they ask this",
        blocks: [
          {
            type: "p",
            text: "You do not need four pages of math for an applied role. You do need to explain how context flows, why long prompts are expensive, and what KV cache is when they ask “why is time-to-first-token slow?”",
          },
          {
            type: "ul",
            items: [
              "Quality: attention is how coreference, instructions, and retrieved clauses reach the next token.",
              "Cost: attention is O(sequence²) in the naive form during prefill.",
              "Serving: KV cache turns decode into O(sequence) extra work per new token, at the price of GPU memory.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Do not recite the paper",
            text: "If you start with 'multi-head scaled dot-product attention as defined in Vaswani et al.' and never reach the dog sentence or KV cache, you sound like a blog. Start with the pronoun. Add QKV. End with cache.",
          },
        ],
      },
      {
        id: "how",
        title: "How Q, K, V work at intuition level",
        blocks: [
          {
            type: "p",
            text: "Each token vector is projected three ways:",
          },
          {
            type: "ul",
            items: [
              "Query (Q): what this token is looking for right now. `it` might be looking for a noun to bind to.",
              "Key (K): how a token advertises itself. `dog` and `street` put up different labels.",
              "Value (V): the payload a token will pass if it is chosen. The actual features of `dog`.",
            ],
          },
          {
            type: "diagram",
            title: "One head, one token",
            lines: [
              "for token \"it\":",
              "  score against every key  →  softmax  →  weights",
              "  dog   0.71",
              "  street 0.08",
              "  tired  0.14",
              "  ...",
              "  output = 0.71 * V_dog + 0.08 * V_street + ...",
            ],
          },
          {
            type: "p",
            text: "The score is a dot product of this query with each key, scaled so the softmax does not saturate. Multi-head means several QKV sets in parallel — one head might track pronouns, another syntax, another a copied JSON key. Then we concatenate and project back.",
          },
          {
            type: "p",
            text: "In a decoder, a causal mask forbids token t from looking at t+1, t+2, … Otherwise the model would cheat at next-token training by reading the answer.",
          },
          {
            type: "h",
            text: "KV cache (the production part)",
          },
          {
            type: "p",
            text: "When you generate token 50, tokens 1–49 already had keys and values. Those do not change. Serving stacks store them (the KV cache) so decode does not recompute attention over the whole prefix from scratch. Prefill writes the cache (time-to-first-token, grows with prompt length). Decode reads it and appends one row (time-per-output-token). GPU memory for the cache grows with layers × heads × sequence × head_dim — that is why long-context chats get expensive even after the math is cached.",
          },
        ],
      },
      {
        id: "example",
        title: "The dog sentence, then a RAG prompt",
        blocks: [
          {
            type: "p",
            text: "“The dog didn’t cross the street because it was tired.” Attention from `it` should land on `dog`. Change the last word to `wide` and it should land on `street`. You will not inspect those weights in production. You will notice the same idea when a retrieved clause is in the prompt: the generated answer can only use that clause if some heads actually put weight on it. If you bury the clause in 20 other chunks, those weights get diluted. That is attention plus lost-in-the-middle, not mysticism.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Latency follow-up they love",
            text: "“p95 is 4 seconds.” Walk: long RAG prompt → heavy prefill → TTFT hurts. Then each answer token reads KV cache. Fixes: fewer chunks, smaller model, streaming, prompt cache if the vendor supports it. Do not say 'optimize attention' as if you will rewrite CUDA.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Tiny causal attention (one head)",
            code: `import numpy as np

def causal_attention(x):
    # x: [seq, d] toy token vectors
    d = x.shape[-1]
    q = x  # in real models these are three different projections
    k = x
    v = x
    scores = (q @ k.T) / np.sqrt(d)
    mask = np.triu(np.ones(scores.shape), k=1).astype(bool)
    scores = np.where(mask, -1e9, scores)
    w = np.exp(scores - scores.max(axis=-1, keepdims=True))
    w = w / w.sum(axis=-1, keepdims=True)
    return w @ v, w

# w[-1] is "what the last token listened to" — the dog/it picture.`,
          },
          {
            type: "p",
            text: "KV cache is the same formula with `k` and `v` from previous steps stored and concatenated. In interview code, saying that sentence is enough. In production you consume it via vLLM / TensorRT-LLM / the vendor API, not your numpy.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Explain self-attention with the dog sentence.",
            a: "In 'The dog didn’t cross the street because it was tired,' attention lets the token 'it' put more weight on 'dog' than on 'street'. Each token builds a weighted mix of the others. Change 'tired' to 'wide' and the mix should swing toward 'street'. That mix is how context reaches the next token.",
          },
          {
            type: "qa",
            q: "What are Q, K, and V in one minute?",
            a: "Query is what this token is looking for. Key is how other tokens advertise themselves. Value is the information they pass if they match. We score the query against keys, softmax, and take a weighted sum of values. I would not derive the gradients in this round.",
          },
          {
            type: "qa",
            q: "What is the KV cache and why do we care in production?",
            a: "When we generate token 50, keys and values for 1–49 are already computed. We store them so we do not redo the whole prefix. Prefill fills the cache and that is time-to-first-token. Decode is faster per token but the cache eats GPU memory as the prompt grows. That is why fat RAG prompts feel slow even before the answer starts streaming.",
            why: "Applied teams hire people who connect attention to latency, not people who only know the slogan 'attention is all you need'.",
          },
        ],
      },
    ],
  },
  {
    slug: "embeddings",
    number: "07",
    title: "Embeddings",
    subtitle: "Semantic vectors, one encoder, and when to go local vs API.",
    priority: "critical",
    minutes: 14,
    group: "LLM core",
    summary:
      "An embedding is a dense vector for text, trained so similar meaning sits nearby. RAG lives or dies on using the same encoder for queries and documents, and on picking a model you can defend (OpenAI, sentence-transformers, e5).",
    youWillLearn: [
      "What an embedding is and is not",
      "Why query and documents must share an encoder",
      "Dimensions, MTEB, and how to pick a model",
      "OpenAI vs sentence-transformers vs e5 — India-practical tradeoffs",
    ],
    sections: [
      {
        id: "what",
        title: "What an embedding is",
        blocks: [
          {
            type: "p",
            text: "An embedding is a fixed-length list of numbers — a vector — that represents a piece of text. Models are trained so paraphrases land close together and unrelated sentences land far apart. 'Casual leave policy' and 'rules for taking a personal day' should be nearer than either is to 'payroll tax slab'.",
          },
          {
            type: "p",
            text: "This is not the LLM 'thinking'. It is a (usually encoder) network whose output you store and search. The generation model may be completely different from the embedding model. In RAG they are two components.",
          },
          {
            type: "ul",
            items: [
              "Input: a string (query, chunk, product title).",
              "Output: a vector of size d (384, 768, 1024, 1536, 3072, …).",
              "Use: nearest-neighbor search, clustering, dedup, classification.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Same encoder on both sides",
            text: "A nearest neighbor is only meaningful in one vector space. Embed the corpus with model A and the query with model B and you get confident junk. Same checkpoint, same prefixes, same normalization. Asymmetric models like e5 still share the checkpoint — they just want `query:` vs `passage:` prefixes.",
          },
        ],
      },
      {
        id: "why",
        title: "Why this is a critical chapter",
        blocks: [
          {
            type: "p",
            text: "If you cannot explain embeddings, you cannot explain RAG. Interviewers in applied-AI GCCs will skip from 'what is an LLM' to 'how do you retrieve' in one breath. The bridge is this vector.",
          },
          {
            type: "table",
            headers: ["Use case", "What you embed", "What you do with the vectors"],
            rows: [
              ["RAG / search", "Chunks + the user query", "kNN / ANN in a vector DB"],
              ["Dedup", "Tickets, docs, questions", "Near-duplicate clustering"],
              ["Routing", "Incoming query", "Nearest intent prototype"],
              ["Eval", "Answers vs references", "Semantic similarity as a weak metric"],
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Do not embed with a chat model 'because we already have GPT'",
            text: "You can pull a hidden state out of a decoder. Quality and cost are usually worse than a dedicated embedding model. Separate the retriever from the generator unless you have measured otherwise.",
          },
        ],
      },
      {
        id: "how",
        title: "How to choose one",
        blocks: [
          {
            type: "p",
            text: "MTEB (Massive Text Embedding Benchmark) ranks embedding models on retrieval, clustering, classification, STS, and more. Retrieval score is the one that matters for RAG. Do not pick a model because the dimension is bigger. Bigger d costs storage and distance-compute; it is not a quality guarantee.",
          },
          {
            type: "table",
            headers: ["Family", "Where it runs", "What to remember"],
            rows: [
              [
                "OpenAI (text-embedding-3-small/large)",
                "API / Azure OpenAI",
                "Strong, simple, billed per token. Data leaves unless Azure + your region. 1536 or 3072-d.",
              ],
              [
                "sentence-transformers (MiniLM, mpnet, BGE, …)",
                "Local Python / CPU or small GPU",
                "Free, private, good POCs and intranet search. 384–1024-d. You own versioning.",
              ],
              [
                "e5 (intfloat), GTE, BGE",
                "Local or HF endpoint",
                "Strong open retrieval. e5 wants `query:` / `passage:` prefixes. Forget the prefix, kill recall.",
              ],
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "Pick for the metric, not the brand",
                text: "Run a 50-query gold set of real India tickets / policies. Measure recall@5. That beats a Twitter screenshot of MTEB.",
              },
              {
                title: "Lock the version",
                text: "Re-embedding 2 million chunks because someone `pip install -U`’d the model is a week of quiet outage. Pin hashes.",
              },
              {
                title: "Match languages",
                text: "Hindi and Hinglish need multilingual models (or a dedicated Indic embedder). An English-only MiniLM will look 'fine' on your demo and fail on production tickets.",
              },
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "POC vs GCC production",
            text: "Laptop POC: `sentence-transformers` all-MiniLM or multilingual-e5-small, Chroma, FastAPI. Team already on Azure: `text-embedding-3-small` in the same region as the chat model so the data story is one conversation. Do not mix spaces in one index.",
          },
        ],
      },
      {
        id: "example",
        title: "Invoice-policy search",
        blocks: [
          {
            type: "p",
            text: "Query: “vendor GST mismatch on the PO”. Chunks: a 3-page finance SOP. The words GST, vendor, and PO may never sit in the same sentence as the user’s phrasing. Keyword search misses. An embedding trained for retrieval still places the query near the 'tax identity on purchase orders' clause. That is the point of semantic vectors.",
          },
          {
            type: "p",
            text: "If you encoded the SOP with `all-MiniLM-L6-v2` and the query with OpenAI `text-embedding-3-small`, the nearest neighbors are a random walk. Same words, two geometries.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Same encoder for query and documents",
            code: `from sentence_transformers import SentenceTransformer

# multilingual-e5-small is a reasonable India-friendly local default.
# If you use e5, prefix exactly like the model card.
model = SentenceTransformer("intfloat/multilingual-e5-small")

passages = [
    "passage: Casual leave cap is 12 days per calendar year.",
    "passage: Sick leave requires a medical certificate after 2 days.",
]
q = "query: how many casual leaves can I take?"

doc_vecs = model.encode(passages, normalize_embeddings=True)
q_vec = model.encode([q], normalize_embeddings=True)
scores = doc_vecs @ q_vec.T  # cosine, because we normalized
print(scores.ravel())`,
          },
          {
            type: "p",
            text: "In FastAPI, load the model once at process start (or call Azure embeddings with a connection pool). Never `SentenceTransformer(...)` inside the request handler.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What is an embedding?",
            a: "A dense vector for a piece of text, trained so similar meaning sits nearby. In RAG I embed chunks at index time and the query at request time with the same encoder, then I take nearest neighbors.",
          },
          {
            type: "qa",
            q: "OpenAI embeddings versus sentence-transformers versus e5?",
            a: "OpenAI is an API — simple and strong, data leaves unless we use Azure in-region. sentence-transformers runs locally, free, good for cost and privacy on a POC. e5 is a strong open retrieval family but you must prefix query and passage the way the card says. I pick local for a laptop demo and Azure when the team already has that tenancy.",
          },
          {
            type: "qa",
            q: "Why must the query and the documents use the same encoder?",
            a: "Nearest neighbor only means something in one vector space. MiniLM documents plus an OpenAI query are not comparable. Same model, same prefixes, same normalization. I also pin the version so I am not silently mixing two checkpoints in one index.",
            why: "This is the most missed practical point in junior RAG interviews.",
          },
        ],
      },
    ],
  },
  {
    slug: "similarity",
    number: "08",
    title: "Similarity",
    subtitle: "Cosine, dot product, L2 — and why RAG normalizes.",
    priority: "critical",
    minutes: 12,
    group: "LLM core",
    summary:
      "Retrieval ranks by a distance. Cosine compares direction and is the default for RAG. Dot product equals cosine on L2-normalized vectors. Forget to normalize and long chunks win for the wrong reason.",
    youWillLearn: [
      "Cosine vs dot product vs L2",
      "Why and when to L2-normalize",
      "Why cosine is the default for RAG",
      "How this maps to FAISS / Chroma settings",
    ],
    sections: [
      {
        id: "what",
        title: "What we are measuring",
        blocks: [
          {
            type: "p",
            text: "After embedding, a query is a vector q and each chunk is a vector d. Retrieval is: rank documents by how close d is to q. 'Close' needs a formula. Three show up in every vector database.",
          },
          {
            type: "table",
            headers: ["Metric", "Formula idea", "Range / meaning"],
            rows: [
              [
                "Cosine similarity",
                "dot(q, d) / (|q| |d|)",
                "−1 to 1. 1 = same direction. Ignores vector length.",
              ],
              [
                "Dot product (IP)",
                "q · d",
                "Unbounded. Equals cosine if both vectors are L2-normalized.",
              ],
              [
                "L2 (Euclidean)",
                "|q − d|",
                "0 is identical. Smaller is closer. Ranking matches cosine on normalized vectors.",
              ],
            ],
          },
          {
            type: "widget",
            widget: "cosine",
          },
          {
            type: "callout",
            tone: "note",
            title: "Normalize once, then inner product",
            text: "If you L2-normalize embeddings at index time and query time, cosine, inner product, and (ranking by) L2 agree. FAISS `IndexFlatIP` on normalized vectors is cosine search. That is the default you should be able to say out loud.",
          },
        ],
      },
      {
        id: "why",
        title: "Why cosine is the RAG default",
        blocks: [
          {
            type: "p",
            text: "Embedding magnitude often tracks document length, token frequency, or incidental scale from the encoder — not 'more meaning'. Cosine throws length away and compares direction. That is usually what we want when the question is a sentence and the chunk is a paragraph.",
          },
          {
            type: "ul",
            items: [
              "A 800-token chunk can have a larger raw vector than a 80-token clause even if the clause is the answer. Raw dot product rewards the long one.",
              "Cosine (or IP after normalize) compares the angle. The short clause can win.",
              "Thresholds ('drop chunks below 0.3') are only sane if the metric is bounded and stable. Cosine is.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Unnormalized dot product in a mixed-length corpus",
            text: "This is the silent RAG bug. Everything 'works' in a demo of equal-sized chunks. Production PDFs have tables, one-line headings, and two-page annexures. Long annexures start winning. People then 'tune top_k' instead of normalizing.",
          },
        ],
      },
      {
        id: "how",
        title: "How the three relate",
        blocks: [
          {
            type: "p",
            text: "On unit vectors, q · d = cosine(q, d), and |q − d|² = 2 − 2 cosine(q, d). So ranking is the same. The database still asks you to pick a metric because the index structure (HNSW, IVF) stores different numbers. Pick one, normalize on the way in, and do not mix.",
          },
          {
            type: "diagram",
            title: "Same two vectors, three readouts",
            lines: [
              "q = policy question          d = a chunk",
              "              ↘          ↙",
              "                 angle θ",
              "cosine  =  cos θ          (direction only)",
              "dot     = |q||d| cos θ    (direction × lengths)",
              "L2      = |q − d|         (straight-line distance)",
              "               ↓",
              "if |q| = |d| = 1, all three rank documents the same",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "Encode",
                text: "Same model for query and docs. Apply the model's prefixes.",
              },
              {
                title: "L2-normalize",
                text: "In sentence-transformers: `normalize_embeddings=True`. For OpenAI, some endpoints already return unit vectors; still normalize if you are unsure.",
              },
              {
                title: "Index with inner product or cosine",
                text: "Chroma cosine, FAISS IP, pgvector `vector_cosine_ops`. Do not store raw vectors in an L2 index and then compare cosine scores in logs as if they matched.",
              },
              {
                title: "Never mix spaces",
                text: "A 0.72 from MiniLM is not a 0.72 from text-embedding-3-small. Thresholds are per model per metric.",
              },
            ],
          },
        ],
      },
      {
        id: "example",
        title: "Two chunks, one query",
        blocks: [
          {
            type: "p",
            text: "Query: “casual leave cap”. Chunk A: one sentence, “Casual leave cap is 12 days.” Chunk B: two pages of leave annexure that mention casual leave once. Unnormalized dot product often ranks B first because the vector is longer. Cosine ranks A first. That is the example you should put on the whiteboard.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Spoken closer",
            text: "“Sir, I L2-normalize and use cosine. Then long PDF chunks do not beat the actual clause. Dot product is fine only after that normalize. I do not mix embedding models in one index.”",
          },
        ],
      },
      {
        id: "implementation",
        title: "Build",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Cosine is normalized dot product",
            code: `import numpy as np

def l2_normalize(mat):
    n = np.linalg.norm(mat, axis=1, keepdims=True)
    return mat / np.clip(n, 1e-12, None)

def cosine(q, docs):
    qn = l2_normalize(q.reshape(1, -1))
    dn = l2_normalize(docs)
    return (dn @ qn.T).ravel()

docs = np.array(
    [
        [0.2, 0.8, 0.1],   # short clause-like
        [2.0, 8.0, 1.0],   # same direction, huge magnitude
        [0.9, 0.1, 0.0],   # different topic
    ],
    dtype=float,
)
q = np.array([0.25, 0.75, 0.1])
print("raw dot", docs @ q)
print("cosine ", cosine(q, docs))
# raw dot ranks the huge vector first; cosine ties it with the short one.`,
          },
          {
            type: "p",
            text: "In FastAPI, normalize in the ingest job and in the query path. Do not trust that 'the database will do it' unless you verified the collection metadata. Log the top score; if everything is 0.12, you are in the wrong space or you forgot prefixes, not 'the user asked a hard question'.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Cosine versus dot product versus L2?",
            a: "Cosine is the angle — it ignores length. Dot product is cosine times the two lengths. L2 is straight-line distance. If I L2-normalize both sides, cosine and dot rank the same, and L2 ranks the same too. I normalize and use cosine or inner product in the vector DB.",
          },
          {
            type: "qa",
            q: "Why is cosine the default for RAG?",
            a: "Embedding magnitude often tracks length or frequency, not meaning. Cosine compares direction so a short policy clause can beat a long annexure. After we normalize, FAISS inner product is cosine, so the default is both principled and cheap.",
          },
          {
            type: "qa",
            q: "What happens if you forget to normalize?",
            a: "Long chunks dominate if we use raw dot product. Scores from two models cannot be mixed. Thresholds become nonsense. I normalize at index time and at query time, I pin one metric, and I never mix embedding spaces in one collection.",
            why: "They are checking whether you have debugged a real index, not whether you can write the cosine formula.",
          },
        ],
      },
    ],
  },
];
