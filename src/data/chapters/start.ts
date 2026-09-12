import type { Chapter } from "../types";

export const startChapters: Chapter[] = [
  {
    slug: "how-to-use",
    number: "00",
    title: "How to use this handbook",
    subtitle: "Study like an engineer, not like a textbook.",
    priority: "career",
    minutes: 8,
    group: "Start here",
    summary:
      "The method, the priority order, and the one rule that gets junior GenAI candidates hired in India MNCs.",
    youWillLearn: [
      "The WHAT → WHY → HOW → EXAMPLE → BUILD → INTERVIEW loop",
      "What interviewers actually test at junior GenAI roles",
      "How to study without memorizing definitions",
      "The 8-week path from zero to applying",
    ],
    sections: [
      {
        id: "what",
        title: "What this is",
        blocks: [
          {
            type: "p",
            text: "This is an interview handbook for junior GenAI / AI Engineer / Applied AI / LLM Engineer roles in India — especially product MNCs, GCCs, and AI-heavy service firms. It is written for someone who can write Python but has not yet sat across from an interviewer and defended a RAG system.",
          },
          {
            type: "p",
            text: "It is not a research paper. It is not a LangChain tutorial dump. Every chapter is built so you can explain the engineering reason, not just the definition.",
          },
          {
            type: "callout",
            tone: "rule",
            title: "The one rule",
            text: "Do not memorize definitions. If an interviewer asks “Why did you use this?”, you should be able to name the problem it solves, the alternative you rejected, and the limitation you still have.",
          },
        ],
      },
      {
        id: "why",
        title: "Why this method",
        blocks: [
          {
            type: "p",
            text: "Junior GenAI interviews in India are a blend. Product MNCs still run DSA. Hiring managers still open your GitHub. Then someone who has shipped RAG will ask why your chunk size is 512 and what you do when retrieval is empty. Definitions fail that round. Engineering stories pass it.",
          },
          {
            type: "ul",
            items: [
              "WHAT — so you can define the thing in one sentence",
              "WHY — so you can justify it under pressure",
              "HOW — so you can walk the pipeline on a whiteboard",
              "EXAMPLE — so it is not abstract",
              "BUILD — so you can talk about code, not slides",
              "INTERVIEW — so you have a spoken answer, not a Wikipedia paragraph",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "What Indian MNCs actually filter on",
            text: "Round 1 is usually DSA or an online test. Round 2 is Python + CS core. Round 3 is your project. GenAI knowledge without DSA still dies at Google, Microsoft, Amazon, Adobe, Salesforce. GenAI knowledge without a project still dies at every applied-AI team. Study both.",
          },
        ],
      },
      {
        id: "how",
        title: "How to study each chapter",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Read What and Why out loud",
                text: "If you cannot explain it to a roommate in 60 seconds, you do not know it yet.",
              },
              {
                title: "Trace How on paper",
                text: "Draw the arrows. User query → embed → search → rerank → prompt → answer. No laptop.",
              },
              {
                title: "Type the example",
                text: "Do not just read Python. Run it, break it, change one parameter, watch what happens.",
              },
              {
                title: "Answer the interview questions without looking",
                text: "Cover the answer. Speak. Then compare. The gap is your study list.",
              },
              {
                title: "Mark the chapter complete only after the quiz",
                text: "Completion is not scrolling. Completion is a quiz score you could defend.",
              },
            ],
          },
          {
            type: "table",
            headers: ["Priority", "Topics", "Interview weight"],
            rows: [
              [
                "Critical",
                "LLM basics, embeddings, RAG, chunking, retrieval, agents, prompts, eval, fine-tuning, production",
                "Hiring-manager round. You must be fluent.",
              ],
              [
                "High",
                "Transformers, attention, LangGraph, function calling, hybrid search, reranking, hallucination, LLM security",
                "Follow-up questions. Weak answers here expose shallow projects.",
              ],
              [
                "Core",
                "DSA (selected), SQL, OOP, OS, DBMS, networks, FastAPI, Docker, Git",
                "Screening rounds. This is how you enter the building.",
              ],
            ],
          },
        ],
      },
      {
        id: "example",
        title: "A worked study session",
        blocks: [
          {
            type: "p",
            text: "Suppose tonight’s chapter is Chunking. A weak session is highlighting the page. A strong 45-minute session looks like this.",
          },
          {
            type: "ol",
            items: [
              "Write in one line: chunking splits documents so retrieval can return precise passages instead of whole PDFs.",
              "List three failures: too small loses context, too large dilutes similarity, no overlap splits a policy clause in half.",
              "Open a 4-page company leave policy. Split at 400 tokens with 40-token overlap. Inspect two adjacent chunks.",
              "Ask yourself: “If an interviewer says our answers miss tables, what do I change?” Answer: parse tables separately, smaller chunks, maybe parent-child retrieval.",
              "Do the 5-question quiz. Miss 2? Re-read only the failure-modes section, not the whole chapter.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Time budget",
            text: "Critical chapters: 40–60 minutes each the first time, 12 minutes on revision. Do not binge 10 chapters in a day. Interviews reward depth on RAG, not a tour of 40 acronyms.",
          },
        ],
      },
      {
        id: "implementation",
        title: "Your 8-week plan",
        blocks: [
          {
            type: "p",
            text: "You do not need to finish every chapter before applying. You need a defensible project, a clean DSA baseline, and fluent answers on RAG plus one training topic.",
          },
          {
            type: "table",
            headers: ["Weeks", "Focus", "Output"],
            rows: [
              ["1–2", "LLM fundamentals, tokens, embeddings, Python, 40 DSA problems", "Notes + GitHub warm-up repo"],
              ["3–4", "RAG pipeline, chunking, Chroma/FAISS, FastAPI, evaluation", "Working RAG API on a real document set"],
              ["5–6", "Agents, tool calling, LangGraph, security, cost, latency", "Agent that calls 2 tools and logs traces"],
              ["7", "QLoRA/PEFT or a second project slice, RAGAS, Docker", "README that a hiring manager can scan in 90 seconds"],
              ["8", "SQL 50, CS core flashcards, project defense, 8 applications", "Interviews on the calendar"],
            ],
          },
          {
            type: "code",
            title: "The five questions for every tool on your resume",
            lang: "text",
            code: `For FastAPI, RAG, embeddings, ChromaDB, LLM APIs,
LangGraph, QLoRA, PEFT, RAGAS, Docker — answer:

1. Why did I use it?
2. What problem does it solve?
3. What are the alternatives?
4. What are its limitations?
5. How would I improve it next?`,
          },
          {
            type: "callout",
            tone: "trap",
            title: "Do not wait until you feel ready",
            text: "Your target is not “I know every GenAI topic.” Your target is “I can solve coding problems, explain CS fundamentals, build a production-style AI system, and defend the projects on my resume.” Apply in week 6, not after a mythical perfect month.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "How should I introduce myself in a GenAI interview?",
            a: "Name, degree, one relevant project, one metric. Example: “I’m a CS grad. I built an invoice-compliance RAG service in FastAPI that retrieves policy clauses from Chroma and grounds a vision-LLM on invoice images. Faithfulness on a 200-invoice set went from 0.61 to 0.84 after hybrid retrieval and reranking.” Then stop. Let them ask.",
            why: "Indian interviewers often start with “Tell me about yourself.” A metric plus a system beats a list of courses.",
          },
          {
            type: "qa",
            q: "I have no industry internship. Can I still sit for MNC GenAI roles?",
            a: "Yes, if the project is real. Use a public document corpus, a Dockerized API, evaluation numbers, and a README that shows failure cases. Internships help. A honest, evaluated system helps more than a fake internship line.",
          },
          {
            type: "qa",
            q: "Should I study LangChain APIs by heart?",
            a: "No. Know the ideas: retrievers, splitters, agents, graphs, callbacks. Interviewers who have shipped systems will ask why you chained three retrievers, not the method name of a class that will change next quarter.",
          },
        ],
      },
    ],
  },
  {
    slug: "india-mnc",
    number: "00B",
    title: "Junior GenAI jobs in India MNCs",
    subtitle: "Roles, companies, rounds, salary bands, and what actually gets you shortlisted.",
    priority: "career",
    minutes: 14,
    group: "Start here",
    summary:
      "A plain map of the India hiring landscape so you study the right things for the companies you want.",
    youWillLearn: [
      "The difference between GenAI Engineer, ML Engineer, and SDE-with-AI",
      "How product MNCs, GCCs, and service firms interview",
      "Realistic junior salary bands",
      "A shortlist strategy that does not waste applications",
    ],
    sections: [
      {
        id: "what",
        title: "What the roles are",
        blocks: [
          {
            type: "p",
            text: "Job titles are messy. The same work is posted as GenAI Engineer, Applied AI Engineer, LLM Engineer, AI Engineer, ML Engineer (LLM), or SDE-1 (AI). Read the JD, not the title. If the JD says RAG, LangChain, prompt engineering, and FastAPI, it is this handbook’s job. If it says CUDA, research papers, and GPU kernels, it is not a junior applied role.",
          },
          {
            type: "table",
            headers: ["Role", "What you actually do", "What they test"],
            rows: [
              [
                "GenAI / LLM Engineer",
                "RAG, agents, eval, APIs, prompts, sometimes light fine-tuning",
                "Projects, Python, retrieval, production sense, some DSA",
              ],
              [
                "Applied AI / AI Engineer",
                "Ship models into products: search, copilots, document AI",
                "System thinking + coding + one ML/LLM project",
              ],
              [
                "ML Engineer",
                "Training pipelines, feature stores, classic ML plus some GenAI",
                "ML fundamentals, Python, SQL, sometimes DSA",
              ],
              [
                "SDE (AI platform)",
                "Backend for AI products — auth, queues, eval harnesses",
                "Strong DSA + backend. GenAI is a plus, not the core.",
              ],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Junior means this",
            text: "0–2 years, campus, or career switch with 1–2 solid projects. You are not expected to invent a new architecture. You are expected to build a correct RAG pipeline, write clean Python, and not pretend you trained GPT from scratch.",
          },
        ],
      },
      {
        id: "why",
        title: "Why the landscape looks like this",
        blocks: [
          {
            type: "p",
            text: "Every large company in India now has a “GenAI” mandate. Product MNCs and GCCs (Global Capability Centers) want people who can put LLMs behind real APIs with cost, latency, and security controls. Service MNCs want people who can deliver client copilots on Azure OpenAI, Bedrock, or Vertex. Startups want the same person, cheaper, who also on-calls.",
          },
          {
            type: "ul",
            items: [
              "Product MNCs / GCCs: Microsoft, Google, Amazon, Adobe, Salesforce, Oracle, SAP, ServiceNow, NVIDIA, Intuit, Walmart Global Tech, Uber, LinkedIn, Atlassian.",
              "IT services MNCs: TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, IBM, Deloitte, LTIMindtree — large volume, more process, still real GenAI project work.",
              "India product companies: Freshworks, Zoho, Razorpay, PhonePe, Flipkart, Swiggy, CRED, Meesho, BrowserStack.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "GCC vs services vs product",
            text: "A GCC role (Microsoft IDC, Google Hyderabad, Amazon Bangalore) is usually closer to the parent company’s bar: DSA + system design + project depth. A services role often tests communication, cloud certifications, and a case study. A startup/product role tests shipping speed and ownership. Prepare for the bar of the company you want, not a generic “AI interview.”",
          },
        ],
      },
      {
        id: "how",
        title: "How the interview is structured",
        blocks: [
          {
            type: "p",
            text: "Most junior loops look like a funnel. Fail DSA, you never talk about RAG. Fail the project defense, DSA does not save you.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Online assessment",
                text: "2 coding questions (arrays, hashing, strings, trees) or a mix of MCQ + 1 code. Languages: Python or Java. Timed. Cheating gets you banned.",
              },
              {
                title: "DSA / problem-solving round",
                text: "45–60 minutes. Speak while you code. They grade approach, edge cases, and complexity — not only the green tests.",
              },
              {
                title: "CS core + Python",
                text: "OOP, REST, SQL joins, indexes, processes vs threads, HTTP, Git. Sometimes a small FastAPI or pandas task.",
              },
              {
                title: "GenAI / project deep dive",
                text: "This handbook’s home. They pick one project and go down: chunk size, empty retrieval, eval, cost, PII, why not fine-tune.",
              },
              {
                title: "Hiring manager + HR",
                text: "Ownership, “why this company,” notice period, location (BLR/HYD/NCR/Pune), compensation. Have a number and a reason.",
              },
            ],
          },
          {
            type: "table",
            headers: ["Company type", "DSA weight", "GenAI weight", "Typical junior CTC*"],
            rows: [
              ["FAANG-like / top product MNC", "Very high", "High if AI team", "₹18–40 LPA (stocks matter)"],
              ["Product MNC / strong GCC", "High", "High", "₹12–25 LPA"],
              ["India product / funded startup", "Medium–high", "Very high", "₹10–22 LPA"],
              ["IT services (AI track)", "Low–medium", "Medium + cloud", "₹4–9 LPA, faster volume"],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Salary bands move",
            text: "Figures are 2025–26 ballparks for 0–2 years in Bengaluru / Hyderabad / NCR / Pune. Stocks, joining bonus, and night-shift allowances change the real number. Never quote a blog as if it were an offer. Always ask for split: base, variable, ESOPs, benefits.",
          },
        ],
      },
      {
        id: "example",
        title: "Example: two candidates, one JD",
        blocks: [
          {
            type: "p",
            text: "JD: “GenAI Engineer, 0–2 years, Python, RAG, Azure OpenAI, FastAPI.” Two resumes hit the recruiter.",
          },
          {
            type: "table",
            headers: ["", "Candidate A", "Candidate B"],
            rows: [
              ["Headline", "Passionate AI enthusiast, 12 courses", "Invoice compliance RAG API, FastAPI + Chroma"],
              ["Project", "Chatbot using ChatGPT UI", "Policy retrieval, rerank, eval table, Docker"],
              ["Numbers", "None", "p95 latency 1.8s, ₹/query, faithfulness 0.84"],
              ["DSA", "Did 400 problems, no pattern notes", "80 patterns, can explain two-pointer and heaps"],
              ["Result", "Screen-reject or dies in project round", "Gets the HM round"],
            ],
          },
          {
            type: "p",
            text: "Candidate B is who this handbook is for. Depth on one system beats a cemetery of unfinished notebooks.",
          },
        ],
      },
      {
        id: "implementation",
        title: "How to apply without wasting months",
        blocks: [
          {
            type: "ol",
            items: [
              "Pick a target band: (1) product MNC/GCC, (2) India product, (3) services AI track. Your DSA hours follow that pick.",
              "Put one GenAI project at the top of the resume: problem, architecture, tools, metric, link.",
              "Use a one-page resume. PDF. No photo. No “visionary.” Python, FastAPI, SQL, Docker, RAG, eval.",
              "Apply on the company career site plus referrals. Naukri/LinkedIn help for services and mid-product; referrals still win GCCs.",
              "Track applications in a simple table: company, role, date, round, notes. Follow up once after 7 days.",
              "Do not spray 200 copies of a generic resume. Change the first 8 lines to match the JD’s stack.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Certifications are not a substitute",
            text: "Azure AI-900 or a Coursera banner will not replace a repository. Use a cert only as a signal that you can sit an Azure/AWS round. Interviewers will still open your code.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Location and notice",
            text: "Most MNC AI teams sit in Bengaluru, Hyderabad, Pune, NCR, Chennai. Remote-first junior seats are rare. If you cannot relocate, say so early. Campus hires: keep a 0–30 day joining story ready. Laterals: 30–90 day notice is normal; buyout is a negotiation, not a right.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "Why do you want a GenAI role instead of a normal SDE role?",
            a: "Because the problems I like are retrieval, evaluation, and putting models behind APIs — not because GenAI is trending. Then point at a project: “I spent weeks on faithfulness and cost, not on generating poems.”",
          },
          {
            type: "qa",
            q: "Are you open to an SDE role that later moves to AI?",
            a: "Yes, if the team is honest about the path. Many GCC AI teams hire SDEs and rotate. Do not refuse a strong SDE seat at a company you want; do refuse a dead-end “AI automation” body-shopping role that never lets you touch retrieval or eval.",
          },
          {
            type: "qa",
            q: "What is your expected CTC?",
            a: "Give a range tied to data, not a wish. “For this level in Bengaluru I’m looking at ₹X–Y LPA split, depending on base vs stocks.” If you have an offer, say the number. If you do not, say the band for similar roles and that you care about the team and the work. Never be the first to invent a fantasy 40 LPA with no internships.",
          },
        ],
      },
    ],
  },
];
