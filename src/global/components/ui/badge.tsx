import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/global/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        primary: "border-transparent bg-accent text-accent-foreground",
        success:
          "border-transparent bg-[#dcfce7] text-[#166534] dark:bg-success/20 dark:text-success",
        warning:
          "border-transparent bg-[#fef3c7] text-[#92400e] dark:bg-warning/20 dark:text-warning",
        destructive:
          "border-transparent bg-[#fee2e2] text-[#991b1b] dark:bg-destructive/20 dark:text-destructive",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
