import type { Chapter } from "../types";

export const coreChapters: Chapter[] = [
  {
    slug: "dsa",
    number: "37",
    title: "DSA for AI interviews in India",
    subtitle: "Patterns, not 400 random problems. A 4-week selected Striver plan.",
    priority: "core",
    minutes: 20,
    group: "Interview core",
    summary:
      "Product MNCs still filter on DSA. You do not need 400 problems. You need arrays, hashing, two pointers, sliding window, stack, binary search, heap, trees, BFS/DFS, and intro DP — plus a 4-week plan.",
    youWillLearn: [
      "Which patterns actually appear in junior AI loops",
      "How DSA shows up even on AI teams",
      "A 4-week Striver A2Z subset you can finish",
      "How to speak while you code",
    ],
    sections: [
      {
        id: "what",
        title: "What to study (and what to ignore)",
        blocks: [
          {
            type: "p",
            text: "DSA in this handbook is a filter, not a personality. You are not preparing for ICPC. You are preparing to pass a 45-minute round so you are allowed to talk about RAG. That means patterns you can recognize in 90 seconds, not a cemetery of 400 unchecked boxes.",
          },
          {
            type: "table",
            headers: ["Pattern", "Why it appears", "Stop after you can"],
            rows: [
              ["Arrays + prefix", "Warm-up, easy OA", "Kadane, rotate, product except self"],
              ["Hashing", "Frequency, pairs, anagrams", "Two-sum family, group anagrams, subarray sum"],
              ["Two pointers", "Sorted arrays, pairs", "3-sum, container with water, remove dupes"],
              ["Sliding window", "Substrings, streams", "Longest substring, min window, at-most-k"],
              ["Stack", "Next greater, validity", "Valid parentheses, daily temperatures, min stack"],
              ["Binary search", "Search space, not just arrays", "Bound search, min-in-rotated, koko / capacity"],
              ["Heap", "Top-k, merge", "Kth largest, merge K lists, top-k frequent"],
              ["Trees", "Recursion comfort", "Traversals, LCA, diameter, serialize (optional)"],
              ["Graphs BFS/DFS", "Dependencies, grids", "Number of islands, course schedule, shortest unweighted"],
              ["Intro DP", "They may still ask one", "Climb stairs, coin change, LIS or 0/1 knapsack idea"],
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "Selected, not completed",
            text: "Striver A2Z is a map. You will not finish every node. You will finish the patterns above at easy+medium until you can explain time and space without looking.",
          },
        ],
      },
      {
        id: "why",
        title: "Why AI engineers still sit DSA",
        blocks: [
          {
            type: "p",
            text: "Google, Microsoft, Amazon, Adobe, Salesforce, and many GCCs use the same campus/SDE funnel for junior AI roles. The OA does not know you built Chroma RAG. Services firms may skip hard DSA; product MNCs will not. Skipping DSA because “I am GenAI” is how you never enter the building.",
          },
          {
            type: "ul",
            items: [
              "OA: 2 problems in 60–90 minutes, often hashing + two pointers or BFS.",
              "Live: they grade approach, edge cases, complexity, and whether you test.",
              "AI-flavored DSA: token stream sliding window, top-k similar docs (heap), prefix cache, graph of agent tool dependencies — rare, but the patterns are the same.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "Company split",
            text: "FAANG-like / top product: full DSA bar. Strong GCC: high. India product: medium–high. IT services AI track: low–medium, more SQL and a case study. Choose hours based on the target, not based on Twitter.",
          },
        ],
      },
      {
        id: "how",
        title: "How to practice so it transfers",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Pattern, then three problems",
                text: "Read the pattern once. Do one easy, two mediums. Write the template from memory the next day.",
              },
              {
                title: "Speak the invariant",
                text: "“Left pointer is the start of a valid window. I expand right, shrink when count > k.” Interviewers hire the invariant, not the AC.",
              },
              {
                title: "Always state complexity",
                text: "After coding: “O(n) time, O(k) extra space.” If you cannot, you do not understand the solution yet.",
              },
              {
                title: "Re-solve after 3 days",
                text: "A problem you cannot redo was entertainment, not study.",
              },
            ],
          },
        ],
      },
      {
        id: "example",
        title: "Example: sliding window in an AI costume",
        blocks: [
          {
            type: "p",
            text: "“Given a stream of tokens, find the shortest substring that contains all required terms.” That is minimum-window substring. In a RAG OA they might dress it as log lines or as chat turns. If you only memorized “longest substring without repeating characters,” you still have the moving-window template: expand, shrink, update answer.",
          },
          {
            type: "code",
            lang: "python",
            title: "Window template you should be able to write cold",
            code: `from collections import Counter

def min_window(s: str, t: str) -> str:
    need, missing = Counter(t), len(t)
    left = start = end = 0
    best = float("inf")
    for right, ch in enumerate(s, 1):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        while missing == 0:
            if right - left < best:
                best, start, end = right - left, left, right
            need[s[left]] += 1
            if need[s[left]] > 0:
                missing += 1
            left += 1
    return s[start:end] if best < float("inf") else ""`,
          },
        ],
      },
      {
        id: "implementation",
        title: "4-week selected Striver A2Z plan",
        blocks: [
          {
            type: "p",
            text: "Assume 90 minutes on weekdays, 3 hours on one weekend day. Python is enough. Do not context-switch to Java “because Amazon.” If the OA is Java-only, you will know in the JD — then switch earlier.",
          },
          {
            type: "table",
            headers: ["Week", "Striver A2Z slice", "Output"],
            rows: [
              [
                "1",
                "Arrays, hashing, two pointers, sliding window (easy+selected medium)",
                "15–20 problems. Templates in a notebook: prefix, hash pair, window.",
              ],
              [
                "2",
                "Stack, binary search (including on answer), heap / top-k",
                "12–15 problems. You can write binary search bounds without off-by-one panic.",
              ],
              [
                "3",
                "Trees (DFS/BFS, LCA, diameter) + graph BFS/DFS + islands / course schedule",
                "12–15 problems. You can recurse without mixing up return values.",
              ],
              [
                "4",
                "Intro DP (1D + unbounded knapsack / coin change) + mixed timed sets",
                "2 timed 60-min mocks. Re-solve every miss the same day.",
              ],
            ],
          },
          {
            type: "ul",
            items: [
              "Skip: heavy segment trees, suffix arrays, max-flow, advanced DP on trees — unless the JD is a platform SDE at a top product company and you already finished the table above.",
              "Language: write in the language you will use in the OA. Prefer Python for speed unless they forbid it.",
              "Quality bar: 80 well-understood problems beat 400 grey ticks.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Watching Striver videos at 2x is not practice",
            text: "If the editor is empty, you did not study. Close the video after the problem statement. Struggle for 20 minutes. Then look. Then re-type from scratch.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "I want a GenAI role. Can I skip DSA?",
            a: "Not for product MNCs and strong GCCs in India. I time-box it to four weeks of patterns so I still have hours for the project. I skip it only if I am exclusively targeting services interviews that publish a no-DSA process — and I still keep hashing and SQL.",
          },
          {
            type: "qa",
            q: "How do you start a problem on the call?",
            a: "Restate, give an example, name brute force and complexity, then the pattern, then code, then a dry run on the example including an edge (empty, one element, all duplicates). I talk the whole time. Silent coding fails even with a correct answer at some firms.",
          },
          {
            type: "qa",
            q: "What if I get a DP problem I cannot finish?",
            a: "I still write the recurrence, the state, and a brute recursive skeleton, and I say what I would memoize. Partial credit is real. Blank screen is not.",
          },
        ],
      },
    ],
  },
  {
    slug: "sql",
    number: "38",
    title: "SQL the AI engineer still needs",
    subtitle: "Joins, GROUP BY, window functions, indexes — and LeetCode SQL 50 as the plan.",
    priority: "core",
    minutes: 14,
    group: "Interview core",
    summary:
      "RAG does not replace SQL. Invoices, users, audit logs, and eval sets live in tables. India MNC screens still ask joins and window functions. LeetCode SQL 50 is enough if you actually write them.",
    youWillLearn: [
      "Why AI teams still interview SQL",
      "Joins, GROUP BY, windows, and indexes at interview depth",
      "A finishable SQL 50 plan",
      "How SQL shows up next to RAG",
    ],
    sections: [
      {
        id: "what",
        title: "What they expect you to write",
        blocks: [
          {
            type: "p",
            text: "You should be able to sit at a shared editor and write SELECT with INNER/LEFT JOIN, GROUP BY/HAVING, a window function (ROW_NUMBER, RANK, SUM() OVER), and explain what an index can and cannot do. You do not need to be a DBA.",
          },
          {
            type: "table",
            headers: ["Topic", "Interview use", "Invoice example"],
            rows: [
              ["INNER vs LEFT JOIN", "Keep or drop unmatched rows", "Invoices left join vendors: missing vendor = data bug"],
              ["GROUP BY / HAVING", "Aggregates + filters on aggregates", "Vendors with sum(amount) > 5 lakh this month"],
              ["Window functions", "Top-n per group without collapsing rows", "Latest invoice per vendor; running total"],
              ["Indexes", "Why the query is slow", "Index (tenant_id, invoice_no) for duplicate checks"],
              ["NULL behavior", "Classic trap", "GSTIN = NULL is unknown; use IS NULL"],
            ],
          },
        ],
      },
      {
        id: "why",
        title: "Why AI engineers still get SQL",
        blocks: [
          {
            type: "p",
            text: "Your vector DB is not the system of record. Postgres (or Snowflake, or BigQuery) holds users, invoices, labels, and audit. Eval is a join between predictions and gold. Cost dashboards are GROUP BY model, day. If you cannot join, you cannot debug production, and the interviewer knows it.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Where it appears",
            text: "Online tests at services MNCs, take-homes, and “CS + SQL” rounds at GCCs. Sometimes a 20-minute live query on a laptop. LeetCode SQL 50 covers almost all of it.",
          },
        ],
      },
      {
        id: "how",
        title: "How to think, not memorize",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Picture the grain",
                text: "One row per invoice or one row per invoice-line? If you GROUP too early you lose line items.",
              },
              {
                title: "Join first, aggregate second",
                text: "Unless you pre-aggregate a side table to avoid fan-out. Mention fan-out if amounts double after a join — that is a senior-for-junior catch.",
              },
              {
                title: "Windows when you must keep rows",
                text: "ROW_NUMBER() OVER (PARTITION BY vendor_id ORDER BY invoice_date DESC) then filter rn = 1.",
              },
              {
                title: "Index for the WHERE/JOIN, not for fun",
                text: "B-tree on equality/range columns. An index will not save a leading-wildcard LIKE or a function wrapped column unless you planned for it.",
              },
            ],
          },
        ],
      },
      {
        id: "example",
        title: "Example: duplicate invoices and latest status",
        blocks: [
          {
            type: "code",
            lang: "sql",
            title: "Windows + join (speak this)",
            code: `-- latest verdict per invoice, with vendor name
WITH ranked AS (
  SELECT v.invoice_id, v.decision, v.created_at,
         ROW_NUMBER() OVER (
           PARTITION BY v.invoice_id
           ORDER BY v.created_at DESC
         ) AS rn
  FROM verdicts v
)
SELECT i.invoice_no, vn.name, r.decision, r.created_at
FROM invoices i
LEFT JOIN ranked r
  ON r.invoice_id = i.id AND r.rn = 1
LEFT JOIN vendors vn ON vn.id = i.vendor_id
WHERE i.tenant_id = :tenant;`,
          },
          {
            type: "p",
            text: "Say out loud: LEFT JOIN so invoices without a verdict still show; window so we do not collapse history in the base table; tenant filter for authz.",
          },
        ],
      },
      {
        id: "implementation",
        title: "LeetCode SQL 50 as the plan",
        blocks: [
          {
            type: "ol",
            items: [
              "Do the 50 in order. They are grouped: selects, joins, aggregates, windows.",
              "Type every query. Reading solutions is not SQL practice.",
              "After each, explain in one line what the join key and the grain are.",
              "Time a mixed 5-query set at the end of week two.",
              "Optional extra: EXPLAIN on your own Postgres for the invoice duplicate query — index vs seq scan.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Two weeks is enough",
            text: "SQL 50 is finishable. Do not start a data-engineering specialization. If a JD lists Spark, learn Spark after you have joins and windows cold.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "INNER JOIN vs LEFT JOIN?",
            a: "INNER keeps rows that match on both sides. LEFT keeps all left rows and NULLs on the right. I use LEFT when “no vendor match” is itself a finding — missing master data — not something I want to delete.",
          },
          {
            type: "qa",
            q: "What is a window function?",
            a: "A calculation across related rows that does not collapse them the way GROUP BY does. ROW_NUMBER to pick the latest invoice per vendor, SUM OVER to get a running total. I still filter in a CTE after numbering.",
          },
          {
            type: "qa",
            q: "When does an index not help?",
            a: "Low-selectivity columns, functions on the column, leading wildcards, or a query that needs most of the table anyway. Also: the wrong composite order — (created_at, tenant_id) when I always filter tenant first.",
          },
          {
            type: "qa",
            q: "Why would an AI team ask SQL?",
            a: "Because eval, billing, and invoices are tables. Retrieval quality work is a join between traces and labels. If I cannot write that join I cannot measure the RAG.",
          },
        ],
      },
    ],
  },
  {
    slug: "cs-core",
    number: "39",
    title: "CS core in interview length",
    subtitle: "OOP, OS, DBMS, networks, security basics — answers, not GATE notes.",
    priority: "core",
    minutes: 18,
    group: "Interview core",
    summary:
      "Junior India MNC rounds still ask process vs thread, indexes, HTTP vs TCP, and OOP. You need 45-second answers you could say on a call, not a semester of notes.",
    youWillLearn: [
      "Interview-length answers for OOP, OS, DBMS, networks",
      "How these topics connect to a FastAPI RAG service",
      "What to skip (GATE-depth proofs)",
      "A compact revision list",
    ],
    sections: [
      {
        id: "what",
        title: "What “CS core” means here",
        blocks: [
          {
            type: "p",
            text: "A 20-minute oral. They pick four topics. You answer in spoken paragraphs with one example each. If you start drawing paging algorithms for ten minutes, you lose the round even if you are correct.",
          },
          {
            type: "ul",
            items: [
              "OOP: encapsulation, inheritance, polymorphism, composition over inheritance, SOLID at slogan+example depth.",
              "OS: process vs thread, deadlock (four conditions + avoid), paging vs segmentation in one breath, CPU vs I/O wait.",
              "DBMS: keys, normalization to 3NF by example, ACID, isolation in one example (dirty read).",
              "Networks: HTTP methods and status, TCP vs UDP, DNS lookup chain, TLS in one sentence.",
              "Security basics: hashing vs encryption, JWT as a bearer token, least privilege, SQL injection as untrusted input.",
            ],
          },
        ],
      },
      {
        id: "why",
        title: "Why it is still on the loop",
        blocks: [
          {
            type: "p",
            text: "AI teams still run services. Your FastAPI workers are processes with threads. Your Postgres transaction is ACID. Your gateway speaks HTTP. Interviewers use CS core to see if you can own an on-call, not only a notebook.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Campus pattern",
            text: "TCS/Infosys/Wipro-style MCQs can be broader and shallower. Product MNC orals are narrower and deeper: “deadlock with an example,” “what happens when you type a URL.” Prepare spoken, then MCQ if your target is services.",
          },
        ],
      },
      {
        id: "how",
        title: "How to answer in 45 seconds",
        blocks: [
          {
            type: "p",
            text: "Definition in one sentence. Difference or mechanism in two. Example from your API. Stop.",
          },
          {
            type: "table",
            headers: ["Topic", "Spoken core"],
            rows: [
              [
                "Process vs thread",
                "A process is an OS-isolated program with its own memory. Threads share that memory and are cheaper to context-switch. FastAPI workers are processes; a request may block a thread on an LLM HTTP call — so I use async or more workers rather than one blocked thread.",
              ],
              [
                "Deadlock",
                "Two holders wait on each other’s lock. Needs mutual exclusion, hold-and-wait, no preemption, circular wait. Avoid by lock ordering or timeouts. In Python, don’t nest two mutexes in opposite orders.",
              ],
              [
                "Paging",
                "Physical memory in fixed frames, virtual memory in pages. The OS maps them; a page fault loads from disk. I do not need Belady’s anomaly unless they push.",
              ],
              [
                "Primary vs foreign key",
                "Primary uniquely identifies a row. Foreign points at a primary in another table. invoice.vendor_id references vendors.id. Unique + not null on (tenant_id, invoice_no) is a real-world composite unique key.",
              ],
              [
                "Normalization",
                "Remove repeating groups and partial/transitive dependencies so we don’t update GSTIN in five places. 3NF is enough. I denormalize on purpose for a read model if I say why.",
              ],
              [
                "ACID",
                "Atomic, consistent, isolated, durable. Money transfer: both rows commit or neither. Isolation: I can name read committed vs repeatable read if they ask.",
              ],
              [
                "TCP vs UDP",
                "TCP is reliable, ordered, connected — HTTP, Postgres. UDP is datagrams, no handshake — DNS queries, video. I would not run LLM HTTP over UDP.",
              ],
              [
                "DNS",
                "Stub resolver → recursive resolver → root → TLD → authoritative. Result cached. If the API hostname points at the wrong region, I just designed extra latency.",
              ],
              [
                "HTTP",
                "Application protocol on TCP (or QUIC). GET safe/idempotent, POST not idempotent unless I make it, PUT idempotent replace. 401 unauthenticated, 403 authenticated but forbidden, 429 rate limit, 502 bad gateway to the model.",
              ],
            ],
          },
        ],
      },
      {
        id: "example",
        title: "Example: “what happens when you call /query”",
        blocks: [
          {
            type: "ol",
            items: [
              "Client DNS-resolves api.company.in, TLS handshake, HTTP POST.",
              "Gateway checks JWT (authn), route policy (authz), rate limit.",
              "Worker process handles the request; async await on embed + LLM so the event loop is not stuck on CPU.",
              "Postgres transaction reads invoice row (indexes on tenant, id).",
              "Response 200 with JSON, or 504 if the model timeout fires.",
            ],
          },
          {
            type: "p",
            text: "That walk-through is CS core plus your project. It beats reciting the OSI model in order.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Revision that fits on one sheet",
        blocks: [
          {
            type: "ul",
            items: [
              "OOP: 4 pillars + composition example from your code (Retriever vs OpenAIRetriever).",
              "OS: process/thread, deadlock, paging, mutex vs semaphore in one line.",
              "DBMS: keys, 3NF example, ACID, index, INNER/LEFT (you already did SQL).",
              "Net: TCP/UDP, DNS, HTTP verbs, status codes, TLS “encrypts the HTTP.”",
              "Security: hash passwords (bcrypt), encrypt PII at rest if required, never log secrets, parameterized SQL.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "GATE notes",
            text: "Do not open a 200-page OS PDF the night before. They will not ask Banker’s algorithm unless you wander there. Stay at interview length.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Process vs thread, with your app as example.",
            a: "Each Uvicorn worker is a process with its own Python interpreter. Inside, async tasks share the process. If I call a blocking OpenAI client without async, I stall the event loop — all requests in that worker wait. So I use the async client or more processes. Threads share memory and can race; processes do not share Python objects.",
          },
          {
            type: "qa",
            q: "What is a deadlock? How do you avoid it?",
            a: "Two sides wait forever on each other’s resource. I avoid by lock ordering, timeouts, and not holding a DB transaction open while I call the LLM.",
          },
          {
            type: "qa",
            q: "TCP vs UDP?",
            a: "TCP gives a reliable byte stream — we use it for HTTP and the database. UDP is faster, unreliable, good for DNS and streaming media. My RAG API is TCP.",
          },
          {
            type: "qa",
            q: "401 vs 403 vs 404?",
            a: "401: I do not know who you are. 403: I know who you are and you may not do this. 404: the resource is not here — sometimes used instead of 403 so we don’t leak that another tenant’s invoice exists.",
          },
        ],
      },
    ],
  },
  {
    slug: "backend",
    number: "40",
    title: "Backend enough to defend a service",
    subtitle: "FastAPI, REST, PostgreSQL, Docker, Git — status codes, idempotency, env, .dockerignore.",
    priority: "core",
    minutes: 16,
    group: "Interview core",
    summary:
      "You do not need to be a platform engineer. You need to defend the service on your resume: routes, status codes, idempotency, secrets, Postgres, Docker, and Git hygiene.",
    youWillLearn: [
      "REST and status codes that interviewers actually poke",
      "Idempotency for retries and tools",
      "Env vars, .dockerignore, and what not to commit",
      "Docker + Git at the depth of a project round",
    ],
    sections: [
      {
        id: "what",
        title: "What “defend a service” means",
        blocks: [
          {
            type: "p",
            text: "Open your FastAPI app and explain every route: who can call it, what it returns on success and failure, whether retrying it is safe, where the secret lives, and how a stranger would run it with Docker. That is the backend bar for junior GenAI.",
          },
          {
            type: "table",
            headers: ["Piece", "You must be able to say"],
            rows: [
              ["FastAPI", "Path, query, body, Depends for auth, pydantic models, SSE/stream"],
              ["REST", "Resources, HTTP verbs, idempotent vs not, versioning if you have it"],
              ["PostgreSQL", "Why a table exists, one index, migrations if any"],
              ["Docker", "Image vs container, compose services, why a .dockerignore"],
              ["Git", "Commit small, .gitignore, no force-push to main, PR story even if solo"],
            ],
          },
        ],
      },
      {
        id: "why",
        title: "Why this sits next to RAG",
        blocks: [
          {
            type: "p",
            text: "The model is a dependency. The product is an HTTP service. HMs who cannot evaluate your LoRA rank can still evaluate whether you shipped a 500 on bad JSON and committed the Azure key.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Services vs product wording",
            text: "A services interview may say “create a REST API for this case study.” A GCC interview may open your Dockerfile. Same skills. Azure Container Apps vs EC2 is a mapping exercise, not a different career.",
          },
        ],
      },
      {
        id: "how",
        title: "How the pieces fit",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Status codes with intent",
                text: "200 OK with a body, 201 created, 202 accepted (ingest job), 400 validation, 401/403 auth, 404 missing, 409 conflict (duplicate invoice_no), 429 rate limit, 500 your bug, 502/504 model/gateway.",
              },
              {
                title: "Idempotency",
                text: "GET, PUT, DELETE (usually) can be retried. POST /pay is not safe unless you send an Idempotency-Key and store it. LLM complete is retried; “create ticket” is not, without a key.",
              },
              {
                title: "Env vars",
                text: "AZURE_OPENAI_KEY, DATABASE_URL, APP_ENV. Loaded from the environment. .env in .gitignore. .env.example committed with blanks.",
              },
              {
                title: ".dockerignore",
                text: "Exclude .git, .env, venv, data/, __pycache__, notebooks. Otherwise you copy secrets and a 2GB invoice dump into the image.",
              },
            ],
          },
        ],
      },
      {
        id: "example",
        title: "Example: POST /invoices is not GET /invoices",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "FastAPI sketch the interviewer may ask you to talk through",
            code: `@app.post("/invoices", status_code=202)
def enqueue_invoice(
    payload: InvoiceIn,
    user: User = Depends(get_user),
    idemp: str | None = Header(default=None, alias="Idempotency-Key"),
):
    if not idemp:
        raise HTTPException(400, "Idempotency-Key required")
    existing = db.get_idemp(user.tenant, idemp)
    if existing:
        return existing  # same 202 body, no second OCR job
    job = queue.submit(payload, tenant=user.tenant)
    db.put_idemp(user.tenant, idemp, job.id)
    return {"job_id": job.id}`,
          },
          {
            type: "p",
            text: "Speak: 202 because OCR is async; auth via Depends; tenant from the user, not the body; idempotency so a retried client does not double-charge the vision API.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Docker and Git that survive a clone",
        blocks: [
          {
            type: "code",
            lang: "docker",
            title: "Dockerfile + .dockerignore essentials",
            code: `# Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# .dockerignore
.git
.env
.venv
__pycache__
data
*.pdf
notebooks`,
          },
          {
            type: "ul",
            items: [
              "compose: api + postgres + (optional) chroma volume. Healthcheck on /health.",
              "Never COPY your local venv. Rebuild from requirements.txt.",
              "Git: meaningful commits (“add tenant filter on chroma query”), not “final2”. README says how to run.",
              "Pre-commit thought: don’t git add .env. If you already pushed a key, rotate it — deleting the commit is not enough if it was public.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Running as root with secrets in the image",
            text: "Interviewers will ask why .env is in the image history. Multi-stage builds and runtime env injection are the fix. For junior scope, “secrets at runtime, .dockerignore, non-root if I can” is enough.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Is POST idempotent?",
            a: "Not by HTTP spec. Retrying POST /invoices can create two jobs. I add an Idempotency-Key header and store it per tenant. PUT /invoices/{id} can be naturally idempotent if it replaces the same resource.",
          },
          {
            type: "qa",
            q: "Why .dockerignore?",
            a: "So the build context does not include .git, virtualenvs, local PDFs, or .env. Smaller image, faster build, fewer leaked secrets.",
          },
          {
            type: "qa",
            q: "Where do you put the OpenAI key?",
            a: "Environment or a secret manager. Never in source, Docker layers, or the system prompt. .env.example lists the names. I rotate if it ever leaked in a screenshot.",
          },
          {
            type: "qa",
            q: "Why FastAPI over Flask for this project?",
            a: "Pydantic validation, type hints, async, and OpenAPI for free. Flask can do it; FastAPI matches how I want to talk about schemas and streaming. I am not religious — I can read Flask.",
          },
        ],
      },
    ],
  },
  {
    slug: "resume",
    number: "41",
    title: "Resume, GitHub, and applying in India",
    subtitle: "One page, metrics, README, referrals — and what you must not lie about.",
    priority: "career",
    minutes: 14,
    group: "Interview core",
    summary:
      "A one-page resume with project bullets that have metrics, a GitHub README a hiring manager can scan in 90 seconds, a sane apply/referral process, and a hard line on honesty for India MNC hiring.",
    youWillLearn: [
      "The one-page layout that passes ATS and humans",
      "How to write project bullets with metrics",
      "What a README must contain",
      "Referrals, portals, and lies that end offers",
    ],
    sections: [
      {
        id: "what",
        title: "What the document is for",
        blocks: [
          {
            type: "p",
            text: "A junior resume in India is a filter, not a biography. One page. PDF. No photo, no “visionary,” no 12 MOOCs above the project. The top third must show: who you are, the stack, and one GenAI system with a number.",
          },
          {
            type: "table",
            headers: ["Section", "Rules"],
            rows: [
              ["Header", "Name, city + relocation note, phone, email, GitHub, LinkedIn. No photo."],
              ["One liner", "CS grad targeting GenAI / applied AI. Python, FastAPI, RAG, SQL, Docker."],
              ["Experience / internships", "Only real ones. Data entry stays data entry."],
              ["Projects (2, maybe 3)", "Problem, action, metric, link. The RAG project is first."],
              ["Skills", "Languages, backend, AI, cloud — only what you can defend."],
              ["Education", "Degree, institute, year, GPA if it helps. No 12th marks unless campus form asks."],
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "If it is not in the repo, it is not on the resume",
            text: "Every tool in the skills row must map to a file you can open on a call. Chroma, FastAPI, Docker, RAGAS, QLoRA — or delete the word.",
          },
        ],
      },
      {
        id: "why",
        title: "Why this format wins screens",
        blocks: [
          {
            type: "p",
            text: "Recruiters in Bengaluru/Hyderabad/NCR spend seconds. ATS searches for Python, FastAPI, Azure, RAG. Humans search for a number. Course lists and “implemented a chatbot using OpenAI API” without eval or Docker look like everyone else.",
          },
          {
            type: "callout",
            tone: "india",
            title: "MNC specifics",
            text: "Product MNCs and GCCs want PDF on the career site plus a referral. Services MNCs still live on Naukri. Campus: follow the TPO template if they force it, then keep a one-pager for off-campus. Location: write “Bengaluru / willing to relocate.” Notice period: campus 0–30 days; laterals 30–90. Do not put expected CTC on the resume.",
          },
        ],
      },
      {
        id: "how",
        title: "How to write a project bullet",
        blocks: [
          {
            type: "p",
            text: "Verb + system + mechanism + metric. Not “responsible for AI.”",
          },
          {
            type: "code",
            lang: "text",
            title: "Bullets you can copy the shape of",
            code: `Built an invoice-compliance RAG API (FastAPI, Chroma, Docker)
that retrieves GST/policy clauses and returns a JSON verdict
with citations. Faithfulness 0.61 → 0.84 on 200 labeled
public/synthetic invoices after hybrid retrieve + rerank.

Added QLoRA adapters on Mistral-7B (15k pairs, 80/10/10,
1×24GB GPU) to stabilize OCR-noisy JSON; test JSON-valid
91% → 98% with retrieval frozen.

If you do not have 0.84, write the number you have:
“Eval set of 50 invoices; citation precision 0.7; p95 1.8s
on a 4o-mini path.” Empty metrics → empty bullets.`,
          },
        ],
      },
      {
        id: "example",
        title: "Example: README an HM actually reads",
        blocks: [
          {
            type: "ol",
            items: [
              "Title + one paragraph problem.",
              "ASCII or PNG architecture.",
              "How to run: cp .env.example .env && docker compose up.",
              "Eval table (before/after).",
              "A failure case (screenshot or log): empty retrieval, hostile PDF.",
              "Limitations and what is not production.",
              "License and data source (public/synthetic — not “confidential bank dump”).",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Pinned repo is a Colab notebook named untitled",
            text: "The HM opens GitHub on their phone. If the first repo is 40 unrelated notebooks, they close it. Pin the two projects from the resume. Delete API keys from history or rotate them.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Applying without wasting a quarter",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Target list",
                text: "15 companies in your band (GCC / product / services). Customize the first 8 lines of the resume to their stack (Azure vs AWS).",
              },
              {
                title: "Two channels",
                text: "Career site application + one referral message. Referral text: 5 lines, repo link, one metric, why that team. Do not spam alumni with a 400-word autobiography.",
              },
              {
                title: "Track",
                text: "Spreadsheet: company, role, date, portal, referral, round, notes. Follow up once at day 7.",
              },
              {
                title: "What not to lie about",
                text: "Company names, titles, internships you did not do, production user counts, “fine-tuned GPT-4,” GATE rank, GPA, notice period, current CTC. Background verification in Indian MNCs is real. An offer pulled for a fake internship is worse than no offer.",
              },
            ],
          },
          {
            type: "ul",
            items: [
              "Do not buy fake internships or “experience letters.”",
              "Do not put tools you cannot open in an IDE on a call.",
              "Do not hide a gap; write “self-directed GenAI project, dates.”",
              "Do not put a photograph, caste, religion, or marital status. It is not required and it invites bias.",
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
            q: "Walk me through your resume.",
            a: "90 seconds: education, one internship if real, then the invoice RAG with one metric, then the QLoRA or backend piece, then stop. Invite them into the repo. Do not read every skill chip.",
          },
          {
            type: "qa",
            q: "This metric — where is it in the repo?",
            a: "I open eval/results.md or the table in the README and say how the set was labeled. If I cannot, the metric should never have been on the resume.",
          },
          {
            type: "qa",
            q: "Are you open to a services location / night shift / bench?",
            a: "Be honest. If you will not sit a US night shift, say so early. If you want a GCC, say you are targeting product engineering, not a generic bench. Do not accept a story you will resent in 30 days and then ghost — that becomes a reference problem.",
          },
          {
            type: "qa",
            q: "What if my only project is a course capstone?",
            a: "Then it is a course capstone. I still Dockerize it, add eval, and write a README. I never relabel it as industry production. Depth plus honesty beats a fake company line.",
          },
        ],
      },
    ],
  },
];
