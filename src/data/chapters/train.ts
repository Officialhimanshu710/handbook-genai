import type { Chapter } from "../types";

export const trainChapters: Chapter[] = [
  {
    slug: "fine-tuning",
    number: "24",
    title: "Fine-tuning vs RAG",
    subtitle: "Teach behaviour and style with data. Do not dump a wiki into weights.",
    priority: "critical",
    minutes: 16,
    group: "Training & quality",
    summary:
      "Fine-tuning changes how a model talks and formats. RAG changes what it can cite today. Data quality and an 80/10/10 split matter more than the trainer brand.",
    youWillLearn: [
      "When fine-tuning is the right lever vs RAG vs prompting",
      "Style/behaviour vs knowledge — the interview distinction",
      "Why data quality beats dataset size",
      "How to describe an 80/10/10 split without waving hands",
    ],
    sections: [
      {
        id: "what",
        title: "What fine-tuning is",
        blocks: [
          {
            type: "p",
            text: "Fine-tuning continues training on a pretrained model using your labelled examples so the weights shift toward your task. For junior GenAI work this almost always means supervised instruction tuning (input → desired output), sometimes with a preference stage later. It is not “uploading PDFs so the model knows them.” Uploading PDFs is RAG.",
          },
          {
            type: "table",
            headers: ["Lever", "What it changes", "When you reach for it"],
            rows: [
              [
                "Prompting",
                "Instructions for this call",
                "Format, tone, abstain — cheap, reversible",
              ],
              [
                "RAG",
                "Evidence in context",
                "Facts that change, citations, long-tail knowledge",
              ],
              [
                "Fine-tuning",
                "Weights / adapters",
                "Stable style, domain language, output schema, tool-call habits",
              ],
              [
                "Tools",
                "Live actions and calculations",
                "Anything that must be true right now or have a side effect",
              ],
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "The split to memorise",
            text: "Fine-tune for style and behaviour. Retrieve for knowledge. If the source of truth updates weekly, it does not belong in weights.",
          },
        ],
      },
      {
        id: "why",
        title: "Why this is a trap in interviews",
        blocks: [
          {
            type: "p",
            text: "Campus decks still say “we fine-tuned Llama on our company data.” Interviewers hear: we spent GPU money to stale-copy a wiki that RAG would have served better, and we have no eval. Fine-tuning is expensive to run, expensive to redo, and it can overwrite useful general behaviour (catastrophic forgetting). It is the right tool when prompting plus RAG still cannot lock a format or a voice after you have tried.",
          },
          {
            type: "ul",
            items: [
              "Knowledge that moves (policies, prices, tickets) → RAG.",
              "A voice (“reply like our L1 support, 4 sentences, no slang”) that few-shot cannot hold → fine-tune.",
              "A schema the model keeps breaking even with structured output → maybe fine-tune, after you check the schema and temperature.",
              "A factoid the model never saw (your internal SKU list) → RAG or a tool, not a weight update.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "Fine-tune is not a knowledge dump",
            text: "Weights are a lossy, uncited, hard-to-update memory. If you need the model to quote the 12 August leave circular, retrieve the circular. Fine-tuning will blur it with last year’s circular and will not give you a document id.",
          },
        ],
      },
      {
        id: "how",
        title: "How you actually do it",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Decide the behaviour you want",
                text: "Write 20 gold input/output pairs by hand. If you cannot, you are not ready to train.",
              },
              {
                title: "Collect data, then clean it",
                text: "One noisy CSV of chat logs will teach the model your agents’ worst habits. Deduplicate, strip PII, drop sarcasm and wrong answers. Quality beats volume.",
              },
              {
                title: "Split 80 / 10 / 10",
                text: "80% train, 10% validation (for early stopping and hyperparams), 10% test (untouched until the end). Split by conversation or document, not by random line — otherwise near-duplicates leak.",
              },
              {
                title: "Train a small adapter, not the world",
                text: "For anything you will actually run, that means LoRA / QLoRA (next chapters). Full fine-tuning of a 7B+ model is rarely a junior-lab move.",
              },
              {
                title: "Evaluate the behaviour, not the loss",
                text: "Loss going down is not “it learned our policy.” Score format validity, refusal quality, and a held-out task. Then test that RAG still works on top.",
              },
            ],
          },
          {
            type: "p",
            text: "Order of operations in a product: prompt → retrieve → eval. Fine-tune only when those three still leave a systematic behaviour gap. Reverse that order and you will fine-tune every week as the wiki moves.",
          },
          {
            type: "diagram",
            title: "What goes where",
            lines: [
              "Company wiki / tickets / PDFs     ---->  RAG (or a tool)",
              "Tone, format, language, routing  ---->  Fine-tune (adapter)",
              "This request’s instructions      ---->  Prompt",
              "Live numbers / writes            ---->  Tools",
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
            text: "A Bengaluru SaaS wants a support model that writes in their two-paragraph template and never offers refunds. Knowledge of the product still lives in a help center that changes daily.",
          },
          {
            type: "table",
            headers: ["Need", "Move"],
            rows: [
              [
                "Always: greeting, repro steps, next action, no refund language",
                "Fine-tune (or a very strict prompt + validator). This is behaviour.",
              ],
              [
                "Correct steps for “SSO login on Okta” this week",
                "RAG over the help center. This is knowledge.",
              ],
              [
                "Open a Jira bug",
                "Tool call, not training.",
              ],
            ],
          },
          {
            type: "code",
            lang: "python",
            title: "Instruction row — this is the unit of fine-tuning",
            code: `{
  "instruction": "Reply to the customer. Use ACME L1 template. No refunds.",
  "input": "I want a refund, SSO is broken since yesterday.",
  "output": "Hi — sorry about SSO.\\nRepro: ...\\nNext: please try ...\\n"
             "Refunds are handled by billing; I cannot issue one here."
}`,
          },
          {
            type: "p",
            text: "A thousand of those rows can lock the template. They will not teach tomorrow’s SSO outage. That paragraph in `output` is a style example, not a knowledge base.",
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
              "Start with 200–2000 hand-reviewed examples, not 200k scraped ones. For style tasks, hundreds of clean pairs often beat tens of thousands of messy ones.",
              "80/10/10 by customer or by ticket thread so the test set is a new person, not a reshuffled sentence.",
              "Hold out a gold eval of 50–100 prompts you care about. Run it before and after. Loss is not the metric you report to a hiring manager.",
              "Keep the base model frozen via LoRA so you can roll back by deleting an adapter file.",
              "Never fine-tune on secrets. If a ticket contains passwords or PAN, it does not enter the train set.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "What you can honestly claim",
            text: "“QLoRA’d Mistral-7B on 1.2k support turns, JSON-valid replies 71% → 96% on a 100-ticket holdout, RAG still used for product facts.” That line is hireable. “Fine-tuned Llama on our data” is not.",
          },
          {
            type: "callout",
            tone: "note",
            title: "SFT vs preference",
            text: "Supervised fine-tuning (SFT) teaches “when you see X, emit Y.” RLHF / DPO teach “prefer A over B.” Junior projects almost always stop at SFT plus eval. Do not name RLHF unless you ran a preference stage.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "When do you fine-tune instead of using RAG?",
            a: "I fine-tune when I need a stable behaviour or style that prompting cannot hold — format, tone, routing, tool-call habits. I use RAG when I need facts, citations, or anything that changes. Fine-tuning is not a replacement for a knowledge base. If I need both, I retrieve and I may also attach a small adapter.",
            why: "This is the critical distinction. Reverse it and you fail the round.",
          },
          {
            type: "qa",
            q: "How would you split the data?",
            a: "80% train, 10% validation, 10% test. Split on the unit that would leak — conversation, customer, or document — not on random lines. Validation is for early stopping. Test is touched once at the end. I also keep a separate gold eval of real product prompts.",
          },
          {
            type: "qa",
            q: "You have 50k support chats. Train on all of them?",
            a: "No. I would sample, dedupe, strip PII, drop wrong resolutions, and keep a few thousand clean instruction pairs. Bad data teaches bad behaviour at scale. I would rather train on 1k reviewed rows than 50k raw logs.",
          },
        ],
      },
    ],
  },
  {
    slug: "lora",
    number: "25",
    title: "LoRA",
    subtitle: "Train a thin adapter. Leave the base model frozen.",
    priority: "high",
    minutes: 13,
    group: "Training & quality",
    summary:
      "Low-Rank Adaptation trains two small matrices per chosen layer instead of every weight. That is why a 7B fine-tune fits in a fine-tune budget at all.",
    youWillLearn: [
      "What “low rank” means in one picture",
      "Why full fine-tuning is the wrong default",
      "Rank, alpha, and what an adapter file is",
      "What to say if they ask about target modules",
    ],
    sections: [
      {
        id: "what",
        title: "What LoRA is",
        blocks: [
          {
            type: "p",
            text: "LoRA (Low-Rank Adaptation) freezes the pretrained weights W and learns a thin update ΔW = B A, where A is rank r × d_in and B is d_out × r, with r much smaller than the full dimensions (typical r = 8, 16, 32). At inference you compute (W + BA) x, or merge BA into W once and ship a single set of weights.",
          },
          {
            type: "diagram",
            title: "The update is a skinny detour",
            lines: [
              "Frozen W (d_out x d_in)     — millions / billions of params, not trained",
              "",
              "x  ->  A (r x d_in)  ->  B (d_out x r)  ->  added to W x",
              "         ^ trained          ^ trained",
              "",
              "Trainable params ≈ r * (d_in + d_out) per adapted matrix",
              "Often 0.1%–1% of the model.",
            ],
          },
          {
            type: "p",
            text: "The adapter is a small file (tens of MB, not tens of GB). You keep one base model on disk and swap adapters per product: support-tone, Hindi-English mix, JSON-only, etc.",
          },
        ],
      },
      {
        id: "why",
        title: "Why not full fine-tuning",
        blocks: [
          {
            type: "p",
            text: "Full fine-tuning stores optimiser states (Adam is ~8 bytes per parameter on top of the weights), gradients, and activations. A 7B model in fp16 is already ~14 GB of weights; Adam pushes training into multi-GPU territory. You also risk catastrophic forgetting: the model gets better at your template and worse at general language. LoRA keeps W frozen, so the general model stays put and the trainable footprint collapses.",
          },
          {
            type: "table",
            headers: ["", "Full FT", "LoRA"],
            rows: [
              ["What moves", "Every weight", "A and B of chosen layers"],
              ["Checkpoint size", "Full model", "Adapter only (MBs)"],
              ["Forgetting", "Easy to clobber the base", "Base stays frozen"],
              ["Rollback", "Keep a full copy", "Delete the adapter"],
              ["Junior-lab realistic?", "Rarely, for 7B+", "Yes, especially with QLoRA"],
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "“I fully fine-tuned Llama-7B on Colab”",
            text: "Unless you used heavy checkpointing tricks or a tiny toy model, you probably ran LoRA and called it fine-tuning. Say LoRA. Interviewers prefer accurate humility over a claim the GPU math does not support.",
          },
        ],
      },
      {
        id: "how",
        title: "How rank and alpha work",
        blocks: [
          {
            type: "ul",
            items: [
              "Rank r: capacity of the update. Higher r → more expressiveness, more VRAM, more overfit risk. Start at 8 or 16 for instruction style. Raise if the eval saturates too low.",
              "lora_alpha: scales the update (often as alpha/r). A common default is alpha = 2r (e.g. r=16, alpha=32). Treat it as a learning-rate companion, not a mystic.",
              "target_modules: which matrices get adapters. Attention q_proj and v_proj is the original paper default. Many 7B recipes also adapt k_proj, o_proj, and the MLP up/down/gate projections for more capacity.",
              "dropout on LoRA layers: small (0.05) can help on tiny datasets.",
            ],
          },
          {
            type: "p",
            text: "Merging: after training you can bake BA into W and export a normal model (simpler serving, no PEFT at inference) or keep them separate (hot-swap adapters on one base).",
          },
          {
            type: "callout",
            tone: "note",
            title: "LoRA is not a new architecture",
            text: "The base transformer does not change. You are learning a low-rank residual. If the task needs new knowledge, LoRA will try to stuff it into that residual and will still lose to RAG.",
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "PEFT LoRA config — conceptual",
            code: `from peft import LoraConfig, get_peft_model

# base_model already loaded in fp16 / bf16 on GPU
lora = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],  # start small; expand if needed
    bias="none",
    task_type="CAUSAL_LM",
)
model = get_peft_model(base_model, lora)
model.print_trainable_parameters()
# typical print: trainable params: 0.12% of all params`,
          },
          {
            type: "p",
            text: "You train with the same causal language-modelling loss as usual, but the optimiser only sees the LoRA tensors. After a few hundred to a few thousand steps on clean instruction data, you save adapter_model.safetensors and a tiny config. That bundle is what you version in git-lfs or object storage — not a 14 GB clone of Mistral.",
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
              "Pick a base you can actually run: 7B-class for a lab GPU, or a hosted fine-tune API if you have no GPU.",
              "Freeze everything, attach LoRA to attention (then MLP if needed).",
              "Train with a modest LR (often 1e-4 to 2e-4 for LoRA, higher than full-FT LRs).",
              "Watch the validation loss and the gold behavioural eval. If train loss crashes and eval format score does not move, you are memorising.",
              "Export the adapter. A/B it against the base+prompt on the same RAG pipeline so you know you did not break grounding.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "College GPU story",
            text: "If the lab has a 8–12 GB card, LoRA in fp16 on 7B may still OOM. That is the door into QLoRA (next chapter), not into “I’ll train BERT and call it Llama.”",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What is LoRA in one minute?",
            a: "I freeze the pretrained weights W and learn a low-rank update BA with rank r much smaller than the layer size. Trainable parameters drop to a fraction of a percent, checkpoints are small adapters, and the base model’s general behaviour is less likely to be destroyed. At inference I add BA to W or merge it.",
            why: "If they hear “it’s a smaller model” you have confused distillation with adapters.",
          },
          {
            type: "qa",
            q: "Why not full fine-tune a 7B?",
            a: "Memory: Adam states plus gradients plus activations blow past a single consumer GPU. Process: I get a 14 GB checkpoint per experiment and a higher forgetting risk. LoRA gives me the behaviour change I need for style/format with a file I can swap and roll back.",
          },
          {
            type: "qa",
            q: "What does rank mean, and how do you pick it?",
            a: "Rank is the inner dimension of A and B — the capacity of the update. I start at 8 or 16 for instruction-style tasks. If the holdout behaviour is still weak and I have enough data, I raise r or adapt more modules. If I overfit a 500-row set, I lower r, add dropout, or collect cleaner data.",
          },
        ],
      },
    ],
  },
  {
    slug: "qlora",
    number: "26",
    title: "QLoRA",
    subtitle: "4-bit base + LoRA on top. This is how a 7B fine-tune fits on one T4.",
    priority: "critical",
    minutes: 15,
    group: "Training & quality",
    summary:
      "QLoRA is a memory technique: quantise the frozen base to 4-bit, train LoRA adapters in higher precision. It is not automatically higher quality than LoRA.",
    youWillLearn: [
      "What is quantised and what is trained",
      "Why 4-bit + LoRA fits on Colab / a college T4",
      "NF4, double quant, paged optimisers — at a talking level",
      "What not to claim about quality",
    ],
    sections: [
      {
        id: "what",
        title: "What QLoRA is",
        blocks: [
          {
            type: "p",
            text: "QLoRA (Quantized LoRA) loads the frozen base model in 4-bit precision and still trains LoRA adapters in 16-bit (bf16/fp16). The huge matrix W is compressed in memory; the small A and B matrices are what the optimiser sees. That is the whole trick. You are not training a 4-bit model from scratch. You are not “distilling.” You are fitting a 7B-class fine-tune on one 16 GB GPU.",
          },
          {
            type: "diagram",
            title: "Who is 4-bit, who is 16-bit",
            lines: [
              "Base weights W     : stored 4-bit (NF4), frozen     -> memory win",
              "Forward compute    : dequant W to bf16/fp16 on the fly",
              "LoRA A, B          : 16-bit, trainable",
              "Adam states        : only for A, B (tiny) + paged if needed",
              "",
              "7B fp16 weights    ~ 14 GB   (already tight on 16 GB)",
              "7B 4-bit weights   ~ 3.5–5 GB  + adapters + activations",
              "One NVIDIA T4 16 GB: this is the realistic box.",
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "QLoRA is for memory",
            text: "The paper’s claim is: quality close to 16-bit LoRA, at a fraction of the VRAM. If you say “QLoRA is more accurate than LoRA,” you have the arrow backwards. You pick QLoRA because the GPU is small, not because 4-bit is a better teacher.",
          },
        ],
      },
      {
        id: "why",
        title: "Why it matters in India labs",
        blocks: [
          {
            type: "p",
            text: "The default hardware story for a student or a junior in India is: free Colab T4 (16 GB), a college lab GPU, or one consumer card. Full 7B fine-tunes do not fit. 16-bit LoRA on 7B is borderline. QLoRA is the reason “I fine-tuned Mistral-7B” can be a true sentence in that environment. 70B is still a cluster story — do not put it on the resume unless you actually had the GPUs.",
          },
          {
            type: "table",
            headers: ["Setup", "What fits (ballpark)", "What to say in interview"],
            rows: [
              [
                "Colab / lab T4 16 GB",
                "7B QLoRA, batch 1, short seq, maybe 8-bit Adam / paged",
                "Honest, hireable",
              ],
              [
                "RTX 4090 24 GB",
                "7B LoRA in 16-bit, or 13B QLoRA carefully",
                "Still junior-realistic",
              ],
              [
                "No GPU",
                "Hosted fine-tune API, or train a tiny model",
                "Do not invent a 70B run",
              ],
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "Single T4 reality",
            text: "If your college has one T4 shared across a batch, your experiment design is: 4-bit base, r=8 or 16, sequence 512–1024, gradient accumulation instead of big batches, overnight queue. That constraint story is more impressive than a fake multi-GPU claim.",
          },
        ],
      },
      {
        id: "how",
        title: "How the pieces work",
        blocks: [
          {
            type: "ul",
            items: [
              "NF4 (4-bit NormalFloat): a quantisation grid tuned for weight distributions that look Gaussian — better than naive int4 for many LLM layers.",
              "Double quantisation: quantise the quantisation constants themselves. Extra memory shave, small.",
              "Compute dtype: dequantise to bf16 (preferred when the GPU has it) or fp16 for matmuls. The T4 is an fp16 machine; Ampere+ likes bf16.",
              "Paged optimisers: when activations spike, optimiser pages to CPU RAM instead of dying with OOM. This is a safety net, not a speedup.",
              "prepare_model_for_kbit_training: cast norms, enable gradient checkpointing so activations do not fill the 16 GB.",
            ],
          },
          {
            type: "p",
            text: "Forward: dequantise W → compute W x in 16-bit → add LoRA path. Backward: gradients flow into A and B only. W stays frozen and 4-bit. That is why optimiser memory tracks the adapter size, not the 7B.",
          },
          {
            type: "callout",
            tone: "trap",
            title: "Quantisation ≠ QLoRA",
            text: "Serving a 4-bit model with bitsandbytes or GGUF is inference quantisation. QLoRA is training adapters on top of a quantised frozen base. Do not mix the two answers.",
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "7B QLoRA on one GPU — the skeleton you can explain",
            code: `from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
    bnb_4bit_compute_dtype="float16",  # T4: fp16; A100/L4: bfloat16
)
model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1",
    quantization_config=bnb,
    device_map="auto",
)
model = prepare_model_for_kbit_training(model)

lora = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, lora)
model.print_trainable_parameters()`,
          },
          {
            type: "p",
            text: "Then a normal Hugging Face Trainer / SFTTrainer loop on your 80/10/10 JSONL. If you OOM: shorten sequence length, drop batch to 1, raise gradient accumulation, enable gradient checkpointing, or shrink r. Do not “just try 13B” on the same card.",
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
              "Confirm bitsandbytes works on that GPU (CUDA version). This is the #1 lab failure.",
              "Load 7B in 4-bit, attach LoRA, print trainable %. If it is not well under 2%, you misconfigured freeze.",
              "Gradient checkpointing on. Batch 1 + accumulation to reach an effective 8–16.",
              "Eval the same gold set as the base model. Report format / task metrics, not “loss 1.2.”",
              "Save adapters only. Document GPU, VRAM peak, hours, and that RAG still supplies facts.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Quality expectations",
            text: "On instruction-style tasks, QLoRA is typically close to 16-bit LoRA. It will not beat a larger model, and it will not replace retrieval. If 4-bit hurts a sensitive eval, try 8-bit LoRA or a smaller full-precision model.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What is QLoRA and why use it?",
            a: "QLoRA stores the frozen base in 4-bit and trains LoRA adapters in 16-bit. I use it to fit a 7B-class fine-tune on one 16 GB GPU — a T4, Colab, a college lab card. It is a memory technique. Quality is usually close to 16-bit LoRA, not magically better.",
            why: "They are listening for “memory, 4-bit base, 16-bit adapters.” Quality bragging is a fail.",
          },
          {
            type: "qa",
            q: "Could you QLoRA a 70B on Colab?",
            a: "Not in any honest single-T4 setup. 70B 4-bit weights alone are tens of gigabytes. I would not claim 70B. I would pick 7B QLoRA, or use a hosted trainer, and be precise about hardware.",
          },
          {
            type: "qa",
            q: "bitsandbytes vs LoRA vs PEFT — who does what?",
            a: "bitsandbytes quantises and computes in low bit-width. LoRA is the adapter math. PEFT is the library that attaches LoRA to a Hugging Face model. QLoRA is the recipe that combines them: 4-bit load + LoRA train.",
          },
        ],
      },
    ],
  },
  {
    slug: "peft",
    number: "27",
    title: "PEFT",
    subtitle: "The umbrella: train a little, ship a portable adapter.",
    priority: "high",
    minutes: 12,
    group: "Training & quality",
    summary:
      "Parameter-Efficient Fine-Tuning is the family name. LoRA is the method you will actually use. Adapters are portable files you load onto a frozen base.",
    youWillLearn: [
      "PEFT vs LoRA vs QLoRA — nested, not rivals",
      "Other PEFT methods at one-line depth",
      "Why adapters are how you serve many behaviours on one base",
      "How to load and swap adapters in code",
    ],
    sections: [
      {
        id: "what",
        title: "What PEFT is",
        blocks: [
          {
            type: "p",
            text: "PEFT (Parameter-Efficient Fine-Tuning) is the umbrella name for methods that adapt a large model by training only a small extra set of parameters. LoRA is one method under that umbrella — the default one in 2024–26 applied work. QLoRA is LoRA plus 4-bit loading. Hugging Face’s `peft` library is the common implementation, not the research idea itself.",
          },
          {
            type: "diagram",
            title: "Nested names, one picture",
            lines: [
              "PEFT  (family: train << 1% of params)",
              "  |- LoRA          (low-rank adapters on frozen W)   <- you will use this",
              "  |- QLoRA         (LoRA + 4-bit frozen W)           <- you will use this on a T4",
              "  |- adapters / IA3 / prefix / prompt-tuning         <- know they exist",
              "  |- full fine-tune is NOT PEFT",
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "Portable adapters",
            text: "The artefact is a small adapter you can copy, version, and load onto the same base on another machine. You do not ship a 14 GB fork per customer tone.",
          },
        ],
      },
      {
        id: "why",
        title: "Why the umbrella exists",
        blocks: [
          {
            type: "p",
            text: "Before PEFT, “customise GPT” meant hosting a full copy per task. That is unworkable at 7B+, let alone 70B. PEFT makes multi-tenant customisation a file-load: one base in VRAM, adapter A for support, adapter B for Hindi, adapter C for JSON extraction. It also makes experiments cheap enough that a junior can run more than one.",
          },
          {
            type: "table",
            headers: ["Method", "What you train", "Junior take"],
            rows: [
              [
                "LoRA",
                "Low-rank BA on chosen layers",
                "Default. Learn this deeply.",
              ],
              [
                "QLoRA",
                "Same, base stored 4-bit",
                "Default when VRAM is the boss.",
              ],
              [
                "Prefix / prompt tuning",
                "Virtual tokens prepended",
                "Exists; weaker for many instruction tasks than LoRA.",
              ],
              [
                "IA3",
                "Learned rescaling vectors",
                "Even smaller; know the name.",
              ],
              [
                "Adapters (Houlsby-style)",
                "Small bottleneck MLPs inserted in layers",
                "The older “adapter” paper. LoRA mostly replaced it in LLM practice.",
              ],
            ],
          },
        ],
      },
      {
        id: "how",
        title: "How adapters travel",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Train once against a named base",
                text: "The adapter config records the base model id and target modules. An adapter for Mistral-7B will not silently work on Llama-7B.",
              },
              {
                title: "Save a small directory",
                text: "adapter_config.json + adapter weights. That directory is what you put in object storage.",
              },
              {
                title: "Load base, then adapter",
                text: "Same architecture, same quantisation story as training if you stay in 4-bit, or merge to 16-bit for serving.",
              },
              {
                title: "Swap or stack (carefully)",
                text: "One process can load adapter “support” then switch to “billing.” Mixing two adapters needs an explicit recipe; do not hand-wave “we fused them.”",
              },
            ],
          },
          {
            type: "p",
            text: "Serving choices: (1) keep PEFT attached and hot-swap, (2) merge LoRA into W and export a vanilla model for vLLM/TGI, (3) call a hosted fine-tune endpoint and never touch PEFT yourself. All three are valid; say which one you used.",
          },
        ],
      },
      {
        id: "example",
        title: "A real example",
        blocks: [
          {
            type: "code",
            lang: "python",
            title: "Train once, load anywhere the base exists",
            code: `from peft import PeftModel, get_peft_model, LoraConfig
from transformers import AutoModelForCausalLM, AutoTokenizer

base_id = "mistralai/Mistral-7B-v0.1"
base = AutoModelForCausalLM.from_pretrained(base_id, device_map="auto")

# training time
model = get_peft_model(base, LoraConfig(
    r=16, lora_alpha=32, task_type="CAUSAL_LM",
    target_modules=["q_proj", "v_proj"],
))
# ... train ...
model.save_pretrained("adapters/acme-l1-tone")

# later, on a different box that already has the base
base = AutoModelForCausalLM.from_pretrained(base_id, device_map="auto")
model = PeftModel.from_pretrained(base, "adapters/acme-l1-tone")
# to ship a single file: model.merge_and_unload()`,
          },
          {
            type: "p",
            text: "The portable unit is `adapters/acme-l1-tone`. The 14 GB base is a dependency, like a runtime. This is the sentence interviewers want: “we version adapters, we do not fork the foundation model per client.”",
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
              "Treat PEFT as the packaging standard: one repo of adapters, one documented base id, one eval harness.",
              "Pin the base revision. An adapter trained on tokenizer X will misbehave on a silent tokenizer bump.",
              "Do not check 14 GB weights into GitHub. Check the adapter and a script that pulls the base.",
              "If you merge for serving, record the merge in the README so nobody tries to LoRA-load a merged model again.",
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "PEFT is not a third algorithm besides LoRA",
            text: "Candidates list “PEFT, LoRA, QLoRA” as three skills like Python, Java, C++. Say: PEFT is the family, LoRA is the method, QLoRA is LoRA under 4-bit loading.",
          },
          {
            type: "callout",
            tone: "india",
            title: "Hosted PEFT",
            text: "Azure AI / Bedrock / Vertex often offer “fine-tune this endpoint” which is PEFT under the hood. You can still talk adapters, data split, and eval without claiming you SSH’d into their GPU.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "What is PEFT? Is it different from LoRA?",
            a: "PEFT is the family of methods that fine-tune a large model by training only a small extra parameter set. LoRA is the method I would actually use. QLoRA is LoRA plus a 4-bit frozen base for memory. I would not list them as three unrelated tools.",
            why: "Taxonomy questions catch keyword-only resumes.",
          },
          {
            type: "qa",
            q: "What does “adapters are portable” mean?",
            a: "The trained artefact is a small file tied to a specific base model. I can keep one 7B in VRAM or on disk and load support-tone or json-mode adapters as needed, or send just the adapter to another machine that already has the base. I do not ship a full copy of the foundation model per behaviour.",
          },
          {
            type: "qa",
            q: "When would you merge the adapter?",
            a: "When the serving stack wants a vanilla model (vLLM, a vendor endpoint that cannot load PEFT) and I do not need to hot-swap behaviours. Merge is a convenience. Until then I keep the adapter separate so I can roll back.",
          },
        ],
      },
    ],
  },
  {
    slug: "hallucination",
    number: "28",
    title: "Hallucination is a system problem",
    subtitle: "Data, retrieval, generation, verification, eval — not a vibe you prompt away.",
    priority: "critical",
    minutes: 16,
    group: "Training & quality",
    summary:
      "Hallucination is the model emitting ungrounded content. You fight it with evidence, decoding, structure, tools, and measurement — stacked, not with one magic sentence.",
    youWillLearn: [
      "Why “just tell it not to lie” fails",
      "The five layers that actually cause the lie",
      "Grounding, citations, structured output, tools, lower temperature",
      "How to talk about eval without inventing a number",
    ],
    sections: [
      {
        id: "what",
        title: "What hallucination is",
        blocks: [
          {
            type: "p",
            text: "A hallucination is a fluent statement that is not supported by the allowed evidence — the retrieved passages, the tool result, or a verified source of truth. It is not “the model has a personality.” It is a system emitting ungrounded tokens: wrong policy clause, invented citation, confident maths, a URL that never existed.",
          },
          {
            type: "p",
            text: "Closed-book chat (no retrieval) will always draw on parametric memory, which is stale and uncited. That is not a surprise. The failure that gets products sued is open-book hallucination: the passages were there, or should have been, and the model still added a sentence nobody retrieved.",
          },
          {
            type: "callout",
            tone: "rule",
            title: "Treat it as a pipeline bug",
            text: "Ask which layer failed: data, retrieval, generation, verification, or eval. If your answer is only “the LLM hallucinated,” you have not started debugging.",
          },
        ],
      },
      {
        id: "why",
        title: "Why it is not a prompt-only problem",
        blocks: [
          {
            type: "p",
            text: "Models are trained to continue text. When evidence is missing, they still complete the pattern. A system prompt that says “do not hallucinate” competes with that prior and loses under pressure (jailbreaks, empty retrieval, high temperature, long context noise). Products that work stack engineering controls, then measure them.",
          },
          {
            type: "table",
            headers: ["Layer", "Failure", "Fix"],
            rows: [
              [
                "Data",
                "Wrong, duplicate, outdated, or missing docs",
                "Ownership, crawl freshness, PII clean, versioning",
              ],
              [
                "Retrieval",
                "Right doc exists, wrong chunks came back",
                "Chunking, hybrid search, rerank, query rewrite",
              ],
              [
                "Generation",
                "Model fills gaps, ignores passages, high temp",
                "Grounding prompt, citations, lower temp, structured output",
              ],
              [
                "Verification",
                "Answer ships with no check",
                "Citation overlap, NLI/faithfulness, tools for maths, human for high risk",
              ],
              [
                "Eval",
                "You never measured, so you never noticed",
                "Gold set, faithfulness, human sample, regression on each change",
              ],
            ],
          },
          {
            type: "callout",
            tone: "trap",
            title: "The prompt-only patch",
            text: "“You are a truthful assistant” is not a hallucination strategy. If retrieval is empty and you still call the LLM, you asked it to invent. Force abstain. That is a product decision, not a poem.",
          },
        ],
      },
      {
        id: "how",
        title: "How you reduce it",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Ground",
                text: "Only answer from retrieved passages or tool JSON. Put passages in the prompt with ids. Instruct: if not in the passages, say so.",
              },
              {
                title: "Cite",
                text: "Require citation ids in structured output. Strip or refuse answers whose ids do not exist. Render quotes in the UI so humans can check.",
              },
              {
                title: "Structure",
                text: "JSON schema: answer | null, citations[], confidence. Null is a legal, celebrated value.",
              },
              {
                title: "Use tools",
                text: "Arithmetic, prices, inventory, ticket state — call a system of record. Do not let the model multiply in prose.",
              },
              {
                title: "Lower temperature",
                text: "Grounded Q&A wants greedy / T≈0. Creativity is for a draft that a human will edit, not for a policy answer.",
              },
              {
                title: "Verify then eval",
                text: "Automatic faithfulness (e.g. RAGAS-style, NLI, citation overlap) plus a monthly human sample. Track it as a regression metric.",
              },
            ],
          },
          {
            type: "diagram",
            title: "Fail closed",
            lines: [
              "query -> retrieve -> (hits empty?) -> return 'I don't know'   STOP",
              "                   -> generate JSON with citation_ids",
              "                   -> ids invalid or span not in chunk? -> refuse",
              "                   -> maths / live field? -> tool, not tokens",
              "                   -> log + eval set",
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
            text: "Question: “Is Saturday a working day in the Hyderabad office?” Wrong system: no hit in the index, model answers “Yes, 1st and 3rd Saturdays” from some other company’s blog in pretraining. Right system: retrieval returns nothing above threshold → structured {answer: null, reason: \"insufficient\"} → UI: “I could not find this in current policy. Ask HR.”",
          },
          {
            type: "code",
            lang: "python",
            title: "Ground, structure, abstain — the boring version that works",
            code: `def answer(query: str) -> dict:
    hits = retrieve(query, k=4, min_score=0.25)
    if not hits:
        return {"answer": None, "citation_ids": [], "reason": "insufficient"}
    raw = llm(prompt(query, hits), temperature=0.0)
    out = Reply.model_validate_json(raw)  # answer | None, citation_ids
    allowed = {h.id for h in hits}
    if out.answer and not set(out.citation_ids) <= allowed:
        return {"answer": None, "citation_ids": [], "reason": "ungrounded"}
    return out.model_dump()`,
          },
          {
            type: "p",
            text: "A second failure in the same product: retrieval returned the Pune clause, the user asked Hyderabad, the model generalised. Fix is retrieval (filter by office metadata) plus a prompt constraint (“do not transfer a city-specific rule”). Two layers, one symptom.",
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
              "Define “allowed evidence” in one sentence for your product. If you cannot, you cannot define hallucination either.",
              "Empty-retrieval path first. Write the test before the prompt.",
              "Citations as first-class JSON. Never regex a URL out of prose.",
              "Temperature 0 for factual paths. Separate the creative draft endpoint if you need one.",
              "Tools for numbers and live state. Calculators are hallucination control.",
              "A 50–200 item eval: supported, unsupported, and “trick” questions. Report faithfulness and abstain-accuracy, not only BLEU.",
            ],
          },
          {
            type: "callout",
            tone: "india",
            title: "What hiring managers in GCCs ask",
            text: "“Show me a case where your bot should say I don’t know.” If your demo never abstains, they assume you never thought about hallucination. Put one abstain screenshot in the README.",
          },
          {
            type: "callout",
            tone: "note",
            title: "You will not reach zero",
            text: "You reduce rate and blast radius. High-stakes domains (medical, legal, finance, HR that affects pay) need a human in the loop, not a better adjective in the system prompt.",
          },
        ],
      },
      {
        id: "interview",
        title: "Interview",
        blocks: [
          {
            type: "qa",
            q: "How do you reduce hallucination in a RAG app?",
            a: "I treat it as a system: clean data, better retrieval, a grounding prompt that can abstain, citations in structured output, tools for maths and live fields, low temperature, and an eval set for faithfulness. I do not rely on “please don’t hallucinate.” If retrieval is empty, I return I don’t know — I do not generate.",
            why: "They want a stack, not a single trick. Name at least four layers.",
          },
          {
            type: "qa",
            q: "Why does lower temperature help?",
            a: "Temperature flattens or sharpens the next-token distribution. Higher T increases the chance of a fluent but unsupported continuation. For extraction and policy Q&A I want greedy or near-zero decoding. I raise T only when diversity is the product.",
          },
          {
            type: "qa",
            q: "Is fine-tuning a hallucination fix?",
            a: "Not for facts. Fine-tuning can teach the model to abstain or to follow a citation format — that is behaviour. It will not keep a changing policy correct. I still retrieve, still cite, still eval. An adapter that sounds more confident can even make hallucinations worse if I am not measuring.",
          },
        ],
      },
    ],
  },
];
