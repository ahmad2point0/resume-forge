import Link from "next/link";

import { siteConfig } from "@/global/config/site";
import { Logo } from "./Logo";
import { GithubIcon } from "./icons";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Create resume", href: "/resumes?new=1" },
      { label: "Templates", href: "/templates" },
      { label: "Import", href: "/import" },
      { label: "Settings", href: "/settings" },
      { label: "Buy me a coffee", href: "/donate" },
    ],
  },
  {
    title: "Open source",
    links: [
      { label: "GitHub", href: siteConfig.repo },
      { label: "Contributing", href: `${siteConfig.repo}/blob/main/CONTRIBUTING.md` },
      { label: "Roadmap", href: `${siteConfig.repo}/blob/main/ROADMAP.md` },
      { label: "MIT License", href: `${siteConfig.repo}/blob/main/LICENSE` },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <p className="text-[12px] font-medium text-muted-foreground">
            100% local · No accounts · No tracking · No backend
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-[12px] text-muted-foreground sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. Released under the
            MIT License.
          </span>
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-3.5" /> Star us on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
