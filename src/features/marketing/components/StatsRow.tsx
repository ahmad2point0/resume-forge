const STATS: { value: string; label: string }[] = [
  { value: "6+", label: "ATS templates" },
  { value: "0", label: "bytes sent to a server" },
  { value: "MIT", label: "open source" },
];

/** Three compact proof-point tiles sitting beneath the hero. */
export function StatsRow() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <dl className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-2 shadow-sm sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-lg px-4 py-6 text-center sm:py-7"
          >
            <dt className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {stat.value}
            </dt>
            <dd className="mt-1.5 text-[13px] font-medium text-muted-foreground">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
