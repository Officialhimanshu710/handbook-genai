import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { AppShell } from "@/components/handbook/app-shell";
import { Button } from "@/components/ui/button";
import { drillItems } from "@/data/drill";

export const Route = createFileRoute("/drill")({ component: DrillPage });

function DrillPage() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const item = drillItems[i]!;
  const finished = i >= drillItems.length;

  if (finished) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-4xl">Drill complete</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {known} fluent · {unknown} to restudy · {drillItems.length} total
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            If you hesitated, it is not fluent. Revisit those chapters before a real loop.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              setI(0);
              setShow(false);
              setKnown(0);
              setUnknown(0);
            }}
          >
            Repeat
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          Rapid revision · {i + 1} / {drillItems.length}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-snug">{item.q}</h1>
        {item.hint && !show ? (
          <p className="mt-3 text-sm text-muted-foreground">Hint: {item.hint}</p>
        ) : null}

        {show ? (
          <div className="mt-6 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Spoken answer
            </p>
            <p className="mt-2 text-[16px] leading-relaxed">{item.a}</p>
          </div>
        ) : (
          <Button variant="outline" className="mt-6" onClick={() => setShow(true)}>
            <Eye className="size-4" /> Reveal
          </Button>
        )}

        {show ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setKnown((n) => n + 1);
                setShow(false);
                setI((n) => n + 1);
              }}
            >
              I could say this
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setUnknown((n) => n + 1);
                setShow(false);
                setI((n) => n + 1);
              }}
            >
              <EyeOff className="size-4" />
              Needs work
            </Button>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
