import { TemplateGrid } from "./TemplateGrid";

/** The /templates browse page: marketing header + the shared template grid. */
export function TemplateGallery() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-primary">
          Template gallery
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Choose a template. Keep your data.
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Every template is ATS-friendly and fully editable. Switch anytime
          without re-entering a thing.
        </p>
      </header>

      <div className="mt-8">
        <TemplateGrid />
      </div>
    </div>
  );
}
