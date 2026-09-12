import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

function NotFoundComponent() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
      <p className="font-mono text-xs text-muted-foreground">404</p>
      <h1 className="font-display text-2xl">That page is not in the handbook</h1>
      <a href="/" className="text-sm text-primary underline-offset-4 hover:underline">
        Back to the desk
      </a>
    </main>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFoundComponent,
  });
}
