import type { Chapter } from "../types";

export const agentChapters: Chapter[] = [
  {
    slug: "agents",
    number: "19",
    title: "Agents and the ReAct loop",
    subtitle: "Think, act, observe — and know when a single retrieve-and-answer is enough.",
    priority: "critical",
    minutes: 16,
    group: "Agents & prompts",
    summary:
      "An agent is an LLM in a loop with tools. ReAct is the pattern. Most junior systems should not be agents.",
    youWillLearn: [
      "What ReAct actually is: Thought → Action → Observation",
      "What a tool is, and who executes it (your app, not the model)",
      "When an agent is the wrong architecture",
      "How to defend an agent design in an interview",
    ],
    sections: [
      {
        id: "what",
        title: "What an agent is",
        blocks: [
          {
            type: "p",
            text: "An agent is not a smarter chatbot. It is an LLM that is allowed to take multiple steps: it reasons about the user request, chooses a tool, your application runs that tool, the result is fed back, and the model decides whether to call another tool or stop. The common name for this loop is ReAct — Reason + Act.",
          },
          {
            type: "p",
            text: "A single LLM call with retrieved context is not an agent. A classifier is not an agent. A prompt that says “you are an agent” is not an agent. If there is no loop and no tool execution, it is just generation.",
          },
          {
            type: "callout",
            tone: "rule",
            title: "One-sentence definition",
            text: "An agent is a model plus a control loop plus tools that your code executes. The model proposes actions. The runtime does the work.",
          },
        ],
      },
      {
        id: "why",
        title: "Why interviewers care",
        blocks: [
          {
            type: "p",
            text: "Every India MNC JD now says “agentic AI.” Interviewers use this topic to see whether you copied a LangChain demo or whether you understand cost, latency, and failure. Agents are slower, more expensive, and harder to debug than a retrieve-then-answer pipeline. If you cannot say when you would not use one, you do not understand them.",
          },
          {
            type: "ul",
            items: [
              "A hiring manager will ask: “Why is this an agent and not RAG?”",
              "A staff engineer will ask: “What happens when the tool fails twice?”",
              "A product round will ask: “What is the p95 latency if it can loop 8 times?”",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "The resume trap in campus hiring",
            text: "“Built an AI agent with LangChain” on a resume usually means a ConversationBufferMemory chatbot. Interviewers in Bengaluru and Hyderabad have seen this 200 times. If your system retrieves four chunks and answers, call it RAG. You will sound more senior, not less.",
          },
        ],
      },
      {
        id: "how",
        title: "How ReAct works",
        blocks: [
          {
            type: "p",
            text: "ReAct is a protocol, not a library. Each turn the model emits a thought (optional but useful for traces), then either an action (tool name + arguments) or a final answer. Your runtime parses the action, runs the function, and appends the observation. Repeat until the model stops or you hit a step limit.",
          },
          {
            type: "diagram",
            title: "The ReAct loop",
            lines: [
              "User question",
              "        |",
              "        v",
              "  [ LLM : Thought ]",
              "        |",
              "        +--> Action: tool_name(args)  -->  YOUR code runs the tool",
              "        |                                      |",
              "        |                               Observation (JSON / text)",
              "        |                                      |",
              "        <--------------------------------------+",
              "        |",
              "        +--> Final answer  -->  stop",
              "",
              "Hard stops: max_steps, timeout, spend cap, policy deny",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "Bound the loop",
                text: "Set max_steps (often 4–8), a wall-clock timeout, and a token/cost budget. Infinite loops are a production incident, not a cute demo.",
              },
              {
                title: "Parse, then execute",
                text: "Never eval the model’s text. Parse a structured tool call, validate arguments against a schema, then call a allow-listed function.",
              },
              {
                title: "Feed observations back as data",
                text: "Tool output goes into the conversation as a tool-result message. Do not ask the model to “remember” it magically.",
              },
              {
                title: "Stop conditions",
                text: "The model emits a final answer, or you force a stop and return a safe fallback: “I could not complete this with the tools I have.”",
              },
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "When NOT to use an agent",
            text: "If the job is one retrieve plus one answer — policy Q&A, FAQ, “summarise this PDF,” extract fields, classify a ticket — do not wrap it in ReAct. An agent adds extra model calls, extra failure modes (wrong tool, loop, hallucinated args), and extra latency. Use RAG or a single structured-output call. Reach for an agent only when the task needs unknown-in-advance actions: search then calculate then write, or branch on tool results.",
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "p",
            text: "User: “How many leave days does the Pune office policy give, and what is 15% of that number for a mid-year joiner?” This is a legitimate agent: you must retrieve a policy clause, then do arithmetic you should not trust the model with.",
          },
          {
            type: "code",
            lang: "text",
            title: "Trace (what you show in an interview)",
            code: `Thought: I need the Pune leave entitlement from policy, then 15% of it.
Action: retrieve(query="Pune office annual leave entitlement")
Observation: "Pune full-time: 21 earned leave days per calendar year."
Thought: 15% of 21 is a calculation. Use the calculator, do not guess.
Action: calculator(expression="0.15 * 21")
Observation: 3.15
Final: Pune policy is 21 earned leave days. 15% of that is 3.15 days.
       Mid-year pro-rata is a separate policy clause I did not retrieve.`,
          },
          {
            type: "p",
            text: "Same product, different question: “How many leave days does the Pune office policy give?” That is one retrieve + answer. No loop. Do not start an agent.",
          },
          {
            type: "table",
            headers: ["Question", "Architecture", "Why"],
            rows: [
              [
                "What is the notice period?",
                "RAG, one shot",
                "One fact, one corpus. Extra tools add cost.",
              ],
              [
                "Compare leave in Pune vs Hyderabad and email my manager",
                "Agent",
                "Two retrievals, a compare, then a send_email tool with HITL.",
              ],
              [
                "Extract vendor GSTIN from this invoice",
                "Structured output",
                "No tools, no loop. JSON schema is enough.",
              ],
            ],
          },
        ],
      },
      {
        id: "implementation",
        title: "How you build it",
        blocks: [
          {
            type: "p",
            text: "In production you do not “let LangChain run.” You own the loop. Below is a teaching-size ReAct runtime. Replace the fake tools with real ones and add tracing.",
          },
          {
            type: "code",
            lang: "python",
            title: "A tiny ReAct loop you can explain on a whiteboard",
            code: `import json

TOOLS = {
    "retrieve": lambda q: policy_search(q["query"]),
    "calculator": lambda q: str(eval_math(q["expression"])),  # sandbox this
}

SYSTEM = """You are a ReAct agent.
Reply with JSON: {"thought": "...", "action": "name"|"final",
"args": {...}, "answer": "..."}.
Allowed tools: retrieve, calculator. Stop with action=final."""

def run_agent(user: str, llm, max_steps: int = 6) -> str:
    messages = [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": user},
    ]
    for step in range(max_steps):
        raw = llm(messages)
        msg = json.loads(raw)
        if msg.get("action") == "final":
            return msg["answer"]
        name, args = msg["action"], msg.get("args") or {}
        if name not in TOOLS:
            obs = f"error: unknown tool {name}"
        else:
            obs = TOOLS[name](args)
        messages.append({"role": "assistant", "content": raw})
        messages.append({"role": "user", "content": f"Observation: {obs}"})
    return "I hit the step limit. Please retry with a narrower question."`,
          },
          {
            type: "ul",
            items: [
              "Log every thought, tool name, args, observation, and token spend. You will debug from this file, not from vibes.",
              "Allow-list tools. A model that can call `run_sql` or `shell` without a policy layer is a security incident.",
              "Idempotency and retries: network tools fail. Retry with backoff. Do not retry a send_email without a dedupe key.",
              "Human-in-the-loop for irreversible actions: payments, emails, deletions, production writes.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "What to put on GitHub",
            text: "A 2-tool agent with traces, a step cap, and a README that shows a failing tool run is a stronger project than a 12-tool auto-GPT clone that sometimes works.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What is an agent? How is it different from a chatbot?",
            a: "A chatbot is usually one or more LLM turns of conversation. An agent is an LLM inside a control loop that can call tools, observe results, and decide the next action until it can answer or hit a stop condition. The model proposes; the application executes.",
            why: "They want to hear tools + loop + your runtime, not “it can think.”",
          },
          {
            type: "qa",
            q: "When would you not use an agent?",
            a: "When the task is a single retrieve-and-answer, classification, extraction, or a fixed pipeline you can write as code. Agents cost extra calls and fail in extra ways. I use an agent only when the next action depends on previous tool output and cannot be hardcoded as a chain.",
            why: "This is the filter question. Junior candidates always say “I would use an agent.”",
          },
          {
            type: "qa",
            q: "How do you stop an agent from looping forever?",
            a: "Hard caps: max_steps, timeout, max tokens / rupees per request. Detect repeated identical tool calls and abort. On abort, return a safe fallback and log the trace. Do not wait for the model to “realise it should stop.”",
          },
        ],
      },
    ],
  },
  {
    slug: "tool-calling",
    number: "20",
    title: "Tool calling",
    subtitle: "The model emits JSON. Your app runs the function. Nothing is magic.",
    priority: "critical",
    minutes: 15,
    group: "Agents & prompts",
    summary:
      "Function calling is structured output plus an executor you write: schema, validation, retries, and a result message back to the model.",
    youWillLearn: [
      "The actual wire format: tool name + JSON arguments",
      "Why schemas, validation, and retries exist",
      "That the LLM never “runs” a Python function by itself",
      "How to talk about failures in an interview",
    ],
    sections: [
      {
        id: "what",
        title: "What tool calling is",
        blocks: [
          {
            type: "p",
            text: "Tool calling (also called function calling) is a contract. You tell the model the names, descriptions, and JSON schemas of functions it may request. The model does not execute them. It emits a structured object: which tool, which arguments. Your application validates that object, runs the real function, and sends the result back as a tool message so the model can continue.",
          },
          {
            type: "callout",
            tone: "rule",
            title: "Say this out loud",
            text: "The LLM does not magically run functions. If your server never executes the call, the user gets a JSON blob, not weather, not SQL, not an email.",
          },
          {
            type: "p",
            text: "This is the same idea as ReAct, with a cleaner wire format than free-text “Action: Search[query]”. Most hosted APIs (OpenAI, Azure OpenAI, Gemini, Anthropic, Groq) now expose tools as first-class message types instead of asking the model to role-play a format.",
          },
        ],
      },
      {
        id: "why",
        title: "Why it exists",
        blocks: [
          {
            type: "p",
            text: "Models are bad at live facts, arithmetic, and side effects. Tools are how you give them APIs, databases, search, and calculators without stuffing the whole world into the prompt. Interviewers also use this topic to test whether you treat the model as an untrusted client: it can emit anything, including invalid JSON and prompt-injected arguments.",
          },
          {
            type: "ul",
            items: [
              "Grounding: fetch the current ticket status instead of guessing.",
              "Precision: run SQL or a calculator instead of mental math.",
              "Actions: create a Jira ticket — but only after validation and, often, a human confirm.",
              "Control: the schema is a firewall. Extra keys and missing required fields should fail closed.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "“I passed the Python function into ChatGPT”",
            text: "You passed a JSON schema derived from that function. The hosted model never imported your module. Campus demos hide this behind one SDK call. Draw the boundary in the interview: model → JSON → your executor → observation.",
          },
        ],
      },
      {
        id: "how",
        title: "How it works",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Register tools",
                text: "Each tool has a name, a human description (this is what the model reads), and a JSON Schema for arguments: types, required fields, enums.",
              },
              {
                title: "Model emits a tool call",
                text: "Instead of a user-visible answer, the response contains something like tool_calls: [{name, arguments}]. Arguments are a JSON string or object.",
              },
              {
                title: "Validate",
                text: "Parse JSON. Check required keys, types, ranges, allow-lists. Reject unknown tools. This is where Pydantic / jsonschema earn their keep.",
              },
              {
                title: "Execute in your process",
                text: "Call the real function with the validated args. Time it, catch errors, never run raw model text as code or SQL.",
              },
              {
                title: "Return a tool result, maybe retry",
                text: "Append a tool-role message. If JSON was invalid or the schema missed, send a short error and let the model retry once or twice. Then give up.",
              },
            ],
          },
          {
            type: "diagram",
            title: "Who does what",
            lines: [
              "App                         Model                      World",
              " |  tools: [schema...]   -->  |",
              " |  + user message            |",
              " |                            | emits tool_call JSON",
              " |  parse + validate     <--  |",
              " |  execute allow-listed fn ------------------>  API / DB",
              " |  tool result message  -->  |",
              " |                            | may call again, or answer",
              " |  final text           <--  |",
            ],
          },
          {
            type: "table",
            headers: ["Failure", "What you do"],
            rows: [
              [
                "Invalid JSON / truncated args",
                "Retry with “arguments must be valid JSON matching the schema.” Cap retries at 2.",
              ],
              [
                "Schema mismatch (missing city)",
                "Return a structured error listing missing fields. Do not guess a city.",
              ],
              [
                "Tool threw (timeout, 404)",
                "Send the error string. Model may try another tool. You may short-circuit to fallback.",
              ],
              [
                "Model invents a tool name",
                "Reject. Tell it the allow-list. Do not dynamically import whatever it named.",
              ],
            ],
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "p",
            text: "A leave-balance copilot. The model is not allowed to invent numbers from memory. It must call get_leave_balance.",
          },
          {
            type: "code",
            lang: "python",
            title: "Schema + executor (the part that actually runs)",
            code: `from pydantic import BaseModel, Field, ValidationError
import json

class LeaveArgs(BaseModel):
    employee_id: str = Field(min_length=3, max_length=16)
    year: int = Field(ge=2020, le=2100)

TOOLS = {
    "get_leave_balance": {
        "description": "Fetch earned-leave balance from HR API.",
        "schema": LeaveArgs,
        "fn": lambda a: hr_api.balance(a.employee_id, a.year),
    }
}

def handle_tool_call(name: str, raw_args: str) -> str:
    spec = TOOLS.get(name)
    if spec is None:
        return json.dumps({"error": "unknown_tool", "allowed": list(TOOLS)})
    try:
        args = spec["schema"].model_validate_json(raw_args)
    except ValidationError as e:
        return json.dumps({"error": "invalid_args", "detail": e.errors()})
    try:
        return json.dumps({"ok": True, "data": spec["fn"](args)})
    except Exception as e:
        return json.dumps({"error": "tool_failed", "detail": str(e)})`,
          },
          {
            type: "p",
            text: "The model might emit get_leave_balance with {\"employee_id\": \"E1042\", \"year\": 2026}. Your app hits the HR API. The next model turn sees {\"ok\": true, \"data\": {\"days\": 12}} and writes a sentence for the user. If the model emitted year: \"next\", validation fails and you retry — you do not coerce it silently into 2027.",
          },
        ],
      },
      {
        id: "implementation",
        title: "How you build it",
        blocks: [
          {
            type: "ol",
            items: [
              "Write the function first, with types. Generate the JSON schema from Pydantic, not by hand, so they cannot drift.",
              "Keep descriptions specific: “HR leave balance for one employee and calendar year” beats “gets data.”",
              "Parallel tool calls: some APIs allow several in one turn. Execute independently only if there are no side-effect races.",
              "Idempotency keys on writes. Models retry. Double-charging is on you.",
              "Never bind a generic run_code or execute_sql tool in a junior project you will demo. Bind get_order(id) and list_orders(status).",
              "Trace tool name, latency, and argument hashes. Redact PII before logs leave the box.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "Azure OpenAI in GCC interviews",
            text: "Microsoft, Accenture, and TCS interviews often say “function calling on Azure OpenAI.” The idea is identical to the public OpenAI tools array. Talk schema + executor + retries. Do not freeze on the SDK class name.",
          },
          {
            type: "callout",
            tone: "note",
            title: "Tool descriptions are prompts",
            text: "A vague description produces vague calls. Include when to use the tool, when not to, and units. This is cheaper than adding another model.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Does the LLM execute the function?",
            a: "No. The model emits a structured tool call. My application validates arguments against a schema and runs an allow-listed function. Then I send the result back as a tool message. If I never execute it, nothing in the real world happens.",
            why: "This is the whole chapter. Miss this and the rest of the agent round collapses.",
          },
          {
            type: "qa",
            q: "What do you do when the model returns invalid JSON arguments?",
            a: "I do not execute. I return a compact validation error, allow 1–2 retries, then fail the turn with a user-safe message and a log. I also tighten the schema and the tool description if the same field keeps breaking.",
          },
          {
            type: "qa",
            q: "How is tool calling different from asking the model to output a JSON plan in the prompt?",
            a: "Same idea, better contract. Native tool calling has a dedicated message type, schema enforcement on many providers, and the model is trained to fill it. A prompt-only JSON plan still needs the same executor and validation — you just fight more format drift.",
          },
        ],
      },
    ],
  },
  {
    slug: "agent-vs-rag",
    number: "21",
    title: "Agents vs RAG",
    subtitle: "RAG chooses what to read. An agent chooses what to do. Combined, that is agentic RAG.",
    priority: "critical",
    minutes: 14,
    group: "Agents & prompts",
    summary:
      "Do not mash the two words together. Retrieval is a tool. Agency is control flow. Most products need RAG; some need an agent that can retrieve more than once.",
    youWillLearn: [
      "The one-line distinction interviewers want",
      "When RAG alone is the product",
      "What “agentic RAG” actually means",
      "A default architecture you can draw",
    ],
    sections: [
      {
        id: "what",
        title: "What the difference is",
        blocks: [
          {
            type: "p",
            text: "RAG (retrieval-augmented generation) answers “what text should I put in the prompt?” An agent answers “what action should I take next?” RAG is a data path. An agent is a control loop. They compose: retrieval can be one of the agent’s tools. That composition is agentic RAG — not a third magic product.",
          },
          {
            type: "table",
            headers: ["", "RAG", "Agent", "Agentic RAG"],
            rows: [
              [
                "Question it answers",
                "What to retrieve",
                "What action to take",
                "When to retrieve, rewrite, or try another source",
              ],
              [
                "Typical loop",
                "Query → retrieve → generate (once)",
                "Think → tool → observe → repeat",
                "Think → retrieve (maybe again) → other tools → answer",
              ],
              [
                "State",
                "Retrieved chunks",
                "Tool traces + working memory",
                "Both",
              ],
              [
                "Default for",
                "Doc Q&A, policy, manuals",
                "Multi-step work with APIs",
                "Hard questions over many corpora, or retrieve-then-act",
              ],
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "Keep the nouns clean",
            text: "RAG = what to retrieve. Agent = what action to take. If you say “I built an agentic RAG” you must be able to point at the extra decisions: query rewrite, extra retrieval hops, or a non-retrieve tool.",
          },
        ],
      },
      {
        id: "why",
        title: "Why the mix-up hurts you",
        blocks: [
          {
            type: "p",
            text: "Candidates say “agent” when they mean “chatbot on PDFs,” and “RAG” when they mean “LangChain agent with a retriever tool.” Interviewers then cannot tell what you built. Worse, you pick the wrong default: an agent on a leave-policy FAQ burns 5× the tokens and still answers worse than a well-chunked RAG.",
          },
          {
            type: "ul",
            items: [
              "Latency: RAG is typically 1 embed + 1 search + 1 generate. An agent is N generates + N tool round-trips.",
              "Eval: RAG has retrieval metrics (recall@k, MRR) and grounded-generation metrics. Agents need task success and trace quality.",
              "Failure: RAG fails by retrieving the wrong passage. Agents fail by retrieving the wrong passage and then emailing it to finance.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "“Everything is agentic RAG now”",
            text: "Vendors rebranded retrievers as agents. If your graph is retrieve → generate with no branch, it is RAG. Saying “agentic” without a decision point is a tell.",
          },
        ],
      },
      {
        id: "how",
        title: "How they combine",
        blocks: [
          {
            type: "p",
            text: "Start with vanilla RAG. Add agency only at a decision you can name.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Vanilla RAG",
                text: "Embed query, top-k chunks, generate with citations. No tools other than search. This is the correct 80% of internal Q&A.",
              },
              {
                title: "RAG with routing",
                text: "A classifier or small LLM pick: HR corpus vs IT corpus vs abstain. Still not an agent — it is a fixed graph with a branch.",
              },
              {
                title: "Agentic RAG",
                text: "The model can rewrite the query, retrieve again, switch corpora, or call a calculator / ticket API based on what came back. Retrieval is a tool, not a preamble.",
              },
              {
                title: "Agent that happens to retrieve",
                text: "The user’s goal is an action (refund, book, file). Retrieval is optional context. Do not call this a RAG product.",
              },
            ],
          },
          {
            type: "diagram",
            title: "Agentic RAG, one hop at a time",
            lines: [
              "User: 'Why was invoice INV-88 rejected and how do I fix it?'",
              "  1. retrieve(policy: invoice rejection codes)",
              "  2. retrieve(ticket or ERP: INV-88 status)     <-- second hop",
              "  3. calculator / format checker on the GSTIN",
              "  4. final answer with citations + a fix checklist",
              "",
              "If step 2 is not a tool the model chose, this is just a chain.",
            ],
          },
          {
            type: "widget",
            widget: "rag-flow",
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "p",
            text: "Campus placement portal copilot, three questions, three designs.",
          },
          {
            type: "table",
            headers: ["User ask", "Design", "Not this"],
            rows: [
              [
                "What is the CGPA cutoff for Company X?",
                "RAG over this year’s brochure",
                "Agent with 8 tools",
              ],
              [
                "Cutoff for Company X, and am I eligible given my 7.6 CGPA?",
                "RAG + a tiny eligibility function (tool or code)",
                "Asking the LLM to do inequality in its head",
              ],
              [
                "Find companies I am eligible for and draft a mail to the TPO",
                "Agent: retrieve rules, filter (code), draft, HITL send",
                "One-shot RAG that pretends to have sent mail",
              ],
            ],
          },
          {
            type: "p",
            text: "Notice the middle row: that is still mostly RAG. A deterministic function on retrieved numbers is cheaper and more correct than ReAct.",
          },
        ],
      },
      {
        id: "implementation",
        title: "How you build it",
        blocks: [
          {
            type: "ol",
            items: [
              "Ship vanilla RAG first. Measure retrieval recall and groundedness. If recall is low, fix chunking and queries — do not add an agent.",
              "Promote retrieval to a tool only when you need a second hop, a rewrite, or a choice among sources.",
              "Keep non-retrieve tools out of the RAG path until a product requirement names them.",
              "For agentic RAG, log which hop retrieved what. Interviewers will ask “show me a two-hop trace.”",
              "Evaluate both layers: did we retrieve the right clause, and did the agent stop at the right time?",
            ],
          },
          {
            type: "code",
            lang: "python",
            title: "Retrieval as a tool, not a hidden preamble",
            code: `def retrieve(query: str, corpus: str = "policy", k: int = 4) -> str:
    """Search one named corpus. The agent picks corpus and query."""
    hits = vector_store.search(corpus, query, k=k)
    return format_with_citations(hits)

# Agent tool list: retrieve, calculator. No send_email.
# Vanilla RAG path (no agent):
#   hits = retrieve(user_query, "policy")
#   answer = llm(system_with(hits), user_query)`,
          },
          {
            type: "callout",
            tone: "india",
            title: "What to write on the resume",
            text: "“Policy RAG with hybrid search and rerank, faithfulness 0.84” is hireable. “Agentic RAG using 12 LangChain tools” without a metric is not. If you did two-hop retrieval, say two-hop and show a trace screenshot.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "RAG vs agent — one sentence each.",
            a: "RAG decides what to retrieve and stuffs it into the prompt for one generation. An agent decides what action to take next in a loop, and retrieval may be one of those actions. Agentic RAG is RAG where retrieval is a tool the model can call more than once.",
            why: "If you cannot say this cleanly, they assume the project is a tutorial clone.",
          },
          {
            type: "qa",
            q: "Your PDF chatbot — why isn’t that an agent?",
            a: "Because the control flow is fixed: embed, search, generate. There is no choice of action and no second hop. Calling it an agent would be inflating the design. I would only add an agent if the user needed multi-source hops or a side-effecting tool.",
          },
          {
            type: "qa",
            q: "When does vanilla RAG become agentic RAG?",
            a: "When a single query embedding is not enough: the first hits show you need a rewritten query, a different corpus, or a follow-up tool (calculator, ticket fetch). The model then chooses those steps. If I hardcode retrieve-twice, that is a chain, not an agent.",
          },
        ],
      },
    ],
  },
  {
    slug: "langgraph",
    number: "22",
    title: "LangGraph",
    subtitle: "State, nodes, edges, loops, persistence, humans. Do not memorize the API.",
    priority: "high",
    minutes: 15,
    group: "Agents & prompts",
    summary:
      "LangGraph is a stateful graph runtime for LLM workflows. You should be able to draw the graph and explain checkpoints — not recite class names.",
    youWillLearn: [
      "State, nodes, edges, and conditional routing",
      "Why graphs beat linear chains for loops",
      "Checkpointers and human-in-the-loop",
      "How to discuss LangGraph without API trivia",
    ],
    sections: [
      {
        id: "what",
        title: "What LangGraph is",
        blocks: [
          {
            type: "p",
            text: "LangGraph is a library for running workflows as a graph: a shared state object, nodes that are functions, and edges that decide where to go next. It exists because a linear chain cannot retry, loop, branch on a tool result, or pause for a human without turning into spaghetti. It is not “the chatbot framework,” and it is not something you must use to build an agent.",
          },
          {
            type: "ul",
            items: [
              "State — a typed dict (messages, retrieved docs, flags) that nodes read and patch.",
              "Nodes — Python functions: take state, do work (LLM call, tool, retrieve), return a partial update.",
              "Edges — static (always A→B) or conditional (router function returns the next node name).",
              "Cycles — legal. Agent node → tool node → agent node is the ReAct loop as a graph.",
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "Interview rule",
            text: "Do not memorize APIs. StateGraph, add_node, add_conditional_edges will change. If you can draw state, nodes, a loop, a stop condition, and a checkpoint, you pass. If you recite method names and cannot draw it, you fail.",
          },
        ],
      },
      {
        id: "why",
        title: "Why graphs",
        blocks: [
          {
            type: "p",
            text: "LCEL chains are DAGs with a happy path. Real agents need cycles (retry retrieval), branches (escalate to a human), and memory that survives a process restart (the user clicked Approve five minutes later). Graphs plus a checkpointer give you that without hiding control flow inside an LLM’s prose.",
          },
          {
            type: "table",
            headers: ["Need", "Chain", "Graph"],
            rows: [
              ["Retrieve then answer", "Fine", "Unnecessary"],
              ["Retry search with a rewritten query", "Awkward", "Natural loop"],
              ["Pause for manager approval", "DIY", "Interrupt + resume"],
              ["Crash mid-tool and continue", "Lost", "Checkpointer"],
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "LangGraph on the resume with no graph",
            text: "If your code is still llm | parser | retriever in a line, you used LangChain, not LangGraph. Do not list it. Interviewers in product MNCs will ask you to whiteboard the nodes. Empty stares end the round.",
          },
        ],
      },
      {
        id: "how",
        title: "How the pieces fit",
        blocks: [
          {
            type: "diagram",
            title: "A support graph you can redraw from memory",
            lines: [
              "                    [ START ]",
              "                        |",
              "                        v",
              "                   ( classify )",
              "                    /        \\",
              "                   v          v",
              "            ( retrieve )   ( escalate ) --> END",
              "                   |",
              "                   v",
              "               ( generate )",
              "                /        \\",
              "               v          v",
              "        grounded?      ( rewrite_query )",
              "         yes|                 |",
              "            v                 +----> back to retrieve (loop)",
              "     ( maybe HITL on send )",
              "            |",
              "           END",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "Define state",
                text: "Messages, query, docs, retry_count, approved: bool. Reducers say how lists merge (append vs replace).",
              },
              {
                title: "Write nodes as pure-ish functions",
                text: "Each node returns only the keys it changes. Keep LLM calls inside nodes, not in the router.",
              },
              {
                title: "Conditional routing",
                text: "A small function inspects state: if retry_count > 2 → end; if needs_human → interrupt; else → tools.",
              },
              {
                title: "Persistence",
                text: "A checkpointer snapshots state after nodes. Resume with a thread_id. This is how you survive restarts and HITL.",
              },
              {
                title: "Human-in-the-loop",
                text: "Interrupt before a side-effect node. UI shows the pending tool args. Resume with approval or an edit.",
              },
            ],
          },
          {
            type: "p",
            text: "Loops need a bound, same as ReAct: retry_count in state, max iterations in the runtime. Graphs make the bound visible — that is the point.",
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "p",
            text: "Invoice-exception copilot. State holds the invoice id, retrieved policy, ERP payload, and an approval flag. Nodes: fetch_invoice, retrieve_policy, propose_fix, wait_for_finance, apply_in_erp. The edge after propose_fix is conditional: low-risk auto-apply, high-risk interrupt.",
          },
          {
            type: "code",
            lang: "python",
            title: "Conceptual graph — ideas, not an API to memorise",
            code: `state = {
    "invoice_id": str,
    "docs": list,          # reducer: replace
    "messages": list,      # reducer: append
    "risk": str,           # "low" | "high"
    "approved": bool,
    "retries": int,
}

# nodes: fetch, retrieve, propose, apply  (each: state -> partial state)
# edges:
#   START -> fetch -> retrieve -> propose -> route
#   route(risk=="low") -> apply -> END
#   route(risk=="high") -> HITL interrupt -> (approved ? apply : END)
#   route(docs empty and retries < 2) -> retrieve   # loop
# persistence: thread_id = invoice_id, snapshot after each node`,
          },
          {
            type: "p",
            text: "If finance rejects, you resume the same thread with approved=false and skip apply. That resume story is what LangGraph is for — not for a FAQ bot.",
          },
        ],
      },
      {
        id: "implementation",
        title: "How you build it",
        blocks: [
          {
            type: "ol",
            items: [
              "Draw the graph on paper before you import anything. If it is a straight line, you do not need a graph library.",
              "Put retry counters and approval flags in state so routers stay dumb and testable without an LLM.",
              "Use a checkpointer (even in-memory for the demo, sqlite/postgres in prod) and demo a resume.",
              "HITL on every write. Show a pending tool payload in the README.",
              "Unit-test routers with fake state. You can test graphs without calling GPT.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Alternatives",
            text: "You can build the same thing with a while-loop and a dict (see the ReAct chapter). LangGraph is useful when you want checkpoints, visualisation, and HITL plumbing. Saying “I used a graph because Twitter said so” is a weak answer. Saying “I needed to pause for approval and resume tomorrow” is a strong one.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Service-company interviews",
            text: "Accenture / TCS / Infosys case studies often expect the word LangGraph. Give them the word, then immediately draw state and a loop bound. You will stand out from people who only list the package.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What problem does LangGraph solve that a chain does not?",
            a: "Cycles, conditional routing, persistent state, and human-in-the-loop resume. A chain is a straight pipeline. A graph is a control plane: nodes update state, edges decide the next node, a checkpointer lets you pause and continue later.",
            why: "They want the systems reason, not “it’s the new LangChain.”",
          },
          {
            type: "qa",
            q: "Explain state, nodes, and edges without code.",
            a: "State is the shared notebook. A node is a worker that reads the notebook and writes a few fields. An edge is the rule for who works next — always the same next worker, or a router that looks at state (including “go back” for a loop).",
          },
          {
            type: "qa",
            q: "How would you implement human-in-the-loop?",
            a: "Interrupt before a side-effecting node. Persist state with a thread id. Show the pending action to a human. On approve, resume; on reject or edit, patch state and resume down a different edge. Never let the model apply a payment while we wait.",
          },
        ],
      },
    ],
  },
  {
    slug: "prompts",
    number: "23",
    title: "Prompts that hold up",
    subtitle: "Role, task, context, constraints, format. Then retrieval, eval, and guardrails still exist.",
    priority: "critical",
    minutes: 14,
    group: "Agents & prompts",
    summary:
      "Prompting is the cheapest control surface. It is not a substitute for RAG, evaluation, or safety. Structured output is the skill that actually ships.",
    youWillLearn: [
      "A five-part prompt skeleton you can reuse",
      "Structured output and why free prose is a liability",
      "What prompting cannot fix",
      "How to answer “are you a prompt engineer?” without cringing",
    ],
    sections: [
      {
        id: "what",
        title: "What a production prompt is",
        blocks: [
          {
            type: "p",
            text: "A prompt is the instruction surface: system plus user plus (sometimes) tool results and few-shot examples. A production prompt is not a personality paragraph. It is a spec: who the model is, what the task is, what context it may use, what it must not do, and what shape the output must have.",
          },
          {
            type: "table",
            headers: ["Part", "Job", "Example"],
            rows: [
              ["Role", "Set the job and the voice", "You are a policy assistant for ACME HR."],
              ["Task", "The verb and the success condition", "Answer only from the passages below."],
              ["Context", "The data (retrieved, user, memory)", "Passages: [1] … [2] …"],
              ["Constraints", "Hard no’s and safety", "If passages are insufficient, say you do not know."],
              ["Format", "The schema the app will parse", "JSON: {answer, citation_ids[], confidence}"],
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "Prompts are necessary, not sufficient",
            text: "Prompts do not replace retrieval (facts), eval (proof), or guardrails (safety). A beautiful system prompt on top of empty search still hallucinates. Interviewers will poke this exact gap.",
          },
        ],
      },
      {
        id: "why",
        title: "Why this still matters",
        blocks: [
          {
            type: "p",
            text: "You will not out-prompt a missing document. You will, however, lose a lot of product quality to sloppy prompts: no abstain rule, no citation format, no JSON schema, temperature left at 0.9 for a classifier. Prompting is the first lever because it is cheap. It is the wrong last lever because it cannot add knowledge or measure itself.",
          },
          {
            type: "ul",
            items: [
              "Structured output turns a language model into an API. Downstream code needs fields, not essays.",
              "Constraints cut a class of failures (invented URLs, medical advice, unsourced numbers).",
              "Few-shot examples teach format faster than a paragraph of adjectives.",
              "Version prompts like code. The string in a notebook cell is not an experiment log.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Prompt-only “guardrails”",
            text: "“You must not reveal PII” in the system prompt is a suggestion. A regex / classifier / policy layer is a guardrail. Do not tell an interviewer that a prompt is your PII strategy.",
          },
        ],
      },
      {
        id: "how",
        title: "How to write them",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Separate system and user",
                text: "System: role, constraints, format. User: the question and the retrieved context. Do not bury the user’s question under 800 words of persona.",
              },
              {
                title: "Put context in a fence",
                text: "Label passages with ids. Instruct: cite those ids, never invent a new one. If the answer is not in the passages, abstain.",
              },
              {
                title: "Demand a schema",
                text: "JSON Schema, tool calling, or a provider’s structured-output mode. Parse with Pydantic. On parse fail, retry once.",
              },
              {
                title: "Set decoding to match the task",
                text: "Classification, extraction, grounded Q&A: temperature near 0. Creative draft: higher. Do not leave the default unexamined.",
              },
              {
                title: "Evaluate, then edit",
                text: "Change one thing, run the eval set. Prompt folklore (“let’s think step by step” on every task) is not a process.",
              },
            ],
          },
          {
            type: "widget",
            widget: "temperature",
          },
          {
            type: "p",
            text: "Chain-of-thought: useful for multi-step reasoning you will hide from the end user. Harmful if you need short, source-bound answers — it gives the model more rope to invent. Prefer “think in a private field, then emit JSON” over dumping a chain into the UI.",
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "code",
            lang: "text",
            title: "Grounded HR assistant — skeleton",
            code: `SYSTEM
You are an HR policy assistant for ACME.
Task: answer the employee question using only the passages.
Constraints:
- If the passages are insufficient, set answer to null and reason "insufficient".
- Do not invent policy numbers, dates, or URLs.
- Do not give legal advice. Suggest HR for edge cases.
Format: JSON matching schema
  { "answer": string | null,
    "citation_ids": number[],
    "reason": string }

USER
Question: {{question}}

Passages:
[1] (leave_policy.md#pune) ...
[2] (leave_policy.md#notice) ...`,
          },
          {
            type: "p",
            text: "Weak version of the same product: “You are a helpful HR guru. Be friendly and complete.” That prompt invites the model to complete from pretraining when retrieval is empty. The skeleton above makes emptiness a first-class output.",
          },
          {
            type: "code",
            lang: "python",
            title: "Parse like an engineer, not like an optimist",
            code: `from pydantic import BaseModel

class Reply(BaseModel):
    answer: str | None
    citation_ids: list[int]
    reason: str

def generate(llm, prompt: str) -> Reply:
    raw = llm(prompt, temperature=0)
    try:
        return Reply.model_validate_json(raw)
    except Exception:
        raw = llm(prompt + "\\nReturn ONLY valid JSON.", temperature=0)
        return Reply.model_validate_json(raw)`,
          },
        ],
      },
      {
        id: "implementation",
        title: "How you build it",
        blocks: [
          {
            type: "ol",
            items: [
              "Store prompts in files or a table with version ids. Log version with every request.",
              "Build a 30–100 example eval set before you “tune the prompt all weekend.”",
              "Use structured output or tool calling for anything an app will parse.",
              "Keep retrieved context closest to the question. Long system sermons in the front get ignored.",
              "Add a refusal path and test it: empty retrieval, off-topic, jailbreak, PII request.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "“Prompt engineer” on Naukri",
            text: "Junior GenAI roles in India rarely hire a full-time prompt poet. They hire people who can retrieve, evaluate, and then write a tight prompt. If a JD is only “write prompts for ChatGPT,” treat it as a content job, not an engineering one.",
          },
          {
            type: "callout",
            tone: "note",
            title: "Few-shot vs fine-tune vs RAG",
            text: "Five examples in the prompt teach format. Fine-tuning teaches a stable behaviour across thousands of calls. RAG supplies facts that change. Do not pay for a fine-tune because you were too lazy to write two examples.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "How do you design a prompt for a RAG system?",
            a: "Role, task, context, constraints, format. The context is retrieved passages with ids. The constraint is abstain when they do not support the answer. The format is JSON with citation ids so the app can render sources and refuse to show an empty citation. Temperature near zero.",
            why: "They want the skeleton plus abstain plus citations — not “I tell it to be helpful.”",
          },
          {
            type: "qa",
            q: "Can a better prompt replace RAG?",
            a: "No. Prompts cannot add facts the weights do not have, and they cannot stay up to date with a company wiki. RAG supplies evidence. Prompts tell the model how to use it. Eval tells you whether it did. Guardrails stop the rest.",
          },
          {
            type: "qa",
            q: "What is structured output and why use it?",
            a: "Forcing the model to fill a schema (JSON Schema, tool call, Pydantic). I use it whenever code will consume the answer: citations, classifications, tool args. Free prose is for the user-facing sentence after the schema parsed cleanly.",
          },
        ],
      },
    ],
  },
];
