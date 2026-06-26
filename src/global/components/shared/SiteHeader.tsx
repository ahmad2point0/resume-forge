"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Star } from "lucide-react";

import { cn } from "@/global/utils/cn";
import { siteConfig } from "@/global/config/site";
import { Button } from "@/global/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/global/components/ui/tooltip";

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { GithubIcon } from "./icons";

const NAV = [
  { href: "/templates", label: "Templates" },
  { href: "/resumes", label: "My Resumes" },
  { href: "/import", label: "Import" },
];

/** Primary site header used across the marketing and management screens. */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            <Star className="size-3.5 text-warning" />
            {siteConfig.badges.stars}
            <span className="mx-0.5 h-3 w-px bg-border" />
            <GithubIcon className="size-3.5" />
            GitHub
          </a>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" asChild aria-label="Buy me a coffee">
                <Link href="/donate">
                  <Coffee className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Buy me a coffee</TooltipContent>
          </Tooltip>
          <ThemeToggle />
          <Button size="sm" asChild>
            <Link href="/resumes?new=1">Create resume</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
