import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        muted: "bg-muted text-muted-foreground",
        outline: "border border-border text-muted-foreground",
        critical: "bg-primary/12 text-primary",
        high: "bg-wash text-foreground",
        core: "bg-muted text-muted-foreground",
        career: "bg-secondary text-secondary-foreground",
        good: "bg-good/12 text-good",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
