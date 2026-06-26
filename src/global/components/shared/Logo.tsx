import Link from "next/link";
import { FileText } from "lucide-react";

import { cn } from "@/global/utils/cn";
import { siteConfig } from "@/global/config/site";

interface LogoProps {
  className?: string;
  href?: string;
  showBadge?: boolean;
}

/**
 * The resumeforge wordmark: a forge-blue glyph + lowercase wordmark, with an
 * optional "OSS" badge. The mark is the page's recurring signature element.
 */
export function Logo({ className, href = "/", showBadge = true }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
        <FileText className="size-4" />
      </span>
      <span className="text-[15px] text-foreground">{siteConfig.name}</span>
      {showBadge && (
        <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
          OSS
        </span>
      )}
    </Link>
  );
}
