"use client";

import Link from "next/link";
import { Coffee, HandHeart, Heart, Star, Wallet } from "lucide-react";

import { siteConfig } from "@/global/config/site";
import {
  Button,
  Card,
  CardContent,
} from "@/global/components/ui";
import { CopyButton, GithubIcon } from "@/global/components/shared";

const METHOD_ICONS: Record<string, typeof Wallet> = {
  jazzcash: Wallet,
  easypaisa: Wallet,
  raast: HandHeart,
};

/** Ways to support the project: financial (local rails) + free (star/share). */
export function DonatePage() {
  const { donate, name, repo } = siteConfig;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <Coffee className="size-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Buy me a coffee
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-[14px] text-muted-foreground">
          {name} is free and open source, forever - no accounts, no ads, no
          tracking. If it saved you time, a small tip helps cover maintenance and
          keeps new templates and features coming.
        </p>
      </header>

      <Card className="mt-8">
        <CardContent className="p-5">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Send a tip</h2>
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Account name:{" "}
            <span className="font-medium text-foreground">
              {donate.accountName}
            </span>
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {donate.methods.map((m) => {
              const Icon = METHOD_ICONS[m.id] ?? Wallet;
              return (
                <div
                  key={m.id}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-[13px] font-semibold">{m.label}</span>
                  </div>
                  <p className="font-mono text-[15px] tracking-tight">
                    {m.number}
                  </p>
                  <CopyButton
                    value={m.number}
                    label="Copy number"
                    className="w-full"
                    toastMessage={`${m.label} number copied`}
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Heart className="size-3.5 text-destructive" /> Every contribution,
            big or small, is genuinely appreciated.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="flex items-center gap-2">
            <GithubIcon className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Free ways to help</h2>
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">
            No budget? These help just as much.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href={repo} target="_blank" rel="noopener noreferrer">
                <Star className="size-4 text-warning" /> Star on GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`${repo}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="size-4" /> Contribute
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/resumes?new=1">Build a resume</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
