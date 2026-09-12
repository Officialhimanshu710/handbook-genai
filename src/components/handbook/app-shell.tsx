import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bookmark,
  BookOpen,
  ListChecks,
  Map,
  Menu,
  Search,
  Shield,
  Waypoints,
} from "lucide-react";
import { chapters, groups, searchChapters } from "@/data";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const links = [
  { to: "/", label: "Desk", icon: BookOpen },
  { to: "/path", label: "Path", icon: Waypoints },
  { to: "/drill", label: "Drill", icon: ListChecks },
  { to: "/design", label: "Design", icon: Map },
  { to: "/projects", label: "Projects", icon: Shield },
] as const;

function NavBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const completed = useProgress((s) => s.completed);
  const pct = Math.round((completed.length / Math.max(chapters.length, 1)) * 100);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-4">
        <Link to="/" onClick={onNavigate} className="block">
          <p className="font-display text-xl leading-none tracking-tight">Grounded</p>
          <p className="mt-1 text-xs text-muted-foreground">GenAI interview handbook</p>
        </Link>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>Progress</span>
            <span className="font-mono tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-2 py-3">
          <div className="mb-3 space-y-0.5">
            {links.map((l) => {
              const Icon = l.icon;
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={onNavigate}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-md px-2 text-sm",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {l.label}
                </Link>
              );
            })}
          </div>
          {groups().map((g) => (
            <div key={g.name} className="mb-4">
              <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {g.name}
              </p>
              <ul>
                {g.items.map((c) => {
                  const href = `/learn/${c.slug}`;
                  const active = pathname === href;
                  const done = completed.includes(c.slug);
                  return (
                    <li key={c.slug}>
                      <Link
                        to="/learn/$slug"
                        params={{ slug: c.slug }}
                        onClick={onNavigate}
                        className={cn(
                          "flex min-h-10 items-start gap-2 rounded-md px-2 py-1.5 text-sm",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/85 hover:bg-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 w-8 shrink-0 font-mono text-[11px] tabular-nums",
                            active ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {c.number}
                        </span>
                        <span className="leading-snug">{c.title}</span>
                        {done ? (
                          <span
                            className={cn(
                              "ml-auto mt-1 size-1.5 shrink-0 rounded-full",
                              active ? "bg-primary-foreground" : "bg-good",
                            )}
                          />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

function SearchBox() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const hits = useMemo(() => searchChapters(q), [q]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        placeholder="Search the handbook"
        className="pl-9"
        aria-label="Search the handbook"
      />
      {open && q.trim().length >= 2 ? (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl bg-popover py-1 shadow-[var(--shadow-border)]">
          {hits.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">No matching chapter.</p>
          ) : (
            hits.map((h) => (
              <Link
                key={h.slug}
                to="/learn/$slug"
                params={{ slug: h.slug }}
                className="block px-3 py-2.5 hover:bg-muted"
                onMouseDown={(e) => e.preventDefault()}
              >
                <p className="text-sm">
                  <span className="mr-2 font-mono text-[11px] text-muted-foreground">{h.number}</span>
                  {h.title}
                </p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{h.snippet}</p>
              </Link>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const setHydrated = useProgress((s) => s.setHydrated);
  const hasHydrated = useProgress((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      const t = window.setTimeout(() => setHydrated(), 50);
      return () => window.clearTimeout(t);
    }
  }, [hasHydrated, setHydrated]);

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-card lg:block">
        <NavBody />
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-3 backdrop-blur-sm sm:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenu(true)}
            aria-label="Open chapters"
          >
            <Menu className="size-5" />
          </Button>
          <SearchBox />
          <Link
            to="/path"
            className="ml-auto hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground sm:flex"
          >
            <Bookmark className="size-4" />
            Saved
          </Link>
        </header>
        <div className="px-4 py-6 sm:px-8 sm:py-8">{children}</div>
      </div>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Chapters</SheetTitle>
          </SheetHeader>
          <NavBody onNavigate={() => setMenu(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
