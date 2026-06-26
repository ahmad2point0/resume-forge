# Contributing to resumeforge

Thanks for your interest in contributing! resumeforge is an open-source, local-first
resume builder, and contributions of all sizes are welcome - bug fixes, new templates,
docs, accessibility improvements, and features.

This guide explains how to set up the project, how the codebase is organized, the
conventions we follow, and how to get a change merged.

---

## Getting set up

1. **Fork** the repository on GitHub.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/resumeforge.git
   cd resumeforge/web-app
   ```
3. **Install dependencies** with [Bun](https://bun.sh):
   ```bash
   bun install
   ```
4. **Start the dev server** (Next.js dev runs Turbopack by default):
   ```bash
   bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

**Prerequisites:** Node.js 20.9+ and Bun.

Before opening a pull request, make sure linting passes:

```bash
bun run lint
```

---

## Project structure

resumeforge uses a **feature-based** architecture. Code lives in `src/` across three
zones:

```text
src/
├── app/        # Next.js App Router - thin route files only
├── features/   # Self-contained domain modules (resumes, ai, export)
└── global/     # Shared code (components, config, constants, hooks, lib, templates)
```

- **`src/app`** holds Next.js App Router files (layout, routes, global styles).
- **`src/features`** holds domain modules; each owns its `store`, `hooks`, `services`,
  `utils`, and `@types`.
- **`src/global`** holds everything shared across features: the `ui/` component library
  (Radix + shadcn-style), `config`, `constants`, `hooks`, `lib/storage`, `lib/scoring`,
  and the `templates` engine.

### Conventions

Please follow these rules so the codebase stays predictable:

- **Features never import each other.** If two features need the same thing, move it into
  `src/global`. A feature may depend on `global`, but not on a sibling feature.
- **Shared code goes in `global`.** Reusable components, hooks, types, and utilities are
  shared via `global`, not duplicated across features.
- **Route files stay thin.** Files under `src/app` should wire things up and delegate to
  feature modules - keep logic out of route files.
- **Use barrels (`index.ts`).** Export a module's public surface from an `index.ts` and
  import from the barrel rather than reaching into internal files.

---

## Coding standards

- **TypeScript strict mode.** The project compiles with `strict: true`; avoid `any` and
  keep types explicit at module boundaries.
- **Naming**
  - Components: `PascalCase` (e.g. `ResumeEditor`).
  - Hooks: `useX` (e.g. `useAutosave`, `useEditorShortcuts`).
  - Services: `*.service.ts` (e.g. an export service), repositories `*.repository.ts`,
    Zustand stores `*.store.ts`, type files `*.types.ts`.
- **Path aliases, not deep relatives.** Import via the configured aliases instead of long
  `../../../` chains:
  - `@/*` → `src/*`
  - `@/features/*` → `src/features/*`
  - `@/global/*` → `src/global/*`
- **Accessibility.** Build on the Radix-based `ui/` primitives, keep keyboard navigation
  working, and provide appropriate ARIA attributes and labels.
- **Privacy.** resumeforge has no backend. Never add server calls, telemetry, or anything
  that sends user resume data off-device. AI calls go browser → provider with the user's
  own key only.

> Note: this project tracks a fast-moving version of Next.js. Some APIs, conventions, and
> file structure may differ from older releases - check the in-repo guidance and the
> bundled docs under `node_modules/next/dist/docs/` before writing new Next.js code, and
> heed deprecation notices.

---

## How to add a new template

Templates live in `src/global/templates`.

1. **Create a definition** in `src/global/templates/definitions/<your-template>.tsx` that
   exports a `TemplateDefinition`. For example:

   ```tsx
   import type { TemplateDefinition } from "@/global/@types";
   import { SingleColumnLayout } from "../components/layouts";

   export const yourTemplate: TemplateDefinition = {
     id: "your-template",
     name: "Your Template",
     description: "A short, user-facing description.",
     category: "ats", // ats | technical | creative | academic | ...
     tags: ["Single column", "ATS-safe"],
     columns: 1,
     atsSafe: true, // set false for two-column / non-parseable layouts
     defaults: { accentColor: "#0f172a", fontFamily: "geist", spacing: "cozy" },
     Renderer: (props) => (
       <SingleColumnLayout {...props} headingStyle="caps-rule" nameScale={2} />
     ),
   };
   ```

   Reuse the shared `SingleColumnLayout` or `TwoColumnLayout` from
   `../components/layouts` where possible. Keep single-column layouts `atsSafe: true` so
   the scoring engine reports them correctly.

2. **Register it** in `src/global/templates/registry.ts` by importing your definition and
   adding it to the `TEMPLATES` array (the array order is the gallery and builder order).

That's it - the gallery, switcher, and `TEMPLATE_COUNT` pick it up automatically.

---

## How to add a resume section

Sections are defined in the canonical registry at
`src/global/constants/sections.ts`.

1. Add a new entry to `SECTION_REGISTRY` keyed by a new `SectionKey` (add the key to the
   `SectionKey` type in `src/global/@types` first). Provide `label`, `singular`, an
   `icon` (a lucide icon name), a `description`, and `list` (`true` if the section holds a
   list of entries, `false` for a single block).
2. Add the key to `DEFAULT_SECTION_ORDER` at the position it should appear by default.
3. Wire up rendering/editing for the section's data shape, and make sure the template
   layouts render it.

---

## Commits & pull requests

- **Conventional Commits.** Use prefixes like `feat:`, `fix:`, `docs:`, `refactor:`,
  `chore:`, `test:`. Example: `feat(templates): add Minimalist Two-Column template`.
- **Run `bun run lint`** and make sure it passes before pushing.
- **Keep PRs focused.** One logical change per pull request makes review faster. Split
  unrelated changes into separate PRs.
- **Describe your change.** Explain the what and why, link any related issue, and include
  screenshots for UI changes.
- For larger features, please **open an issue first** to discuss the approach.

---

## Code of conduct

Be respectful, inclusive, and constructive. We want resumeforge to be a welcoming project
for contributors of all backgrounds and experience levels. Harassment or discrimination of
any kind is not tolerated. By participating, you agree to uphold these expectations.

Thanks for helping make resumeforge better! 🙌
